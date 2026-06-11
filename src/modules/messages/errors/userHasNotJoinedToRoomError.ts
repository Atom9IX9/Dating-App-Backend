/*
 * FILE: src/modules/messages/errors/userHasNotJoinedToRoomError.ts
 * PURPOSE: Module file with defined behavior.
 */

export class UserHasNotJoinedToRoomError extends Error {
  // Inject required services and repositories for this class.
  constructor(message?: string) {
    super();
    this.message = message || 'User has not joined to the room';
    this.name = 'UserHasNotJionedToRoomError';
  }
}
