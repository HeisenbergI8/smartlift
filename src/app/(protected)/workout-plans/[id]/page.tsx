import WorkoutPlanDetailPage from "@/views/workout-plans/pages/WorkoutPlanDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkoutPlanDetailPage planId={parseInt(id, 10)} />;
}
