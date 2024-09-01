import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <View className="flex flex-col items-center h-full justify-center space-y-5">
                <Text>This screen doesn't exist.</Text>
                <Link href="/">
                    <Text>Go to home screen!</Text>
                </Link>
            </View>
        </>
    );
}
