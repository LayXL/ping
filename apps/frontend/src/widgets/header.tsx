import { CurrencyCard } from "@/shared/ui/currency-card.tsx"
import { Icon } from "@/shared/ui/icon.tsx"
import { trpc } from "@/shared/utils/trpc.ts"
import { useQuery } from "@tanstack/react-query"
import bridge from "@vkontakte/vk-bridge"
import { useNavigate } from "react-router-dom"

export const Header = () => {
  const userData = useQuery({
    queryKey: ["user", "avatar"],
    queryFn: () => bridge.send("VKWebAppGetUserInfo"),
  })

  const stats = trpc.user.getStats.useQuery()

  const navigate = useNavigate()

  return (
    <div className="px-4 py-3 flex justify-between items-center border-b border-b-inversed/10">
      <div className={"cursor-pointer"} onClick={() => navigate("/shop")}>
        <Icon name={"shopping-cart"} />
      </div>
      <div className="flex gap-2 items-center">
        <CurrencyCard currency={"coins"} value={stats.data?.coins ?? 0} />
        <div className="bg-inversed/10 border border-inversed/30 p-1 rounded-full cardShadow">
          <img
            draggable={false}
            src={userData.data?.photo_100}
            alt=""
            className="rounded-full w-12"
          />
        </div>
        <CurrencyCard currency={"rating"} value={stats.data?.score ?? 0} />
      </div>
      <div className={"cursor-pointer"} onClick={() => navigate("/rating")}>
        <Icon name={"trophy"} />
      </div>
    </div>
  )
}
