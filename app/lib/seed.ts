import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export async function ensureDefaultAdmin() {
  const email = "admin@educert.test";
  const password = "Demo1234!";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return existing;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  return prisma.user.create({
    data: {
      name: "Administrador EduCert",
      email,
      passwordHash,
      role: "ADMIN",
    },
  });
}
