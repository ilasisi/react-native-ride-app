import { axiosInstance } from "@/lib/axios";

export const getRiders = async () => {
    const response = await axiosInstance.get("riders");

    return response.data;
};

export const getUserRides = async (id?: string) => {
    const response = await axiosInstance.get(`rides/${id}`);

    return response.data;
};

export const createRide = async (data: any) => {
    const response = await axiosInstance.post("create/ride", data);

    return response.data;
};
