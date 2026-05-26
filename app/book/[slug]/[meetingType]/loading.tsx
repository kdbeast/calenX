import { Loader2, CalendarClock } from "lucide-react";

export default function BookingPageLoading() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
          <CalendarClock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Loading available slots</h2>

          <p className="text-sm text-muted-foreground">
            Checking calendar availability and meeting times...
          </p>
        </div>

        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    </main>
  );
}
