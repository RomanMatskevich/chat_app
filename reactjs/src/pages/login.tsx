import React,{ useState } from "react";

import { StoreActions, useStore } from "../state/chat";
import { useNavigate } from "react-router";

export default function Login() {
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const navigate = useNavigate();
  const setUser = useStore((state: StoreActions) => state.setUser);
  const backendUrl = process.env.REACT_APP_HTTP_SERVER_URL + "/user/getUserOrCreateUser" || "";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          lastName: lastName,
        }),
      });
      console.log(response);
      const user = await response.json();
      user && setUser({
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        chats: user.chats,
      });
      navigate("/chat");
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Login
        </h1>
        <div className="mb-4">
          <label
            htmlFor="userId"
            className="block text-gray-700 font-semibold mb-2"
          >
            login
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Your LastName"
            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md shadow-md font-semibold hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
