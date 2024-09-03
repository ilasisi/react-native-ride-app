import { createRide } from "@/services/rideService";
import { useMutation } from "@tanstack/react-query";

export const useCreateRide = () => {
    const mutation = useMutation({
        mutationFn: createRide,
        onSuccess: async (response) => {
            if (response.status === 200) {
                console.log(response);
            }
        },
        onError: (error: any) => {
            console.log(error.response.data);
        },
    });

    return mutation;
};
