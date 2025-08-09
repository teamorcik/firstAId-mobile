import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ScrollAdapt } from "@/components/scroll-adapt";
import { useWindowDimensions } from "react-native";
import { useState, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useStore } from "@/lib/globalStore";
import { generateUUID } from "@/lib/utils";
import type { Message, CreateMessage } from "@ai-sdk/react";

interface SuggestedActionsProps {
  hasInput?: boolean;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: { body?: object },
  ) => Promise<string | null | undefined>;
}

export function SuggestedActions({
  hasInput = false,
  append,
}: SuggestedActionsProps) {
  const { selectedImageUris, setChatId } = useStore();
  const { width } = useWindowDimensions();
  const [cardWidth, setCardWidth] = useState(0);

  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(
      hasInput || selectedImageUris.length > 0 ? 0 : 1,
      {
        duration: 200,
      },
    );
  }, [hasInput, selectedImageUris]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handlePress = async (action: string) => {
    const newChatId = generateUUID();
    setChatId({ id: newChatId, from: "newChat" });

    // Send the initial message using append
    await append(
      {
        role: "user",
        content: action,
      },
      {
        body: { id: newChatId },
      },
    );
  };

  const actions = [
    {
      title: "Acil İlk Yardım",
      label:
        "Kanama, yanık veya boğulma gibi yaygın acil durumlar için anında ilk yardım rehberliği alın.",
      action: "Kanama acil durumunda ne yapmalıyım?",
    },
    {
      title: "CPR Talimatları",
      label:
        "Acil durumlarda yetişkinler, çocuklar ve bebekler için adım adım CPR prosedürlerini öğrenin.",
      action: "Yetişkin bir kişiye nasıl CPR yapılır?",
    },
    {
      title: "İlk Yardım Çantası Rehberi",
      label:
        "İlk yardım çantanızda hangi temel eşyaların bulunması gerektiğini ve nasıl kullanılacağını öğrenin.",
      action: "İlk yardım çantamda neler bulunmalı?",
    },
  ];

  return (
    <Animated.View style={animatedStyle}>
      <ScrollAdapt withSnap itemWidth={cardWidth}>
        {actions.map((item, i) => (
          <Pressable key={item.action} onPress={() => handlePress(item.action)}>
            <View
              onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
              className={cn(
                "mb-3 mr-2.5 h-32 w-[280px] rounded-lg border border-gray-200 bg-white p-4 dark:bg-black dark:border-gray-700",
              )}
              style={{
                //   borderWidth: StyleSheet.hairlineWidth,
                //   borderColor: "red",
                ...(i === actions.length - 1 && {
                  marginRight: width - cardWidth,
                }),
              }}
            >
              <Text className="text-lg font-semibold text-foreground">{item.title}</Text>
              <Text className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {item.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollAdapt>
    </Animated.View>
  );
}
