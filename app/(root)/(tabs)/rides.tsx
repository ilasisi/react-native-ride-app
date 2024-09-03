import { useUser } from "@clerk/clerk-expo";
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RideCard from "@/components/RideCard";
import { images } from "@/constants";
import { Ride } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { getUserRides } from "@/services/rideService";
import { useRefreshByUser } from "@/hooks/useRefreshByUser";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";

const Rides = () => {
    const { user } = useUser();

    const {
        isPending,
        data: recentRides,
        refetch,
    } = useQuery<Ride[], Error>({
        queryKey: ["rides", user?.id],
        queryFn: () => getUserRides(user?.id),
    });

    const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
    useRefreshOnFocus(refetch);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FlatList
                data={recentRides}
                renderItem={({ item }) => <RideCard ride={item} />}
                keyExtractor={(item, index) => index.toString()}
                className="px-5"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingBottom: 100,
                }}
                refreshControl={
                    <RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />
                }
                ListEmptyComponent={() => (
                    <View className="flex flex-col items-center justify-center">
                        {!isPending ? (
                            <>
                                <Image
                                    source={images.noResult}
                                    className="w-40 h-40"
                                    alt="No recent rides found"
                                    resizeMode="contain"
                                />
                                <Text className="text-sm">No recent rides found</Text>
                            </>
                        ) : (
                            <ActivityIndicator size="small" color="#000" />
                        )}
                    </View>
                )}
                ListHeaderComponent={
                    <>
                        <Text className="text-2xl font-JakartaBold my-5">All Rides</Text>
                    </>
                }
            />
        </SafeAreaView>
    );
};

export default Rides;
