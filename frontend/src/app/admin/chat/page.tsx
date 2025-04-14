"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMessagesByRoom,
  selectChatMessages,
  selectChatLoading,
  selectChatError,
  setRoom,
  addMessage,
} from "@/store/chatSlice";
import { io, Socket } from "socket.io-client";
import styled from "styled-components";
import { ChatMessage } from "@/store/chatSlice";

const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  withCredentials: true,
  transports: ["websocket"], // ⚠️ önemli!
});

const ChatPage = () => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectChatMessages);
  const loading = useAppSelector(selectChatLoading);
  const error = useAppSelector(selectChatError);

  const [room] = useState("admin-room");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    console.log("📡 Odaya katılım ve socket bağlanıyor...");
    dispatch(setRoom(room));
    dispatch(fetchMessagesByRoom(room));

    socket.emit("join-room", room);

    socket.on("connect", () => {
      console.log("✅ Socket bağlı:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket bağlantı hatası:", err.message);
    });

    socket.on("chat-message", (msg: ChatMessage) => {
      console.log("📥 Yeni mesaj geldi:", msg);
      dispatch(addMessage(msg));
    });

    return () => {
      socket.off("chat-message");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [dispatch, room]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    socket.emit("chat-message", {
      room,
      message: newMessage,
    });

    setNewMessage("");
  };

  return (
    <Container>
      <h2>💬 Admin Chat Paneli</h2>

      <ChatContainer>
        {loading && <Info>Yükleniyor...</Info>}
        {error && <ErrorText>{error}</ErrorText>}
        {messages.map((msg) => (
          <Message key={msg._id}>
            <strong>{msg.sender?.name || "Sistem"}:</strong> {msg.message}
          </Message>
        ))}
      </ChatContainer>

      <InputWrapper>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mesaj yaz..."
        />
        <button onClick={handleSendMessage}>Gönder</button>
      </InputWrapper>
    </Container>
  );
};

export default ChatPage;

// 💅 Styles
const Container = styled.div`
  padding: 2rem;
`;

const ChatContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #fafafa;
`;

const Message = styled.div`
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 1rem;

  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #333;
    color: #fff;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #555;
    }
  }
`;

const Info = styled.p`
  color: #555;
`;

const ErrorText = styled.p`
  color: red;
`;
