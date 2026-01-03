import { useMemo } from "react";
import type { TCurrentContent } from "./page";

export const useLogDateString = (
  logDate: Date | undefined,
  currentContentSection: TCurrentContent
) => {
  const dailyLogDateString = useMemo(() => {
    if (!logDate || currentContentSection === "allFinished") return "";

    const normalize = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

    const dayDiff = Math.round(
      (normalize(new Date()) - normalize(logDate)) / 86400000
    );

    if (dayDiff === 1) return " (Yesterday)";
    const formatter = new Intl.DateTimeFormat("en", {
      weekday: "long",
      day: "2-digit",
      month: "short",
    });
    return ` (${formatter.format(logDate)})`;
  }, [logDate, currentContentSection]);

  return dailyLogDateString;
};
