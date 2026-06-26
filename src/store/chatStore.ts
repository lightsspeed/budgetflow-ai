"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatConversation, ChatMessage } from "@/types";

interface ChatState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  setActiveConversation: (id: string) => void;
  addMessage: (convId: string, message: ChatMessage) => void;
  createConversation: (title?: string) => string;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      setActiveConversation: (id) => set({ activeConversationId: id }),
      addMessage: (convId, message) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === convId
              ? { ...c, messages: [...c.messages, message], updatedAt: Date.now() }
              : c
          ),
        })),
      createConversation: (title) => {
        const id = `conv-${Date.now()}`;
        const conv: ChatConversation = {
          id,
          title: title || "New Chat",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((s) => ({
          conversations: [conv, ...s.conversations],
          activeConversationId: id,
        }));
        return id;
      },
    }),
    { name: "chat" }
  )
);
