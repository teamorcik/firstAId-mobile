import { View, ScrollView, ActivityIndicator } from "react-native";

// import Markdown from "react-native-markdown-display";
import { CustomMarkdown } from "@/components/ui/markdown";
import { useKeyboard } from "@react-native-community/hooks";
import { Text } from "@/components/ui/text";
import WeatherCard from "@/components/weather";
import { WelcomeMessage } from "@/components/welcome-message";
import React, { forwardRef, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { LottieLoader } from "@/components/lottie-loader";

type ToolInvocation = {
  toolName: string;
  toolCallId: string;
  state: string;
  result?: any;
};

type Message = {
  id: string;
  role: "user" | "assistant" | "system" | "function" | "data" | "tool";
  content: string;
  toolInvocations?: ToolInvocation[];
};

type ChatInterfaceProps = {
  messages: Message[];
  scrollViewRef: React.RefObject<ScrollView>;
  isLoading?: boolean;
};

export const ChatInterface = forwardRef<ScrollView, ChatInterfaceProps>(
  ({ messages, scrollViewRef, isLoading }, ref) => {
    const localRef = useRef<ScrollView>(null);
    const effectiveRef = scrollViewRef || localRef;

    // Always keep view anchored to bottom like modern chat apps
    useEffect(() => {
      if (effectiveRef.current) {
        setTimeout(() => {
          effectiveRef.current?.scrollToEnd({ animated: true });
        }, 50);
      }
    }, [messages, isLoading]);

    const { keyboardShown, keyboardHeight } = useKeyboard();

    return (
      <View className="flex-1">
        <ScrollView
          ref={effectiveRef}
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 16,
            paddingBottom: keyboardShown ? keyboardHeight + 60 : 60,
            minHeight: '100%',
            justifyContent: 'flex-end',
          }}
          showsVerticalScrollIndicator
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={4}
          bounces
          alwaysBounceVertical
          decelerationRate="normal"
          snapToAlignment="end"
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 20,
          }}
          removeClippedSubviews
        >
          <View style={{ gap: 12 }}>
            {/* Initial notice only before any message */}
            {!messages.length && (
              <View className="self-start max-w-[90%] rounded-2xl bg-yellow-100 dark:bg-yellow-900 p-4 mb-2">
                <Text className="text-sm text-yellow-900 dark:text-yellow-100">
                  Bu tamamlayıcı bir ilk yardım uygulamasıdır. Lütfen önce 112'yi arayın. Aramadıysanız sağ üstten aramayı gerçekleştirebilirsiniz.
                </Text>
              </View>
            )}

            {!messages.length && <WelcomeMessage />}

            {messages.map((m) => (
              <React.Fragment key={m.id}>
                {m.toolInvocations?.map((t) => {
                  if (t.toolName === 'getWeather') {
                    if (t.state !== 'result') {
                      return (
                        <View
                          key={t.toolCallId}
                          className={cn('mt-2 max-w-[85%] rounded-2xl bg-gray-100 dark:bg-gray-800 p-4')}
                        >
                          <ActivityIndicator size="small" color="black" />
                          <Text className="text-foreground">Getting weather data...</Text>
                        </View>
                      );
                    }
                    if (t.state === 'result') {
                      return (
                        <WeatherCard
                          key={t.toolCallId}
                          city={t.result.city || 'Unknown'}
                          temperature={t.result.current.temperature_2m}
                          weatherCode={t.result.current.weathercode}
                          humidity={t.result.current.relative_humidity_2m}
                          wind={t.result.current.wind_speed_10m}
                        />
                      );
                    }
                  }
                  return null;
                })}

                {/* Message bubble */}
                <View
                  className={
                    m.role === 'user'
                      ? 'ml-auto max-w-[85%] rounded-2xl bg-gray-200 dark:bg-gray-700 px-4 py-2'
                      : 'mr-auto max-w-[85%] rounded-2xl bg-gray-100 dark:bg-gray-800 px-4 py-2'
                  }
                  style={{ overflow: 'hidden' }}
                >
                  {m.content.length > 0 && (
                    <>
                      {m.role !== 'user' && (
                        <View className="mb-1">
                          <Text className="text-xs text-gray-500 dark:text-gray-400">Assistant</Text>
                        </View>
                      )}
                      <CustomMarkdown content={m.content} />
                    </>
                  )}
                </View>

                {isLoading && messages[messages.length - 1].role === 'user' && m === messages[messages.length - 1] && (
                  <View className="flex-row items-center gap-2">
                    <View className="mr-1 h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                      <Text className="text-base text-foreground">🤖</Text>
                    </View>
                    <View className="-ml-2 -mt-[1px]">
                      <LottieLoader width={40} height={40} />
                    </View>
                  </View>
                )}
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  },
);
