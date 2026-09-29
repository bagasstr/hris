import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest): NextResponse {
    // Hanya redirect jika pengunjung berada di halaman utama ("/")
    if (request.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    // Jika bukan ("/"), biarkan halaman terbuka normal
    return NextResponse.next()
}

export const config = {
    matcher: "/((?!_next/static|favicon.ico).*)",
}
