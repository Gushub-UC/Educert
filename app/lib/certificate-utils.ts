import crypto from "node:crypto";
import PDFDocument from "pdfkit";

export type CertificateInput = {
  uuid: string;
  studentName: string;
  studentEmail?: string | null;
  courseName: string;
  grade: string;
  issuedBy: string;
  createdAt: Date | string;
};

export function sha256(input: Buffer | string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function buildCertificatePayload(data: CertificateInput) {
  return JSON.stringify({
    uuid: data.uuid,
    studentName: data.studentName,
    studentEmail: data.studentEmail ?? "",
    courseName: data.courseName,
    grade: data.grade,
    issuedBy: data.issuedBy,
    createdAt: new Date(data.createdAt).toISOString(),
  });
}

export async function createCertificatePdfBuffer(data: CertificateInput) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (error) => reject(error));

    doc
      .fontSize(24)
      .text("EduCert", { align: "center" })
      .moveDown();

    doc
      .fontSize(18)
      .text("Certificado Académico Digital", { align: "center" })
      .moveDown(1.3);

    doc.fontSize(12).text(`Folio: ${data.uuid}`);
    doc.text(`Estudiante: ${data.studentName}`);
    doc.text(`Correo: ${data.studentEmail ?? "No registrado"}`);
    doc.text(`Curso: ${data.courseName}`);
    doc.text(`Calificación: ${data.grade}`);
    doc.text(`Emisor: ${data.issuedBy}`);
    doc.text(`Fecha de emisión: ${new Date(data.createdAt).toISOString()}`);

    doc.moveDown(2);
    doc
      .fontSize(11)
      .text(
        "Este documento confirma la autenticidad de la certificación emitida por EduCert. La validación se realiza mediante la huella digital y el folio único asociado.",
        { align: "justify" }
      );

    doc.end();
  });
}

export async function buildQrDataUrl(value: string) {
  const { toDataURL } = await import("qrcode");
  return toDataURL(value, {
    width: 180,
    margin: 1,
    errorCorrectionLevel: "M",
  });
}
