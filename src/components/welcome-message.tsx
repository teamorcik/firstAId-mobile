import { View } from "react-native";
import { Text } from "./ui/text";

export const WelcomeMessage = () => {
  return (
    <View className="items-center justify-center py-10">
      <Text className="text-2xl font-semibold text-foreground mb-2">Merhaba</Text>
      <Text className="text-sm text-gray-500 dark:text-gray-400">
        Bir şeyler yazın veya aşağıdaki önerilerden birini seçin.
      </Text>
    </View>
  );
};
