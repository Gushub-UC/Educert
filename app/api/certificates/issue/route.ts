import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getSessionFromCookies } from "@/app/lib/auth";
import { buildCertificatePayload, createCertificatePdfBuffer, sha256 } from "@/app/lib/certificate-utils";

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const studentName = String(body.studentName ?? "").trim();
    const studentEmail = String(body.studentEmail ?? "").trim();
    const courseName = String(body.courseName ?? "").trim();
    const grade = String(body.grade ?? "").trim();

    if (!studentName || !courseName || !grade) {
      return NextResponse.json({ error: "Los campos obligatorios son requeridos" }, { status: 400 });
    }

    const uuid = randomUUID();
    const issuedAt = new Date();

    const certificateData = {
      uuid,
      studentName,
      studentEmail: studentEmail || null,
      courseName,
      grade,
      issuedBy: session.name,
      createdAt: issuedAt,
    };

    const pdfBuffer = await createCertificatePdfBuffer(certificateData);
    const pdfHash = sha256(pdfBuffer);
    const integrityHash = sha256(buildCertificatePayload(certificateData));
    const publicValidationUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/validate/${uuid}`;

    const created = await prisma.certificate.create({
      data: {
        uuid,
        studentName,
        studentEmail: studentEmail || null,
        courseName,
        grade,
        issuedBy: session.name,
        pdfHash,
        integrityHash,
        qrCodeUrl: publicValidationUrl,
        createdById: session.userId,
      },
    });

    return NextResponse.json({
      success: true,
      certificate: {
        uuid: created.uuid,
        qrCodeUrl: created.qrCodeUrl,
        pdfHash: created.pdfHash,
        status: created.status,
      },
    });
  } catch (error) {
    console.error("Certificate issue error:", error);
    return NextResponse.json({ error: "No se pudo emitir el certificado" }, { status: 500 });
  }
}
