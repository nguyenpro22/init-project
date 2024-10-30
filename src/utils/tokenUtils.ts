import { CookieStorageKey } from "@/constants";
import { clearCookieStorage, getCookie, setCookie } from "@/utils";

export const clearToken = () => {
  // clearLocalStorage();
  // clearSessionStorage();
  clearCookieStorage();
};

export const getAccessToken = (): string | null => {
  return getCookie(CookieStorageKey.ACCESS_TOKEN) == "undefined"
    ? null
    : getCookie(CookieStorageKey.ACCESS_TOKEN);
};

export const setAccessToken = (value: unknown) => {
  return setCookie(CookieStorageKey.ACCESS_TOKEN, value as string, 1);
};

export const getRefreshToken = () => {
  return getCookie(CookieStorageKey.REFRESH_TOKEN);
};

export const setRefreshToken = (value: unknown) => {
  return setCookie(CookieStorageKey.REFRESH_TOKEN, value as string, 1);
};

export const getRefreshTokenExpiryTime = () => {
  return getCookie(CookieStorageKey.REFRESH_TOKEN_EXPIRY_TIME);
};

export const setRefreshTokenExpiryTime = (value: unknown) => {
  return setCookie(
    CookieStorageKey.REFRESH_TOKEN_EXPIRY_TIME,
    value as string,
    1
  );
};

export const decodeJwt = (token: string | null) => {
  if (token === "undefined" || !token) {
    return null;
  }
  if (!token) {
    return null;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
};

export const GetDataByToken = (token: string): unknown | null => {
  const decoded = decodeJwt(token);
  // const id = decoded?.UserId;
  // const role = decoded?.Role;
  // const vendorId = decoded?.VendorId;
  // return { id, vendorId, role };
  return null;
};

export const rememberMe = (token: string, refreshToken: string): void => {
  setCookie(CookieStorageKey.REMEMBER_ME, "true", 30);
  setCookie(CookieStorageKey.ACCESS_TOKEN, token, 30);
  setCookie(CookieStorageKey.REFRESH_TOKEN, refreshToken, 30);
};
export const isRememberMe = (): boolean => {
  return getCookie(CookieStorageKey.REMEMBER_ME) ? true : false;
};

export const isTokenExpired = (): boolean => {
  const expiryTime = getRefreshTokenExpiryTime();
  if (!expiryTime) {
    return true;
  }
  const timeRemaining = new Date(expiryTime).getTime() - Date.now();
  const threshold = 30 * 1000;

  return timeRemaining <= threshold;
};
