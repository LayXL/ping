import type { ArrayElement } from "./arrayElement.ts"

export const leagues = [
  {
    name: "newbie",
    title: "Новичок",
    description: "Начни путь с первого удара!",
    color: "#ADD8E632",
    from: 10,
    to: 99,
  },
  {
    name: "amateur",
    title: "Любитель",
    description: "Уверенность растет с каждым рикошетом",
    color: "#32CD3232",
    from: 100,
    to: 299,
  },
  {
    name: "speedElite",
    title: "Элита Скорости",
    description: "Контролируй скорость, управляй игрой",
    color: "#FFD70032",
    from: 300,
    to: 599,
  },
  {
    name: "gold",
    title: "Золотая Лига",
    description: "Каждый удар — словно магия на поле!",
    color: "#FFA50032",
    from: 600,
    to: 999,
  },
  {
    name: "platinum",
    title: "Платиновая Лига",
    description: "Точность, скорость и мастерство…",
    color: "#B0A4FF32",
    from: 1000,
    to: 1499,
  },
  {
    name: "diamond",
    title: "Алмазная Лига",
    description: "Игра на грани возможностей!",
    color: "#00E1FF32",
    from: 1500,
    to: 1999,
  },
  {
    name: "legend",
    title: "Легенда",
    description: "История продолжается с каждым ударом",
    color: "#80008032",
    from: 2000,
    to: 2999,
  },
  {
    name: "infinity",
    title: "Бесконечность",
    description: "Теперь твой путь бесконечен",
    color: "#FF000432",
    from: 3000,
    to: Number.MAX_SAFE_INTEGER,
  },
] as const

export type LeagueName = ArrayElement<typeof leagues>["name"]
