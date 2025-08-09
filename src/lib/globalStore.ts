import { create } from "zustand";

type ChatIdState = {
  id: string;
  from: "history" | "newChat";
} | null;

interface ChatHistory {
  id: string;
  title: string;
  messages: any[];
}

interface StoreState {
  scrollY: number;
  setScrollY: (value: number) => void;
  selectedImageUris: string[];
  addImageUri: (uri: string) => void;
  removeImageUri: (uri: string) => void;
  clearImageUris: () => void;
  setBottomChatHeightHandler: (value: boolean) => void;
  bottomChatHeightHandler: boolean;
  chatId: ChatIdState;
  setChatId: (value: { id: string; from: "history" | "newChat" }) => void;
  setFocusKeyboard: (value: boolean) => void;
  focusKeyboard: boolean;
  firstAidHistory: any[];
  setFirstAidHistory: (msgs: any[]) => void;
  egitimHistory: any[];
  setEgitimHistory: (msgs: any[]) => void;
  firstAidChats: ChatHistory[];
  setFirstAidChats: (chats: ChatHistory[]) => void;
  activeFirstAidChatId: string | null;
  setActiveFirstAidChatId: (id: string | null) => void;
  egitimChats: ChatHistory[];
  setEgitimChats: (chats: ChatHistory[]) => void;
  activeEgitimChatId: string | null;
  setActiveEgitimChatId: (id: string | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  scrollY: 0,
  setScrollY: (value: number) => set({ scrollY: value }),
  selectedImageUris: [],
  addImageUri: (uri: string) =>
    set((state) => ({
      selectedImageUris: [...state.selectedImageUris, uri],
    })),
  removeImageUri: (uri: string) =>
    set((state) => ({
      selectedImageUris: state.selectedImageUris.filter(
        (imageUri) => imageUri !== uri,
      ),
    })),
  clearImageUris: () => set({ selectedImageUris: [] }),
  bottomChatHeightHandler: false,
  setBottomChatHeightHandler: (value: boolean) =>
    set({ bottomChatHeightHandler: value }),
  chatId: null,
  setChatId: (value) => set({ chatId: value }),
  focusKeyboard: false,
  setFocusKeyboard: (value: boolean) => set({ focusKeyboard: value }),
  firstAidHistory: [],
  setFirstAidHistory: (msgs) => set({ firstAidHistory: msgs }),
  egitimHistory: [],
  setEgitimHistory: (msgs) => set({ egitimHistory: msgs }),
  firstAidChats: [],
  setFirstAidChats: (chats) => set({ firstAidChats: chats || [] }),
  activeFirstAidChatId: null,
  setActiveFirstAidChatId: (id) => set({ activeFirstAidChatId: id }),
  egitimChats: [],
  setEgitimChats: (chats) => set({ egitimChats: chats || [] }),
  activeEgitimChatId: null,
  setActiveEgitimChatId: (id) => set({ activeEgitimChatId: id }),
}));
