import type {
  BodyWeightLog,
  BodyWeightLogsResponse,
  GetBodyWeightLogsParams,
  GetWeeklyAveragesParams,
  LogBodyWeightDto,
  WeeklyAverage,
  WeightSource,
} from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const dateStr = (daysAgoCount: number): string =>
  new Date(Date.now() - daysAgoCount * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

const isoStr = (daysAgoCount: number): string =>
  new Date(Date.now() - daysAgoCount * 24 * 60 * 60 * 1000).toISOString();

let nextId = 61;

const SOURCES: WeightSource[] = [
  "manual",
  "smart_scale",
  "smart_scale",
  "smart_scale",
  "manual",
];

// Seed data — 60 days, most days logged
const mockLogs: BodyWeightLog[] = Array.from({ length: 60 }, (_, i) => {
  const daysAgoCount = 60 - i;
  // Skip a few days to look realistic (every ~7 days skip one)
  if (daysAgoCount % 7 === 0 && daysAgoCount > 0) return null;
  const base = 83.5 - i * 0.05; // slight downtrend
  const noise = Math.sin(i * 1.7) * 0.4 + Math.cos(i * 0.9) * 0.3;
  const weight = Math.round((base + noise) * 10) / 10;
  return {
    id: i + 1,
    userId: 1,
    logDate: dateStr(daysAgoCount),
    weightKg: weight,
    source: SOURCES[i % SOURCES.length],
    notes: i === 0 ? "After vacation" : i === 14 ? "Post-deload week" : null,
    createdAt: isoStr(daysAgoCount),
    updatedAt: isoStr(daysAgoCount),
  } satisfies BodyWeightLog;
}).filter(Boolean) as BodyWeightLog[];

export const bodyWeightApiService = {
  async getLogs(
    params?: GetBodyWeightLogsParams,
  ): Promise<BodyWeightLogsResponse> {
    await delay(300);
    let filtered = [...mockLogs];
    if (params?.startDate) {
      filtered = filtered.filter((l) => l.logDate >= params.startDate!);
    }
    if (params?.endDate) {
      filtered = filtered.filter((l) => l.logDate <= params.endDate!);
    }
    filtered.sort((a, b) => b.logDate.localeCompare(a.logDate));
    return { data: filtered, meta: { total: filtered.length } };
  },

  async getLatest(): Promise<BodyWeightLog | null> {
    await delay(200);
    const sorted = [...mockLogs].sort((a, b) =>
      b.logDate.localeCompare(a.logDate),
    );
    return sorted[0] ?? null;
  },

  async getWeeklyAverages(
    params?: GetWeeklyAveragesParams,
  ): Promise<WeeklyAverage[]> {
    await delay(300);
    const weeksCount = params?.weeks ?? 12;
    const weeks: WeeklyAverage[] = [];

    for (let w = weeksCount - 1; w >= 0; w--) {
      const weekEndDays = w * 7;
      const weekStartDays = weekEndDays + 6;
      const start = dateStr(weekStartDays);
      const end = dateStr(weekEndDays);
      const logsInRange = mockLogs.filter(
        (l) => l.logDate >= start && l.logDate <= end,
      );
      if (logsInRange.length === 0) continue;
      const avg =
        logsInRange.reduce((sum, l) => sum + l.weightKg, 0) /
        logsInRange.length;
      weeks.push({
        weekStart: start,
        weekEnd: end,
        averageWeightKg: Math.round(avg * 100) / 100,
        logCount: logsInRange.length,
      });
    }

    return weeks;
  },

  async logWeight(dto: LogBodyWeightDto): Promise<BodyWeightLog> {
    await delay(400);
    const existing = mockLogs.find((l) => l.logDate === dto.logDate);
    if (existing) {
      existing.weightKg = dto.weightKg;
      existing.source = dto.source;
      existing.notes = dto.notes ?? null;
      existing.updatedAt = new Date().toISOString();
      return { ...existing };
    }
    const newLog: BodyWeightLog = {
      id: nextId++,
      userId: 1,
      logDate: dto.logDate,
      weightKg: dto.weightKg,
      source: dto.source,
      notes: dto.notes ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockLogs.push(newLog);
    return { ...newLog };
  },

  async deleteLog(id: number): Promise<void> {
    await delay(300);
    const idx = mockLogs.findIndex((l) => l.id === id);
    if (idx !== -1) {
      mockLogs.splice(idx, 1);
    }
  },
};
