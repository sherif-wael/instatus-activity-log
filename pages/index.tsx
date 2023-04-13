import ActivityLog from "@/components/ActivityLog";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="w-full max-w-5xl px-4">
        <ActivityLog />
      </div>
    </div>
  )
}
