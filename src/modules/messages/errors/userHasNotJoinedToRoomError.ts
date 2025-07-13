export class UserHasNotJoinedToRoomError extends Error {
  constructor(message?: string) {
    super();
    this.message = message || 'User has not joined to the room';
    this.name = 'UserHasNotJionedToRoomError';
  }
}
