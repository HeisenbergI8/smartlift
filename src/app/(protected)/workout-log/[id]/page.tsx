import WorkoutSessionDetailPage from "@/views/workout-log/pages/WorkoutSessionDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkoutSessionDetailPage sessionId={parseInt(id, 10)} />;
}
