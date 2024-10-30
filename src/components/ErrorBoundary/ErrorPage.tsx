import React from "react";

interface ErrorPageProps {
  error?: Error;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong!
      </h1>
      {error && (
        <pre className="text-sm bg-gray-100 p-4 rounded">{error.message}</pre>
      )}
    </div>
  );
};

export default ErrorPage;
