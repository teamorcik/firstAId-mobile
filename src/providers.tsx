import type React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ColorSchemeProvider } from "@/design-system/color-scheme/provider";
import { Toaster } from "@/components/sonner";
import NativewindThemeProvider from "./ThemeProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ColorSchemeProvider>
        <Toaster />
        <NativewindThemeProvider>
          <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
        </NativewindThemeProvider>
      </ColorSchemeProvider>
    </GestureHandlerRootView>
  );
}

export default Providers;
