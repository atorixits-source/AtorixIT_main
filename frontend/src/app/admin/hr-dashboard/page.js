"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  UserCheck, Users, Briefcase, Award,
  Target, Search, Plus,
  RefreshCw, Edit2, Trash2, X, MapPin, Timer, DollarSign,
  SlidersHorizontal, ChevronRight, ArrowUpDown, ChevronDown, FileText,
  Phone, Building2, Clock, Globe, Eye,
} from "lucide-react";
import RoleBasedRoute from "@/components/admin/RoleBasedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import LeadActions from "@/components/admin/LeadActions";
import { trackPage } from "@/lib/activityTracker";
import { logUIAction } from "@/lib/uiLogger";

// ─── Breakpoint hook ─────────────────────────────────────────────────────────

function useBreakpoint() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
}

// ─── Job Data & Helpers ──────────────────────────────────────────────────────

const DEFAULT_JOBS = [
  { id: 1, title: "Frontend Developer", department: "Engineering", location: "Remote", type: "Full-time", experience: "2–4 yrs", salary: "$80K–$110K", status: "active", postedDate: "2026-01-15", requirements: ["React", "TypeScript", "CSS/Tailwind", "REST APIs"], description: "Own the component library and lead performance work across our web app. You'll collaborate daily with design and backend to ship fast, accessible UIs." },
  { id: 2, title: "UX/UI Designer", department: "Design", location: "New York, NY", type: "Full-time", experience: "2–3 yrs", salary: "$70K–$95K", status: "active", postedDate: "2026-01-20", requirements: ["Figma", "User Research", "Prototyping", "Design Systems"], description: "Shape the visual language of our product from wireframe to polished component. You'll own the design system and run regular user research sessions." },
  { id: 3, title: "Backend Engineer", department: "Engineering", location: "San Francisco, CA", type: "Full-time", experience: "3–5 yrs", salary: "$100K–$140K", status: "active", postedDate: "2026-01-25", requirements: ["Node.js", "PostgreSQL", "Docker", "AWS"], description: "Architect and maintain our API layer, own data modeling, and scale our infrastructure as usage grows. Strong focus on observability and reliability." },
  { id: 4, title: "Product Manager", department: "Product", location: "Remote", type: "Full-time", experience: "3–6 yrs", salary: "$90K–$130K", status: "active", postedDate: "2026-02-01", requirements: ["Strategy", "Agile", "Data Analysis", "Stakeholder Mgmt"], description: "Drive the roadmap across engineering and design. You'll run discovery, write specs, and be accountable for outcomes — not just output." },
  { id: 5, title: "DevOps Engineer", department: "Infrastructure", location: "Austin, TX", type: "Full-time", experience: "2–4 yrs", salary: "$95K–$125K", status: "paused", postedDate: "2026-02-05", requirements: ["Kubernetes", "Terraform", "CI/CD", "Linux"], description: "Build and maintain the CI/CD pipelines, container orchestration, and cloud infrastructure. On-call rotation shared across the infra team." },
  { id: 6, title: "Data Scientist", department: "Data", location: "Remote", type: "Full-time", experience: "2–5 yrs", salary: "$90K–$120K", status: "active", postedDate: "2026-02-10", requirements: ["Python", "ML/AI", "SQL", "Statistics"], description: "Turn raw product and business data into actionable intelligence. You'll own our ML pipeline, build dashboards, and work closely with PMs." },
  { id: 7, title: "iOS Engineer", department: "Engineering", location: "Remote", type: "Full-time", experience: "3–5 yrs", salary: "$105K–$135K", status: "active", postedDate: "2026-02-12", requirements: ["Swift", "SwiftUI", "Xcode", "CoreData"], description: "Build and maintain our native iOS app. You'll drive architecture decisions, mentor junior engineers, and collaborate with design on interactions." },
  { id: 8, title: "Growth Marketer", department: "Marketing", location: "New York, NY", type: "Full-time", experience: "2–4 yrs", salary: "$75K–$100K", status: "paused", postedDate: "2026-02-14", requirements: ["SEO", "Paid Ads", "Analytics", "A/B Testing"], description: "Own top-of-funnel growth across paid and organic channels. You'll run experiments continuously and report directly to the Head of Marketing." },
];

const DEPARTMENTS = ["Engineering", "Design", "Product", "Data", "Infrastructure", "HR", "Marketing", "Sales", "Operations"];
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const emptyForm = { title: "", department: "Engineering", location: "", type: "Full-time", experience: "", salary: "", status: "active", description: "", requirements: "" };

const DEPT_COLORS = {
  Engineering: "#3b82f6", Design: "#ec4899", Product: "#8b5cf6",
  Data: "#f59e0b", Infrastructure: "#06b6d4", HR: "#14b8a6",
  Marketing: "#f43f5e", Sales: "#10b981", Operations: "#f97316",
};
const deptColor = (d) => DEPT_COLORS[d] || "#a1a1aa";
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtShort = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

// ─── Resume viewer helper ─────────────────────────────────────────────────────
const openResume = (url) => {
  if (!url) return;
  const cleanUrl = url.replace(/\/fl_[^\/]+\//, "/");
  const isWord = /\.(docx|doc)$/i.test(cleanUrl);
  if (isWord) {
    window.open("https://docs.google.com/viewer?url=" + encodeURIComponent(cleanUrl) + "&embedded=true", "_blank");
  } else {
    const proxyUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/job-applications/resume-proxy?url=" + encodeURIComponent(cleanUrl);
    window.open(proxyUrl, "_blank");
  }
};

const inputCls = "w-full px-3 py-2.5 text-sm outline-none rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all duration-150";
const FL = ({ children }) => <label style={{ display: "block", fontSize: "10px", fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>{children}</label>;
const FI = (p) => <input {...p} className={inputCls} />;
const FS = ({ children, ...p }) => <select {...p} className={inputCls} style={{ cursor: "pointer" }}>{children}</select>;
const FTA = (p) => <textarea {...p} rows={3} className={inputCls} style={{ resize: "none", lineHeight: "1.6" }} />;

// ─── StatusBadge ─────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  applied: { background: "#dbeafe", color: "#1e40af" },
  reviewed: { background: "#f3e8ff", color: "#6b21a8" },
  interview: { background: "#fef9c3", color: "#854d0e" },
  offered: { background: "#dcfce7", color: "#166534" },
  rejected: { background: "#fee2e2", color: "#991b1b" },
  onboarding: { background: "#e0e7ff", color: "#3730a3" },
  active: { background: "#dcfce7", color: "#166534" },
};
const StatusBadge = ({ status }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 500, textTransform: "capitalize", ...(STATUS_STYLES[status] || { background: "#f4f4f5", color: "#52525b" }) }}>
    {status}
  </span>
);

// ─── Candidate Detail Modal ───────────────────────────────────────────────────

function CandidateDetailModal({ app, onClose, isMobile, onOpenResume }) {
  if (!app) return null;

  const Field = ({ icon: Icon, label, value }) => {
    if (!value && value !== 0) return null;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ fontSize: "10px", fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "4px" }}>
          <Icon size={10} color="#c4c4c8" /> {label}
        </span>
        <span style={{ fontSize: "13px", color: "#3f3f46", lineHeight: 1.4 }}>{value}</span>
      </div>
    );
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(3px)" }} />
      <div
        className={isMobile ? "jpanel-sheet" : "modal-desktop"}
        style={{
          position: "fixed", zIndex: 61,
          ...(isMobile
            ? { bottom: 0, left: 0, right: 0, borderRadius: "20px 20px 0 0", maxHeight: "90dvh" }
            : { top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "500px", maxHeight: "85vh", borderRadius: "16px" }
          ),
          background: "#fff", border: "1px solid #e4e4e7",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        {/* Drag handle */}
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px", flexShrink: 0 }}>
            <div style={{ width: "32px", height: "4px", borderRadius: "2px", background: "#e4e4e7" }} />
          </div>
        )}

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f4f4f5", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", fontWeight: 700, fontSize: "17px", flexShrink: 0 }}>
              {app.fullName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#18181b", margin: 0 }}>{app.fullName}</h2>
              <p style={{ fontSize: "12px", color: "#a1a1aa", margin: "2px 0 0" }}>{app.email}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", border: "none", background: "transparent", cursor: "pointer", color: "#a1a1aa" }}>
            <X size={15} />
          </button>
        </div>

        {/* Status strip */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 20px", background: "#fafafa", borderBottom: "1px solid #f4f4f5", flexShrink: 0 }}>
          <StatusBadge status={app.status} />
          {app.createdAt && (
            <span style={{ fontSize: "12px", color: "#a1a1aa", fontFamily: "'IBM Plex Mono',monospace" }}>
              Applied {new Date(app.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          )}
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Contact & Position */}
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#c4c4c8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ flex: 1, height: "1px", background: "#f4f4f5" }} />Contact & Position<span style={{ flex: 1, height: "1px", background: "#f4f4f5" }} />
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
              <Field icon={Phone} label="Phone" value={app.phone} />
              <Field icon={Briefcase} label="Position" value={app.position} />
              {app.department && <Field icon={Users} label="Department" value={app.department} />}
              <Field icon={Globe} label="Source" value={app.source} />
            </div>
          </div>

          {/* Professional Details */}
          {(app.experience || app.currentCompany || app.expectedSalary || app.noticePeriod) && (
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#c4c4c8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ flex: 1, height: "1px", background: "#f4f4f5" }} />Professional Details<span style={{ flex: 1, height: "1px", background: "#f4f4f5" }} />
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
                <Field icon={Award} label="Experience" value={app.experience} />
                <Field icon={Building2} label="Current Company" value={app.currentCompany} />
                <Field icon={DollarSign} label="Expected Salary" value={app.expectedSalary ? (typeof app.expectedSalary === "number" ? `₹${Number(app.expectedSalary).toLocaleString()}` : app.expectedSalary) : null} />
                <Field icon={Clock} label="Notice Period" value={app.noticePeriod} />
              </div>
            </div>
          )}

          {/* Cover Letter */}
          {app.coverLetter && (
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#c4c4c8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ flex: 1, height: "1px", background: "#f4f4f5" }} />Cover Letter<span style={{ flex: 1, height: "1px", background: "#f4f4f5" }} />
              </p>
              <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.7, margin: 0, background: "#fafafa", padding: "12px 14px", borderRadius: "10px", border: "1px solid #f4f4f5" }}>
                {app.coverLetter}
              </p>
            </div>
          )}

          {/* Resume */}
          {app.resumePath && (
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#c4c4c8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ flex: 1, height: "1px", background: "#f4f4f5" }} />Resume<span style={{ flex: 1, height: "1px", background: "#f4f4f5" }} />
              </p>
              <button
                onClick={() => onOpenResume(app.resumePath)}
                style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "9px 16px", borderRadius: "8px", background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
              >
                <FileText size={14} /> View Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Job Detail Panel ─────────────────────────────────────────────────────────

function JobDetailPanel({ selected, onClose, onEdit, onDelete, scrollable }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #f4f4f5", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", flexShrink: 0 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: deptColor(selected.department), flexShrink: 0 }} />
            <span style={{ fontSize: "11px", color: "#a1a1aa", fontWeight: 500 }}>{selected.department}</span>
          </div>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#18181b", lineHeight: 1.3, margin: 0 }}>{selected.title}</h2>
        </div>
        <button onClick={onClose} style={{ flexShrink: 0, width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", border: "none", background: "transparent", cursor: "pointer", color: "#a1a1aa" }}>
          <X size={14} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: scrollable ? "auto" : "visible" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #f4f4f5", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" }}>
          {[
            { Icon: MapPin, label: "Location", val: selected.location },
            { Icon: Timer, label: "Type", val: selected.type },
            { Icon: Award, label: "Experience", val: selected.experience },
            { Icon: DollarSign, label: "Salary", val: selected.salary },
          ].filter(r => r.val).map(({ Icon, label, val }) => (
            <div key={label}>
              <p style={{ fontSize: "10px", color: "#a1a1aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px", margin: "0 0 2px" }}>{label}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Icon size={11} color="#d4d4d8" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: "12px", color: "#3f3f46", fontFamily: "'IBM Plex Mono',monospace" }}>{val}</span>
              </div>
            </div>
          ))}
          <div style={{ gridColumn: "span 2" }}>
            <p style={{ fontSize: "10px", color: "#a1a1aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>Posted</p>
            <span style={{ fontSize: "12px", color: "#3f3f46", fontFamily: "'IBM Plex Mono',monospace" }}>{fmtDate(selected.postedDate)}</span>
          </div>
        </div>
        {selected.description && (
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f4f4f5" }}>
            <p style={{ fontSize: "10px", color: "#a1a1aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>About the role</p>
            <p style={{ fontSize: "12px", color: "#52525b", lineHeight: 1.6, margin: 0 }}>{selected.description}</p>
          </div>
        )}
        {selected.requirements?.length > 0 && (
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f4f4f5" }}>
            <p style={{ fontSize: "10px", color: "#a1a1aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Requirements</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {selected.requirements.map(r => (
                <span key={r} style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "6px", background: "#f4f4f5", color: "#52525b", border: "1px solid #e4e4e7", fontFamily: "'IBM Plex Mono',monospace" }}>{r}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: "12px 16px", display: "flex", gap: "8px", flexShrink: 0, borderTop: "1px solid #f4f4f5", background: "#fff" }}>
        <button onClick={() => onEdit(selected)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px", borderRadius: "8px", background: "#4f46e5", color: "#fff", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
          <Edit2 size={12} /> Edit
        </button>
        <button onClick={() => onDelete(selected.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px 14px", borderRadius: "8px", background: "transparent", color: "#71717a", border: "1px solid #e4e4e7", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Mobile Job Card ──────────────────────────────────────────────────────────

function MobileJobCard({ job, isSelected, onSelect, onToggleStatus, onEdit, onDelete }) {
  return (
    <div style={{ padding: "14px 16px", borderBottom: "1px solid #f4f4f5", borderLeft: isSelected ? "3px solid #4f46e5" : "3px solid transparent", background: isSelected ? "#eef2ff" : "#fff", cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }} onClick={() => onSelect(job)}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", minWidth: 0 }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: deptColor(job.department), flexShrink: 0, marginTop: "5px" }} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: isSelected ? "#4338ca" : "#18181b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.title}</p>
            <p style={{ fontSize: "12px", color: "#a1a1aa", margin: "2px 0 6px" }}>{job.department} · {job.type}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              {job.location && <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#71717a", fontFamily: "'IBM Plex Mono',monospace" }}><MapPin size={11} color="#d4d4d8" />{job.location}</span>}
              {job.salary && <span style={{ fontSize: "12px", color: "#71717a", fontFamily: "'IBM Plex Mono',monospace" }}>{job.salary}</span>}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); onToggleStatus(job.id); }} style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 600, border: job.status === "active" ? "1px solid #bbf7d0" : "1px solid #e4e4e7", background: job.status === "active" ? "#f0fdf4" : "#f4f4f5", color: job.status === "active" ? "#15803d" : "#71717a", cursor: "pointer" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: job.status === "active" ? "#22c55e" : "#a1a1aa" }} />
            {job.status === "active" ? "Live" : "Off"}
          </button>
          <span style={{ fontSize: "11px", color: "#a1a1aa", fontFamily: "'IBM Plex Mono',monospace" }}>{fmtShort(job.postedDate)}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #f4f4f5" }}>
        <button onClick={e => { e.stopPropagation(); onEdit(job); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", borderRadius: "8px", background: "#eef2ff", color: "#4f46e5", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
          <Edit2 size={11} /> Edit
        </button>
        <button onClick={e => { e.stopPropagation(); onDelete(job.id); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", borderRadius: "8px", background: "transparent", color: "#71717a", border: "1px solid #e4e4e7", cursor: "pointer" }}>
          <Trash2 size={12} />
        </button>
        <button onClick={e => { e.stopPropagation(); onSelect(job); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", padding: "8px 10px", borderRadius: "8px", background: "transparent", color: "#71717a", border: "1px solid #e4e4e7", cursor: "pointer", fontSize: "12px", fontWeight: 600, flexShrink: 0 }}>
          Details <ChevronRight size={12} style={{ transform: isSelected ? "rotate(90deg)" : "none" }} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HRDashboard() {
  const { isMobile, isDesktop } = useBreakpoint();

  // ── Hiring Pipeline ──
  const [searchTerm, setSearchTerm] = useState("");
  const [hiringData, setHiringData] = useState([]);
  const [loadingPipeline, setLoadingPipeline] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5, total: 0, totalPages: 1 });
  const [viewingCandidate, setViewingCandidate] = useState(null);

  const fetchHiringData = async () => {
    try {
      setLoadingPipeline(true);
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job-applications?page=${pagination.page}&pageSize=${pagination.pageSize}`;
      const res = await fetch(url, { headers: { "Content-Type": "application/json", Accept: "application/json" }, credentials: "include" });
      const data = await res.json();
      if (res.ok && data.success) {
        setHiringData(data.items || []);
        setPagination(p => ({ ...p, total: data.total || 0, totalPages: data.totalPages || 1 }));
      } else setHiringData([]);
    } catch { setHiringData([]); }
    finally { setLoadingPipeline(false); }
  };
  useEffect(() => { fetchHiringData(); }, [pagination.page]);
  const handlePageChange = (n) => {
    if (n > 0 && n <= pagination.totalPages) {
      logUIAction("HR_PIPELINE_PAGINATE", "Hiring_Pipeline", { from: pagination.page, to: n });
      setPagination(p => ({ ...p, page: n }));
    }
  };
  const fmtApplied = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A";

  // ── Job Openings ──
  const [jobs, setJobs] = useState([]);
  const [jobSearch, setJobSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [sortDir, setSortDir] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const jobSearchRef = useRef(null);

  useEffect(() => {
    const s = localStorage.getItem("admin_job_openings");
    setJobs(s ? JSON.parse(s) : DEFAULT_JOBS);
    trackPage("/admin/hr-dashboard", "auto");
    logUIAction("HR_PAGE_OPEN", "HR_Dashboard");
  }, []);

  const persistJobs = (u) => { setJobs(u); localStorage.setItem("admin_job_openings", JSON.stringify(u)); };
  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const jobDepts = ["All", ...Array.from(new Set(jobs.map(j => j.department)))];
  const filteredJobs = jobs
    .filter(j => {
      const q = jobSearch.toLowerCase();
      return (!q || j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q) || j.location?.toLowerCase().includes(q)) &&
        (filterDept === "All" || j.department === filterDept) &&
        (filterStatus === "All" || j.status === filterStatus);
    })
    .sort((a, b) => sortDir === "desc" ? new Date(b.postedDate) - new Date(a.postedDate) : new Date(a.postedDate) - new Date(b.postedDate));

  useEffect(() => { if (selected) setSelected(jobs.find(j => j.id === selected.id) || null); }, [jobs]);

  const openAdd = () => {
    logUIAction("HR_NEW_LISTING_OPEN", "Job_Openings");
    setEditingId(null); setForm({ ...emptyForm }); setModalOpen(true);
  };
  const openEdit = (job) => {
    logUIAction("HR_JOB_EDIT_OPEN", "Job_Openings", { jobId: job.id, title: job.title });
    setEditingId(job.id);
    setForm({ ...job, requirements: Array.isArray(job.requirements) ? job.requirements.join(", ") : job.requirements || "" });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  const handleSaveJob = () => {
    if (!form.title.trim() || !form.location.trim()) return;
    const reqs = form.requirements ? form.requirements.split(",").map(r => r.trim()).filter(Boolean) : [];
    const isEdit = !!editingId;
    logUIAction(isEdit ? "HR_JOB_UPDATE" : "HR_JOB_CREATE", "Job_Openings", { jobId: editingId || "new", title: form.title, department: form.department, status: form.status });
    if (editingId) {
      persistJobs(jobs.map(j => j.id === editingId ? { ...j, ...form, requirements: reqs } : j));
      showToast("Job updated.");
    } else {
      persistJobs([...jobs, { ...form, id: Date.now(), requirements: reqs, postedDate: new Date().toISOString().split("T")[0] }]);
      showToast("Listing published.");
    }
    closeModal();
  };

  const handleDeleteJob = (id) => {
    const job = jobs.find(j => j.id === id);
    logUIAction("HR_JOB_DELETE", "Job_Openings", { jobId: id, title: job?.title });
    if (selected?.id === id) setSelected(null);
    persistJobs(jobs.filter(j => j.id !== id));
    setDeleteConfirm(null);
    showToast("Listing removed.", "error");
  };

  const toggleJobStatus = (id) => {
    const job = jobs.find(j => j.id === id);
    const nextStatus = job?.status === "active" ? "paused" : "active";
    logUIAction("HR_JOB_STATUS_TOGGLE", "Job_Openings", { jobId: id, from: job?.status, to: nextStatus });
    persistJobs(jobs.map(j => j.id === id ? { ...j, status: nextStatus } : j));
  };

  const handleSelectJob = (job) => {
    const isClosing = selected?.id === job?.id;
    logUIAction(isClosing ? "HR_JOB_CLOSE" : "HR_JOB_VIEW", "Job_Openings", { jobId: job?.id, title: job?.title });
    setSelected(prev => prev?.id === job?.id ? null : job);
  };
  const panelOpen = !!selected && isDesktop;

  const jobStats = { total: jobs.length, active: jobs.filter(j => j.status === "active").length, paused: jobs.filter(j => j.status === "paused").length };
  const hrStats = { totalEmployees: 156, newHires: 12, openPositions: jobStats.active, avgRetention: "92%" };

  const sm = (mobile, other) => isMobile ? mobile : other;

  return (
    <RoleBasedRoute allowedRoles={["hr_mode", "super_admin"]}>
      <AdminLayout title="HR Dashboard" description="Manage employees, recruitment, performance, and HR operations.">

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
          @keyframes jSlideIn { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
          @keyframes jSlideUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
          @keyframes jRowIn    { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
          @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes modalIn   { from{opacity:0;transform:translate(-50%,-46%) scale(0.96)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
          .jpanel-side   { animation: jSlideIn 0.2s ease forwards; }
          .jpanel-sheet  { animation: jSlideUp 0.22s ease forwards; }
          .jrow          { animation: jRowIn 0.15s ease forwards; }
          .modal-desktop { animation: modalIn 0.18s ease forwards; }
          * { box-sizing: border-box; }
          button { transition: opacity 0.15s, transform 0.1s; }
          button:active { transform: scale(0.97); }
          .view-btn:hover { background: #eff6ff !important; border-color: #bfdbfe !important; color: #1d4ed8 !important; }
        `}</style>

        {/* ── Toast ── */}
        {toast && (
          <div style={{ position: "fixed", zIndex: 9999, top: "12px", right: isMobile ? "12px" : "20px", left: isMobile ? "12px" : "auto", display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", borderRadius: "12px", background: "#fff", border: toast.type === "error" ? "1px solid #fecaca" : "1px solid #e4e4e7", color: toast.type === "error" ? "#dc2626" : "#18181b", fontSize: "14px", fontWeight: 500, boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: toast.type === "error" ? "#ef4444" : "#6366f1", flexShrink: 0 }} />
            {toast.msg}
          </div>
        )}

        {/* ── Stats Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: sm("12px", "24px"), marginBottom: sm("20px", "40px") }}>
          {[
            { Icon: Users, label: "Total Employees", val: hrStats.totalEmployees, bg: "#eff6ff", iconBg: "#dbeafe", ic: "#2563eb", vc: "#1d4ed8" },
            { Icon: UserCheck, label: "New Hires", val: hrStats.newHires, bg: "#f0fdf4", iconBg: "#dcfce7", ic: "#16a34a", vc: "#15803d" },
            { Icon: Briefcase, label: "Open Positions", val: hrStats.openPositions, bg: "#faf5ff", iconBg: "#f3e8ff", ic: "#9333ea", vc: "#7e22ce" },
            { Icon: Target, label: "Retention Rate", val: hrStats.avgRetention, bg: "#fff7ed", iconBg: "#ffedd5", ic: "#ea580c", vc: "#c2410c" },
          ].map(({ Icon, label, val, bg, iconBg, ic, vc }) => (
            <div key={label} style={{ background: bg, border: "1px solid rgba(0,0,0,0.05)", borderRadius: sm("16px", "24px"), padding: sm("14px 16px", "28px"), boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ background: iconBg, padding: sm("10px", "14px"), borderRadius: "14px" }}><Icon size={sm(18, 22)} color={ic} /></div>
                <span style={{ fontSize: sm("28px", "36px"), fontWeight: 600, color: vc }}>{val}</span>
              </div>
              <p style={{ marginTop: sm("14px", "22px"), fontSize: sm("11px", "13px"), fontWeight: 500, color: ic, marginBottom: 0 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            JOB OPENINGS  (unchanged)
        ══════════════════════════════════════════ */}
        <div style={{ background: "#fff", borderRadius: sm("16px", "20px"), border: "1px solid #e4e4e7", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: sm("20px", "32px") }}>
          <div style={{ padding: sm("14px 16px", "20px 24px"), borderBottom: "1px solid #f4f4f5" }}>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <h3 style={{ fontSize: sm("15px", "17px"), fontWeight: 600, color: "#18181b", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                  <Briefcase size={16} color="#4f46e5" /> Job Openings
                </h3>
                <p style={{ fontSize: "12px", color: "#a1a1aa", margin: "4px 0 0" }}>Manage active job listings and hiring positions</p>
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {[{ label: "Total", val: jobStats.total, accent: false }, { label: "Active", val: jobStats.active, accent: true }, { label: "Paused", val: jobStats.paused, accent: false }].map(({ label, val, accent }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px", borderRadius: "8px", border: accent ? "1px solid #c7d2fe" : "1px solid #e4e4e7", background: accent ? "#eef2ff" : "#f9f9f9", fontSize: "12px" }}>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 500, fontSize: "13px", color: accent ? "#4f46e5" : "#18181b" }}>{String(val).padStart(2, "0")}</span>
                    <span style={{ color: "#a1a1aa" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "8px 12px" }}>
                <Search size={14} color="#a1a1aa" style={{ flexShrink: 0 }} />
                <input ref={jobSearchRef} value={jobSearch} onChange={e => { setJobSearch(e.target.value); logUIAction("HR_JOB_SEARCH", "Job_Openings", { query: e.target.value }); }} placeholder="Search title, department, location…" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "#3f3f46", minWidth: 0 }} />
                {jobSearch && <button onClick={() => { setJobSearch(""); jobSearchRef.current?.focus(); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#a1a1aa", padding: 0, display: "flex" }}><X size={14} /></button>}
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: isMobile ? "wrap" : "nowrap" }}>
                {isMobile && (
                  <button onClick={() => setShowFilters(f => !f)} style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px", background: "#fff", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "8px 12px", fontSize: "13px", color: "#52525b", cursor: "pointer" }}>
                    <SlidersHorizontal size={13} color="#a1a1aa" /> Filters
                    <ChevronDown size={13} color="#a1a1aa" style={{ marginLeft: "auto", transform: showFilters ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>
                )}
                {!isMobile && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#fff", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "6px 12px" }}>
                      <SlidersHorizontal size={13} color="#a1a1aa" />
                      <select value={filterDept} onChange={e => { setFilterDept(e.target.value); logUIAction("HR_JOB_FILTER_DEPT", "Job_Openings", { department: e.target.value }); }} style={{ background: "transparent", border: "none", outline: "none", fontSize: "13px", color: "#52525b", cursor: "pointer" }}>
                        {jobDepts.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", background: "#fff", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "6px 12px" }}>
                      <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); logUIAction("HR_JOB_FILTER_STATUS", "Job_Openings", { status: e.target.value }); }} style={{ background: "transparent", border: "none", outline: "none", fontSize: "13px", color: "#52525b", cursor: "pointer" }}>
                        <option value="All">All Status</option><option value="active">Active</option><option value="paused">Paused</option>
                      </select>
                    </div>
                  </>
                )}
                <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
                  <Plus size={14} />{isMobile ? "New" : "New Listing"}
                </button>
              </div>
              {isMobile && showFilters && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px", background: "#fff", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "8px 12px" }}>
                    <SlidersHorizontal size={13} color="#a1a1aa" />
                    <select value={filterDept} onChange={e => { setFilterDept(e.target.value); logUIAction("HR_JOB_FILTER_DEPT", "Job_Openings", { department: e.target.value }); }} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "13px", color: "#52525b", cursor: "pointer" }}>
                      {jobDepts.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#fff", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "8px 12px" }}>
                    <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); logUIAction("HR_JOB_FILTER_STATUS", "Job_Openings", { status: e.target.value }); }} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "13px", color: "#52525b", cursor: "pointer" }}>
                      <option value="All">All Status</option><option value="active">Active</option><option value="paused">Paused</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", padding: isDesktop ? "16px" : "0", alignItems: "flex-start" }}>
            {!isDesktop && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", borderBottom: "1px solid #f4f4f5", background: "#fafafa" }}>
                  <button onClick={() => setSortDir(d => { const next = d === "desc" ? "asc" : "desc"; logUIAction("HR_JOB_SORT", "Job_Openings", { direction: next }); return next; })} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    <ArrowUpDown size={11} /> Posted {sortDir === "desc" ? "↓" : "↑"}
                  </button>
                  <span style={{ fontSize: "11px", color: "#a1a1aa", fontFamily: "'IBM Plex Mono',monospace" }}>{filteredJobs.length} of {jobs.length}</span>
                </div>
                {filteredJobs.length === 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px", gap: "10px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#f4f4f5", display: "flex", alignItems: "center", justifyContent: "center" }}><Briefcase size={20} color="#a1a1aa" /></div>
                    <p style={{ fontSize: "13px", color: "#71717a", margin: 0 }}>No listings found</p>
                    <button onClick={openAdd} style={{ fontSize: "13px", fontWeight: 600, color: "#4f46e5", background: "none", border: "none", cursor: "pointer" }}>+ New listing</button>
                  </div>
                ) : filteredJobs.map((job, i) => (
                  <div key={job.id} className="jrow" style={{ animationDelay: `${i * 0.03}s` }}>
                    <MobileJobCard job={job} isSelected={selected?.id === job.id} onSelect={handleSelectJob} onToggleStatus={toggleJobStatus} onEdit={openEdit} onDelete={(id) => setDeleteConfirm(id)} />
                  </div>
                ))}
                {filteredJobs.length > 0 && <div style={{ padding: "8px 16px", borderTop: "1px solid #f4f4f5", background: "#fafafa" }}><span style={{ fontSize: "11px", color: "#a1a1aa", fontFamily: "'IBM Plex Mono',monospace" }}>{filteredJobs.length} of {jobs.length} records</span></div>}
              </div>
            )}
            {isDesktop && (
              <div style={{ flex: 1, minWidth: 0, border: "1px solid #e4e4e7", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: panelOpen ? "1fr 80px 72px" : "1fr 140px 120px 90px 80px 72px", gap: "12px", padding: "10px 16px", borderBottom: "1px solid #f4f4f5", background: "#fafafa" }}>
                  {["Role", ...(!panelOpen ? ["Location", "Salary"] : [])].map(h => (
                    <span key={h} style={{ fontSize: "10px", fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</span>
                  ))}
                  <button onClick={() => setSortDir(d => { const next = d === "desc" ? "asc" : "desc"; logUIAction("HR_JOB_SORT", "Job_Openings", { direction: next }); return next; })} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", fontSize: "10px", fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    <ArrowUpDown size={11} />{!panelOpen && "Posted"}
                  </button>
                  <span style={{ fontSize: "10px", fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.1em" }}>Status</span>
                </div>
                {filteredJobs.length === 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 16px", gap: "10px" }}>
                    <Briefcase size={20} color="#a1a1aa" />
                    <p style={{ fontSize: "13px", color: "#71717a", margin: 0 }}>No listings found</p>
                    <button onClick={openAdd} style={{ fontSize: "13px", fontWeight: 600, color: "#4f46e5", background: "none", border: "none", cursor: "pointer" }}>+ New listing</button>
                  </div>
                ) : filteredJobs.map((job, i) => {
                  const isSel = selected?.id === job.id;
                  return (
                    <div key={job.id} className="jrow" style={{ animationDelay: `${i * 0.03}s` }}>
                      <div onClick={() => setSelected(isSel ? null : job)} style={{ display: "grid", gridTemplateColumns: panelOpen ? "1fr 80px 72px" : "1fr 140px 120px 90px 80px 72px", gap: "12px", padding: "12px 16px", borderBottom: "1px solid #f4f4f5", borderLeft: isSel ? "2px solid #4f46e5" : "2px solid transparent", background: isSel ? "#eef2ff" : "transparent", cursor: "pointer", transition: "background 0.12s" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: deptColor(job.department), flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: "13px", fontWeight: 600, color: isSel ? "#4338ca" : "#18181b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.title}</p>
                            <p style={{ fontSize: "11px", color: "#a1a1aa", margin: "1px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.department} · {job.type}</p>
                          </div>
                        </div>
                        {!panelOpen && <div style={{ display: "flex", alignItems: "center", gap: "5px", minWidth: 0 }}><MapPin size={11} color="#d4d4d8" style={{ flexShrink: 0 }} /><span style={{ fontSize: "12px", color: "#71717a", fontFamily: "'IBM Plex Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.location}</span></div>}
                        {!panelOpen && <span style={{ fontSize: "12px", color: "#71717a", fontFamily: "'IBM Plex Mono',monospace", alignSelf: "center" }}>{job.salary || "—"}</span>}
                        <span style={{ fontSize: "12px", color: "#a1a1aa", fontFamily: "'IBM Plex Mono',monospace", alignSelf: "center" }}>{fmtShort(job.postedDate)}</span>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <button onClick={e => { e.stopPropagation(); toggleJobStatus(job.id); }} style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 600, border: job.status === "active" ? "1px solid #bbf7d0" : "1px solid #e4e4e7", background: job.status === "active" ? "#f0fdf4" : "#f4f4f5", color: job.status === "active" ? "#15803d" : "#71717a", cursor: "pointer" }}>
                            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: job.status === "active" ? "#22c55e" : "#a1a1aa" }} />
                            {job.status === "active" ? "Live" : "Off"}
                          </button>
                        </div>
                        <ChevronRight size={15} color={isSel ? "#818cf8" : "#d4d4d8"} style={{ alignSelf: "center", justifySelf: "flex-end", transform: isSel ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                      </div>
                    </div>
                  );
                })}
                {filteredJobs.length > 0 && <div style={{ padding: "8px 16px", borderTop: "1px solid #f4f4f5", background: "#fafafa" }}><span style={{ fontSize: "11px", color: "#a1a1aa", fontFamily: "'IBM Plex Mono',monospace" }}>{filteredJobs.length} of {jobs.length} records</span></div>}
              </div>
            )}
            {isDesktop && selected && (
              <div className="jpanel-side" style={{ width: "280px", flexShrink: 0, background: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", overflow: "hidden", position: "sticky", top: "16px" }}>
                <JobDetailPanel selected={selected} onClose={() => setSelected(null)} onEdit={openEdit} onDelete={(id) => setDeleteConfirm(id)} scrollable={false} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile/Tablet bottom sheet for job detail */}
        {!isDesktop && selected && (
          <>
            <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }} />
            <div className="jpanel-sheet" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "#fff", borderRadius: "20px 20px 0 0", border: "1px solid #e4e4e7", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)", maxHeight: "85dvh", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px", flexShrink: 0 }}>
                <div style={{ width: "32px", height: "4px", borderRadius: "2px", background: "#e4e4e7" }} />
              </div>
              <JobDetailPanel selected={selected} onClose={() => setSelected(null)} onEdit={openEdit} onDelete={(id) => setDeleteConfirm(id)} scrollable={true} />
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════
            HIRING PIPELINE  (original table + View button)
        ══════════════════════════════════════════ */}
        <div style={{ background: "#fff", borderRadius: sm("16px", "20px"), border: "1px solid #e4e4e7", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: sm("20px", "32px") }}>
          <div style={{ padding: sm("14px 16px", "20px 24px"), borderBottom: "1px solid #f4f4f5" }}>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <h3 style={{ fontSize: sm("15px", "17px"), fontWeight: 600, color: "#18181b", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                  <Briefcase size={16} color="#2563eb" /> Hiring Pipeline
                </h3>
                <p style={{ fontSize: "12px", color: "#a1a1aa", margin: "4px 0 0" }}>Track candidate applications and recruitment progress</p>
              </div>
              <div style={{ display: "flex", flexDirection: "row", gap: "8px", width: isMobile ? "100%" : "auto", alignItems: "center" }}>
                <div style={{ position: "relative", flex: isMobile ? 1 : "none", minWidth: 0 }}>
                  <Search size={14} color="#9ca3af" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                  <input type="text" placeholder="Search candidates..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); logUIAction("HR_CANDIDATE_SEARCH", "Hiring_Pipeline", { query: e.target.value }); }} onKeyDown={(e) => e.key === "Enter" && fetchHiringData()} style={{ width: "100%", paddingLeft: "34px", paddingRight: "12px", paddingTop: "9px", paddingBottom: "9px", borderRadius: "10px", border: "1px solid #d1d5db", background: "#f9fafb", fontSize: "13px", outline: "none" }} />
                </div>
                <Button variant="outline" size="sm" onClick={() => { logUIAction("HR_PIPELINE_REFRESH", "Hiring_Pipeline"); fetchHiringData(); }} disabled={loadingPipeline} style={{ borderRadius: "10px", flexShrink: 0, whiteSpace: "nowrap" }}>
                  <RefreshCw size={14} style={{ marginRight: "6px", animation: loadingPipeline ? "spin 1s linear infinite" : "none" }} />
                  {loadingPipeline ? "Refreshing" : "Refresh"}
                </Button>
              </div>
            </div>
          </div>

          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "460px" : "600px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f4f4f5", background: "#fafafa" }}>
                  <th style={{ padding: sm("10px 12px", "12px 20px"), textAlign: "left", fontSize: "10px", fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>Candidate</th>
                  {!isMobile && <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "10px", fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em" }}>Position</th>}
                  {!isMobile && <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "10px", fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em" }}>Resume</th>}
                  <th style={{ padding: sm("10px 12px", "12px 20px"), textAlign: "left", fontSize: "10px", fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em" }}>Status</th>
                  {!isMobile && <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "10px", fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em" }}>Applied</th>}
                  <th style={{ padding: sm("10px 12px", "12px 20px"), textAlign: "right", fontSize: "10px", fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingPipeline
                  ? Array(5).fill(0).map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f4f4f5" }}>
                      {Array(isMobile ? 3 : 6).fill(0).map((__, j) => (
                        <td key={j} style={{ padding: sm("12px", "14px 20px") }}>
                          <div style={{ height: "16px", background: "#e4e4e7", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} />
                        </td>
                      ))}
                    </tr>
                  ))
                  : hiringData.length > 0
                    ? hiringData.map(app => (
                      <tr key={app._id} style={{ borderBottom: "1px solid #f4f4f5" }} onMouseEnter={e => e.currentTarget.style.background = "#fafafa"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        {/* Candidate */}
                        <td style={{ padding: sm("12px", "14px 20px") }}>
                          <div style={{ display: "flex", alignItems: "center", gap: sm("8px", "12px") }}>
                            <div style={{ width: sm("32px", "38px"), height: sm("32px", "38px"), borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", fontWeight: 500, fontSize: "14px", flexShrink: 0 }}>{app.fullName?.charAt(0) || "A"}</div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontWeight: 500, color: "#18181b", fontSize: "13px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.fullName}</p>
                              <p style={{ fontSize: "11px", color: "#a1a1aa", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.email}</p>
                              {isMobile && app.phone && <p style={{ fontSize: "11px", color: "#71717a", margin: "2px 0 0", fontFamily: "'IBM Plex Mono',monospace" }}>{app.phone}</p>}
                              {isMobile && <p style={{ fontSize: "11px", color: "#71717a", margin: "2px 0 0" }}>{app.position}</p>}
                            </div>
                          </div>
                        </td>
                        {/* Position */}
                        {!isMobile && (
                          <td style={{ padding: "14px 20px" }}>
                            <p style={{ fontWeight: 500, color: "#18181b", fontSize: "13px", margin: 0 }}>{app.position}</p>
                            <p style={{ fontSize: "11px", color: "#a1a1aa", margin: "2px 0 0" }}>{app.department}</p>
                          </td>
                        )}
                        {/* Resume */}
                        {!isMobile && (
                          <td style={{ padding: "14px 20px" }}>
                            {app.resumePath ? (
                              <button onClick={() => { logUIAction("VIEW_RESUME", "Hiring_Pipeline", { applicationId: app._id, email: app.email }); openResume(app.resumePath); }} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "6px", background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
                                <FileText size={12} /> View
                              </button>
                            ) : (
                              <span style={{ fontSize: "12px", color: "#d1d5db" }}>—</span>
                            )}
                          </td>
                        )}
                        {/* Status */}
                        <td style={{ padding: sm("12px", "14px 20px") }}><StatusBadge status={app.status} /></td>
                        {/* Applied */}
                        {!isMobile && <td style={{ padding: "14px 20px", fontSize: "13px", color: "#71717a" }}>{fmtApplied(app.createdAt)}</td>}
                        {/* Actions: View + LeadActions */}
                        <td style={{ padding: sm("12px", "14px 20px"), textAlign: "right" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                            <button
                              className="view-btn"
                              onClick={() => { logUIAction("HR_CANDIDATE_VIEW", "Hiring_Pipeline", { applicationId: app._id, name: app.fullName }); setViewingCandidate(app); }}
                              title="View full application details"
                              style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: sm("5px 8px", "5px 10px"), borderRadius: "6px", background: "#f9fafb", border: "1px solid #e4e4e7", color: "#71717a", fontSize: "12px", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}
                            >
                              <Eye size={12} />
                              {!isMobile && <span>View</span>}
                            </button>
                            <LeadActions lead={app} type="job" onUpdated={fetchHiringData} />
                          </div>
                        </td>
                      </tr>
                    ))
                    : (
                      <tr><td colSpan={isMobile ? 3 : 6} style={{ padding: "32px", textAlign: "center", fontSize: "13px", color: "#a1a1aa" }}>No applications found</td></tr>
                    )
                }
              </tbody>
            </table>
          </div>

          <div style={{ padding: sm("12px 16px", "14px 24px"), borderTop: "1px solid #f4f4f5", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
            <p style={{ fontSize: "13px", color: "#a1a1aa", margin: 0, textAlign: isMobile ? "center" : "left" }}>
              Showing {(pagination.page - 1) * pagination.pageSize + 1}–{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: isMobile ? "center" : "flex-end" }}>
              <Button variant="outline" size="sm" disabled={pagination.page === 1} onClick={() => handlePageChange(pagination.page - 1)} style={{ borderRadius: "8px" }}>Previous</Button>
              <Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => handlePageChange(pagination.page + 1)} style={{ borderRadius: "8px" }}>Next</Button>
            </div>
          </div>
        </div>

        {/* ── Department Overview ── */}
        <div style={{ borderRadius: sm("16px", "24px"), border: "1px solid #dbeafe", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", padding: sm("18px 16px", "32px"), marginBottom: sm("20px", "32px") }}>
          <h3 style={{ fontSize: sm("15px", "17px"), fontWeight: 600, color: "#1e293b", display: "flex", alignItems: "center", gap: "8px", margin: "0 0 20px" }}>
            <Users size={16} color="#2563eb" /> Department Overview
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: sm("10px", "20px"), textAlign: "center" }}>
            {[
              { count: 45, label: "Engineering", bg: "#eff6ff", border: "#dbeafe", nc: "#1d4ed8", lc: "#2563eb" },
              { count: 28, label: "Marketing", bg: "#f0fdf4", border: "#dcfce7", nc: "#15803d", lc: "#16a34a" },
              { count: 32, label: "Sales", bg: "#faf5ff", border: "#f3e8ff", nc: "#7e22ce", lc: "#9333ea" },
              { count: 51, label: "Operations", bg: "#fff7ed", border: "#ffedd5", nc: "#c2410c", lc: "#ea580c" },
            ].map(({ count, label, bg, border, nc, lc }) => (
              <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: sm("14px", "20px"), padding: sm("16px 10px", "24px"), boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <h2 style={{ fontSize: sm("28px", "36px"), fontWeight: 600, color: nc, margin: 0 }}>{count}</h2>
                <p style={{ margin: sm("8px 0 0", "12px 0 0"), fontSize: sm("11px", "13px"), fontWeight: 500, color: lc }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Candidate Detail Modal ── */}
        {viewingCandidate && (
          <CandidateDetailModal
            app={viewingCandidate}
            isMobile={isMobile}
            onClose={() => setViewingCandidate(null)}
            onOpenResume={(url) => { logUIAction("VIEW_RESUME", "Hiring_Pipeline", { applicationId: viewingCandidate._id }); openResume(url); }}
          />
        )}

        {/* ── Add/Edit Job Modal ── */}
        {modalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? "0" : "16px" }} onClick={e => e.target === e.currentTarget && closeModal()}>
            <div style={{ background: "#fff", border: "1px solid #e4e4e7", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", width: "100%", maxWidth: isMobile ? "100%" : "680px", borderRadius: isMobile ? "20px 20px 0 0" : "20px", maxHeight: "92dvh", display: "flex", flexDirection: "column" }}>
              {isMobile && <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}><div style={{ width: "32px", height: "4px", borderRadius: "2px", background: "#e4e4e7" }} /></div>}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f4f4f5", flexShrink: 0 }}>
                <div>
                  <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#18181b", margin: 0 }}>{editingId ? "Edit Listing" : "New Listing"}</h2>
                  <p style={{ fontSize: "12px", color: "#a1a1aa", margin: "3px 0 0" }}>{editingId ? "Update position details." : "Publish a new job opening."}</p>
                </div>
                <button onClick={closeModal} style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", border: "none", background: "transparent", cursor: "pointer", color: "#a1a1aa" }}><X size={16} /></button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "14px" }}>
                  <div style={{ gridColumn: isMobile ? "1" : "span 2" }}>
                    <FL>Job Title <span style={{ color: "#f87171", fontWeight: 400, textTransform: "none", letterSpacing: "normal" }}>*</span></FL>
                    <FI value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior React Developer" />
                  </div>
                  <div><FL>Department</FL><FS value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</FS></div>
                  <div><FL>Job Type</FL><FS value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{JOB_TYPES.map(t => <option key={t}>{t}</option>)}</FS></div>
                  <div><FL>Location <span style={{ color: "#f87171", fontWeight: 400, textTransform: "none", letterSpacing: "normal" }}>*</span></FL><FI value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Remote or city" /></div>
                  <div><FL>Experience</FL><FI value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 2–4 years" /></div>
                  <div><FL>Salary Range</FL><FI value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="e.g. $80K – $110K" /></div>
                  <div><FL>Status</FL><FS value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="active">Active</option><option value="paused">Paused</option></FS></div>
                  <div style={{ gridColumn: isMobile ? "1" : "span 2" }}>
                    <FL>Requirements <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: "normal", color: "#a1a1aa" }}>(comma-separated)</span></FL>
                    <FI value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} placeholder="React, TypeScript, Node.js" />
                  </div>
                  <div style={{ gridColumn: isMobile ? "1" : "span 2" }}>
                    <FL>Description</FL>
                    <FTA value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the role and responsibilities…" />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", padding: "14px 20px", borderTop: "1px solid #f4f4f5", background: "#fafafa", borderRadius: isMobile ? "0" : "0 0 20px 20px", flexShrink: 0 }}>
                <button onClick={closeModal} style={{ padding: "9px 16px", borderRadius: "8px", border: "1px solid #e4e4e7", background: "#fff", color: "#52525b", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>Cancel</button>
                <button onClick={handleSaveJob} disabled={!form.title.trim() || !form.location.trim()} style={{ padding: "9px 20px", borderRadius: "8px", background: "#4f46e5", color: "#fff", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer", opacity: (!form.title.trim() || !form.location.trim()) ? 0.4 : 1 }}>
                  {editingId ? "Save Changes" : "Publish"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Delete Confirm ── */}
        {deleteConfirm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? "0" : "16px" }}>
            <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: isMobile ? "20px 20px 0 0" : "16px", padding: "20px", width: "100%", maxWidth: isMobile ? "100%" : "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
              {isMobile && <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}><div style={{ width: "32px", height: "4px", borderRadius: "2px", background: "#e4e4e7" }} /></div>}
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}><Trash2 size={16} color="#ef4444" /></div>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#18181b", margin: "0 0 6px" }}>Remove this listing?</h3>
              <p style={{ fontSize: "12px", color: "#71717a", margin: "0 0 20px", lineHeight: 1.6 }}>This job opening will be permanently deleted and cannot be recovered.</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid #e4e4e7", background: "#fff", color: "#52525b", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>Cancel</button>
                <button onClick={() => handleDeleteJob(deleteConfirm)} style={{ flex: 1, padding: "11px", borderRadius: "10px", background: "#dc2626", color: "#fff", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          </div>
        )}

      </AdminLayout>
    </RoleBasedRoute>
  );
}