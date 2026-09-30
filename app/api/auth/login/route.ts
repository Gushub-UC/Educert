import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { ensureDefaultAdmin } from "@/app/lib/seed";
import { setAuthCookie, signToken, verifyPassword } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Correo y contraseña requeridos" }, { status: 400 });
    }

    const user = (await ensureDefaultAdmin()) as Awaited<ReturnType<typeof prisma.user.findUnique>>;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const account = existingUser ?? user;

    if (!account) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const isValid = await verifyPassword(password, account.passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const token = signToken({
      userId: account.id,
      email: account.email,
      role: account.role,
      name: account.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
      },
    });

    return setAuthCookie(response, token);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "No se pudo iniciar sesión" }, { status: 500 });
  }
}
