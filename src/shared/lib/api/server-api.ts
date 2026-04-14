import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;
// ---- ГЛОБАЛЬНОЕ СОСТОЯНИЕ (аналог axios instance) ----
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// ---- Универсальный fetch с cookie ----
async function serverFetch(
  url: string,
  cookieHeader: string,
): Promise<Response> {
  return fetch(`${API_URL}${url}`, {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
}

// ---- REFRESH (ОДИН НА ВСЕХ) ----
async function refreshToken(cookieHeader: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "GET",
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const setCookie = res.headers.get("set-cookie");
    if (!setCookie) return null;

    return setCookie;
  } catch {
    return null;
  }
}

// ---- ГЛАВНАЯ ФУНКЦИЯ С RETRY (как axios interceptor) ----
export async function serverRequestWithAuth<T>(url: string): Promise<T | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // 1️⃣ Первый запрос
  let response = await serverFetch(url, cookieHeader);

  if (response.ok) {
    return parseApiResponse<T>(response);
  }
  // если не 401 — сразу ошибка
  if (response.status !== 401) {
    return null;
  }

  // ---- дальше поведение как axios ----

  // 2️⃣ Если refresh уже идёт — ждём его
  if (isRefreshing && refreshPromise) {
    const newCookie = await refreshPromise;

    if (!newCookie) return null;

    const retry = await serverFetch(url, newCookie);
    if (!retry.ok) return null;

    return retry.json();
  }

  // 3️⃣ Мы первые → запускаем refresh
  isRefreshing = true;

  refreshPromise = refreshToken(cookieHeader);

  const newCookie = await refreshPromise;

  isRefreshing = false;
  refreshPromise = null;

  if (!newCookie) {
    return null; // refresh умер → logout
  }

  // 4️⃣ Повторяем оригинальный запрос (как axios)
  const retry = await serverFetch(url, newCookie);

  if (!retry.ok) {
    return null;
  }
  return parseApiResponse<T>(retry);
}

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: any;
};

async function parseApiResponse<T>(res: Response): Promise<T> {
  const body: ApiResponse<T> = await res.json();

  // 🔴 полный аналог axios interceptor success-check
  if (!body.success) {
    throw body.error ?? new Error("API Error");
  }

  return body.data as T;
}
