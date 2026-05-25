"use client";

import {
  Loader2,
  Save,
  Undo2,
  Clock,
  User,
  Mail,
  Video,
  ExternalLink,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import withDragAndDrop, {
  type EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { Calendar, Views, type View } from "react-big-calendar";
import { format, differenceInMinutes, isBefore, startOfDay } from "date-fns";

import type {
  TimeBlock,
  BusyBlock,
  BookedBlock,
  CalendarEvent,
  TimeBlockInteraction,
  SlotInfo,
} from "../types";

import {
  calendarFormats,
  calendarMessages,
  formatTimeRange,
} from "../lib/formats";

import {
  CALENDAR_CONFIG,
  MAX_TIME,
  MIN_TIME,
  AVAILABILITY_COLORS,
  BUSY_BLOCK_COLORS,
  BOOKING_STATUS_COLORS,
} from "../lib/constants";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { localizer } from "../lib/localizer";
import { Button } from "@/components/ui/button";
import { CalendarToolbar } from "./cadendar-toolbar";
import { isBusyBlock, isBookedBlock } from "../types";
import { saveAvailability } from "@/lib/actions/availability";
import { useCalendarEvents } from "../hooks/use-calendar-events";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "./availability-calendar.css";

const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar);

interface AvailabilityCalendarProps {
  initialBlocks?: TimeBlock[];
  busyBlocks?: BusyBlock[];
  bookedBlocks?: BookedBlock[];
}

export function AvailabilityCalendar({
  initialBlocks = [],
  busyBlocks = [],
  bookedBlocks = [],
}: AvailabilityCalendarProps) {
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<BookedBlock | null>(
    null,
  );

  const [isSaving, startSaveTransition] = useTransition();

  const {
    events,
    hasChanges,
    handleSelectSlot,
    handleEventDrop,
    handleEventResize,
    removeBlock,
    copyDayToWeek,
    clearWeek,
    discardChanges,
    markAsSaved,
    getEventsForSave,
  } = useCalendarEvents(initialBlocks);

  const formatDuration = (start: Date, end: Date) => {
    const mins = differenceInMinutes(end, start);

    if (mins < 60) return `${mins}min`;

    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;

    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  };

  const handleSave = () => {
    startSaveTransition(async () => {
      try {
        const blocksToSave = getEventsForSave();

        const savedBlocks = await saveAvailability(blocksToSave);

        const newBlocks: TimeBlock[] = savedBlocks.map((b) => ({
          id: b.id,
          start: new Date(b.start),
          end: new Date(b.end),
        }));

        markAsSaved(newBlocks);
      } catch (error) {
        console.error("Failed to save:", error);
      }
    });
  };

  const allEvents: CalendarEvent[] = [
    ...events,
    ...busyBlocks,
    ...bookedBlocks,
  ];

  const isMonthView = view === Views.MONTH;

  const now = new Date();
  const todayStart = startOfDay(now);

  const isDark = useMemo(() => {
    if (typeof window === "undefined") return false;

    return document.documentElement.classList.contains("dark");
  }, []);

  const slotPropGetter = (date: Date) => {
    if (isBefore(date, now)) {
      return {
        style: {
          backgroundColor: isDark ? "#111111" : "#f5f5f0",
          cursor: "not-allowed",
          opacity: 0.85,
        },
      };
    }

    return {};
  };

  const dayPropGetter = (date: Date) => {
    if (isBefore(date, todayStart)) {
      return {
        style: {
          backgroundColor: isDark ? "#f24949" : "#f24940",
        },
      };
    }

    return {};
  };

  const drillDown = (targetDate: Date) => {
    setDate(targetDate);
    setView(Views.WEEK);
  };

  const adaptEventArgs = (
    args: EventInteractionArgs<CalendarEvent>,
  ): TimeBlockInteraction => ({
    event: args.event as TimeBlock,
    start: args.start as Date,
    end: args.end as Date,
  });

  const onSlotSelect = (slotInfo: SlotInfo) => {
    if (isBefore(slotInfo.end, now)) return;

    isMonthView ? drillDown(slotInfo.start) : handleSelectSlot(slotInfo);
  };

  const onBlockSelect = (block: CalendarEvent) => {
    if (isBookedBlock(block)) {
      setSelectedBooking(block);
      return;
    }

    if (isBusyBlock(block)) return;

    isMonthView ? drillDown(block.start) : removeBlock(block.id);
  };

  const getStatusIndicator = (block: BookedBlock) => {
    switch (block.attendeeStatus) {
      case "accepted":
        return "✓";

      case "declined":
        return "✗";

      case "tentative":
        return "?";

      default:
        return "";
    }
  };

  const getBlockTitle = (block: CalendarEvent) => {
    if (isBusyBlock(block)) {
      return isMonthView ? "Busy" : block.title;
    }

    if (isBookedBlock(block)) {
      const indicator = getStatusIndicator(block);

      return indicator ? `${indicator} ${block.guestName}` : block.guestName;
    }

    return isMonthView ? formatTimeRange(block.start, block.end) : "Available";
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    if (isBusyBlock(event)) {
      return {
        style: {
          backgroundColor: isDark ? "#1d4ed8" : "#3b82f6",

          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: 500,
          padding: "2px 6px",
        },
      };
    }

    if (isBookedBlock(event)) {
      const status =
        event.attendeeStatus && event.attendeeStatus in BOOKING_STATUS_COLORS
          ? event.attendeeStatus
          : "default";

      const darkColors = {
        accepted: {
          background: "#14532d",
          border: "#22c55e",
          text: "#dcfce7",
        },

        tentative: {
          background: "#78350f",
          border: "#f59e0b",
          text: "#fef3c7",
        },

        declined: {
          background: "#7f1d1d",
          border: "#ef4444",
          text: "#fee2e2",
        },

        default: {
          background: "#27272a",
          border: "#52525b",
          text: "#fafafa",
        },
      };

      const colors = isDark
        ? darkColors[status as keyof typeof darkColors]
        : BOOKING_STATUS_COLORS[status as keyof typeof BOOKING_STATUS_COLORS];

      return {
        style: {
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`,
          color: colors.text,
          borderRadius: "10px",
          fontWeight: 600,
          padding: "2px 6px",
        },
      };
    }

    return {
      style: {
        backgroundColor: isDark ? "#1d4ed8" : "#2563eb",

        border: "none",
        color: "white",
        borderRadius: "10px",
        padding: "2px 6px",
        fontWeight: 600,
      },
    };
  };

  const ToolbarWithActions = (
    props: React.ComponentProps<typeof CalendarToolbar>,
  ) => (
    <CalendarToolbar
      {...props}
      showCopyButton={!isMonthView}
      onCopyDayToWeek={(dayIndex, includeWeekends) =>
        copyDayToWeek(dayIndex, date, includeWeekends)
      }
      onClearWeek={() => clearWeek(date)}
    />
  );

  return (
    <div className="calendar-wrapper relative h-[calc(100vh-180px)] min-h-[400px] sm:min-h-[600px]">
      {/* BOOKING DETAILS */}

      <Dialog
        open={!!selectedBooking}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
      >
        <DialogContent className="sm:max-w-md dark:border-zinc-800 dark:bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  selectedBooking?.attendeeStatus === "declined"
                    ? "bg-red-500"
                    : selectedBooking?.attendeeStatus === "tentative"
                      ? "bg-amber-500"
                      : selectedBooking?.attendeeStatus === "accepted"
                        ? "bg-green-600"
                        : "bg-gray-500"
                }`}
              />
              Meeting Details
            </DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 pt-2">
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                  selectedBooking.attendeeStatus === "declined"
                    ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    : selectedBooking.attendeeStatus === "tentative"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      : selectedBooking.attendeeStatus === "accepted"
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                {selectedBooking.attendeeStatus === "declined" &&
                  "Guest Declined"}

                {selectedBooking.attendeeStatus === "tentative" &&
                  "Guest Tentative"}

                {selectedBooking.attendeeStatus === "accepted" &&
                  "Guest Accepted"}

                {selectedBooking.attendeeStatus === "needsAction" &&
                  "Guest: Awaiting Response"}
              </div>

              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 text-muted-foreground" />

                <div>
                  <p className="font-medium">{selectedBooking.guestName}</p>

                  <p className="text-sm text-muted-foreground">Guest</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />

                <div>
                  <a
                    href={`mailto:${selectedBooking.guestEmail}`}
                    className="font-medium text-blue-500 hover:underline"
                  >
                    {selectedBooking.guestEmail}
                  </a>

                  <p className="text-sm text-muted-foreground">Email</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />

                <div>
                  <p className="font-medium">
                    {format(selectedBooking.start, "EEEE, MMMM d, yyyy")}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {format(selectedBooking.start, "h:mm a")} –{" "}
                    {format(selectedBooking.end, "h:mm a")} (
                    {formatDuration(selectedBooking.start, selectedBooking.end)}
                    )
                  </p>
                </div>
              </div>

              {selectedBooking.meetLink && (
                <div className="flex items-start gap-3">
                  <Video className="mt-0.5 h-5 w-5 text-muted-foreground" />

                  <div>
                    <a
                      href={selectedBooking.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-medium text-blue-500 hover:underline"
                    >
                      Join Google Meet
                      <ExternalLink className="h-4 w-4" />
                    </a>

                    <p className="text-sm text-muted-foreground">Video call</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedBooking(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* SAVE BAR */}

      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-zinc-200 bg-white/90 px-4 py-2 shadow-2xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90">
          <span className="text-sm font-medium text-muted-foreground">
            Unsaved changes
          </span>

          <div className="h-4 w-px bg-border" />

          <Button
            variant="ghost"
            size="sm"
            onClick={discardChanges}
            disabled={isSaving}
          >
            <Undo2 className="mr-1 h-4 w-4" />
            Discard
          </Button>

          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1 h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      )}

      <DnDCalendar
        localizer={localizer}
        style={{ height: "100%" }}
        formats={calendarFormats}
        messages={calendarMessages}
        events={allEvents}
        view={view}
        date={date}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        onView={setView}
        onNavigate={setDate}
        onDrillDown={drillDown}
        startAccessor="start"
        endAccessor="end"
        titleAccessor={getBlockTitle}
        eventPropGetter={eventStyleGetter}
        selectable
        resizable={!isMonthView}
        draggableAccessor={(event) =>
          !isMonthView && !isBusyBlock(event) && !isBookedBlock(event)
        }
        popup
        onSelectSlot={onSlotSelect}
        onSelectEvent={onBlockSelect}
        onEventDrop={(args) => {
          if (
            !isMonthView &&
            !isBusyBlock(args.event) &&
            !isBookedBlock(args.event)
          ) {
            handleEventDrop(adaptEventArgs(args));
          }
        }}
        onEventResize={(args) => {
          if (
            !isMonthView &&
            !isBusyBlock(args.event) &&
            !isBookedBlock(args.event)
          ) {
            handleEventResize(adaptEventArgs(args));
          }
        }}
        min={MIN_TIME}
        max={MAX_TIME}
        step={CALENDAR_CONFIG.step}
        timeslots={CALENDAR_CONFIG.timeslots}
        slotPropGetter={slotPropGetter}
        dayPropGetter={dayPropGetter}
        components={{
          toolbar: ToolbarWithActions,
        }}
      />
    </div>
  );
}
