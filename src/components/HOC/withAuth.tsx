import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/utils";
import LoadingSpinner from "@/components/LoadingSpinner";
export const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return function WithAuthComponent(props: any) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const validateAuth = async () => {
        const token = getAccessToken();
        if (!token) {
          router.push("/auth");
        } else {
          setIsLoading(false);
        }
      };
      validateAuth();
    }, [router]);

    if (isLoading) {
      return <LoadingSpinner />;
    }

    return <WrappedComponent {...props} />;
  };
};
