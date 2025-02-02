// lib/exportToCsv.ts
interface CalendarEvent {
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
  description?: string;
}

export function exportToCsv(events: CalendarEvent[]) {
  const headers = ["Event", "Start", "End", "Description"];
  const csvContent = [
    headers.join(","),
    ...events.map((event) =>
      [
        event.summary,
        new Date(event.start.dateTime).toLocaleString(),
        new Date(event.end.dateTime).toLocaleString(),
        event.description || "",
      ]
        .map((cell) => `"${cell.replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");

  // Client-side check
  if (typeof window === 'undefined') return;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "calendar_events.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}