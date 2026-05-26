import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
          <SearchX className="h-10 w-10 text-zinc-500 dark:text-zinc-400" />
        </div>

        {/* Content */}
        <h1 className="mt-6 text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
          404 😵‍💫
        </h1>

        <h2 className="mt-3 text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
          Page not found
        </h2>

        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          The page you are looking for does not exist or may have been moved.
        </p>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
