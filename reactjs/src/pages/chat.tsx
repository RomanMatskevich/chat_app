import ChatList from "../components/chat/chatList";
import ChatField from "../components/chat/chatField";
import { useCallback, useContext, useEffect } from "react";
import { CustomError, Message } from "../types";
import toast from "react-hot-toast";
import { SocketContext } from "../providers/socket";
import { useStore } from "../state/chat";

export default function Chat(){
  const socket = useContext(SocketContext);
  const activeChatId = useStore((state) => state.activeChatId)
  const addMessageInChat = useStore((state) => state.addMessage)
  const messages = useStore((state) => state.messages)
  const onError = useCallback((error: CustomError) => {
    console.log(error);
    toast.error(error.message);
  }, []);
  const onMessage = useCallback((message: Message) => {
    console.log(messages)
    addMessageInChat(message)
    console.log(messages)
    if(message.chat === activeChatId){
      
      
    }
    console.log(message);
  }, []);
  useEffect(() => {
    // костыль, но в оф доке)
    socket?.chatSocket?.off("error", onError).on("error", onError);
    socket?.chatSocket?.off("message", onMessage).on("message", onMessage);
  }, [socket, onMessage, onError]);
  return (
        <div className="h-screen flex">
          <ChatList />
          <ChatField />
        </div>
  );
}