"use client";

import React from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "@/store";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";

const ClientProvider: React.FC<{ children: React.ReactNode }> = React.memo(
  ({ children }) => {
    return (
      <ErrorBoundary>
        <Provider store={store}>
          <AuthProvider>{children}</AuthProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 5000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                icon: "🚀",
              },
              error: {
                duration: 3000,
                icon: "🚨",
              },
            }}
          />
        </Provider>
      </ErrorBoundary>
    );
  }
);

ClientProvider.displayName = "ClientProvider";

export default ClientProvider;
