import { Button } from "@/shared/ui/button"

export const Home = () => {
  return (
    <div className="h-full pb-safe-area-bottom">
      <div className="h-full p-4 flex flex-col gap-4">
        <div className="flex-1 bg-primary/50">{/*  */}</div>

        <div className="flex flex-col gap-4">
          <div className="p-4 bg-surface/50 rounded-[32px] border border-inversed/5 flex-col gap-4 flex">
            <div className="justify-center items-center gap-2 flex">
              <div className="flex-col justify-center items-center gap-1 flex">
                <p className="text-center text-2xl font-semibold">Обычный</p>
                <p className="text-center text-primary/30 text-sm font-medium">
                  Управляй одной платформой и отбивай один шар
                </p>
              </div>
            </div>
            <div className="py-4 bg-primary/30 rounded-2xl border border-inversed/5 items-center flex">
              <div className="flex-1 flex-col justify-start items-center flex">
                <div className="justify-center items-center gap-1 flex">
                  <p className="text-lg font-semibold">128</p>
                </div>
                <p className="text-center text-white/30 text-xs font-normal">
                  Последняя игра
                </p>
              </div>
              <div className="bg-inversed/50 h-full rounded-full w-px" />
              <div className="flex-1 flex-col justify-start items-center flex">
                <div className="justify-center items-center flex">
                  <p className="text-lg font-semibold">Легкая</p>
                </div>
                <p className="text-center text-white/30 text-xs font-normal">
                  Сложность
                </p>
              </div>
            </div>
          </div>

          <Button label="Играть" />
          <p className="text-primary/30 font-medium text-sm text-center">
            Выберите режим игры
          </p>
        </div>
      </div>
    </div>
  )
}
