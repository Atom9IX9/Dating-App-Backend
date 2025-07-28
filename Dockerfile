FROM node:22.16.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=development

EXPOSE 5000 5001

CMD ["npm", "run", "start:dev"]