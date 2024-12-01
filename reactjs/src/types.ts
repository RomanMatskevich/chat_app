export type CustomError = {
    status: number;
    message: string;
}

export type Chat = {
    _id: string;
    name: string;
}

export type User = {
    _id: string | null;
    name: string | null;
    lastName: string | null;
    chats: Chat[] | []
}

export type Message = {
    chat: string,
    sender: string,
    text: string
}