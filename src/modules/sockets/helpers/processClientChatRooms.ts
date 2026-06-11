/*
 * FILE: src/modules/sockets/helpers/processClientChatRooms.ts
 * PURPOSE: Module file with defined behavior.
 */

import { ChatsService } from '@/modules/chats/chats.service';

export const processClientChatRooms = async (
  clientId: string,
  chatsService: ChatsService,
  cb: (room: string) => void,
) => {
  const clientChatRooms = await chatsService.getUserChatRooms(clientId);
  for (const room of clientChatRooms) {
    cb(room);
  }
};
