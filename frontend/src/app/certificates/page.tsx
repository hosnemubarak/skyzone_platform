import fs from "fs";
import path from "path";
import { Metadata } from "next";
import CertificatesPageContent, { CertificateData } from "@/components/certificates/CertificatesPageContent";

export const metadata: Metadata = {
  title: "Certificates & Compliance Reports",
  description: "Verify the quality, safety, and performance standards of Knox hybrid inverters. Browse official international test reports, CE certifications, and compliance documentation.",
};

function parseCertificateFile(filename: string): CertificateData {
  // Strip .pdf
  const nameWithoutExt = filename.replace(/\.pdf$/i, "");
  
  // Initialize default values
  let title = "";
  let type: "Certificate" | "Test Report" = "Certificate";
  let standard = "CE Compliance / IEC Standards";
  let serialNumber = "";
  let model = "";
  let category = "Inverter Accessories";

  // Check if there is a serial number at start (e.g. szntc2604067sv00)
  const serialMatch = nameWithoutExt.match(/^(szntc\w+)/i);
  if (serialMatch) {
    serialNumber = serialMatch[1].toUpperCase();
  }

  // Determine Type (Certificate vs Report)
  if (nameWithoutExt.toLowerCase().includes("report")) {
    type = "Test Report";
  } else {
    type = "Certificate";
  }

  // Detect standards
  if (nameWithoutExt.toLowerCase().includes("62109")) {
    standard = "EN IEC 62109-1 & 2 (Safety of power converters)";
  } else if (nameWithoutExt.toLowerCase().includes("61683")) {
    standard = "IEC 61683 (Procedure for measuring efficiency)";
  } else if (nameWithoutExt.toLowerCase().includes("ce-lvd")) {
    standard = "CE-LVD (Low Voltage Directive)";
  }

  // Detect models
  if (nameWithoutExt.toLowerCase().includes("6.6kw") || nameWithoutExt.toLowerCase().includes("12000pv")) {
    model = "XZ-6.6kW-12000pV";
    category = "Hybrid Inverter";
  } else if (
    nameWithoutExt.toLowerCase().includes("11.2kw") || 
    nameWithoutExt.toLowerCase().includes("9.2kw")
  ) {
    model = "XZ-11.2kW & XZ-9.2kW";
    category = "Hybrid Inverter";
  } else {
    model = "Knox Inverter Series";
    category = "Solar Solution";
  }

  // Format a clean user-friendly title
  if (filename.toLowerCase().includes("62109") && filename.toLowerCase().includes("cert")) {
    title = `CE-LVD Safety Certificate (EN IEC 62109)`;
  } else if (filename.toLowerCase().includes("62109") && filename.toLowerCase().includes("report")) {
    title = `CE-LVD Safety Test Report (EN IEC 62109)`;
  } else if (filename.toLowerCase().includes("61683") && filename.toLowerCase().includes("cert")) {
    title = `IEC 61683 Efficiency Certificate`;
  } else if (filename.toLowerCase().includes("61683") && filename.toLowerCase().includes("report")) {
    title = `IEC 61683 Efficiency Test Report`;
  } else if (serialNumber) {
    const certSuffix = serialNumber.endsWith("67SV00") ? "Part 1" : "Part 2";
    title = `MPPT Solar Inverter Compliance Certificate (${certSuffix})`;
  } else {
    // Fallback formatting
    title = nameWithoutExt
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return {
    filename,
    title,
    type,
    standard,
    serialNumber: serialNumber || "N/A",
    model,
    category,
    filePath: `/Certicate/${filename}`,
  };
}

export default async function CertificatesPage() {
  const certDirectory = path.join(process.cwd(), "public", "Certicate");
  let certificates: CertificateData[] = [];

  try {
    if (fs.existsSync(certDirectory)) {
      const filenames = fs.readdirSync(certDirectory);
      certificates = filenames
        .filter((file) => file.endsWith(".pdf"))
        .map((file) => parseCertificateFile(file));
      
      // Sort certificates: Certificates first, then Test Reports, then alphabetically by Title
      certificates.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "Certificate" ? -1 : 1;
        }
        return a.title.localeCompare(b.title);
      });
    }
  } catch (error) {
    console.error("Error reading certificates directory:", error);
  }

  return <CertificatesPageContent certificates={certificates} />;
}
