import { axiosInstance } from "@/lib/axios";

interface CreateUserProps {
    first_name: string;
    last_name: string;
    email: string;
    clerk_id?: string | null;
    password?: string;
}

export const createUser = async (data: CreateUserProps) => {
    const response = await axiosInstance.post("create/user", data);

    return response.data;
};
