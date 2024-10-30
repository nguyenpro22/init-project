import { Mutex } from "async-mutex";
import {
  clearCookieStorage,
  decodeJwt,
  isTokenExpired,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  setRefreshTokenExpiryTime,
} from "@/utils";
import {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { AuthResponse } from "@/features/auth";

const mutex = new Mutex();

export const handleRefreshToken = async (
  baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  args: FetchArgs,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>
) => {
  const release = await mutex.acquire();
  try {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!refreshToken || !accessToken) {
      clearCookieStorage();
      return {
        error: { status: 401, data: "No tokens available" },
      };
    }

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh_token",
        method: "POST",
        body: { accessToken, refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { value } = refreshResult.data as AuthResponse;
      setAccessToken(value.accessToken);
      setRefreshToken(value.refreshToken);
      setRefreshTokenExpiryTime(value.refreshTokenExpiryTime);
      return baseQuery(args, api, extraOptions);
    }

    clearCookieStorage();
    return refreshResult;
  } finally {
    release();
  }
};

// Re-export token utilities for convenience
export {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  setRefreshTokenExpiryTime,
  clearCookieStorage as clearTokens,
  decodeJwt,
  isTokenExpired,
};
