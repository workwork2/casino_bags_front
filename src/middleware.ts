import { NextRequest, NextResponse } from "next/server";
import { BYPASS_WALLET_AUTH_FOR_DESIGN } from "@/shared/config/devFlags";

/** Кошелёк и ЛК: `/deposit`, `/account`, `/account/withdraw`, `/account/history`, … */
const PROTECTED_PATHS = ["/account", "/deposit"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  // Вёрстка: кошелёк и ЛК без редиректа на логин (см. `BYPASS_WALLET_AUTH_FOR_DESIGN` в devFlags)
  if (isProtected && BYPASS_WALLET_AUTH_FOR_DESIGN) {
    return NextResponse.next();
  }

  if (!isProtected) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  // ❌ нет refresh токена → сразу на логин
  if (!refreshToken) {
    return redirectToLogin(req);
  }

  // ✅ access токен есть → пропускаем
  if (accessToken) {
    return NextResponse.next();
  }

  // 🔄 access нет → пробуем обновить
  try {
    const refreshRes = await fetch(`${process.env.API_URL}/auth/refresh`, {
      method: "GET",
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
      cache: "no-store",
    });

    if (!refreshRes.ok) {
      return redirectToLogin(req);
    }

    const data = await refreshRes.json();
    const newAccessToken = data?.data?.accessToken;

    if (!newAccessToken) {
      return redirectToLogin(req);
    }

    const res = NextResponse.next();

    res.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch {
    return redirectToLogin(req);
  }
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL("/", req.url);

  loginUrl.searchParams.set("from", req.nextUrl.pathname);

  const res = NextResponse.redirect(loginUrl);

  res.cookies.delete("access_token");
  res.cookies.delete("refresh_token");

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};