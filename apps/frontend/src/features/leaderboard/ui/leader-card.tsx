import { tv } from "tailwind-variants"

const leaderCard = tv({
  slots: {
    base: "rounded-3xl p-px border-[3px] flex gap-4",
    place: "border-[3px] border-white size-8 bg-gradient-to-br rounded-full",
  },
  variants: {
    place: {
      1: {
        base: "border-[#F0C81B] bg-gradient-to-br from-[#F0C81B80] to-[#FF992A80]",
        place: "from-[#F0C81B] to-[#FF992A]",
      },
      2: {
        base: "border-[#9CA0B2] bg-gradient-to-br from-[#9CA0B280] to-[#8084A180]",
        place: "from-[#9CA0B2] to-[#8084A1]",
      },
      3: {
        base: "border-[#CA8457] bg-gradient-to-br from-[#CA845780] to-[#B0651E80]",
        place: "from-[#CA8457] to-[#B0651E]",
      },
      other: {
        base: "border border-inversed/5 bg-primary/30",
        place: "from-[#8C897B] to-[#CACAC7]",
      },
    },
    isPinned: {
      true: {
        base: "border-[#01F5AC] bg-gradient-to-r from-[#01F5AC80] to-[#01F5AC0080]",
      },
    },
  },

  defaultVariants: {
    place: "other",
    isPinned: false,
  },
})

type LeaderCardProps = {
  place: number
  score: number
  name: string
  avatarUrl?: string
}

export const LeaderCard = (props: LeaderCardProps) => {
  const { base, place } = leaderCard({
    place: props.place > 3 ? undefined : (props.place as 1 | 2 | 3),
    isPinned: false,
  })

  return (
    <div className={base()}>
      <div className={place()}>123</div>
    </div>
  )
}
