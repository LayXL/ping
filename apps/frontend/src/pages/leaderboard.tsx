import { LeaderCard } from "@/features/leaderboard/ui/leader-card.tsx"
import { trpc } from "@/shared/utils/trpc.ts"
import { Header } from "@/widgets/header.tsx"

export const Leaderboard = () => {
  const leaderboard = trpc.leaderboard.getLeaderboard.useQuery({
    league: "newbie",
  })

  return (
    <div className="h-full flex flex-col pb-safe-area-bottom">
      <Header />
      <div className={"flex flex-col gap-4 p-4"}>
        <LeaderCard place={1} />
        <LeaderCard place={2} />
        <LeaderCard place={3} />
        <LeaderCard place={4} />
      </div>
    </div>
  )
}
