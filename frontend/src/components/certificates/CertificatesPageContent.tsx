"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FileText, Download, Eye, Search, X, ShieldCheck, Award, FileSpreadsheet } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export interface CertificateData {
  filename: string;
  title: string;
  type: "Certificate" | "Test Report";
  standard: string;
  serialNumber: string;
  model: string;
  category: string;
  filePath: string;
}

interface CertificatesPageContentProps {
  certificates: CertificateData[];
}

export default function CertificatesPageContent({ certificates }: CertificatesPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<"all" | "Certificate" | "Test Report">("all");
  const [activeModel, setActiveModel] = useState<"all" | "XZ-6.6kW" | "XZ-11.2kW & XZ-9.2kW">("all");

  // Filtering logic
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      // 1. Search Query Filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cert.title.toLowerCase().includes(q) ||
        cert.standard.toLowerCase().includes(q) ||
        cert.serialNumber.toLowerCase().includes(q) ||
        cert.model.toLowerCase().includes(q);

      // 2. Type Filter
      const matchesType = activeType === "all" || cert.type === activeType;

      // 3. Model Filter
      const matchesModel =
        activeModel === "all" ||
        (activeModel === "XZ-6.6kW" && cert.model.includes("6.6kW")) ||
        (activeModel === "XZ-11.2kW & XZ-9.2kW" && (cert.model.includes("11.2kW") || cert.model.includes("9.2kW")));

      return matchesSearch && matchesType && matchesModel;
    });
  }, [certificates, searchQuery, activeType, activeModel]);

  return (
    <>
      {/* Page Hero */}
      <section className="relative bg-primary pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        {/* Background visual details */}
        <div className="absolute inset-0 hero-grid-pattern opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto px-5">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Certificates</span>
          </div>
          
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Quality Assurance
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight">
              Certificates &amp; Compliance Reports
            </h1>
            <p className="text-lg text-white/70 mt-4 leading-relaxed">
              Verify the quality, safety, and performance standards of Knox hybrid inverters. Browse official international test reports, CE certifications, and compliance documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Control panel & Filter bar */}
      <section className="py-6 bg-white sticky top-[72px] z-30 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-xs shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search standard, model..."
                className="w-full bg-bg-light border border-gray-200/80 rounded-xl px-4 py-2.5 pl-10 text-sm text-text-dark focus:outline-none focus:border-electric/50 focus:bg-white transition-all placeholder:text-gray-400"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-text-dark bg-gray-200/50 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              {/* Type Filters */}
              <div className="flex items-center bg-bg-light p-1 rounded-xl border border-gray-100">
                <button
                  onClick={() => setActiveType("all")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeType === "all"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-text-dark"
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setActiveType("Certificate")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeType === "Certificate"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-text-dark"
                  }`}
                >
                  Certificates
                </button>
                <button
                  onClick={() => setActiveType("Test Report")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeType === "Test Report"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-text-dark"
                  }`}
                >
                  Test Reports
                </button>
              </div>

              {/* Model Filters */}
              <div className="flex items-center bg-bg-light p-1 rounded-xl border border-gray-100">
                <button
                  onClick={() => setActiveModel("all")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeModel === "all"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-text-dark"
                  }`}
                >
                  All Models
                </button>
                <button
                  onClick={() => setActiveModel("XZ-6.6kW")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeModel === "XZ-6.6kW"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-text-dark"
                  }`}
                >
                  XZ-6.6kW
                </button>
                <button
                  onClick={() => setActiveModel("XZ-11.2kW & XZ-9.2kW")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeModel === "XZ-11.2kW & XZ-9.2kW"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-text-dark"
                  }`}
                >
                  XZ-11.2/9.2kW
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Listing Grid */}
      <section className="py-16 bg-bg-light min-h-[500px]">
        <div className="max-w-[1200px] mx-auto px-5">
          {filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCertificates.map((cert, idx) => (
                <ScrollReveal key={cert.filename} delay={idx * 0.05}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-300 group flex flex-col h-full">
                    
                    {/* CSS Certificate Document Preview Thumbnail */}
                    <div className="relative p-6 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center h-[240px] border-b border-gray-100">
                      <div className="relative w-[150px] h-[190px] bg-white border-[3px] border-double border-amber-500/40 rounded shadow-md flex flex-col justify-between p-3.5 overflow-hidden group-hover:border-amber-500/80 transition-all duration-300">
                        {/* Certificate Watermark Design */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                          <Award className="w-24 h-24 text-primary" />
                        </div>

                        {/* Top Part: Title/Type */}
                        <div className="text-center relative z-10">
                          <div className="w-5 h-5 mx-auto bg-primary/5 rounded-full flex items-center justify-center mb-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="text-[7px] text-gray-400 font-bold uppercase tracking-wider block">
                            Sky Zone Compliance
                          </span>
                        </div>

                        {/* Center: Large Certificate Heading */}
                        <div className="text-center relative z-10 my-2">
                          <h4 className={`font-serif text-[10px] leading-tight font-extrabold ${
                            cert.type === "Certificate" ? "text-primary" : "text-gray-700"
                          }`}>
                            {cert.type === "Certificate" ? "CERTIFICATE OF CONFORMANCE" : "TEST COMPLIANCE REPORT"}
                          </h4>
                          <div className="w-8 h-0.5 bg-accent mx-auto my-1.5" />
                          <span className="text-[7px] text-gray-500 block font-semibold truncate px-1">
                            {cert.model}
                          </span>
                          <span className="text-[6px] text-gray-400 block truncate px-2 mt-0.5">
                            {cert.standard.split(" (")[0]}
                          </span>
                        </div>

                        {/* Bottom: Signature Seal & Info */}
                        <div className="flex items-end justify-between relative z-10">
                          <div className="text-left">
                            <span className="text-[5px] text-gray-400 block">Serial No</span>
                            <span className="text-[6px] font-mono text-gray-600 block max-w-[70px] truncate">
                              {cert.serialNumber}
                            </span>
                          </div>

                          {/* Gold Foil Seal */}
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 shadow flex items-center justify-center shrink-0">
                            <Award className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Hover action overlay (for accessibility and premium look) */}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Tags */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm border ${
                            cert.type === "Certificate"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-blue-50 text-blue-600 border-blue-100"
                          }`}>
                            {cert.type === "Certificate" ? "Certificate" : "Test Report"}
                          </span>
                          <span className="text-[10px] bg-gray-100 text-gray-600 border border-gray-200/50 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                            {cert.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-heading font-bold text-base text-text-dark group-hover:text-electric transition-colors leading-snug line-clamp-2" title={cert.title}>
                          {cert.title}
                        </h3>

                        {/* Metadata Details */}
                        <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
                          <div className="flex justify-between items-start text-xs text-gray-500">
                            <span className="font-medium">Model Range:</span>
                            <span className="text-text-dark font-semibold text-right max-w-[170px] truncate">{cert.model}</span>
                          </div>
                          <div className="flex justify-between items-start text-xs text-gray-500">
                            <span className="font-medium">Quality Standard:</span>
                            <span className="text-text-dark font-semibold text-right max-w-[170px] truncate" title={cert.standard}>{cert.standard}</span>
                          </div>
                          {cert.serialNumber !== "N/A" && (
                            <div className="flex justify-between items-start text-xs text-gray-500">
                              <span className="font-medium">Certificate No:</span>
                              <span className="text-text-dark font-mono font-semibold">{cert.serialNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <a
                          href={cert.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-3 py-2 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View PDF
                        </a>
                        <a
                          href={cert.filePath}
                          download={cert.filename}
                          className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-dark text-white font-semibold px-3 py-2 rounded-xl text-xs transition-all shadow-sm cursor-pointer hover:shadow"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </a>
                      </div>
                    </div>

                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] px-5 border border-gray-100 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-xl text-text-dark">No certificates found</h3>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                We couldn&apos;t find any compliance documentation matching your filters. Try adjusting your search query or reset the type and model filters.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveType("all");
                    setActiveModel("all");
                  }}
                  className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-primary-dark transition-all shadow cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
