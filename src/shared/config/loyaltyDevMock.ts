import type { User } from "@/features/auth/model/types";

/**
 * Мок-пользователь для `fetchMe`, когда включён `DEV_LOYALTY_PREVIEW`.
 */
export const DEV_MOCK_USER: User = {
  id: "dev-preview-user",
  email: "preview@local.dev",
  firstName: "Preview",
  lastName: "Player",
  authMethod: "email",
  isEmailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  roles: ["USER"],
};

/**
 * Ответ `/vip/info` для страницы лояльности, CP-обмена и карточек статусов.
 */
export const DEV_VIP_MOCK = {
  user: { username: "DemoPlayer" },
  cpWallet: 12_400,
  progress: {
    currentPoints: 4250,
    targetPoints: 10_000,
    nextLevelName: "Gold",
    currentLevel: 1,
  },
  levels: [
    {
      level: 0,
      name: "Guest",
      cpRequired: 0,
      weeklyCashbackRate: 0,
      depositBonusMultiplier: 1,
      freeTournamentGames: 0,
      hasPersonalManager: false,
    },
    {
      level: 1,
      name: "Classic",
      cpRequired: 5000,
      weeklyCashbackRate: 0.05,
      depositBonusMultiplier: 1.1,
      freeTournamentGames: 0,
      hasPersonalManager: false,
    },
    {
      level: 2,
      name: "Gold",
      cpRequired: 10_000,
      weeklyCashbackRate: 0.08,
      depositBonusMultiplier: 1.25,
      freeTournamentGames: 3,
      hasPersonalManager: false,
    },
    {
      level: 3,
      name: "VIP",
      cpRequired: 50_000,
      weeklyCashbackRate: 0.12,
      depositBonusMultiplier: 1.5,
      freeTournamentGames: 10,
      hasPersonalManager: true,
    },
  ],
} as const;
