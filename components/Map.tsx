import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { icons } from "@/constants";
import { calculateDriverTimes, calculateRegion, generateMarkersFromData } from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { getRiders } from "@/services/rideService";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { axiosInstance } from "@/lib/axios";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

const Map = () => {
    const { userLongitude, userLatitude, destinationLatitude, destinationLongitude } =
        useLocationStore();
    const { selectedDriver, setDrivers } = useDriverStore();

    const {
        isPending,
        error,
        data: drivers,
        refetch,
    } = useQuery<Driver[], Error>({
        queryKey: ["drivers"],
        queryFn: getRiders,
    });

    useRefreshOnFocus(refetch);

    const [markers, setMarkers] = useState<MarkerData[]>([]);

    useEffect(() => {
        if (Array.isArray(drivers)) {
            if (!userLatitude || !userLongitude) return;

            const newMarkers = generateMarkersFromData({
                data: drivers,
                userLatitude,
                userLongitude,
            });

            setMarkers(newMarkers);
        }
    }, [drivers, userLatitude, userLongitude]);

    useEffect(() => {
        if (
            markers.length > 0 &&
            destinationLatitude !== undefined &&
            destinationLongitude !== undefined
        ) {
            calculateDriverTimes({
                markers,
                userLatitude,
                userLongitude,
                destinationLatitude,
                destinationLongitude,
            }).then((drivers) => {
                setDrivers(drivers as MarkerData[]);
            });
        }
    }, [
        markers,
        destinationLatitude,
        destinationLongitude,
        setDrivers,
        userLatitude,
        userLongitude,
    ]);

    const region = calculateRegion({
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
    });

    if (isPending || (!userLatitude && !userLongitude))
        return (
            <View className="flex justify-between items-center w-full">
                <ActivityIndicator size="small" color="#000" />
            </View>
        );

    if (error)
        return (
            <View className="flex justify-between items-center w-full">
                <Text>Error: {error.message}</Text>
            </View>
        );

    return (
        <MapView
            provider={PROVIDER_DEFAULT}
            className="w-full h-full rounded-2xl"
            tintColor="black"
            mapType="mutedStandard"
            showsPointsOfInterest={false}
            initialRegion={region}
            showsUserLocation={true}
            userInterfaceStyle="light">
            {markers.map((marker, index) => (
                <Marker
                    key={marker.id}
                    coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                    }}
                    title={marker.title}
                    image={selectedDriver === marker.id ? icons.selectedMarker : icons.marker}
                />
            ))}

            {destinationLatitude && destinationLongitude && (
                <>
                    <Marker
                        key="destination"
                        coordinate={{
                            latitude: destinationLatitude,
                            longitude: destinationLongitude,
                        }}
                        title="Destination"
                        image={icons.pin}
                    />
                    <MapViewDirections
                        origin={{
                            latitude: userLatitude!,
                            longitude: userLongitude!,
                        }}
                        destination={{
                            latitude: destinationLatitude,
                            longitude: destinationLongitude,
                        }}
                        apikey={directionsAPI!}
                        strokeColor="#0286FF"
                        strokeWidth={3}
                    />
                </>
            )}
        </MapView>
    );
};

export default Map;
