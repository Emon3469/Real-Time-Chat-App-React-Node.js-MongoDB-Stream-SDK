import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
    const authUser = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser,
        retry: false,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    return {
        isLoading: authUser.isLoading,
        authUser: authUser.data?.user,
        error: authUser.error,
    };
};

export default useAuthUser;
