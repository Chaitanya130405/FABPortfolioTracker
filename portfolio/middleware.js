import { NextResponse } from "next/server";
export function middleware(request) {
  let token;
  try {
    if (request.cookies && typeof request.cookies.get === "function") {
      token = request.cookies.get("token")?.value;
    } else {
      const cookieHeader = request.headers.get("cookie") || "";
      const found = cookieHeader
        .split(";")
        .map((s) => s.trim())
        .find((s) => s.startsWith("token="));
      token = found ? decodeURIComponent(found.split("=")[1] || "") : undefined;
    }
  } catch (e) {
    token = undefined;
  }
  const pathname = request.nextUrl.pathname;

  const isLoginRoute = pathname.startsWith("/login");
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/investor-details");

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/investor-details/:path*"],
};
