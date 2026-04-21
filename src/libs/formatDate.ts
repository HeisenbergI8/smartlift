/**
 * Formats an ISO date string or Date object to DD/MM/YYYY.
 * Handles both "2026-04-20" and "2026-04-20T00:00:00.000Z" without timezone drift.
 */
export function formatDate(value: string | Date): string {
  if (typeof value === "string") {
    const datePart = value.split("T")[0];
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
  }
  const dd = String(value.getDate()).padStart(2, "0");
  const mm = String(value.getMonth() + 1).padStart(2, "0");
  const yyyy = value.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
