import { LeaderCard } from "@/features/leaderboard/ui/leader-card.tsx"
import { Icon } from "@/shared/ui/icon.tsx"
import { PrimitiveCard } from "@/shared/ui/primitive-card.tsx"
import { cn } from "@/shared/utils/cn.ts"
import { trpc } from "@/shared/utils/trpc.ts"
import { Header } from "@/widgets/header.tsx"
import { useState } from "react"
import { type LeagueName, leagues } from "shared/leagues.ts"

export const Leaderboard = () => {
  const [currentLeague, setCurrentLeague] = useState<LeagueName>("newbie")

  const currentLeagueData = leagues.find(
    (league) => league.name === currentLeague
  )

  const leaderboard = trpc.leaderboard.getLeaderboard.useQuery({
    league: currentLeague,
  })

  return (
    <div className="h-full flex flex-col pb-safe-area-bottom">
      <Header />
      <div className={"flex flex-col gap-4 p-4"}>
        <PrimitiveCard color={currentLeagueData?.color}>
          <div className={"flex flex-col gap-4 p-6"}>
            <div className={"flex flex-col gap-1"}>
              <div className={"flex"}>
                <div
                  onClick={() => {
                    const currentLeagueIndex = leagues.findIndex(
                      (league) => league.name === currentLeague
                    )

                    if (currentLeagueIndex === 0)
                      setCurrentLeague(leagues[leagues.length - 1].name)
                    else setCurrentLeague(leagues[currentLeagueIndex - 1].name)
                  }}
                >
                  <Icon
                    name={"chevron-left"}
                    size={36}
                    className="bg-accent hover:bg-accent/70 active:bg-accent/50"
                  />
                </div>
                <p
                  className={"flex-1 text-center font-semibold text-2xl"}
                  children={currentLeagueData?.title}
                />
                <div
                  onClick={() => {
                    const currentLeagueIndex = leagues.findIndex(
                      (league) => league.name === currentLeague
                    )

                    if (currentLeagueIndex === leagues.length - 1)
                      setCurrentLeague(leagues[0].name)
                    else setCurrentLeague(leagues[currentLeagueIndex + 1].name)
                  }}
                >
                  <Icon
                    name={"chevron-right"}
                    size={36}
                    className="bg-accent hover:bg-accent/70 active:bg-accent/50"
                  />
                </div>
              </div>
              <div className={"h-[2lh] flex items-center justify-center"}>
                <p
                  className={"text-primary/30 text-center"}
                  children={currentLeagueData?.description}
                />
              </div>
            </div>

            <div
              className={
                "flex bg-primary/30 px-4 py-6 rounded-2xl items-stretch"
              }
            >
              <div className={"flex flex-1 flex-col gap-0.5 items-center"}>
                <div className={"flex gap-1.5"}>
                  <p
                    className={"font-semibold text-lg"}
                    children={currentLeagueData?.from}
                  />
                  <img
                    src={"/icons/rank.svg"}
                    alt={""}
                    className={"cardShadow"}
                  />
                </div>
                <p className={"text-xs text-primary/30"}>Начало лиги</p>
              </div>
              {(currentLeagueData?.to ?? 0) < 10000 && (
                <>
                  <div className={"w-px bg-inversed/30 rounded-full"} />
                  <div className={"flex flex-1 flex-col gap-0.5 items-center"}>
                    <div className={"flex gap-1.5"}>
                      <p
                        className={"font-semibold text-lg"}
                        children={currentLeagueData?.to}
                      />
                      <img
                        src={"/icons/rank.svg"}
                        alt={""}
                        className={"cardShadow"}
                      />
                    </div>
                    <p className={"text-xs text-primary/30"}>Конец лиги</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </PrimitiveCard>
        <div className={"flex items-center justify-center gap-3"}>
          {leagues.map((league, i) => (
            <div
              key={league.name}
              className={cn(
                "size-2 bg-inversed rounded-full transition-colors",
                i === leagues.findIndex((x) => x.name === currentLeague) &&
                  "bg-accent"
              )}
              onClick={() => setCurrentLeague(league.name)}
            />
          ))}
        </div>

        {leaderboard.data?.map((leader, i) => (
          <LeaderCard
            key={leader.id}
            place={i + 1}
            name={leader.displayName ?? ""}
            score={leader.score}
            avatarUrl={leader.avatarUrl}
          />
        ))}

        {leaderboard.isSuccess && leaderboard.data.length === 0 && (
          <div className="bg-surface/25 border border-inversed/5 rounded-[40px] flex-col items-center p-4 py-16 text-center">
            <p className="font-medium text-lg">Здесь пока никого нет</p>
            <p className="text-primary/50">Станьте первыми</p>
          </div>
        )}
      </div>
    </div>
  )
}
