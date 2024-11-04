import { CurrencyCard } from "@/shared/ui/currency-card.tsx"
import { Icon } from "@/shared/ui/icon.tsx"
import { useQuery } from "@tanstack/react-query"
import bridge from "@vkontakte/vk-bridge"

export const Header = () => {
  const userData = useQuery({
    queryKey: ["user", "avatar"],
    queryFn: () => bridge.send("VKWebAppGetUserInfo"),
  })

  return (
    <div className="px-4 py-3 flex justify-between items-center border-b border-b-inversed/10">
      <Icon name={"shopping-cart"} />
      <div className="flex gap-2 items-center">
        <CurrencyCard currency={"coins"} value={10} />
        <div className="bg-inversed/10 border border-inversed/30 p-1 rounded-full cardShadow">
          <img
            draggable={false}
            src={userData.data?.photo_100}
            alt=""
            className="rounded-full w-12"
          />
        </div>
        <CurrencyCard currency={"rating"} value={10} />
      </div>
      <Icon name={"trophy"} />
    </div>
  )
}
