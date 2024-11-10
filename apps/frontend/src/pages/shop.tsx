import { useHaptic } from "@/shared/hooks/use-haptic.ts"
import { Button } from "@/shared/ui/button.tsx"
import { Game } from "@/shared/ui/game.tsx"
import { Icon } from "@/shared/ui/icon.tsx"
import { PrimitiveCard } from "@/shared/ui/primitive-card.tsx"
import { cn } from "@/shared/utils/cn.ts"
import { trpc } from "@/shared/utils/trpc.ts"
import { Header } from "@/widgets/header.tsx"
import { useMemo, useState } from "react"

const skinNames: Record<string, string> = {
  default: "Обычный",
  hamster: "Хомяк",
}

export const Shop = () => {
  const haptic = useHaptic()
  const utils = trpc.useUtils()

  const [isConfirmingBuy, setIsConfirmingBuy] = useState(false)

  const shopItems = trpc.shop.getItems.useQuery()
  const selectedSkin = trpc.shop.getSelectedSkin.useQuery()
  const stats = trpc.user.getStats.useQuery()

  const selectSkinMutate = trpc.shop.selectSkin.useMutation({
    onSuccess: () => {
      utils.shop.getSelectedSkin.invalidate()
    },
  })

  const buyItemMutate = trpc.shop.buyItem.useMutation({
    onSuccess: () => {
      setIsConfirmingBuy(false)
      utils.user.getStats.invalidate()
      utils.shop.getItems.invalidate()
    },
  })

  const displayItems = [
    "default",
    ...(shopItems.data?.map((item) => item.name) ?? []),
  ]
  const [currentItem, setCurrentItem] = useState(0)

  const state = useMemo(() => {
    const item = shopItems.data?.[currentItem - 1]

    if (item === undefined) {
      return selectedSkin.data === "default"
        ? ("selected" as const)
        : ("owned" as const)
    }

    const userBalance = stats.data?.coins ?? 0
    const itemPrice = item.price ?? 0

    if (item.owned) {
      return selectedSkin.data === item.name
        ? ("selected" as const)
        : ("owned" as const)
    }

    return userBalance >= itemPrice
      ? ("available" as const)
      : ("unavailable" as const)
  }, [shopItems.data, currentItem, selectedSkin.data, stats.data?.coins])

  return (
    <div className="h-full flex flex-col pb-safe-area-bottom">
      <Header />

      <div className="flex-1 p-4 pt-0 flex flex-col gap-4">
        <div className="flex-1 -m-4 mb-0">
          <Game mode={"classic"} isPreview skin={displayItems[currentItem]} />
        </div>

        <PrimitiveCard>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center">
              <div
                onClick={() => {
                  haptic("selection")

                  setCurrentItem(
                    currentItem === 0
                      ? displayItems.length - 1
                      : (currentItem - 1) % displayItems.length
                  )
                  setIsConfirmingBuy(false)
                }}
              >
                <Icon
                  name={"chevron-left"}
                  size={36}
                  className="bg-accent hover:bg-accent/70 active:bg-accent/50"
                />
              </div>
              <p
                className="text-2xl font-semibold flex-1 text-center"
                children={skinNames[displayItems[currentItem]]}
              />
              <div
                onClick={() => {
                  haptic("selection")

                  setCurrentItem((currentItem + 1) % displayItems.length)
                  setIsConfirmingBuy(false)
                }}
              >
                <Icon
                  name={"chevron-right"}
                  size={36}
                  className="bg-accent hover:bg-accent/70 active:bg-accent/50"
                />
              </div>
            </div>
          </div>
        </PrimitiveCard>

        <div className="flex items-center justify-center gap-3">
          {displayItems.map((key) => (
            <div
              key={key}
              className={cn(
                "size-2 rounded-full bg-inversed transition-colors",
                displayItems[currentItem] === key && "bg-accent"
              )}
            />
          ))}
        </div>

        <Button
          key={state}
          variant={
            state === "selected" || isConfirmingBuy ? "secondary" : "primary"
          }
          disabled={state === "unavailable"}
          label={
            isConfirmingBuy
              ? "Подтвердить покупку"
              : state === "owned"
                ? "Выбрать"
                : state === "available"
                  ? "Купить"
                  : state === "unavailable"
                    ? "Недоступно"
                    : "Выбран"
          }
          onClick={() => {
            if (isConfirmingBuy) {
              buyItemMutate.mutate({
                itemId: shopItems.data?.[currentItem - 1].id ?? 0,
              })
            } else if (state === "available") {
              setIsConfirmingBuy(true)
            } else if (state === "owned") {
              selectSkinMutate.mutate({
                itemId:
                  currentItem === 0
                    ? null
                    : (shopItems.data?.[currentItem - 1].id ?? 0),
              })
            }
          }}
        />

        <p
          className={cn(
            "text-sm font-medium text-primary/75 text-center",
            state === "unavailable" && "text-red-500"
          )}
          children={
            isConfirmingBuy
              ? "Нажмите еще раз, для покупки"
              : state === "owned"
                ? "Этот вариант уже имеется"
                : state === "available"
                  ? "Выберите понравившийся вариант"
                  : state === "unavailable"
                    ? "Недостаточно монет"
                    : "Этот вариант уже выбран"
          }
        />
      </div>
    </div>
  )
}
