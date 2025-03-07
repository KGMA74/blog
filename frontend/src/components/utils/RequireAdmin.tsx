'use client';

import { useRetrieveUserQuery } from "../../redux/features/authApiSlice";
import { useAppSelector } from "../../redux/hooks";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isRefresh, setRefresh] = useState(false);
    const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
    const {data: me} = useRetrieveUserQuery();
    const router = useRouter();

    useEffect(() => {
        console.log('isLoading:', isLoading);
        console.log('isAuthenticated:', isAuthenticated);

        if (!isLoading && !isAuthenticated) {
            router.push("/auth/login-register");
        }
    }, [isLoading, isAuthenticated, router]);


    if (!(isAuthenticated && me?.is_superuser)) {
        return <div className="flex w-full h-full justify-center items-center text-red-500 text-3xl"><p className="">Not allow</p></div>
    }

    return <>{children}</>;
};

export default RequireAuth;