const fs = require('fs');
const path = require('path');
const glob = require('glob');

const root = path.resolve(process.cwd());
const patterns = ['src/**/*.ts', 'test/**/*.ts'];

const descriptionByType = {
  controller: 'HTTP controller defining request handlers and routes for the feature.',
  service: 'Business logic provider encapsulating operations and persistence for the feature.',
  module: 'NestJS module that groups controllers, providers, and imports for the feature.',
  model: 'Sequelize model mapping the entity to the database table.',
  dto: 'Data transfer object definitions used for request validation and payload shape.',
  response: 'Response DTO definitions shaping API output payloads.',
  strategy: 'Passport strategy implementation for authentication using JWT tokens.',
  guard: 'Authorization logic ensuring requests are valid and users are authenticated.',
  pipe: 'NestJS pipe for request-level validation or transformation.',
  helper: 'Utility helper functions used across the module.',
  constant: 'Collection of constants used in configuration or request processing.',
  config: 'Application configuration loader and environment settings.',
  adapter: 'Custom adapter for WebSocket setup and authentication integration.',
  error: 'Application-specific error type used for domain validation.',
  index: 'Barrel file re-exporting module members for easier imports.',
};

function getDescription(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  if (normalized === 'src/main.ts') {
    return 'Application bootstrap file. Configures the NestJS app, global pipes, CORS, Swagger, and WebSocket adapter.';
  }
  const parts = normalized.split('/');
  const file = parts.pop();
  const parent = parts[parts.length - 1] || '';
  const name = path.basename(file, '.ts');
  const kind = name === 'index' ? 'index' : name.toLowerCase();
  if (descriptionByType[kind]) {
    return descriptionByType[kind];
  }
  if (parent === 'dto' || parent === 'response' || parent === 'models' || parent === 'guards' || parent === 'helpers' || parent === 'errors' || parent === 'types') {
    return descriptionByType[parent] || descriptionByType[kind] || 'Module file with defined behavior.';
  }
  if (normalized.includes('/modules/')) {
    if (name.endsWith('Module')) return descriptionByType.module;
    if (name.endsWith('Controller')) return descriptionByType.controller;
    if (name.endsWith('Service')) return descriptionByType.service;
    if (name.endsWith('Strategy')) return descriptionByType.strategy;
    if (name.endsWith('Adapter')) return descriptionByType.adapter;
    if (name.endsWith('Pipe')) return descriptionByType.pipe;
    if (name.endsWith('Guard')) return descriptionByType.guard;
  }
  return 'TypeScript source file part of the application logic.';
}

function shouldInsertComment(content) {
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    return !trimmed.startsWith('/*') && !trimmed.startsWith('//');
  }
  return true;
}

function isCommentLine(line) {
  return /^\s*(\/\/|\/\*|\*)/.test(line);
}

function getInsertIndex(lines, index) {
  let insertIndex = index;
  while (insertIndex > 0 && /^\s*@/.test(lines[insertIndex - 1])) {
    insertIndex -= 1;
  }
  return insertIndex;
}

function hasCommentAbove(lines, index) {
  let i = index - 1;
  while (i >= 0 && lines[i].trim() === '') {
    i -= 1;
  }
  if (i < 0) return false;
  return isCommentLine(lines[i]);
}

function camelCaseToPhrase(name) {
  return name
    .replace(/([A-Z]+)/g, ' $1')
    .replace(/([0-9]+)/g, ' $1')
    .trim()
    .toLowerCase();
}

function getMethodComment(methodName) {
  const normalized = methodName.toLowerCase();
  if (normalized.startsWith('create')) {
    return `Create ${camelCaseToPhrase(methodName).replace('create ', '')} and save it to the data store.`;
  }
  if (normalized.startsWith('get')) {
    return `Retrieve ${camelCaseToPhrase(methodName).replace('get ', '')} and return the requested data.`;
  }
  if (normalized.startsWith('update')) {
    return `Apply updates to ${camelCaseToPhrase(methodName).replace('update ', '')} and return the result.`;
  }
  if (normalized.startsWith('delete')) {
    return `Remove ${camelCaseToPhrase(methodName).replace('delete ', '')} from storage and return confirmation.`;
  }
  if (normalized.startsWith('save')) {
    return `Save ${camelCaseToPhrase(methodName).replace('save ', '')} and return the persisted metadata.`;
  }
  if (normalized.startsWith('validate')) {
    return `Validate ${camelCaseToPhrase(methodName).replace('validate ', '')} and return the validation result.`;
  }
  if (normalized.startsWith('hash')) {
    return `Hash the provided input and return the encrypted result.`;
  }
  if (normalized.startsWith('find')) {
    return `Find ${camelCaseToPhrase(methodName).replace('find ', '')} in the database and return it.`;
  }
  if (normalized.startsWith('set')) {
    return `Set ${camelCaseToPhrase(methodName).replace('set ', '')} and persist the new state.`;
  }
  if (normalized.startsWith('accept')) {
    return `Accept ${camelCaseToPhrase(methodName).replace('accept ', '')} and update the matching state.`;
  }
  if (normalized.startsWith('upload')) {
    return `Upload ${camelCaseToPhrase(methodName).replace('upload ', '')} and return the storage result.`;
  }
  if (normalized.startsWith('generate')) {
    return `Generate ${camelCaseToPhrase(methodName).replace('generate ', '')} and return the created value.`;
  }
  if (normalized.startsWith('sync')) {
    return `Synchronize ${camelCaseToPhrase(methodName).replace('sync ', '')} and return the updated collection.`;
  }
  if (normalized.startsWith('check') || normalized.startsWith('is')) {
    return `Validate ${camelCaseToPhrase(methodName).replace(/^(check|is) /, '')} and return whether the condition holds.`;
  }
  if (normalized.startsWith('refresh')) {
    return `Refresh token data and return new authentication tokens.`;
  }
  if (normalized.startsWith('login')) {
    return `Authenticate the user and return access and refresh tokens.`;
  }
  if (normalized.startsWith('register')) {
    return `Register a new user or auth record and return authentication details.`;
  }
  if (normalized.startsWith('handle')) {
    return `Handle an incoming event or request and execute the business logic.`;
  }
  return `Execute the ${camelCaseToPhrase(methodName)} operation.`;
}

function removeFalseInlineComments(content) {
  const lines = content.split(/\r?\n/);
  const result = [];
  const keywordPattern = /^(for|if|while|switch|catch|do|else|return|throw|try|case|break|continue)\b/;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^\s*\/\/\s*Execute the .* operation\.$/.test(line)) {
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') {
        j += 1;
      }
      if (j < lines.length && keywordPattern.test(lines[j].trim())) {
        continue;
      }
    }
    result.push(line);
  }

  return result.join('\n');
}

function insertInlineComments(content) {
  const lines = content.split(/\r?\n/);
  const result = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const classMatch = /^\s*export\s+class\s+(\w+)/.exec(line);
    const constructorMatch = /^\s*constructor\s*\(/.exec(line);
    const methodMatch = /^\s*(public|protected|private)?\s*(static\s+)?(async\s+)?([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/.exec(line);
    const functionMatch = /^\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/.exec(line);
    const arrowFunctionMatch = /^\s*(?:export\s+)?const\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*\(/.exec(line);

    if (classMatch) {
      const insertIndex = getInsertIndex(result, result.length);
      if (!hasCommentAbove(result, insertIndex)) {
        const indent = line.match(/^\s*/)[0];
        result.splice(insertIndex, 0, `${indent}// NestJS class implementing ${classMatch[1]}.`);
      }
    }

    if (constructorMatch) {
      const insertIndex = getInsertIndex(result, result.length);
      if (!hasCommentAbove(result, insertIndex)) {
        const indent = line.match(/^\s*/)[0];
        result.splice(insertIndex, 0, `${indent}// Inject required services and repositories for this class.`);
      }
    }

    if (
      methodMatch &&
      methodMatch[4] !== 'constructor' &&
      (methodMatch[1] || methodMatch[3]) &&
      !['if', 'for', 'while', 'switch', 'catch', 'do', 'else', 'return', 'throw', 'try', 'case', 'break', 'continue'].includes(
        methodMatch[4],
      )
    ) {
      const methodName = methodMatch[4];
      const insertIndex = getInsertIndex(result, result.length);
      if (!hasCommentAbove(result, insertIndex)) {
        const indent = line.match(/^\s*/)[0];
        result.splice(insertIndex, 0, `${indent}// ${getMethodComment(methodName)}`);
      }
    }

    if (functionMatch) {
      const functionName = functionMatch[1];
      const insertIndex = getInsertIndex(result, result.length);
      if (!hasCommentAbove(result, insertIndex)) {
        const indent = line.match(/^\s*/)[0];
        result.splice(insertIndex, 0, `${indent}// ${getMethodComment(functionName)}`);
      }
    }

    if (arrowFunctionMatch) {
      const functionName = arrowFunctionMatch[1];
      const insertIndex = getInsertIndex(result, result.length);
      if (!hasCommentAbove(result, insertIndex)) {
        const indent = line.match(/^\s*/)[0];
        result.splice(insertIndex, 0, `${indent}// ${getMethodComment(functionName)}`);
      }
    }

    result.push(line);
  }

  return result.join('\n');
}

let count = 0;

patterns.forEach(pattern => {
  const files = glob.sync(pattern, { cwd: root, absolute: true });
  files.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    const rel = path.relative(root, filePath).replace(/\\/g, '/');
    const description = getDescription(rel);

    if (shouldInsertComment(content)) {
      const comment = `/*\n * FILE: ${rel}\n * PURPOSE: ${description}\n */\n\n`;
      content = comment + content;
      count += 1;
    }

    const updatedContent = insertInlineComments(content);
    const cleanedContent = removeFalseInlineComments(updatedContent);
    if (cleanedContent !== content) {
      fs.writeFileSync(filePath, cleanedContent, 'utf8');
    }
  });
});

console.log(`Comments inserted into ${count} files.`);
