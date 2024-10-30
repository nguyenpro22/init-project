import { handleRefreshToken } from "@/core/auth";
import { clearToken, showError } from "@/utils";
import { baseQuery } from "./query";
import { CustomBaseQuery } from "./type";
import { FetchArgs } from "@reduxjs/toolkit/query";

export const baseQueryWithReAuth: CustomBaseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await handleRefreshToken(
      baseQuery,
      args as FetchArgs,
      api,
      extraOptions
    );

    if (refreshResult.data) {
      result = refreshResult as typeof result;
    } else if (refreshResult.error?.status === 500) {
      showError("Session expired. Please log in again.");
      clearToken();
      return { error: { status: 401, data: "Session expired" } };
    }
  }

  if (result.error?.status === 401) {
    showError("Unauthorized access. Redirecting to login.");
    clearToken();
    // window.location.href = "/auth";
  }

  if (result.error?.status === 403) {
    showError("Access forbidden.");
  }

  return result;
};
