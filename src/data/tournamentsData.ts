// src/data/tournamentsData.ts

export type TournamentCategoryId = "slots" | "live" | "weekly" | "vip";

export const TOURNAMENT_CATEGORY_FILTERS: {
  id: TournamentCategoryId | "all";
  label: string;
}[] = [
  { id: "all", label: "Все" },
  { id: "slots", label: "Слоты" },
  { id: "live", label: "Live-казино" },
  { id: "weekly", label: "Еженедельные" },
  { id: "vip", label: "VIP" },
];

export interface LeaderboardItem {
  place: number;
  name: string;
  prize: string;
  isTop?: boolean;
}

export interface Tournament {
  id: number;
  title: string;
  prizePool: string;
  imageSrc: string;
  category: TournamentCategoryId;
  timer: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  dates: string;
  minBet: string;
  scoringRules: string;
  terms: string[];
  leaderboard: LeaderboardItem[];
}

export const tournamentsData: Tournament[] = [
  {
    id: 1,
    title: "Carnival Cup",
    prizePool: "5 000 €",
    imageSrc: "/fairy.svg",
    category: "slots",
    timer: { days: "04", hours: "04", minutes: "04", seconds: "04" },
    dates: "19.05.2025 - 25.05.2025 (00:00 UTC - 23:59 UTC)",
    minBet: "€0.8",
    scoringRules:
      "TOTAL BET : You score points proportionally to wagered money. Only real money bets with no active bonus count.",
    terms: [
      "General Terms and Conditions and Bonus Terms and Conditions of the Casino apply.",
      "The Casino administration has the right to cancel the promo at any time.",
      "Wagering Requirement: x5",
      "Qualifying games: All slots.",
      "Qualifying bets: Real money bets only.",
      "Prize Pool Distribution details...",
    ],
    leaderboard: [
      { place: 1, name: "Viktor Z", prize: "1200$", isTop: true },
      { place: 2, name: "Lisyan", prize: "600$", isTop: true },
      { place: 3, name: "Shiva", prize: "300$", isTop: true },
      { place: 4, name: "Oleg", prize: "600$", isTop: false },
      { place: 5, name: "Abdul", prize: "300$", isTop: false },
      { place: 6, name: "Abhilash", prize: "600$", isTop: false },
      { place: 7, name: "Farhana", prize: "300$", isTop: false },
      { place: 8, name: "Gobind", prize: "300$", isTop: false },
    ],
  },
  {
    id: 2,
    title: "Golden Trophy",
    prizePool: "10 000 €",
    imageSrc: "/trophy_t.svg",
    category: "weekly",
    timer: { days: "02", hours: "12", minutes: "30", seconds: "00" },
    dates: "01.06.2025 - 07.06.2025",
    minBet: "€1.0",
    scoringRules: "Highest single win multiplier.",
    terms: ["Standard terms apply."],
    leaderboard: [],
  },
  {
    id: 3,
    title: "Royal Live Series",
    prizePool: "3 500 €",
    imageSrc: "/live.svg",
    category: "live",
    timer: { days: "01", hours: "08", minutes: "15", seconds: "00" },
    dates: "12.06.2025 - 18.06.2025",
    minBet: "€2.0",
    scoringRules: "Очки за оборот в live-столах с реальными дилерами.",
    terms: ["Только live-игры из списка турнира.", "Стандартные правила казино."],
    leaderboard: [
      { place: 1, name: "Alex M.", prize: "800€", isTop: true },
      { place: 2, name: "Nina K.", prize: "500€", isTop: true },
    ],
  },
  {
    id: 4,
    title: "Turbo Slots Sprint",
    prizePool: "7 500 €",
    imageSrc: "/slots.svg",
    category: "slots",
    timer: { days: "06", hours: "00", minutes: "00", seconds: "00" },
    dates: "20.06.2025 - 27.06.2025",
    minBet: "€0.5",
    scoringRules: "Максимальный суммарный множитель за серию спинов.",
    terms: ["Квалификация: слоты с пометкой Sprint.", "Без активного бонуса."],
    leaderboard: [],
  },
  {
    id: 5,
    title: "Arena Rush",
    prizePool: "4 000 €",
    imageSrc: "/cards.svg",
    category: "slots",
    timer: { days: "03", hours: "14", minutes: "45", seconds: "00" },
    dates: "15.06.2025 - 22.06.2025",
    minBet: "€1.0",
    scoringRules: "Очки за оборот в квалификационных слотах турнира.",
    terms: ["Только слоты из списка акции.", "Один аккаунт — одно участие."],
    leaderboard: [
      { place: 1, name: "ProSpin", prize: "1500€", isTop: true },
      { place: 2, name: "LineKing", prize: "900€", isTop: true },
      { place: 3, name: "Odds99", prize: "600€", isTop: true },
    ],
  },
  {
    id: 6,
    title: "VIP High Roller",
    prizePool: "25 000 €",
    imageSrc: "/crown-gold.svg",
    category: "vip",
    timer: { days: "10", hours: "00", minutes: "00", seconds: "00" },
    dates: "01.07.2025 - 31.07.2025",
    minBet: "€5.0",
    scoringRules: "Рейтинг по сумме оборота среди участников VIP-уровня.",
    terms: ["Доступ по приглашению или статусу VIP.", "Администрация вправе скорректировать призовые места."],
    leaderboard: [],
  },
  {
    id: 7,
    title: "Jackpot Week",
    prizePool: "15 000 €",
    imageSrc: "/jackpots.svg",
    category: "weekly",
    timer: { days: "05", hours: "22", minutes: "10", seconds: "00" },
    dates: "Неделя 23 — 29.06.2025",
    minBet: "€0.4",
    scoringRules: "Таблица по обороту в слотах недели и случайные призы.",
    terms: ["Список слотов в разделе акции.", "Призы начисляются по правилам провайдера."],
    leaderboard: [],
  },
];
