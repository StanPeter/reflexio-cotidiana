import { useMemo } from "react";

export const useLogDateString = (logDate: Date | undefined) => {
  const dailyLogDateString = useMemo(() => {
    if (!logDate) return "";

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
  }, [logDate]);

  return dailyLogDateString;
};
