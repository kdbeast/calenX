"use client";

import { AlertCircle } from "lucide-react";

export default function AvailabilityError() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="mt-6 text-2xl font-bold">Failed to load availability</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't sync your availability calendar right now.
        </p>
      </div>
    </main>
  );
}
