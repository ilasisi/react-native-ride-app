import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";

import { useCreateUser } from "@/hooks/mutation/user";

export const tokenCache = {
    async getToken(key: string) {
        try {
            const item = await SecureStore.getItemAsync(key);
            if (item) {
                console.log(`${key} was used 🔐 \n`);
            } else {
                console.log("No values stored under key: " + key);
            }
            return item;
        } catch (error) {
            console.error("SecureStore get item error: ", error);
            await SecureStore.deleteItemAsync(key);
            return null;
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return SecureStore.setItemAsync(key, value);
        } catch (err) {
            console.log(err);
            return;
        }
    },
};

export const googleOAuth = async (startOAuthFlow: any) => {
    const { mutate } = useCreateUser();

    try {
        const { createdSessionId, setActive, signUp } = await startOAuthFlow({
            redirectUrl: Linking.createURL("/(root)/(tabs)/home"),
        });

        if (createdSessionId) {
            if (setActive) {
                await setActive({ session: createdSessionId });

                if (signUp.createdUserId) {
                    mutate({
                        first_name: signUp.firstName,
                        last_name: signUp.lastName,
                        email: signUp.emailAddress,
                        clerk_id: signUp.createdUserId,
                    });
                }

                return {
                    success: true,
                    code: "success",
                    message: "You have successfully signed in with Google",
                };
            }
        }

        return {
            success: false,
            message: "An error occurred while signing in with Google",
        };
    } catch (err: any) {
        console.error(err);
        return {
            success: false,
            code: err.code,
            message: err?.errors[0]?.longMessage,
        };
    }
};
