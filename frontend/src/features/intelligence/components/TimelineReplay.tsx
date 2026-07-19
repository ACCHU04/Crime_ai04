import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { getTimelineColor, getTimelineIcon } from "@/features/investigations/utils";
import { formatDateTime } from "@/lib/formatters";
import type { TimelineData } from "@/features/investigations/types";

interface TimelineReplayProps {
  timeline: TimelineData | undefined;
  isLoading: boolean;
}

export function TimelineReplay({ timeline, isLoading }: TimelineReplayProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const events = timeline?.events ?? [];

  const stopPlayback = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isPlaying && events.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= events.length - 1) {
            stopPlayback();
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, events.length, stopPlayback]);

  const handlePlay = () => {
    if (currentIndex >= events.length - 1) {
      setCurrentIndex(-1);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    stopPlayback();
  };

  const handleNext = () => {
    stopPlayback();
    setCurrentIndex((prev) => Math.min(prev + 1, events.length - 1));
  };

  const handlePrev = () => {
    stopPlayback();
    setCurrentIndex((prev) => Math.max(prev - 1, -1));
  };

  const handleReset = () => {
    stopPlayback();
    setCurrentIndex(-1);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline Replay</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="card" />
        </CardContent>
      </Card>
    );
  }

  if (!events.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline Replay</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No events" description="Timeline data is not available." />
        </CardContent>
      </Card>
    );
  }

  const progress = events.length > 0 ? ((currentIndex + 1) / events.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Timeline Replay</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="relative h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-[var(--accent)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleReset}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handlePrev}
            disabled={currentIndex <= -1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors"
            title="Previous"
          >
            <SkipBack className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-white hover:brightness-110 transition-all"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= events.length - 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors"
            title="Next"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="text-center text-[10px] text-[var(--text-muted)]">
          {currentIndex < 0 ? "Ready to play" : `Event ${currentIndex + 1} of ${events.length}`}
        </p>

        {/* Visible events (up to current index) */}
        <div className="relative ml-3 border-l-2 border-[var(--border-subtle)] pl-6 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {events.map((event, i) => {
              const isVisible = i <= currentIndex;
              if (!isVisible) return null;

              const Icon = getTimelineIcon(event.type);
              const isCurrent = i === currentIndex;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`relative mb-4 last:mb-0 ${isCurrent ? "ring-1 ring-[var(--accent)]/30 rounded-lg" : ""}`}
                >
                  <div className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border-2 ${getTimelineColor(event.type)}`}>
                    <Icon className="h-3 w-3 text-[var(--text-primary)]" />
                  </div>
                  <div className={`${isCurrent ? "bg-[var(--accent)]/5 rounded-lg p-1" : ""}`}>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{event.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{formatDateTime(event.date)}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
