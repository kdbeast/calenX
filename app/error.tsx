"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>

        {/* Content */}
        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Something went wrong
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            An unexpected error occurred while loading this page.
          </p>

          {/* Dev Error */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 rounded-lg bg-zinc-100 p-3 text-left text-xs text-red-600 dark:bg-zinc-800 dark:text-red-400">
              {error.message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
