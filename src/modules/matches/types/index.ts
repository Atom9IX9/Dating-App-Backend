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
