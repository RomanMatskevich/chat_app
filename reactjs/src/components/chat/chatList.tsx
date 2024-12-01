import { StoreActions, useStore } from "../../state/chat";
import { StoreState } from "../../state/chat";
import { useEffect, useState } from "react";
import { User } from "../../types";

export default function ChatList() {
  const user = useStore((state: StoreState) => state.user);
  const activeChatId = useStore((state: StoreState) => state.activeChatId);
  const setActiveChatId = useStore((state: StoreActions) => state.setActiveChatId);
  const setMessages = useStore((state: StoreActions) => state.setMessages);
  const addChatToUser = useStore((state: StoreActions) => state.setMessages)
  const chats = user.chats;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_HTTP_SERVER_URL}/message/get/${activeChatId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const messages = await response.json();
        setMessages(messages);
        console.log(response, messages);
      } catch (error) {
        console.log(error);
      }
    };
    if (activeChatId) {
      fetchData();
    }
  }, [activeChatId, setMessages]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);

    if (e.target.value.trim()) {
      const name = e.target.value.trim().split(" ")[0];
      const lastName = e.target.value.trim().split(" ")[1];
      try {
        const response = await fetch(
          `${process.env.REACT_APP_HTTP_SERVER_URL}/user/search?name=${name}&lastName=${lastName}`
        );
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const users = await response.json();
        setSearchResults(users);
      } catch (error) {
        console.log(error);
      }
    } else {
      setSearchResults([]);
    }
  };
  const createChat = async (userId: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HTTP_SERVER_URL}/chats/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "name",
            participants: [user._id, userId],
          }),
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      setSearchQuery("")
      const chat = await response.json();
      setActiveChatId(chat._id)
      addChatToUser(chat._id)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className="w-1/3 border-r bg-gray-100">
      <div className="p-4 font-bold text-lg">Чаты</div>
      <div className="p-4">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Поиск пользователей..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {searchQuery && (
        <div className="bg-white p-2 max-h-40 overflow-y-auto shadow-md">
          <ul>
            {searchResults.map((user) => (
              <li
                key={user._id}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  user._id && createChat(user._id);
                }}
              >
                {user.name} {user.lastName}
              </li>
            ))}
          </ul>
        </div>
      )}
      <ul>
        {chats.map((chat) => (
          <li
            key={chat._id}
            className={`p-4 cursor-pointer ${
              activeChatId === chat._id
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveChatId(chat._id)}
          >
            {chat.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
