import { create } from "zustand";
import { Message, User } from "../types";

export type StoreState = {
  user: User;
  activeChatId: string | null;
  messages: Message[] | [];
};
export type StoreActions = {
  setUser: (user: User) => void;
  setActiveChatId: (chatId: string) => void;
  setMessages: (newMessages: Message[]) => void;
  addMessage: (message: Message) => void;
  // addChatToUser: (chatId: string) => void;
};
export type Store = StoreState & StoreActions;

export const useStore = create<Store>((set) => ({
  user: {
    _id: null,
    name: null,
    lastName: null,
    chats: [],
  },
  activeChatId: null,
  messages: [],
  setUser: (newUser: User) =>
    set({ user: newUser, activeChatId: newUser.chats.length > 0 ? newUser.chats[0]._id : null, }),
  setActiveChatId: (newChatId: string) => set({ activeChatId: newChatId }),
  setMessages: (newMessages: Message[]) => set({ messages: newMessages }),
  addMessage: (newMessage: Message) =>
    set((state) => ({
      messages: [...state.messages, newMessage],
    })),
  // addChatToUser: (chatId: string) =>
  //   set((state) => ({
  //     user: {
  //       ...state.user,
  //       chats: [...state.user.chats, chatId], 
  //     },
  //   })),
}));
