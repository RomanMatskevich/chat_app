import { StoreActions, useStore } from "../../state/chat";
import { StoreState } from "../../state/chat";
import { useEffect, useState } from "react";
import { User } from "../../types";

export default function ChatList() {
  const user = useStore((state: StoreState) => state.user);
  const activeChatId = useStore((state: StoreState) => state.activeChatId);
  const setActiveChatId = useStore(
    (state: StoreActions) => state.setActiveChatId
  );
  const setMessages = useStore((state: StoreActions) => state.setMessages);
  // const addChatToUser = useStore((state: StoreActions) => state.addChatToUser);
  const chats = user.chats;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_HTTP_SERVER_URL}/message/get/${activeChatId}`
        );
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

  const handleUserSelect = (user: User) => {
    if (selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const createChat = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HTTP_SERVER_URL}/chats/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "New Group Chat",
            participants: [user._id, ...selectedUsers.map((u) => u._id)],
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create chat");
      }
      const chat = await response.json();
      setActiveChatId(chat._id);
      setSearchQuery("");
      setSelectedUsers([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className="w-1/3 border-r bg-gray-100">
      <div className="p-4 font-bold text-lg flex justify-between">
        <span>{user.name}`s</span> Чати
      </div>
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
        <div className="bg-pink-200 p-2 max-h-40 overflow-y-auto shadow-md">
          <ul>
            {searchResults.map((user) => (
              <li
                key={user._id}
                className={`p-2 cursor-pointer hover:bg-gray-200 ${
                  selectedUsers.some((u) => u._id === user._id)
                    ? "bg-blue-100"
                    : ""
                }`}
                onClick={() => handleUserSelect(user)}
              >
                {user.name} {user.lastName}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedUsers.length > 0 && (
        <div className="p-4">
          <button
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={createChat}
          >
            Створити чат ({selectedUsers.length} користувачів)
          </button>
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
