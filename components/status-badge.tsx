import { clsx } from "clsx";

import { type AttendanceStatus, statusLabel } from "@/lib/attendance";

type StatusBadgeProps = {
  status: AttendanceStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-semibold",
        status === "ready" && "bg-emerald-100 text-emerald-700",
        status === "not_ready" && "bg-rose-100 text-rose-700",
        status === "pending" && "bg-slate-100 text-slate-500",
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
