import { useContext, useState } from "react";
import { useStore, StoreState } from "../../state/chat";
import { SocketContext } from "../../providers/socket"

export default function ChatField() {
  const activeChatId = useStore((state: StoreState) => state.activeChatId)
  const messages = useStore((state: StoreState) => state.messages)
  const user = useStore((state: StoreState) => state.user)
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState("")
  const activeChat = user.chats.find((chat) => chat._id === activeChatId);
  const handleSendMessage = () => {
    socket?.chatSocket.emit("sendMessage", {
        "chatId": activeChatId, 
        "senderId": user._id, 
        "text": message
    })    
    setMessage("")
  };

  return (
    <main className="flex-1 flex flex-col">
      {activeChatId ? (
        <>
          <header className="p-4 border-b font-bold bg-white">
            {activeChat?.name}
          </header>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length > 0 && messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 p-2 max-w-sm rounded-md ${
                  message.sender._id === user._id
                    ? "bg-blue-500 text-white ml-auto text-right"
                    : "bg-gray-200 text-black"
                }`}
              >
                <div className="text-sm font-semibold">{message.sender.name}</div>
                <div>{message.text}</div>
              </div>
            ))}
          </div>
          <footer className="p-4 border-t bg-white flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => {setMessage(e.target.value)}}
              placeholder="Введите сообщение..."
              className="flex-1 p-2 border rounded-md"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Отправить
            </button>
          </footer>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Выберите чат, чтобы начать общение
        </div>
      )}
    </main>
  );
}
