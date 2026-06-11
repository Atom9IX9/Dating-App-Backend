/*
 * FILE: src/modules/matches/types/index.ts
 * PURPOSE: Barrel file re-exporting module members for easier imports.
 */

export type TGetMatchesWhereObj = {
  receiverId?: string;
  userId?: string;
};

export enum UserTypeEnum {
  Sender = 'sender',
  Receiver = 'receiver',
}

export enum ReceivedStatuses {
  Rejected = 'rejected',
  Pending = 'pending',
  Accepted = 'accepted',
}

export enum UserReceives {
  Rejected = 'rejected',
  Accepted = 'accepted',
}
