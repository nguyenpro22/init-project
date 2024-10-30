import { createContext, useContext, useMemo } from "react";
import { useLoginMutation, useRegisterMutation } from "@/features/auth/api";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "@/features/auth/slice";
import { showError, showSuccess } from "@/utils/toast";
import {
  ILoginRequest,
  IRegisterRequest,
  ILoginResponse,
} from "@/features/auth/type";
import { RootState } from "@/store";

interface AuthContextType {
  user: ILoginResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (credentials: ILoginRequest) => Promise<void>;
  register: (data: IRegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] =
    useRegisterMutation();

  const contextValue = useMemo(
    () => ({
      user: auth.user,
      isAuthenticated: auth.isAuthenticated,
      isLoading: isLoginLoading || isRegisterLoading,
      accessToken: auth.accessToken,

      login: async (credentials: ILoginRequest) => {
        try {
          const result = await loginMutation(credentials).unwrap();
          dispatch(setCredentials(result));
          showSuccess("Đăng nhập thành công");
        } catch (error) {
          showError("Đăng nhập thất bại");
          throw error;
        }
      },

      register: async (data: IRegisterRequest) => {
        try {
          const result = await registerMutation(data).unwrap();
          dispatch(setCredentials(result));
          showSuccess("Đăng ký thành công");
        } catch (error) {
          showError("Đăng ký thất bại");
          throw error;
        }
      },

      logout: () => {
        dispatch(logout());
        showSuccess("Đã đăng xuất");
      },
    }),
    [
      auth,
      dispatch,
      loginMutation,
      registerMutation,
      isLoginLoading,
      isRegisterLoading,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
