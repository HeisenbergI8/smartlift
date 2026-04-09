import type {
  DashboardOverview,
  GetKpiSnapshotsParams,
  GetNutritionAdherenceParams,
  GetWeightTrendParams,
  GetWorkoutConsistencyParams,
  KpiSnapshot,
  NutritionAdherenceResponse,
  StrengthProgressResponse,
  WeightTrendPeriod,
  WeightTrendResponse,
  WorkoutConsistencyResponse,
} from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toDateStr = (d: Date) => d.toISOString().split("T")[0];
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const weeksAgo = (n: number) => daysAgo(n * 7);

let nextSnapshotId = 5;

const mockSnapshots: KpiSnapshot[] = [
  {
    id: 1,
    userId: 1,
    snapshotDate: toDateStr(daysAgo(21)),
    bodyWeightKg: 85.2,
    totalSessionsWeek: 4,
    plannedSessionsWeek: 6,
    consistencyScore: 67,
    strengthIndex: 2350,
    weeklyStreak: 2,
    createdAt: daysAgo(21).toISOString(),
  },
  {
    id: 2,
    userId: 1,
    snapshotDate: toDateStr(daysAgo(14)),
    bodyWeightKg: 84.1,
    totalSessionsWeek: 5,
    plannedSessionsWeek: 6,
    consistencyScore: 83,
    strengthIndex: 2390,
    weeklyStreak: 3,
    createdAt: daysAgo(14).toISOString(),
  },
  {
    id: 3,
    userId: 1,
    snapshotDate: toDateStr(daysAgo(7)),
    bodyWeightKg: 83.3,
    totalSessionsWeek: 6,
    plannedSessionsWeek: 6,
    consistencyScore: 100,
    strengthIndex: 2430,
    weeklyStreak: 4,
    createdAt: daysAgo(7).toISOString(),
  },
  {
    id: 4,
    userId: 1,
    snapshotDate: toDateStr(new Date()),
    bodyWeightKg: 82.5,
    totalSessionsWeek: 5,
    plannedSessionsWeek: 6,
    consistencyScore: 83,
    strengthIndex: 2450,
    weeklyStreak: 4,
    createdAt: new Date().toISOString(),
  },
];

export const dashboardApiService = {
  async getOverview(): Promise<DashboardOverview> {
    await delay(400);
    const latest = mockSnapshots[mockSnapshots.length - 1];
    return {
      latestBodyWeight: { weightKg: 82.5, logDate: toDateStr(new Date()) },
      latestKpiSnapshot: latest,
      activeNutritionRecommendation: {
        dailyCaloriesKcal: 2200,
        proteinG: 160,
        carbohydratesG: 220,
        fatsG: 61,
      },
      activeWorkoutPlan: { name: "Push / Pull / Legs", daysPerWeek: 6 },
      unreadNotificationsCount: 3,
      activeEgoLiftAlertsCount: 1,
    };
  },

  async getStrengthProgress(): Promise<StrengthProgressResponse> {
    await delay(350);
    return {
      records: [
        {
          exerciseName: "Barbell Back Squat",
          currentMaxWeightKg: 160,
          achievedAt: daysAgo(5).toISOString(),
        },
        {
          exerciseName: "Barbell Bench Press",
          currentMaxWeightKg: 120,
          achievedAt: daysAgo(12).toISOString(),
        },
        {
          exerciseName: "Deadlift",
          currentMaxWeightKg: 200,
          achievedAt: daysAgo(3).toISOString(),
        },
        {
          exerciseName: "Overhead Press",
          currentMaxWeightKg: 85,
          achievedAt: daysAgo(8).toISOString(),
        },
        {
          exerciseName: "Romanian Deadlift",
          currentMaxWeightKg: 150,
          achievedAt: daysAgo(10).toISOString(),
        },
      ],
    };
  },

  async getWeightTrend(
    params?: GetWeightTrendParams,
  ): Promise<WeightTrendResponse> {
    await delay(350);
    const period: WeightTrendPeriod = params?.period ?? "month";
    const days = period === "week" ? 7 : period === "3months" ? 90 : 30;
    const endTarget = 82.5;
    const startBase = endTarget + (days / 30) * 2.0;

    const entries = Array.from({ length: days }, (_, i) => {
      const progress = days > 1 ? i / (days - 1) : 1;
      const weight =
        startBase -
        progress * (startBase - endTarget) +
        Math.sin(i * 0.8) * 0.2;
      return {
        logDate: toDateStr(daysAgo(days - 1 - i)),
        weightKg: +weight.toFixed(1),
      };
    });

    const startWeight = entries[0]?.weightKg ?? null;
    const endWeight = entries[entries.length - 1]?.weightKg ?? null;
    const changeKg =
      startWeight !== null && endWeight !== null
        ? +(endWeight - startWeight).toFixed(1)
        : null;
    const changePct =
      startWeight && changeKg !== null
        ? +((changeKg / startWeight) * 100).toFixed(1)
        : null;

    return { entries, startWeight, endWeight, changeKg, changePct };
  },

  async getWorkoutConsistency(
    params?: GetWorkoutConsistencyParams,
  ): Promise<WorkoutConsistencyResponse> {
    await delay(350);
    const totalWeeks = params?.weeks ?? 8;
    const planned = 6;
    const completedPattern = [4, 5, 6, 3, 6, 5, 6, 5];

    const weeks = Array.from({ length: totalWeeks }, (_, i) => {
      const weekStart = toDateStr(weeksAgo(totalWeeks - 1 - i));
      const completed = completedPattern[i % completedPattern.length];
      return {
        weekStart,
        planned,
        completed,
        consistencyPct: Math.round((completed / planned) * 100),
      };
    });

    const totalCompleted = weeks.reduce((s, w) => s + w.completed, 0);
    const totalPlanned = weeks.reduce((s, w) => s + w.planned, 0);

    let currentStreak = 0;
    for (let i = weeks.length - 1; i >= 0; i--) {
      if (weeks[i].completed >= weeks[i].planned) currentStreak++;
      else break;
    }

    return {
      weeks,
      overallConsistencyPct: Math.round((totalCompleted / totalPlanned) * 100),
      currentStreak,
    };
  },

  async getNutritionAdherence(
    params?: GetNutritionAdherenceParams,
  ): Promise<NutritionAdherenceResponse> {
    await delay(350);
    const totalDays = params?.days ?? 30;
    const target = 2200;
    const loggedPattern = [
      2180, 2250, 2100, 1980, 2320, 2200, 2050, 2300, 2150, 2400, 1900, 2200,
      2350, 2100, 2050, 2180, 2280, 2000, 2200, 2150, 2350, 2100, 1950, 2200,
      2300, 2050, 2100, 2250, 2180, 2200,
    ];

    const entries = Array.from({ length: totalDays }, (_, i) => {
      const loggedCaloriesKcal = loggedPattern[i % loggedPattern.length];
      const adherencePct = +((loggedCaloriesKcal / target) * 100).toFixed(1);
      return {
        date: toDateStr(daysAgo(totalDays - 1 - i)),
        loggedCaloriesKcal,
        targetCaloriesKcal: target,
        adherencePct,
      };
    });

    const avgAdherencePct = +(
      entries.reduce((s, e) => s + e.adherencePct, 0) / entries.length
    ).toFixed(1);
    return { entries, avgAdherencePct };
  },

  async getKpiSnapshots(
    params?: GetKpiSnapshotsParams,
  ): Promise<KpiSnapshot[]> {
    await delay(300);
    let result = [...mockSnapshots];
    if (params?.startDate)
      result = result.filter((s) => s.snapshotDate >= params.startDate!);
    if (params?.endDate)
      result = result.filter((s) => s.snapshotDate <= params.endDate!);
    return result.sort((a, b) => a.snapshotDate.localeCompare(b.snapshotDate));
  },

  async createKpiSnapshot(): Promise<KpiSnapshot> {
    await delay(500);
    const snapshot: KpiSnapshot = {
      id: nextSnapshotId++,
      userId: 1,
      snapshotDate: toDateStr(new Date()),
      bodyWeightKg: 82.5,
      totalSessionsWeek: 5,
      plannedSessionsWeek: 6,
      consistencyScore: 83,
      strengthIndex: 2460,
      weeklyStreak: 4,
      createdAt: new Date().toISOString(),
    };
    mockSnapshots.push(snapshot);
    return { ...snapshot };
  },
};
