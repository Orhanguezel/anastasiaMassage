// src/store/chatSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./index";
import axios from "axios";

// 🔸 Mesaj tipi
export interface ChatMessage {
  _id: string;
  roomId: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  message: string;
  createdAt: string;
}

interface ChatState {
  messages: ChatMessage[];
  currentRoom: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  currentRoom: null,
  loading: false,
  error: null,
};

const BASE_URL = process.env.NEXT_PUBLIC_SOCKET_URL; // http://localhost:5012

export const fetchMessagesByRoom = createAsyncThunk<
  ChatMessage[],
  string,
  { rejectValue: string }
>("chat/fetchMessagesByRoom", async (roomId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/chat/${roomId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Mesajlar alınamadı";
    return rejectWithValue(message);
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setRoom(state, action: PayloadAction<string>) {
      state.currentRoom = action.payload;
      state.messages = [];
      state.error = null;
    },
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesByRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesByRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessagesByRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bilinmeyen hata";
      });
  },
});

export const { setRoom, addMessage, clearMessages } = chatSlice.actions;

export const selectChatMessages = (state: RootState) => state.chat.messages;
export const selectChatLoading = (state: RootState) => state.chat.loading;
export const selectChatError = (state: RootState) => state.chat.error;
export const selectCurrentRoom = (state: RootState) => state.chat.currentRoom;

export default chatSlice.reducer;
