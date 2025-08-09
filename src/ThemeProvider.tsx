import "@/global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, Text as RNText, TextInput as RNTextInput } from "react-native";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import {
  useFonts,
  Ubuntu_300Light,
  Ubuntu_400Regular,
  Ubuntu_500Medium,
  Ubuntu_700Bold,
} from "@expo-google-fonts/ubuntu";
// import { PortalHost } from "@rn-primitives/portal";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const [fontsLoaded] = useFonts({
    Ubuntu_300Light,
    Ubuntu_400Regular,
    Ubuntu_500Medium,
    Ubuntu_700Bold,
  });

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        // setAndroidNavigationBar(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      // setAndroidNavigationBar(colorTheme);
      setIsColorSchemeLoaded(true);
    })();
  }, []);

  // Apply global font defaults once loaded
  React.useEffect(() => {
    if (!fontsLoaded) return;
    const defaultFontFamily = "Ubuntu_400Regular" as const;

    // Ensure existing defaults are preserved and extended
    RNText.defaultProps = RNText.defaultProps || {};
    RNText.defaultProps.style = [
      // @ts-expect-error RN types don't define style on defaultProps
      RNText.defaultProps.style,
      { fontFamily: defaultFontFamily },
    ];

    RNTextInput.defaultProps = RNTextInput.defaultProps || {};
    RNTextInput.defaultProps.style = [
      // @ts-expect-error RN types don't define style on defaultProps
      RNTextInput.defaultProps.style,
      { fontFamily: defaultFontFamily },
    ];
  }, [fontsLoaded]);

  // Hide splash only after both color scheme and fonts are ready
  React.useEffect(() => {
    if (isColorSchemeLoaded && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isColorSchemeLoaded, fontsLoaded]);

  if (!isColorSchemeLoaded || !fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      {children}
      {/* <PortalHost /> */}
    </ThemeProvider>
  );
}
