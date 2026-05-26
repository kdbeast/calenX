import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-5">
        {/* Spinner */}
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-zinc-200 dark:border-zinc-800" />

          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Loading...
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Please wait while we prepare your experience.
          </p>
        </div>
      </div>
    </main>
  );
}
