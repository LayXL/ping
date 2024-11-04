import { cn } from "@/shared/utils/cn.ts"

type CurrencyCardProps = {
  currency: "coins" | "rating"
  value: number
}

export const CurrencyCard = (props: CurrencyCardProps) => {
  return (
    <div
      className={cn(
        "flex p-1 rounded-full gap-1.5 border border-inversed/30 bg-gradient-to-br",
        props.currency === "coins" &&
          "from-[#efc81b40] to-[#ff992a40] pr-[10px]",
        props.currency === "rating" &&
          "from-[#7700bc40] to-[#ff00a940] flex-row-reverse pl-[10px]"
      )}
    >
      <img
        draggable={false}
        src={`/icons/${props.currency === "coins" ? "coin" : "rank"}.svg`}
        alt=""
        className="size-6 cardShadow"
      />
      <span className="w-14 text-center font-semibold">{props.value}</span>
    </div>
  )
}
