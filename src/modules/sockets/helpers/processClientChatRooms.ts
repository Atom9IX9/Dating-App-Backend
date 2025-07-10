import { ChatsService } from 'src/modules/chats/chats.service';

export const processClientChatRooms = async (
  clientId: string,
  chatsService: ChatsService,
  cb: (room: string) => void,
) => {
  const clientChatRooms = await chatsService.findAllUserChats(clientId);
  for (const room of clientChatRooms) {
    cb(room);
  }
};
