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

  // Check if there is a serial number at start (e.g. SZNTC2604067SV00)
  const serialMatch = nameWithoutExt.match(/^(SZ\w+)/i);
  if (serialMatch) {
    serialNumber = serialMatch[1];
  }

  // Clean Chinese characters and extra formatting
  let cleanParts = nameWithoutExt
    .replace(/[^\x00-\x7F]+/g, "") // remove non-ascii
    .replace(/_/g, " ")
    .trim();

  // If there's a serial number, remove it from the cleaning text
  if (serialNumber) {
    cleanParts = cleanParts.replace(serialNumber, "").trim();
  }

  // Categorize based on file content
  if (cleanParts.toLowerCase().includes("report")) {
    type = "Test Report";
  } else {
    type = "Certificate";
  }

  // Detect standards
  if (cleanParts.toLowerCase().includes("62109")) {
    standard = "EN IEC 62109-1 & 2 (Safety of power converters)";
  } else if (cleanParts.toLowerCase().includes("61683")) {
    standard = "IEC 61683 (Procedure for measuring efficiency)";
  } else if (cleanParts.toLowerCase().includes("lvd")) {
    standard = "CE-LVD (Low Voltage Directive)";
  }

  // Detect models
  if (cleanParts.toLowerCase().includes("6.6kw") || cleanParts.toLowerCase().includes("12000pv")) {
    model = "XZ-6.6kW-12000pV";
    category = "Hybrid Inverter";
  } else if (
    cleanParts.toLowerCase().includes("11_2kw") || 
    cleanParts.toLowerCase().includes("11.2kw") || 
    cleanParts.toLowerCase().includes("9_2kw") || 
    cleanParts.toLowerCase().includes("9.2kw") ||
    cleanParts.toLowerCase().includes("11 2kw") ||
    cleanParts.toLowerCase().includes("9 2kw")
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
    title = cleanParts;
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
