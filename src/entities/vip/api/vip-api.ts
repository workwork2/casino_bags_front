import { api } from "@/shared/lib/api/axios";
import { DEV_LOYALTY_PREVIEW } from "@/shared/config/devFlags";
import { DEV_VIP_MOCK } from "@/shared/config/loyaltyDevMock";

export const fetchVipInfoApi = async () => {
  if (DEV_LOYALTY_PREVIEW) {
    return {
      ...DEV_VIP_MOCK,
      levels: DEV_VIP_MOCK.levels.map((l) => ({ ...l })),
    };
  }
  const response = await api.get("/vip/info");
  return response.data;
};
