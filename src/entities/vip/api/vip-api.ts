import { api } from "@/shared/lib/api/axios";

export const fetchVipInfoApi = async () => {
  const response = await api.get("/vip/info");
  console.log(response, "response.data");
  return response.data;
};
