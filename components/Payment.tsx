import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { LegacyRef, ReactNode, useRef, useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";
import { Paystack, paystackProps } from "react-native-paystack-webview";

import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { useLocationStore } from "@/store";
import { PaymentProps } from "@/types/type";
import { useCreateRide } from "@/hooks/mutation/ride";

const Payment = ({ email, amount, driverId, rideTime }: PaymentProps) => {
    const paystackWebViewRef = useRef<paystackProps.PayStackRef>();
    const {
        userAddress,
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationAddress,
        destinationLongitude,
    } = useLocationStore();

    const { userId } = useAuth();
    const [success, setSuccess] = useState<boolean>(false);
    const { mutate, isError } = useCreateRide();

    return (
        <>
            <Paystack
                paystackKey={process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY!}
                billingEmail={email}
                amount={parseInt(amount)}
                onCancel={(e) => {
                    Alert.alert(`${e.status}`);
                }}
                onSuccess={async (res) => {
                    mutate({
                        origin_address: userAddress,
                        destination_address: destinationAddress,
                        origin_latitude: userLatitude,
                        origin_longitude: userLongitude,
                        destination_latitude: destinationLatitude,
                        destination_longitude: destinationLongitude,
                        ride_time: rideTime.toFixed(0),
                        fare_price: parseInt(amount) * 100,
                        payment_status: "paid",
                        rider_id: driverId,
                        user_id: userId,
                        status: "accepted",
                    });

                    if (!isError) {
                        setSuccess(true);
                    }
                }}
                ref={paystackWebViewRef as LegacyRef<ReactNode>}
            />
            <CustomButton
                title="Confirm Ride"
                className="my-10"
                onPress={() => paystackWebViewRef.current?.startTransaction()}
            />

            <ReactNativeModal isVisible={success} onBackdropPress={() => setSuccess(false)}>
                <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
                    <Image source={images.check} className="w-28 h-28 mt-5" />

                    <Text className="text-2xl text-center font-JakartaBold mt-5">
                        Booking placed successfully
                    </Text>

                    <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
                        Thank you for your booking. Your reservation has been successfully placed.
                        Please proceed with your trip.
                    </Text>

                    <CustomButton
                        title="Back Home"
                        onPress={() => {
                            setSuccess(false);
                            router.push("/(root)/(tabs)/home");
                        }}
                        className="mt-5"
                    />
                </View>
            </ReactNativeModal>
        </>
    );
};

export default Payment;
