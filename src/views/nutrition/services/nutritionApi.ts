import type {
  CreateNutritionRecommendationDto,
  DailyNutritionLog,
  DailyNutritionLogsResponse,
  GetDailyLogsParams,
  LogDailyNutritionDto,
  NutritionAdjustment,
  NutritionRecommendation,
  NutritionRecommendationsResponse,
  PlateauDetectResult,
} from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const daysAgo = (d: number) =>
  new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

let nextId = 4;

const mockRecommendations: NutritionRecommendation[] = [
  {
    id: 1,
    userId: 1,
    dailyCaloriesKcal: 2200,
    proteinG: 160,
    carbohydratesG: 220,
    fatsG: 61,
    effectiveFrom: daysAgo(14),
    effectiveTo: null,
    notes: "Maintenance phase — moderate deficit.",
    source: "system",
    isActive: true,
    createdAt: daysAgo(14),
    updatedAt: daysAgo(14),
  },
  {
    id: 2,
    userId: 1,
    dailyCaloriesKcal: 2450,
    proteinG: 170,
    carbohydratesG: 265,
    fatsG: 68,
    effectiveFrom: daysAgo(45),
    effectiveTo: daysAgo(14),
    notes: "Bulk phase — slight caloric surplus.",
    source: "coach",
    isActive: false,
    createdAt: daysAgo(45),
    updatedAt: daysAgo(14),
  },
  {
    id: 3,
    userId: 1,
    dailyCaloriesKcal: 1950,
    proteinG: 155,
    carbohydratesG: 180,
    fatsG: 54,
    effectiveFrom: daysAgo(90),
    effectiveTo: daysAgo(45),
    notes: null,
    source: "manual",
    isActive: false,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(45),
  },
];

export const nutritionApiService = {
  async getActiveRecommendation(): Promise<NutritionRecommendation | null> {
    await delay(300);
    return mockRecommendations.find((r) => r.isActive) ?? null;
  },

  async getAllRecommendations(): Promise<NutritionRecommendationsResponse> {
    await delay(300);
    const sorted = [...mockRecommendations].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return { data: sorted, meta: { total: sorted.length } };
  },

  async createRecommendation(
    dto: CreateNutritionRecommendationDto,
  ): Promise<NutritionRecommendation> {
    await delay(400);
    // Deactivate all existing
    mockRecommendations.forEach((r) => {
      if (r.isActive) {
        r.isActive = false;
        r.effectiveTo = new Date().toISOString();
        r.updatedAt = new Date().toISOString();
      }
    });
    const newRec: NutritionRecommendation = {
      id: nextId++,
      userId: 1,
      dailyCaloriesKcal: dto.dailyCaloriesKcal,
      proteinG: dto.proteinG,
      carbohydratesG: dto.carbohydratesG,
      fatsG: dto.fatsG,
      effectiveFrom: dto.effectiveFrom,
      effectiveTo: dto.effectiveTo ?? null,
      notes: dto.notes ?? null,
      source: dto.source,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockRecommendations.push(newRec);
    return { ...newRec };
  },

  async generateRecommendation(): Promise<NutritionRecommendation> {
    await delay(500);
    // Deactivate all existing
    mockRecommendations.forEach((r) => {
      if (r.isActive) {
        r.isActive = false;
        r.effectiveTo = new Date().toISOString();
        r.updatedAt = new Date().toISOString();
      }
    });
    const generated: NutritionRecommendation = {
      id: nextId++,
      userId: 1,
      dailyCaloriesKcal: 2300,
      proteinG: 176,
      carbohydratesG: 240,
      fatsG: 64,
      effectiveFrom: new Date().toISOString(),
      effectiveTo: null,
      notes: "Smart TDEE recommendation generated from training profile.",
      source: "system",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockRecommendations.push(generated);
    return { ...generated };
  },
};

const dateStr = (daysAgoCount: number) =>
  new Date(Date.now() - daysAgoCount * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

let nextLogId = 8;

const mockDailyLogs: DailyNutritionLog[] = [
  {
    id: 1,
    userId: 1,
    logDate: dateStr(0),
    totalCaloriesKcal: 2180,
    proteinG: 158,
    carbohydratesG: 215,
    fatsG: 60,
    notes: null,
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
  },
  {
    id: 2,
    userId: 1,
    logDate: dateStr(1),
    totalCaloriesKcal: 2250,
    proteinG: 162,
    carbohydratesG: 222,
    fatsG: 63,
    notes: "Refeed day",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: 3,
    userId: 1,
    logDate: dateStr(2),
    totalCaloriesKcal: 2100,
    proteinG: 155,
    carbohydratesG: 208,
    fatsG: 58,
    notes: null,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: 4,
    userId: 1,
    logDate: dateStr(3),
    totalCaloriesKcal: 1980,
    proteinG: 150,
    carbohydratesG: 195,
    fatsG: 55,
    notes: "Lower appetite",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    id: 5,
    userId: 1,
    logDate: dateStr(4),
    totalCaloriesKcal: 2320,
    proteinG: 168,
    carbohydratesG: 235,
    fatsG: 65,
    notes: null,
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
  },
  {
    id: 6,
    userId: 1,
    logDate: dateStr(5),
    totalCaloriesKcal: 2200,
    proteinG: 160,
    carbohydratesG: 220,
    fatsG: 61,
    notes: null,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    id: 7,
    userId: 1,
    logDate: dateStr(6),
    totalCaloriesKcal: 2050,
    proteinG: 152,
    carbohydratesG: 202,
    fatsG: 57,
    notes: "Rest day",
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
  },
];

let nextAdjId = 4;

const mockAdjustments: NutritionAdjustment[] = [
  {
    id: 1,
    nutritionRecommendationId: 1,
    trigger: "weight_trend",
    previousCaloriesKcal: 2200,
    newCaloriesKcal: 2150,
    previousProteinG: 160,
    newProteinG: 160,
    previousCarbsG: 220,
    newCarbsG: 208,
    previousFatsG: 61,
    newFatsG: 60,
    reason: "Weekly adherence below 85% — slight reduction",
    createdAt: daysAgo(7),
    nutritionRecommendation: { ...mockRecommendations[0] },
  },
  {
    id: 2,
    nutritionRecommendationId: 2,
    trigger: "goal_change",
    previousCaloriesKcal: 2300,
    newCaloriesKcal: 2450,
    previousProteinG: 162,
    newProteinG: 170,
    previousCarbsG: 245,
    newCarbsG: 265,
    previousFatsG: 63,
    newFatsG: 68,
    reason: "Training volume increase — calories bumped",
    createdAt: daysAgo(21),
    nutritionRecommendation: { ...mockRecommendations[1] },
  },
  {
    id: 3,
    nutritionRecommendationId: 3,
    trigger: "coach_override",
    previousCaloriesKcal: 2000,
    newCaloriesKcal: 1950,
    previousProteinG: 158,
    newProteinG: 155,
    previousCarbsG: 188,
    newCarbsG: 180,
    previousFatsG: 55,
    newFatsG: 54,
    reason: null,
    createdAt: daysAgo(60),
    nutritionRecommendation: { ...mockRecommendations[2] },
  },
];

export const dailyNutritionApiService = {
  async getDailyLogs(
    params?: GetDailyLogsParams,
  ): Promise<DailyNutritionLogsResponse> {
    await delay(300);
    let filtered = [...mockDailyLogs];
    if (params?.startDate) {
      filtered = filtered.filter((l) => l.logDate >= params.startDate!);
    }
    if (params?.endDate) {
      filtered = filtered.filter((l) => l.logDate <= params.endDate!);
    }
    filtered.sort((a, b) => b.logDate.localeCompare(a.logDate));
    return { data: filtered, meta: { total: filtered.length } };
  },

  async logDailyNutrition(
    dto: LogDailyNutritionDto,
  ): Promise<DailyNutritionLog> {
    await delay(400);
    const existing = mockDailyLogs.find((l) => l.logDate === dto.logDate);
    if (existing) {
      existing.totalCaloriesKcal =
        dto.totalCaloriesKcal ?? existing.totalCaloriesKcal;
      existing.proteinG = dto.proteinG ?? existing.proteinG;
      existing.carbohydratesG = dto.carbohydratesG ?? existing.carbohydratesG;
      existing.fatsG = dto.fatsG ?? existing.fatsG;
      existing.notes = dto.notes ?? existing.notes;
      existing.updatedAt = new Date().toISOString();
      return { ...existing };
    }
    const newLog: DailyNutritionLog = {
      id: nextLogId++,
      userId: 1,
      logDate: dto.logDate,
      totalCaloriesKcal: dto.totalCaloriesKcal ?? null,
      proteinG: dto.proteinG ?? null,
      carbohydratesG: dto.carbohydratesG ?? null,
      fatsG: dto.fatsG ?? null,
      notes: dto.notes ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockDailyLogs.push(newLog);
    return { ...newLog };
  },

  async getAdjustmentHistory(): Promise<NutritionAdjustment[]> {
    await delay(300);
    return [...mockAdjustments].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  async detectPlateau(): Promise<PlateauDetectResult> {
    await delay(600);
    const active = mockRecommendations.find((r) => r.isActive);
    if (!active) {
      return { plateauDetected: false, reason: "No active recommendation" };
    }
    const newCalories = active.dailyCaloriesKcal - 100;
    const carbCalorieDelta = -100;
    const carbsDelta = Math.round(carbCalorieDelta / 4);
    const newCarbs = Math.max(0, active.carbohydratesG + carbsDelta);
    const newRec = await nutritionApiService.createRecommendation({
      dailyCaloriesKcal: newCalories,
      proteinG: active.proteinG,
      carbohydratesG: newCarbs,
      fatsG: active.fatsG,
      effectiveFrom: new Date().toISOString(),
      notes: "Plateau detected — calories reduced by 100 kcal.",
      source: "system",
    });
    const adjustment: NutritionAdjustment = {
      id: nextAdjId++,
      nutritionRecommendationId: newRec.id,
      trigger: "plateau_detected",
      previousCaloriesKcal: active.dailyCaloriesKcal,
      newCaloriesKcal: newRec.dailyCaloriesKcal,
      previousProteinG: active.proteinG,
      newProteinG: newRec.proteinG,
      previousCarbsG: active.carbohydratesG,
      newCarbsG: newRec.carbohydratesG,
      previousFatsG: active.fatsG,
      newFatsG: newRec.fatsG,
      reason: "Body weight plateau detected over 3 weeks",
      createdAt: new Date().toISOString(),
      nutritionRecommendation: { ...newRec },
    };
    mockAdjustments.push(adjustment);
    return { plateauDetected: true, adjustment, newRecommendation: newRec };
  },
};
