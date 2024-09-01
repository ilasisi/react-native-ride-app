import CustomButton from "@/components/CustomButton";
import { onboarding } from "@/constants";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

const Onboarding = () => {
    const swiperRef = useRef<Swiper>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const isLastSlide = activeIndex === onboarding.length - 1;

    return (
        <SafeAreaView className="flex items-center justify-between h-screen">
            <TouchableOpacity
                onPress={() => router.replace("/(auth)/sign-up")}
                className="w-full flex justify-end items-end p-5">
                <Text className="text-black font-JakartaBold">Skip</Text>
            </TouchableOpacity>

            <Swiper
                ref={swiperRef}
                loop={false}
                dot={<View className="w-[32px] h-[4px] mx-1 bg-neutral-300 rounded-full" />}
                activeDot={<View className="w-[32px] h-[4px] mx-1 bg-blue-400 rounded-full" />}
                onIndexChanged={(index) => setActiveIndex(index)}>
                {onboarding.map((item) => (
                    <View className="flex items-center justify-center p-5 space-y-10" key={item.id}>
                        <Image
                            source={item.image}
                            className="w-full h-[300px]"
                            resizeMode="contain"
                        />
                        <View className="flex items-center justify-center w-full space-y-3 px-10">
                            <Text className="text-black text-3xl font-bold text-center">
                                {item.title}
                            </Text>
                            <Text className="font-JakartaSemiBold text-neutral-500 text-center">
                                {item.description}
                            </Text>
                        </View>
                    </View>
                ))}
            </Swiper>
            <CustomButton
                title={isLastSlide ? "Get Started" : "Next"}
                className="w-11/12 mt-10"
                onPress={() =>
                    isLastSlide ? router.replace("/(auth)/sign-up") : swiperRef.current?.scrollBy(1)
                }
            />
        </SafeAreaView>
    );
};

export default Onboarding;
