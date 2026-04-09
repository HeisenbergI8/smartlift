import { configureStore } from "@reduxjs/toolkit";

import { authApi } from "./services/authApi";
import { equipmentApi } from "./services/equipmentApi";
import { exerciseApi } from "./services/exerciseApi";
import { muscleGroupApi } from "./services/muscleGroupApi";
import { musclePriorityApi } from "./services/musclePriorityApi";
import { userProfileApi } from "./services/userProfileApi";
import { workoutLogApi } from "./services/workoutLogApi";
import { workoutPlanApi } from "./services/workoutPlanApi";
import { personalRecordsApi } from "./services/personalRecordsApi";
import { egoLiftApi } from "./services/egoLiftApi";
import { progressionApi } from "./services/progressionApi";
import { nutritionApi } from "./services/nutritionApi";
import { bodyWeightApi } from "./services/bodyWeightApi";
import { dashboardApi } from "./services/dashboardApi";
import { milestonesApi } from "./services/milestonesApi";
import { notificationsApi } from "./services/notificationsApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [equipmentApi.reducerPath]: equipmentApi.reducer,
    [exerciseApi.reducerPath]: exerciseApi.reducer,
    [muscleGroupApi.reducerPath]: muscleGroupApi.reducer,
    [musclePriorityApi.reducerPath]: musclePriorityApi.reducer,
    [userProfileApi.reducerPath]: userProfileApi.reducer,
    [workoutLogApi.reducerPath]: workoutLogApi.reducer,
    [workoutPlanApi.reducerPath]: workoutPlanApi.reducer,
    [personalRecordsApi.reducerPath]: personalRecordsApi.reducer,
    [egoLiftApi.reducerPath]: egoLiftApi.reducer,
    [progressionApi.reducerPath]: progressionApi.reducer,
    [nutritionApi.reducerPath]: nutritionApi.reducer,
    [bodyWeightApi.reducerPath]: bodyWeightApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [milestonesApi.reducerPath]: milestonesApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      authApi.middleware,
      equipmentApi.middleware,
      exerciseApi.middleware,
      muscleGroupApi.middleware,
      musclePriorityApi.middleware,
      userProfileApi.middleware,
      workoutLogApi.middleware,
      workoutPlanApi.middleware,
      personalRecordsApi.middleware,
      egoLiftApi.middleware,
      progressionApi.middleware,
      nutritionApi.middleware,
      bodyWeightApi.middleware,
      dashboardApi.middleware,
      milestonesApi.middleware,
      notificationsApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
