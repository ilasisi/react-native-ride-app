import { createUser } from "@/services/userService";
import { useMutation } from "@tanstack/react-query";

export const useCreateUser = () => {
    const mutation = useMutation({
        mutationFn: createUser,
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
