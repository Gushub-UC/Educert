import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { buildCertificatePayload, sha256 } from "@/app/lib/certificate-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;
    const certificate = await prisma.certificate.findUnique({ where: { uuid } });

    if (!certificate) {
      return NextResponse.json({ valid: false, message: "Certificado No Encontrado" }, { status: 404 });
    }

    const expectedHash = sha256(
      buildCertificatePayload({
        uuid: certificate.uuid,
        studentName: certificate.studentName,
        studentEmail: certificate.studentEmail,
        courseName: certificate.courseName,
        grade: certificate.grade,
        issuedBy: certificate.issuedBy,
        createdAt: certificate.createdAt,
      }),
    );

    const isOriginal = certificate.integrityHash === expectedHash;
    const isActive = certificate.status === "ACTIVE";

    if (!isActive || !isOriginal) {
      return NextResponse.json({
        valid: false,
        message: isActive ? "Certificado Alterado" : "Certificado Revocado",
        status: certificate.status,
      }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      message: "Certificado Válido y Auténtico",
      certificate: {
        uuid: certificate.uuid,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        grade: certificate.grade,
        issuedBy: certificate.issuedBy,
        status: certificate.status,
      },
    });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json({ valid: false, message: "Error en la validación" }, { status: 500 });
  }
}
