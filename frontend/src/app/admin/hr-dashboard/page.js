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

// ─── Breakpoint hook ──────────────────────────────────────────────────────────
//
//  Exact tiers required:
//  ┌──────────────────┬─────────────────────────────────────────────────────┐
//  │ 320 – 374 px     │ very small mobile   (isSmallMobile)                 │
//  │ 375 – 424 px     │ mid mobile                                          │
//  │ 425 – 767 px     │ large mobile                                        │
//  │ 320 – 767 px     │ ALL mobile          (isMobile)  ← was wrong: <640   │
//  │ 768 – 1023 px    │ tablet              (isTablet)  ← was wrong: 640–1000│
//  │ 1024 – 1439 px   │ laptop              (isLaptop)                      │
//  │ 1440 px +        │ large desktop       (isLargeDesktop)                │
//  │ 1024 px +        │ laptop + desktop    (isDesktop) ← was wrong: 1000–1440│
//  └──────────────────┴─────────────────────────────────────────────────────┘
//
function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return {
    width,
    isSmallMobile:  width < 375,                      // 320–374 px
    isMidMobile:    width >= 375 && width < 425,      // 375–424 px
    isLargeMobile:  width >= 425 && width < 768,      // 425–767 px
    isMobile:       width < 768,                      // 320–767 px  ← FIXED (was < 640)
    isTablet:       width >= 768  && width < 1024,    // 768–1023 px ← FIXED (was 640–1000)
    isLaptop:       width >= 1024 && width < 1440,    // 1024–1439 px
    isLargeDesktop: width >= 1440,                    // 1440 px+
    isDesktop:      width >= 1024,                    // 1024 px+    ← FIXED (was 1000–1440)
  };
}

// ─── Job Data & Helpers ───────────────────────────────────────────────────────
const DEFAULT_JOBS = [
  { id: 1, title: "Frontend Developer",  department: "Engineering",    location: "Remote",            type: "Full-time", experience: "2–4 yrs",  salary: "$80K–$110K",  status: "active", postedDate: "2026-01-15", requirements: ["React","TypeScript","CSS/Tailwind","REST APIs"],         description: "Own the component library and lead performance work across our web app. You'll collaborate daily with design and backend to ship fast, accessible UIs." },
  { id: 2, title: "UX/UI Designer",       department: "Design",         location: "New York, NY",      type: "Full-time", experience: "2–3 yrs",  salary: "$70K–$95K",   status: "active", postedDate: "2026-01-20", requirements: ["Figma","User Research","Prototyping","Design Systems"],   description: "Shape the visual language of our product from wireframe to polished component. You'll own the design system and run regular user research sessions." },
  { id: 3, title: "Backend Engineer",     department: "Engineering",    location: "San Francisco, CA", type: "Full-time", experience: "3–5 yrs",  salary: "$100K–$140K", status: "active", postedDate: "2026-01-25", requirements: ["Node.js","PostgreSQL","Docker","AWS"],                    description: "Architect and maintain our API layer, own data modeling, and scale our infrastructure as usage grows. Strong focus on observability and reliability." },
  { id: 4, title: "Product Manager",      department: "Product",        location: "Remote",            type: "Full-time", experience: "3–6 yrs",  salary: "$90K–$130K",  status: "active", postedDate: "2026-02-01", requirements: ["Strategy","Agile","Data Analysis","Stakeholder Mgmt"],  description: "Drive the roadmap across engineering and design. You'll run discovery, write specs, and be accountable for outcomes — not just output." },
  { id: 5, title: "DevOps Engineer",      department: "Infrastructure", location: "Austin, TX",        type: "Full-time", experience: "2–4 yrs",  salary: "$95K–$125K",  status: "paused", postedDate: "2026-02-05", requirements: ["Kubernetes","Terraform","CI/CD","Linux"],                description: "Build and maintain the CI/CD pipelines, container orchestration, and cloud infrastructure. On-call rotation shared across the infra team." },
  { id: 6, title: "Data Scientist",       department: "Data",           location: "Remote",            type: "Full-time", experience: "2–5 yrs",  salary: "$90K–$120K",  status: "active", postedDate: "2026-02-10", requirements: ["Python","ML/AI","SQL","Statistics"],                     description: "Turn raw product and business data into actionable intelligence. You'll own our ML pipeline, build dashboards, and work closely with PMs." },
  { id: 7, title: "iOS Engineer",         department: "Engineering",    location: "Remote",            type: "Full-time", experience: "3–5 yrs",  salary: "$105K–$135K", status: "active", postedDate: "2026-02-12", requirements: ["Swift","SwiftUI","Xcode","CoreData"],                    description: "Build and maintain our native iOS app. You'll drive architecture decisions, mentor junior engineers, and collaborate with design on interactions." },
  { id: 8, title: "Growth Marketer",      department: "Marketing",      location: "New York, NY",      type: "Full-time", experience: "2–4 yrs",  salary: "$75K–$100K",  status: "paused", postedDate: "2026-02-14", requirements: ["SEO","Paid Ads","Analytics","A/B Testing"],              description: "Own top-of-funnel growth across paid and organic channels. You'll run experiments continuously and report directly to the Head of Marketing." },
];

const DEPARTMENTS = ["Engineering","Design","Product","Data","Infrastructure","HR","Marketing","Sales","Operations"];
const JOB_TYPES   = ["Full-time","Part-time","Contract","Internship","Freelance"];
const emptyForm   = { title:"", department:"Engineering", location:"", type:"Full-time", experience:"", salary:"", status:"active", description:"", requirements:"" };

const DEPT_COLORS = {
  Engineering:"#3b82f6", Design:"#ec4899", Product:"#8b5cf6",
  Data:"#f59e0b", Infrastructure:"#06b6d4", HR:"#14b8a6",
  Marketing:"#f43f5e", Sales:"#10b981", Operations:"#f97316",
};
const deptColor = (d) => DEPT_COLORS[d] || "#a1a1aa";
const fmtDate   = (d) => new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
const fmtShort  = (d) => new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric" });

// ─── Resume viewer helper ─────────────────────────────────────────────────────
const openResume = (url) => {
  if (!url) return;
  const cleanUrl = url.replace(/\/fl_[^\/]+\//, "/");
  const isWord   = /\.(docx|doc)$/i.test(cleanUrl);
  if (isWord) {
    window.open("https://docs.google.com/viewer?url=" + encodeURIComponent(cleanUrl) + "&embedded=true", "_blank");
  } else {
    const proxyUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/job-applications/resume-proxy?url=" + encodeURIComponent(cleanUrl);
    window.open(proxyUrl, "_blank");
  }
};

// ─── Form element helpers ─────────────────────────────────────────────────────
const inputCls = "w-full px-3 py-2.5 text-sm outline-none rounded-lg bg-zinc-50 dark:bg-[#0f172a] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all duration-150";

const FL  = ({ children })       => <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400 mb-[6px]">{children}</label>;
const FI  = (p)                  => <input    {...p} className={inputCls} />;
const FS  = ({ children, ...p }) => <select   {...p} className={inputCls} style={{ cursor:"pointer" }}>{children}</select>;
const FTA = (p)                  => <textarea {...p} rows={3} className={inputCls} style={{ resize:"none", lineHeight:"1.6" }} />;

// ─── StatusBadge ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  applied:    "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-300",
  reviewed:   "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  interview:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  offered:    "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-300",
  rejected:   "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-300",
  onboarding: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  active:     "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-300",
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  return (
    <span className={`inline-flex items-center px-2 py-[2px] rounded-full text-xs font-medium capitalize ${style}`}>
      {status}
    </span>
  );
};

// ─── Candidate Detail Modal ───────────────────────────────────────────────────
// Mobile (320–767px)  → bottom-sheet (slides up from bottom, full-width)
// Tablet+ (768px+)    → centred modal  (max-width 500px)
function CandidateDetailModal({ app, onClose, isMobile, onOpenResume }) {
  if (!app) return null;

  const Field = ({ icon: Icon, label, value }) => {
    if (!value && value !== 0) return null;
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
        <span style={{ fontSize:"10px", fontWeight:600, color:"#a1a1aa", textTransform:"uppercase", letterSpacing:"0.08em", display:"flex", alignItems:"center", gap:"4px" }}>
          <Icon size={10} color="#c4c4c8" /> {label}
        </span>
        <span style={{ fontSize:"13px", color:"#3f3f46", lineHeight:1.4 }}>{value}</span>
      </div>
    );
  };

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:60, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(3px)" }} />
      <div
        className={isMobile ? "jpanel-sheet" : "modal-desktop"}
        style={{
          position:"fixed", zIndex:61,
          ...(isMobile
            ? { bottom:0, left:0, right:0, borderRadius:"20px 20px 0 0", maxHeight:"90dvh" }
            : { top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"min(500px, 94vw)", maxHeight:"85vh", borderRadius:"16px" }
          ),
          background:"transparent", border:"1px solid #e4e4e7",
          boxShadow:"0 20px 60px rgba(0,0,0,0.18)",
          display:"flex", flexDirection:"column", overflow:"hidden",
        }}
      >
        {/* Drag handle — mobile only */}
        {isMobile && (
          <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 4px", flexShrink:0 }}>
            <div style={{ width:"32px", height:"4px", borderRadius:"2px", background:"#e4e4e7" }} />
          </div>
        )}

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #f4f4f5", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ width:"42px", height:"42px", borderRadius:"50%", background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", color:"#2563eb", fontWeight:700, fontSize:"17px", flexShrink:0 }}>
              {app.fullName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <h2 className="text-zinc-900 dark:text-white" style={{ fontSize:"15px", fontWeight:700, margin:0 }}>{app.fullName}</h2>
              <p style={{ fontSize:"12px", color:"#a1a1aa", margin:"2px 0 0" }}>{app.email}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:"30px", height:"30px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"8px", border:"none", background:"transparent", cursor:"pointer", color:"#a1a1aa" }}>
            <X size={15} />
          </button>
        </div>

        {/* Status strip */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"9px 20px", background:"#fafafa", borderBottom:"1px solid #f4f4f5", flexShrink:0 }}>
          <StatusBadge status={app.status} />
          {app.createdAt && (
            <span style={{ fontSize:"12px", color:"#a1a1aa", fontFamily:"'IBM Plex Mono',monospace" }}>
              Applied {new Date(app.createdAt).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" })}
            </span>
          )}
        </div>

        {/* Scrollable body */}
        <div style={{ flex:1, overflowY:"auto", padding:"18px 20px", display:"flex", flexDirection:"column", gap:"20px" }}>

          {/* Contact & Position */}
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, color:"#c4c4c8", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 12px", display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ flex:1, height:"1px", background:"#f4f4f5" }} />Contact & Position<span style={{ flex:1, height:"1px", background:"#f4f4f5" }} />
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px 20px" }}>
              <Field icon={Phone}     label="Phone"      value={app.phone}      />
              <Field icon={Briefcase} label="Position"   value={app.position}   />
              {app.department && <Field icon={Users}  label="Department" value={app.department} />}
              <Field icon={Globe}     label="Source"     value={app.source}     />
            </div>
          </div>

          {/* Professional Details */}
          {(app.experience || app.currentCompany || app.expectedSalary || app.noticePeriod) && (
            <div>
              <p style={{ fontSize:"10px", fontWeight:700, color:"#c4c4c8", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 12px", display:"flex", alignItems:"center", gap:"8px" }}>
                <span style={{ flex:1, height:"1px", background:"#f4f4f5" }} />Professional Details<span style={{ flex:1, height:"1px", background:"#f4f4f5" }} />
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px 20px" }}>
                <Field icon={Award}      label="Experience"       value={app.experience}     />
                <Field icon={Building2}  label="Current Company"  value={app.currentCompany} />
                <Field icon={DollarSign} label="Expected Salary"  value={app.expectedSalary ? (typeof app.expectedSalary === "number" ? `₹${Number(app.expectedSalary).toLocaleString()}` : app.expectedSalary) : null} />
                <Field icon={Clock}      label="Notice Period"    value={app.noticePeriod}   />
              </div>
            </div>
          )}

          {/* Cover Letter */}
          {app.coverLetter && (
            <div>
              <p style={{ fontSize:"10px", fontWeight:700, color:"#c4c4c8", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 10px", display:"flex", alignItems:"center", gap:"8px" }}>
                <span style={{ flex:1, height:"1px", background:"#f4f4f5" }} />Cover Letter<span style={{ flex:1, height:"1px", background:"#f4f4f5" }} />
              </p>
              <p style={{ fontSize:"13px", color:"#52525b", lineHeight:1.7, margin:0, background:"#fafafa", padding:"12px 14px", borderRadius:"10px", border:"1px solid #f4f4f5" }}>
                {app.coverLetter}
              </p>
            </div>
          )}

          {/* Resume */}
          {app.resumePath && (
            <div>
              <p style={{ fontSize:"10px", fontWeight:700, color:"#c4c4c8", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 10px", display:"flex", alignItems:"center", gap:"8px" }}>
                <span style={{ flex:1, height:"1px", background:"#f4f4f5" }} />Resume<span style={{ flex:1, height:"1px", background:"#f4f4f5" }} />
              </p>
              <button
                onClick={() => onOpenResume(app.resumePath)}
                style={{ display:"inline-flex", alignItems:"center", gap:"7px", padding:"9px 16px", borderRadius:"8px", background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1d4ed8", fontSize:"13px", fontWeight:600, cursor:"pointer" }}
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
// Reused as sticky side-panel on desktop AND bottom-sheet content on mobile/tablet
function JobDetailPanel({ selected, onClose, onEdit, onDelete, scrollable }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>

      {/* Panel header */}
      <div style={{ padding:"12px 16px", borderBottom:"1px solid #f4f4f5", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"8px", flexShrink:0 }}>
        <div style={{ minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"4px" }}>
            <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:deptColor(selected.department), flexShrink:0 }} />
            <span style={{ fontSize:"11px", color:"#a1a1aa", fontWeight:500 }}>{selected.department}</span>
          </div>
          <h2 className="text-zinc-900 dark:text-white" style={{ fontSize:"14px", fontWeight:700, lineHeight:1.3, margin:0 }}>{selected.title}</h2>
        </div>
        <button onClick={onClose} style={{ flexShrink:0, width:"28px", height:"28px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"8px", border:"none", background:"transparent", cursor:"pointer", color:"#a1a1aa" }}>
          <X size={14} />
        </button>
      </div>

      {/* Panel body */}
      <div style={{ flex:1, overflowY:scrollable ? "auto" : "visible" }}>

        {/* Metadata grid */}
        <div style={{ padding:"12px 16px", borderBottom:"1px solid #f4f4f5", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
          {[
            { Icon:MapPin,     label:"Location",   val:selected.location   },
            { Icon:Timer,      label:"Type",        val:selected.type       },
            { Icon:Award,      label:"Experience",  val:selected.experience },
            { Icon:DollarSign, label:"Salary",      val:selected.salary     },
          ].filter(r => r.val).map(({ Icon, label, val }) => (
            <div key={label}>
              <p style={{ fontSize:"10px", color:"#a1a1aa", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 2px" }}>{label}</p>
              <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                <Icon size={11} color="#d4d4d8" style={{ flexShrink:0 }} />
                <span style={{ fontSize:"12px", color:"#3f3f46", fontFamily:"'IBM Plex Mono',monospace" }}>{val}</span>
              </div>
            </div>
          ))}
          <div style={{ gridColumn:"span 2" }}>
            <p style={{ fontSize:"10px", color:"#a1a1aa", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 2px" }}>Posted</p>
            <span style={{ fontSize:"12px", color:"#3f3f46", fontFamily:"'IBM Plex Mono',monospace" }}>{fmtDate(selected.postedDate)}</span>
          </div>
        </div>

        {/* Description */}
        {selected.description && (
          <div style={{ padding:"12px 16px", borderBottom:"1px solid #f4f4f5" }}>
            <p style={{ fontSize:"10px", color:"#a1a1aa", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 6px" }}>About the role</p>
            <p style={{ fontSize:"12px", color:"#52525b", lineHeight:1.6, margin:0 }}>{selected.description}</p>
          </div>
        )}

        {/* Requirements */}
        {selected.requirements?.length > 0 && (
          <div style={{ padding:"12px 16px", borderBottom:"1px solid #f4f4f5" }}>
            <p style={{ fontSize:"10px", color:"#a1a1aa", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 8px" }}>Requirements</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
              {selected.requirements.map(r => (
                <span key={r} style={{ fontSize:"11px", padding:"2px 8px", borderRadius:"6px", background:"#f4f4f5", color:"#52525b", border:"1px solid #e4e4e7", fontFamily:"'IBM Plex Mono',monospace" }}>{r}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Panel footer */}
      <div style={{ padding:"12px 16px", display:"flex", gap:"8px", flexShrink:0, borderTop:"1px solid #f4f4f5", background:"#fff" }}>
        <button onClick={() => onEdit(selected)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", padding:"10px", borderRadius:"8px", background:"#4f46e5", color:"#fff", border:"none", cursor:"pointer", fontSize:"12px", fontWeight:600 }}>
          <Edit2 size={12} /> Edit
        </button>
        <button onClick={() => onDelete(selected.id)} className="text-zinc-600 dark:text-zinc-400" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", padding:"10px 14px", borderRadius:"8px", background:"transparent", border:"1px solid #e4e4e7", cursor:"pointer", fontSize:"12px", fontWeight:600 }}>
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Mobile + Tablet Job Card (320–1023px) ────────────────────────────────────
function MobileJobCard({ job, isSelected, onSelect, onToggleStatus, onEdit, onDelete }) {
  return (
    <div style={{ padding:"14px 16px", borderBottom:"1px solid #f4f4f5", borderLeft:isSelected ? "3px solid #4f46e5" : "3px solid transparent", background:isSelected ? "#eef2ff" : "#fff", cursor:"pointer" }}>

      {/* Top row */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"8px" }} onClick={() => onSelect(job)}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:"10px", minWidth:0 }}>
          <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:deptColor(job.department), flexShrink:0, marginTop:"5px" }} />
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:"14px", fontWeight:600, color:isSelected ? "#4338ca" : "#18181b", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{job.title}</p>
            <p style={{ fontSize:"12px", color:"#a1a1aa", margin:"2px 0 6px" }}>{job.department} · {job.type}</p>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap" }}>
              {job.location && <span className="text-zinc-600 dark:text-zinc-400" style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"12px", fontFamily:"'IBM Plex Mono',monospace" }}><MapPin size={11} color="#d4d4d8" />{job.location}</span>}
              {job.salary   && <span className="text-zinc-600 dark:text-zinc-400" style={{ fontSize:"12px", fontFamily:"'IBM Plex Mono',monospace" }}>{job.salary}</span>}
            </div>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"6px", flexShrink:0 }}>
          <button onClick={e => { e.stopPropagation(); onToggleStatus(job.id); }} style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"2px 8px", borderRadius:"6px", fontSize:"10px", fontWeight:600, border:job.status === "active" ? "1px solid #bbf7d0" : "1px solid #e4e4e7", background:job.status === "active" ? "#f0fdf4" : "#f4f4f5", color:job.status === "active" ? "#15803d" : "#71717a", cursor:"pointer" }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:job.status === "active" ? "#22c55e" : "#a1a1aa" }} />
            {job.status === "active" ? "Live" : "Off"}
          </button>
          <span style={{ fontSize:"11px", color:"#a1a1aa", fontFamily:"'IBM Plex Mono',monospace" }}>{fmtShort(job.postedDate)}</span>
        </div>
      </div>

      {/* Action row */}
      <div style={{ display:"flex", gap:"8px", marginTop:"10px", paddingTop:"10px", borderTop:"1px solid #f4f4f5" }}>
        <button onClick={e => { e.stopPropagation(); onEdit(job); }} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:"5px", padding:"8px", borderRadius:"8px", background:"#eef2ff", color:"#4f46e5", border:"none", cursor:"pointer", fontSize:"12px", fontWeight:600 }}>
          <Edit2 size={11} /> Edit
        </button>
        <button onClick={e => { e.stopPropagation(); onDelete(job.id); }} className="text-zinc-600 dark:text-zinc-400" style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"8px 12px", borderRadius:"8px", background:"transparent", border:"1px solid #e4e4e7", cursor:"pointer" }}>
          <Trash2 size={12} />
        </button>
        <button onClick={e => { e.stopPropagation(); onSelect(job); }} className="text-zinc-600 dark:text-zinc-400" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"4px", padding:"8px 10px", borderRadius:"8px", background:"transparent", border:"1px solid #e4e4e7", cursor:"pointer", fontSize:"12px", fontWeight:600, flexShrink:0 }}>
          Details <ChevronRight size={12} style={{ transform:isSelected ? "rotate(90deg)" : "none" }} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HRDashboard() {
  const bp = useBreakpoint();
  const { isMobile, isTablet, isDesktop, isLargeDesktop, isSmallMobile, width } = bp;

  // ── Hiring Pipeline state ───────────────────────────────────────────────────
  const [searchTerm,       setSearchTerm]       = useState("");
  const [hiringData,       setHiringData]       = useState([]);
  const [loadingPipeline,  setLoadingPipeline]  = useState(true);
  const [pagination,       setPagination]       = useState({ page:1, pageSize:5, total:0, totalPages:1 });
  const [viewingCandidate, setViewingCandidate] = useState(null);

  const fetchHiringData = async () => {
    try {
      setLoadingPipeline(true);
      const url  = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job-applications?page=${pagination.page}&pageSize=${pagination.pageSize}`;
      const res  = await fetch(url, { headers:{ "Content-Type":"application/json", Accept:"application/json" }, credentials:"include" });
      const data = await res.json();
      if (res.ok && data.success) {
        setHiringData(data.items || []);
        setPagination(p => ({ ...p, total:data.total || 0, totalPages:data.totalPages || 1 }));
      } else setHiringData([]);
    } catch { setHiringData([]); }
    finally { setLoadingPipeline(false); }
  };

  useEffect(() => { fetchHiringData(); }, [pagination.page]);

  const handlePageChange = (n) => {
    if (n > 0 && n <= pagination.totalPages) {
      logUIAction("HR_PIPELINE_PAGINATE","Hiring_Pipeline",{ from:pagination.page, to:n });
      setPagination(p => ({ ...p, page:n }));
    }
  };

  const fmtApplied = (d) => d ? new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" }) : "N/A";

  // ── Job Openings state ──────────────────────────────────────────────────────
  const [jobs,          setJobs]          = useState([]);
  const [jobSearch,     setJobSearch]     = useState("");
  const [filterDept,    setFilterDept]    = useState("All");
  const [filterStatus,  setFilterStatus]  = useState("All");
  const [selected,      setSelected]      = useState(null);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [editingId,     setEditingId]     = useState(null);
  const [form,          setForm]          = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast,         setToast]         = useState(null);
  const [sortDir,       setSortDir]       = useState("desc");
  const [showFilters,   setShowFilters]   = useState(false);
  const jobSearchRef = useRef(null);

  useEffect(() => {
    const s = localStorage.getItem("admin_job_openings");
    setJobs(s ? JSON.parse(s) : DEFAULT_JOBS);
    trackPage("/admin/hr-dashboard","auto");
    logUIAction("HR_PAGE_OPEN","HR_Dashboard");
  }, []);

  const persistJobs = (u)              => { setJobs(u); localStorage.setItem("admin_job_openings", JSON.stringify(u)); };
  const showToast   = (msg, type="success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const jobDepts = ["All", ...Array.from(new Set(jobs.map(j => j.department)))];

  const filteredJobs = jobs
    .filter(j => {
      const q = jobSearch.toLowerCase();
      return (
        (!q || j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q) || j.location?.toLowerCase().includes(q)) &&
        (filterDept   === "All" || j.department === filterDept) &&
        (filterStatus === "All" || j.status     === filterStatus)
      );
    })
    .sort((a,b) => sortDir === "desc"
      ? new Date(b.postedDate) - new Date(a.postedDate)
      : new Date(a.postedDate) - new Date(b.postedDate)
    );

  useEffect(() => { if (selected) setSelected(jobs.find(j => j.id === selected.id) || null); }, [jobs]);

  const openAdd  = () => { logUIAction("HR_NEW_LISTING_OPEN","Job_Openings"); setEditingId(null); setForm({ ...emptyForm }); setModalOpen(true); };
  const openEdit = (job) => {
    logUIAction("HR_JOB_EDIT_OPEN","Job_Openings",{ jobId:job.id, title:job.title });
    setEditingId(job.id);
    setForm({ ...job, requirements:Array.isArray(job.requirements) ? job.requirements.join(", ") : job.requirements || "" });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  const handleSaveJob = () => {
    if (!form.title.trim() || !form.location.trim()) return;
    const reqs   = form.requirements ? form.requirements.split(",").map(r => r.trim()).filter(Boolean) : [];
    const isEdit = !!editingId;
    logUIAction(isEdit ? "HR_JOB_UPDATE" : "HR_JOB_CREATE","Job_Openings",{ jobId:editingId || "new", title:form.title, department:form.department, status:form.status });
    if (editingId) {
      persistJobs(jobs.map(j => j.id === editingId ? { ...j, ...form, requirements:reqs } : j));
      showToast("Job updated.");
    } else {
      persistJobs([...jobs, { ...form, id:Date.now(), requirements:reqs, postedDate:new Date().toISOString().split("T")[0] }]);
      showToast("Listing published.");
    }
    closeModal();
  };

  const handleDeleteJob = (id) => {
    const job = jobs.find(j => j.id === id);
    logUIAction("HR_JOB_DELETE","Job_Openings",{ jobId:id, title:job?.title });
    if (selected?.id === id) setSelected(null);
    persistJobs(jobs.filter(j => j.id !== id));
    setDeleteConfirm(null);
    showToast("Listing removed.","error");
  };

  const toggleJobStatus = (id) => {
    const job        = jobs.find(j => j.id === id);
    const nextStatus = job?.status === "active" ? "paused" : "active";
    logUIAction("HR_JOB_STATUS_TOGGLE","Job_Openings",{ jobId:id, from:job?.status, to:nextStatus });
    persistJobs(jobs.map(j => j.id === id ? { ...j, status:nextStatus } : j));
  };

  const handleSelectJob = (job) => {
    const isClosing = selected?.id === job?.id;
    logUIAction(isClosing ? "HR_JOB_CLOSE" : "HR_JOB_VIEW","Job_Openings",{ jobId:job?.id, title:job?.title });
    setSelected(prev => prev?.id === job?.id ? null : job);
  };

  const panelOpen = !!selected && isDesktop;

  const jobStats = {
    total:  jobs.length,
    active: jobs.filter(j => j.status === "active").length,
    paused: jobs.filter(j => j.status === "paused").length,
  };
  const hrStats = { totalEmployees:156, newHires:12, openPositions:jobStats.active, avgRetention:"92%" };

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <RoleBasedRoute allowedRoles={["hr_mode","super_admin"]}>
      <AdminLayout title="HR Dashboard" description="Manage employees, recruitment, performance, and HR operations.">

        {/* ── Animations ───────────────────────────────────────────────── */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
          @keyframes pulse    { 0%,100%{opacity:1}   50%{opacity:.4} }
          @keyframes jSlideIn { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
          @keyframes jSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
          @keyframes jRowIn   { from{opacity:0;transform:translateY(4px)}  to{opacity:1;transform:translateY(0)} }
          @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes modalIn  { from{opacity:0;transform:translate(-50%,-46%) scale(0.96)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
          .jpanel-side   { animation: jSlideIn 0.2s  ease forwards; }
          .jpanel-sheet  { animation: jSlideUp 0.22s ease forwards; }
          .jrow          { animation: jRowIn   0.15s ease forwards; }
          .modal-desktop { animation: modalIn  0.18s ease forwards; }
          * { box-sizing: border-box; }
          button { transition: opacity 0.15s, transform 0.1s; }
          button:active { transform: scale(0.97); }
          .view-btn:hover { background:#eff6ff !important; border-color:#bfdbfe !important; color:#1d4ed8 !important; }
        `}</style>

        {/* ── Toast ────────────────────────────────────────────────────── */}
        {toast && (
          <div style={{
            position:"fixed", zIndex:9999,
            // Mobile: bottom toast so it doesn't cover header
            // Desktop: top-right corner
            top:    isMobile ? "auto"  : "12px",
            bottom: isMobile ? "80px"  : "auto",
            right:  "12px",
            left:   isMobile ? "12px"  : "auto",
            display:"flex", alignItems:"center", gap:"10px",
            padding:"10px 16px", borderRadius:"12px",
            background:"transparent",
            border: toast.type === "error" ? "1px solid #fecaca" : "1px solid #e4e4e7",
            color:  toast.type === "error" ? "#dc2626" : "#18181b",
            fontSize:"14px", fontWeight:500,
            boxShadow:"0 4px 24px rgba(0,0,0,0.10)",
          }}>
            <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:toast.type === "error" ? "#ef4444" : "#6366f1", flexShrink:0 }} />
            {toast.msg}
          </div>
        )}

        {/*
          ════════════════════════════════════════════════════════════════
          OUTER WRAPPER — padding scales across all 6 breakpoint tiers

          320–374px  → px 12  py 12
          375–424px  → px 12  py 16
          425–767px  → px 16  py 16
          768–1023px → px 20  py 20   (tablet)
          1024–1439px→ px 24  py 24   (laptop)
          1440px+    → px 32  py 24   (large desktop)

          FIX: original code had NO outer padding at all.
          ════════════════════════════════════════════════════════════════
        */}
        <div style={{
          paddingLeft:   width < 375 ? "12px" : width < 425 ? "12px" : width < 768 ? "16px" : width < 1024 ? "20px" : width < 1440 ? "24px" : "32px",
          paddingRight:  width < 375 ? "12px" : width < 425 ? "12px" : width < 768 ? "16px" : width < 1024 ? "20px" : width < 1440 ? "24px" : "32px",
          paddingTop:    width < 375 ? "12px" : width < 768 ? "16px" : "24px",
          paddingBottom: "24px",
        }}>

          {/*
            ══════════════════════════════════════════════════════════════
            STATS CARDS
            ┌──────────────┬──────────────────────────────────────────┐
            │ 320–767px    │ 2 × 2 grid                               │
            │ 768–1023px   │ 2 × 2 grid (tablet, wider gap)           │
            │ 1024px+      │ 1 × 4 row  (laptop / desktop)            │
            └──────────────┴──────────────────────────────────────────┘
            Card padding, icon size, font size all scale per tier.
            FIX: original used only sm() → 2 tiers. Now 6 tiers.
            ══════════════════════════════════════════════════════════════
          */}
          <div style={{
            display:             "grid",
            gridTemplateColumns: isDesktop ? "repeat(4,1fr)" : "1fr 1fr",
            gap:           width < 375 ? "10px" : width < 768 ? "12px" : width < 1024 ? "16px" : "24px",
            marginBottom:  width < 768 ? "20px" : width < 1024 ? "28px" : "40px",
          }}>
            {[
              { Icon:Users,    label:"Total Employees", val:hrStats.totalEmployees, bg:"#eff6ff", iconBg:"#dbeafe", ic:"#2563eb", vc:"#1d4ed8" },
              { Icon:UserCheck,label:"New Hires",        val:hrStats.newHires,       bg:"#f0fdf4", iconBg:"#dcfce7", ic:"#16a34a", vc:"#15803d" },
              { Icon:Briefcase,label:"Open Positions",   val:hrStats.openPositions,  bg:"#faf5ff", iconBg:"#f3e8ff", ic:"#9333ea", vc:"#7e22ce" },
              { Icon:Target,   label:"Retention Rate",  val:hrStats.avgRetention,   bg:"#fff7ed", iconBg:"#ffedd5", ic:"#ea580c", vc:"#c2410c" },
            ].map(({ Icon, label, val, bg, iconBg, ic, vc }) => (
              <div key={label} style={{
                background:   bg,
                border:       "1px solid rgba(0,0,0,0.05)",
                borderRadius: width < 375 ? "12px" : width < 768 ? "16px" : "24px",
                // Padding per tier: 320 / 375–424 / 425–767 / 768–1023 / 1024+
                padding:      width < 375 ? "12px 12px" : width < 425 ? "14px 14px" : width < 768 ? "16px 16px" : width < 1024 ? "20px" : "28px",
                boxShadow:    "0 2px 12px rgba(0,0,0,0.05)",
              }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ background:iconBg, padding:width < 768 ? "10px" : "14px", borderRadius:"14px" }}>
                    <Icon size={width < 375 ? 16 : width < 768 ? 18 : 22} color={ic} />
                  </div>
                  <span style={{ fontSize:width < 375 ? "22px" : width < 425 ? "24px" : width < 768 ? "28px" : "36px", fontWeight:600, color:vc }}>{val}</span>
                </div>
                <p style={{
                  marginTop:    width < 375 ? "10px" : width < 768 ? "14px" : "22px",
                  fontSize:     width < 375 ? "10px" : width < 425 ? "11px" : width < 768 ? "12px" : "13px",
                  fontWeight:   500,
                  color:        ic,
                  marginBottom: 0,
                }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/*
            ══════════════════════════════════════════════════════════════
            JOB OPENINGS CARD
            ══════════════════════════════════════════════════════════════
          */}
          <div
            className="bg-white dark:bg-gray-800 border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden"
            style={{
              borderRadius: width < 768 ? "14px" : "20px",
              marginBottom: width < 768 ? "18px" : "32px",
            }}
          >

            {/* ── Card Header ──────────────────────────────────────── */}
            <div style={{
              // Padding: 320 / mobile / tablet / laptop+
              padding:      width < 375 ? "12px 12px" : width < 768 ? "14px 16px" : width < 1024 ? "16px 20px" : "20px 24px",
              borderBottom: "1px solid #f4f4f5",
            }}>

              {/* Title + stats pills */}
              <div style={{
                display:        "flex",
                flexDirection:  isMobile ? "column" : "row",
                alignItems:     isMobile ? "flex-start" : "center",
                justifyContent: "space-between",
                gap:            "12px",
                flexWrap:       "wrap",
              }}>
                <div style={{ minWidth:0 }}>
                  <h3
                    className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white"
                    style={{ fontSize:width < 768 ? "15px" : "17px", margin:0 }}
                  >
                    <Briefcase size={16} color="#4f46e5" />
                    Job Openings
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize:"12px", margin:"4px 0 0" }}>
                    Manage active job listings and hiring positions
                  </p>
                </div>

                {/* Stats pills */}
                <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", alignItems:"center" }}>
                  {[
                    { label:"Total",  val:jobStats.total,  accent:false },
                    { label:"Active", val:jobStats.active, accent:true  },
                    { label:"Paused", val:jobStats.paused, accent:false },
                  ].map(({ label, val, accent }) => (
                    <div key={label} style={{
                      display:"flex", alignItems:"center", gap:"6px",
                      padding:"5px 10px", borderRadius:"8px",
                      border:     accent ? "1px solid #c7d2fe" : "1px solid #e4e4e7",
                      background: accent ? "#eef2ff" : "#f9f9f9",
                      fontSize:   "12px",
                    }}>
                      <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontWeight:500, fontSize:"13px", color:accent ? "#4f46e5" : "#18181b" }}>
                        {String(val).padStart(2,"0")}
                      </span>
                      <span style={{ color:"#a1a1aa" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search + Filters */}
              <div style={{ marginTop:"12px", display:"flex", flexDirection:"column", gap:"8px" }}>

                {/* Search — full width at every breakpoint */}
                <div style={{ display:"flex", alignItems:"center", gap:"8px", border:"1px solid #e4e4e7", borderRadius:"10px", padding:"8px 12px", width:"100%" }}>
                  <Search size={14} color="#a1a1aa" style={{ flexShrink:0 }} />
                  <input
                    ref={jobSearchRef}
                    value={jobSearch}
                    onChange={e => { setJobSearch(e.target.value); logUIAction("HR_JOB_SEARCH","Job_Openings",{ query:e.target.value }); }}
                    placeholder="Search title, department, location…"
                    className="flex-1 bg-transparent border-none outline-none text-zinc-800 dark:text-zinc-100"
                    style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:width < 375 ? "13px" : "14px", minWidth:0 }}
                  />
                  {jobSearch && (
                    <button onClick={() => { setJobSearch(""); jobSearchRef.current?.focus(); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#a1a1aa", padding:0, display:"flex" }}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Controls row */}
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", alignItems:"center" }}>

                  {/*
                    MOBILE (320–767px): collapsed "Filters" toggle.
                    Dept/status selects revealed below when tapped.
                  */}
                  {isMobile && (
                    <button
                      onClick={() => setShowFilters(f => !f)}
                      style={{ flex:"1 1 auto", display:"flex", alignItems:"center", gap:"6px", background:"transparent", border:"1px solid #e4e4e7", borderRadius:"10px", padding:"8px 12px", fontSize:"13px", color:"#52525b", cursor:"pointer" }}
                    >
                      <SlidersHorizontal size={13} color="#a1a1aa" />
                      Filters
                      <ChevronDown size={13} color="#a1a1aa" style={{ marginLeft:"auto", transform:showFilters ? "rotate(180deg)" : "none", transition:"transform 0.2s" }} />
                    </button>
                  )}

                  {/*
                    TABLET (768–1023px) + LAPTOP/DESKTOP (1024px+):
                    Inline selects always visible.
                  */}
                  {!isMobile && (
                    <>
                      <div style={{ display:"flex", alignItems:"center", gap:"6px", border:"1px solid #e4e4e7", borderRadius:"10px", padding: isTablet ? "7px 10px" : "6px 12px" }}>
                        <SlidersHorizontal size={13} color="#a1a1aa" />
                        <select value={filterDept} onChange={e => { setFilterDept(e.target.value); logUIAction("HR_JOB_FILTER_DEPT","Job_Openings",{ department:e.target.value }); }} style={{ background:"transparent", border:"none", outline:"none", fontSize:"13px", color:"#52525b", cursor:"pointer" }}>
                          {jobDepts.map(d => <option key={d}>{d}</option>)}
                        </select>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", border:"1px solid #e4e4e7", borderRadius:"10px", padding: isTablet ? "7px 10px" : "6px 12px" }}>
                        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); logUIAction("HR_JOB_FILTER_STATUS","Job_Openings",{ status:e.target.value }); }} style={{ background:"transparent", border:"none", outline:"none", fontSize:"13px", color:"#52525b", cursor:"pointer" }}>
                          <option value="All">All Status</option>
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* New Listing button — every breakpoint */}
                  <button
                    onClick={openAdd}
                    style={{ display:"flex", alignItems:"center", gap:"6px", padding:width < 375 ? "7px 10px" : "8px 14px", background:"#4f46e5", color:"#fff", border:"none", borderRadius:"10px", fontSize:"13px", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}
                  >
                    <Plus size={14} />
                    {isMobile ? "New" : "New Listing"}
                  </button>
                </div>

                {/* Mobile expanded filter panel */}
                {isMobile && showFilters && (
                  <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                    <div style={{ flex:1, display:"flex", alignItems:"center", gap:"6px", border:"1px solid #e4e4e7", borderRadius:"10px", padding:"8px 12px" }}>
                      <SlidersHorizontal size={13} color="#a1a1aa" />
                      <select value={filterDept} onChange={e => { setFilterDept(e.target.value); logUIAction("HR_JOB_FILTER_DEPT","Job_Openings",{ department:e.target.value }); }} style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"13px", color:"#52525b" }}>
                        {jobDepts.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div style={{ flex:1, display:"flex", alignItems:"center", border:"1px solid #e4e4e7", borderRadius:"10px", padding:"8px 12px" }}>
                      <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); logUIAction("HR_JOB_FILTER_STATUS","Job_Openings",{ status:e.target.value }); }} style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"13px", color:"#52525b" }}>
                        <option value="All">All Status</option>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Job List Area ─────────────────────────────────────── */}
            <div style={{
              display:    "flex",
              gap:        "16px",
              padding:    isDesktop ? "16px" : "0",
              alignItems: "flex-start",
              flexWrap:   isDesktop ? "nowrap" : "wrap",
            }}>

              {/* MOBILE + TABLET card list (320–1023px) */}
              {!isDesktop && (
                <div style={{ flex:1, minWidth:0 }}>
                  {filteredJobs.length === 0 ? (
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 16px", gap:"10px" }}>
                      <Briefcase size={20} color="#a1a1aa" />
                      <p className="text-zinc-600 dark:text-zinc-400" style={{ fontSize:"13px", margin:0 }}>No listings found</p>
                      <button onClick={openAdd} style={{ fontSize:"13px", fontWeight:600, color:"#4f46e5", background:"none", border:"none", cursor:"pointer" }}>+ New listing</button>
                    </div>
                  ) : filteredJobs.map((job, i) => (
                    <div key={job.id} className="jrow" style={{ animationDelay:`${i * 0.03}s` }}>
                      <MobileJobCard
                        job={job}
                        isSelected={selected?.id === job.id}
                        onSelect={handleSelectJob}
                        onToggleStatus={toggleJobStatus}
                        onEdit={openEdit}
                        onDelete={(id) => setDeleteConfirm(id)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/*
                DESKTOP TABLE ROWS (1024px+)
                FIX: original only rendered the Role column.
                Now renders all 6 columns:
                  Role | Location | Salary | Experience | Status | Actions
                Grid adjusts when side panel is open (panelOpen):
                  Panel open   → 3 cols (role | status | actions)
                  Panel closed + 1024–1279px → 6 cols, narrower
                  Panel closed + 1280–1439px → 6 cols, wider
                  Panel closed + 1440px+     → 6 cols, widest
                FIX className: was "bg-white dark-bg-gray-800"
                               now "bg-white dark:bg-gray-800"
              */}
              {isDesktop && (
                <div className="bg-white dark:bg-gray-800" style={{
                  flex:1, minWidth:0,
                  border:"1px solid #e4e4e7", borderRadius:"12px", overflow:"hidden",
                }}>
                  {filteredJobs.length === 0 ? (
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 24px", gap:"10px" }}>
                      <Briefcase size={22} color="#a1a1aa" />
                      <p className="text-zinc-600 dark:text-zinc-400" style={{ fontSize:"14px", margin:0 }}>No listings found</p>
                      <button onClick={openAdd} style={{ fontSize:"13px", fontWeight:600, color:"#4f46e5", background:"none", border:"none", cursor:"pointer" }}>+ New listing</button>
                    </div>
                  ) : filteredJobs.map((job, i) => {
                    const isSel = selected?.id === job.id;
                    return (
                      <div key={job.id} className="jrow" style={{ animationDelay:`${i * 0.03}s` }}>
                        <div
                          onClick={() => setSelected(isSel ? null : job)}
                          style={{
                            display: "grid",
                            gridTemplateColumns: panelOpen
                              ? "1fr 80px 72px"
                              : width < 1280
                                ? "1fr 110px 100px 88px 70px 68px"
                                : "1fr 140px 120px 90px 80px 72px",
                            gap:          "12px",
                            padding:      "12px 16px",
                            borderBottom: "1px solid #f4f4f5",
                            cursor:       "pointer",
                            background:   isSel ? "#eef2ff" : "transparent",
                            borderLeft:   isSel ? "3px solid #4f46e5" : "3px solid transparent",
                            transition:   "background 0.15s",
                          }}
                        >
                          {/* Role — always shown */}
                          <div style={{ display:"flex", alignItems:"center", gap:"10px", minWidth:0 }}>
                            <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:deptColor(job.department), flexShrink:0 }} />
                            <div style={{ minWidth:0 }}>
                              <p style={{ fontSize:"13px", fontWeight:600, margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", color:isSel ? "#4338ca" : "#18181b" }}>
                                {job.title}
                              </p>
                              <p style={{ fontSize:"11px", color:"#a1a1aa", margin:"1px 0 0" }}>
                                {job.department} · {job.type}
                              </p>
                            </div>
                          </div>

                          {/* Additional columns — only when panel is closed */}
                          {!panelOpen && (
                            <>
                              {/* Location */}
                              <div style={{ display:"flex", alignItems:"center", gap:"4px", minWidth:0 }}>
                                <MapPin size={11} color="#d4d4d8" style={{ flexShrink:0 }} />
                                <span style={{ fontSize:"12px", color:"#52525b", fontFamily:"'IBM Plex Mono',monospace", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{job.location}</span>
                              </div>
                              {/* Salary */}
                              <span style={{ fontSize:"12px", color:"#52525b", fontFamily:"'IBM Plex Mono',monospace", display:"flex", alignItems:"center" }}>{job.salary}</span>
                              {/* Experience */}
                              <span style={{ fontSize:"12px", color:"#52525b", fontFamily:"'IBM Plex Mono',monospace", display:"flex", alignItems:"center" }}>{job.experience}</span>
                              {/* Status toggle */}
                              <div style={{ display:"flex", alignItems:"center" }}>
                                <button
                                  onClick={e => { e.stopPropagation(); toggleJobStatus(job.id); }}
                                  style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"2px 8px", borderRadius:"6px", fontSize:"10px", fontWeight:600, border:job.status === "active" ? "1px solid #bbf7d0" : "1px solid #e4e4e7", background:job.status === "active" ? "#f0fdf4" : "#f4f4f5", color:job.status === "active" ? "#15803d" : "#71717a", cursor:"pointer" }}
                                >
                                  <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:job.status === "active" ? "#22c55e" : "#a1a1aa" }} />
                                  {job.status === "active" ? "Live" : "Off"}
                                </button>
                              </div>
                              {/* Edit + Delete */}
                              <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:"6px" }}>
                                <button onClick={e => { e.stopPropagation(); openEdit(job); }} style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"6px", borderRadius:"7px", background:"#eef2ff", color:"#4f46e5", border:"none", cursor:"pointer" }}>
                                  <Edit2 size={12} />
                                </button>
                                <button onClick={e => { e.stopPropagation(); setDeleteConfirm(job.id); }} className="text-zinc-500" style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"6px", borderRadius:"7px", background:"transparent", border:"1px solid #e4e4e7", cursor:"pointer" }}>
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* DESKTOP sticky side panel (1024px+) */}
              {isDesktop && selected && (
                <div className="jpanel-side" style={{
                  // Width per tier: 1024–1279 / 1280–1439 / 1440+
                  width:      width < 1280 ? "240px" : width < 1440 ? "260px" : "300px",
                  flexShrink: 0,
                  border:     "1px solid #e4e4e7", borderRadius:"12px",
                  overflow:   "hidden", position:"sticky", top:"16px",
                }}>
                  <JobDetailPanel selected={selected} onClose={() => setSelected(null)} onEdit={openEdit} onDelete={(id) => setDeleteConfirm(id)} scrollable={false} />
                </div>
              )}
            </div>
          </div>

          {/* Mobile + Tablet bottom-sheet for job detail */}
          {!isDesktop && selected && (
            <>
              <div onClick={() => setSelected(null)} style={{ position:"fixed", inset:0, zIndex:40, background:"rgba(0,0,0,0.3)", backdropFilter:"blur(2px)" }} />
              <div className="jpanel-sheet" style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:50, background:"transparent", borderRadius:"20px 20px 0 0", border:"1px solid #e4e4e7", boxShadow:"0 -8px 40px rgba(0,0,0,0.15)", maxHeight:"85dvh", display:"flex", flexDirection:"column" }}>
                <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 4px", flexShrink:0 }}>
                  <div style={{ width:"32px", height:"4px", borderRadius:"2px", background:"#e4e4e7" }} />
                </div>
                <JobDetailPanel selected={selected} onClose={() => setSelected(null)} onEdit={openEdit} onDelete={(id) => setDeleteConfirm(id)} scrollable={true} />
              </div>
            </>
          )}

          {/*
            ════════════════════════════════════════════════════════════════
            HIRING PIPELINE
            FIX: removed mx-3 sm:mx-4 md:mx-6 lg:mx-8 outer margin
                 (page already has outer padding, double-margin looked wrong)

            Table column visibility:
            Mobile  (320–767px)  → Candidate, Status, Actions only
            Tablet  (768–1023px) → + Position, Resume, Applied (hidden md:table-cell)
            Laptop  (1024px+)    → same as tablet, wider padding

            FIX: ALL text-white instances replaced with correct gray colors.
            FIX: th headers were text-white → text-gray-500 dark:text-gray-400
            FIX: search input width constrained on tablet/desktop
            FIX: Refresh button label hidden on small screens (hidden sm:inline)
            FIX: min-w-[700px] → min-w-[480px] (less unnecessary scroll)
            ════════════════════════════════════════════════════════════════
          */}
          <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden mb-8">

            {/* Pipeline header */}
            <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">

                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    <Briefcase size={16} className="text-blue-600" />
                    Hiring Pipeline
                  </h3>
                  {/* FIX: was text-white → text-gray-500 dark:text-gray-400 */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Track candidate applications and recruitment progress
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  {/* Search — constrained width on tablet/desktop */}
                  <div className="relative flex-1 md:flex-none md:w-52 lg:w-64">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search candidates…"
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); logUIAction("HR_CANDIDATE_SEARCH","Hiring_Pipeline",{ query:e.target.value }); }}
                      onKeyDown={(e) => e.key === "Enter" && fetchHiringData()}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Refresh */}
                  <Button variant="outline" size="sm" onClick={() => { logUIAction("HR_PIPELINE_REFRESH","Hiring_Pipeline"); fetchHiringData(); }} disabled={loadingPipeline} className="flex-shrink-0">
                    <RefreshCw size={14} className={loadingPipeline ? "animate-spin mr-1" : "mr-1"} />
                    {/* FIX: always showed label; now hidden on very small screens */}
                    <span className="hidden sm:inline">{loadingPipeline ? "Refreshing" : "Refresh"}</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {/*
                FIX: was min-w-[700px] → min-w-[480px] md:min-w-full
                Smaller minimum reduces unnecessary horizontal scroll on mobile.
              */}
              <table className="min-w-[480px] md:min-w-full w-full text-sm">

                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    {/* FIX: was text-white → text-gray-500 dark:text-gray-400 */}
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Candidate
                    </th>
                    {/* Position — hidden on mobile, visible tablet+ */}
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Position
                    </th>
                    {/* Resume — hidden on mobile */}
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Resume
                    </th>
                    {/* Applied — hidden on mobile */}
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loadingPipeline ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i}>
                        <td className="px-3 sm:px-4 py-3" colSpan={6}>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
                        </td>
                      </tr>
                    ))
                  ) : hiringData.length > 0 ? (
                    hiringData.map(app => (
                      <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">

                        {/* Candidate cell */}
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                              {app.fullName?.charAt(0) || "A"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm truncate">
                                {app.fullName}
                              </p>
                              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                                {app.email}
                              </p>
                              {/* On mobile show position inline — FIX: was text-white */}
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate md:hidden">
                                {app.position}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Position — tablet+ (hidden md:table-cell) */}
                        <td className="hidden md:table-cell px-4 py-4">
                          <p className="text-sm text-gray-900 dark:text-white font-medium truncate max-w-[150px]">
                            {app.position}
                          </p>
                          {/* FIX: was text-white */}
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                            {app.department}
                          </p>
                        </td>

                        {/* Resume — tablet+ */}
                        <td className="hidden md:table-cell px-4 py-4">
                          {app.resumePath ? (
                            <button
                              onClick={() => { logUIAction("VIEW_RESUME","Hiring_Pipeline",{ applicationId:app._id }); openResume(app.resumePath); }}
                              className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              <FileText size={12} /> View
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>

                        {/* Applied — tablet+  FIX: was text-white */}
                        <td className="hidden md:table-cell px-4 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {fmtApplied(app.createdAt)}
                        </td>

                        {/* Status */}
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <StatusBadge status={app.status} />
                        </td>

                        {/* Actions */}
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-right">
                          <div className="flex flex-wrap justify-end items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => { logUIAction("HR_CANDIDATE_VIEW","Hiring_Pipeline",{ applicationId:app._id }); setViewingCandidate(app); }}
                              className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                            >
                              <Eye size={12} />
                              {/* FIX: always showed; now hidden on mobile */}
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <LeadActions lead={app} type="job" onUpdated={fetchHiringData} />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      {/* FIX: was text-white */}
                      <td colSpan={6} className="py-10 sm:py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                        No applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination — stacked on mobile, row on tablet+ */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700">
              {/* FIX: was text-white */}
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                Showing {(pagination.page - 1) * pagination.pageSize + 1}–{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={pagination.page === 1}                    onClick={() => handlePageChange(pagination.page - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => handlePageChange(pagination.page + 1)}>Next</Button>
              </div>
            </div>
          </div>

          {/*
            ════════════════════════════════════════════════════════════════
            DEPARTMENT OVERVIEW
            ┌──────────────┬──────────────────────────────────────────┐
            │ 320–767px    │ 2 × 2 grid                               │
            │ 768–1023px   │ 2 × 2 grid (tablet, wider gap + padding) │
            │ 1024px+      │ 1 × 4 row  (laptop / desktop)            │
            └──────────────┴──────────────────────────────────────────┘
            FIX: original used only sm() → 2 tiers. Now 6 tiers.
          ════════════════════════════════════════════════════════════════
          */}
          <div style={{
            borderRadius:  width < 375 ? "12px" : width < 768 ? "16px" : "24px",
            border:        "1px solid #dbeafe",
            boxShadow:     "0 2px 10px rgba(0,0,0,0.05)",
            padding:       width < 375 ? "14px 12px" : width < 425 ? "16px 14px" : width < 768 ? "18px 16px" : width < 1024 ? "24px 20px" : "32px",
            marginBottom:  width < 768 ? "20px" : "32px",
          }}>
            <h3 style={{
              fontSize:   width < 768 ? "15px" : "17px",
              fontWeight: 600,
              color:      "#1e293b",
              display:    "flex", alignItems:"center", gap:"8px",
              margin:     "0 0 20px",
            }}>
              <Users size={16} color="#2563eb" /> Department Overview
            </h3>

            <div style={{
              display:             "grid",
              gridTemplateColumns: isDesktop ? "repeat(4,1fr)" : "1fr 1fr",
              gap:                 width < 375 ? "10px" : width < 768 ? "12px" : width < 1024 ? "14px" : "20px",
              textAlign:           "center",
            }}>
              {[
                { count:45, label:"Engineering", bg:"#eff6ff", border:"#dbeafe", nc:"#1d4ed8", lc:"#2563eb" },
                { count:28, label:"Marketing",   bg:"#f0fdf4", border:"#dcfce7", nc:"#15803d", lc:"#16a34a" },
                { count:32, label:"Sales",        bg:"#faf5ff", border:"#f3e8ff", nc:"#7e22ce", lc:"#9333ea" },
                { count:51, label:"Operations",   bg:"#fff7ed", border:"#ffedd5", nc:"#c2410c", lc:"#ea580c" },
              ].map(({ count, label, bg, border, nc, lc }) => (
                <div key={label} style={{
                  background:   bg,
                  border:       `1px solid ${border}`,
                  borderRadius: width < 375 ? "10px" : width < 768 ? "14px" : "20px",
                  padding:      width < 375 ? "12px 8px" : width < 425 ? "14px 10px" : width < 768 ? "16px 10px" : width < 1024 ? "20px" : "24px",
                  boxShadow:    "0 1px 4px rgba(0,0,0,0.05)",
                }}>
                  <h2 style={{ fontSize:width < 375 ? "24px" : width < 768 ? "28px" : "36px", fontWeight:600, color:nc, margin:0 }}>{count}</h2>
                  <p style={{ margin:width < 768 ? "8px 0 0" : "12px 0 0", fontSize:width < 375 ? "10px" : width < 768 ? "11px" : "13px", fontWeight:500, color:lc }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>{/* end outer wrapper */}

        {/* ── Candidate Detail Modal ──────────────────────────────────── */}
        {viewingCandidate && (
          <CandidateDetailModal
            app={viewingCandidate}
            isMobile={isMobile}
            onClose={() => setViewingCandidate(null)}
            onOpenResume={(url) => { logUIAction("VIEW_RESUME","Hiring_Pipeline",{ applicationId:viewingCandidate._id }); openResume(url); }}
          />
        )}

        {/* ── Add / Edit Job Modal ────────────────────────────────────── */}
        {modalOpen && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(4px)", zIndex:50, display:"flex", alignItems:isMobile ? "flex-end" : "center", justifyContent:"center", padding:isMobile ? "0" : "16px" }} onClick={e => e.target === e.currentTarget && closeModal()}>
            <div style={{ background:"transparent", border:"1px solid #e4e4e7", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", width:"100%", maxWidth:isMobile ? "100%" : isTablet ? "600px" : "680px", borderRadius:isMobile ? "20px 20px 0 0" : "20px", maxHeight:"92dvh", display:"flex", flexDirection:"column" }}>
              {isMobile && <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 4px" }}><div style={{ width:"32px", height:"4px", borderRadius:"2px", background:"#e4e4e7" }} /></div>}

              {/* Modal header — FIX: was broken className "dark-text-white" */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #f4f4f5", flexShrink:0 }}>
                <div>
                  <h2 className="text-zinc-900 dark:text-white" style={{ fontSize:"14px", fontWeight:700, margin:0 }}>
                    {editingId ? "Edit Listing" : "New Listing"}
                  </h2>
                  <p style={{ fontSize:"12px", color:"#a1a1aa", margin:"3px 0 0" }}>{editingId ? "Update position details." : "Publish a new job opening."}</p>
                </div>
                <button onClick={closeModal} style={{ width:"32px", height:"32px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"8px", border:"none", background:"transparent", cursor:"pointer", color:"#a1a1aa" }}><X size={16} /></button>
              </div>

              {/* Modal body */}
              <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
                <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap:"14px" }}>
                  <div style={{ gridColumn:isMobile ? "1" : "span 2" }}>
                    <FL>Job Title <span style={{ color:"#f87171", fontWeight:400, textTransform:"none", letterSpacing:"normal" }}>*</span></FL>
                    <FI value={form.title} onChange={e => setForm({ ...form, title:e.target.value })} placeholder="e.g. Senior React Developer" />
                  </div>
                  <div><FL>Department</FL><FS value={form.department} onChange={e => setForm({ ...form, department:e.target.value })}>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</FS></div>
                  <div><FL>Job Type</FL><FS value={form.type} onChange={e => setForm({ ...form, type:e.target.value })}>{JOB_TYPES.map(t => <option key={t}>{t}</option>)}</FS></div>
                  <div><FL>Location <span style={{ color:"#f87171", fontWeight:400, textTransform:"none", letterSpacing:"normal" }}>*</span></FL><FI value={form.location} onChange={e => setForm({ ...form, location:e.target.value })} placeholder="Remote or city" /></div>
                  <div><FL>Experience</FL><FI value={form.experience} onChange={e => setForm({ ...form, experience:e.target.value })} placeholder="e.g. 2–4 years" /></div>
                  <div><FL>Salary Range</FL><FI value={form.salary} onChange={e => setForm({ ...form, salary:e.target.value })} placeholder="e.g. $80K – $110K" /></div>
                  <div><FL>Status</FL><FS value={form.status} onChange={e => setForm({ ...form, status:e.target.value })}><option value="active">Active</option><option value="paused">Paused</option></FS></div>
                  <div style={{ gridColumn:isMobile ? "1" : "span 2" }}>
                    <FL>Requirements <span style={{ fontWeight:400, textTransform:"none", letterSpacing:"normal", color:"#a1a1aa" }}>(comma-separated)</span></FL>
                    <FI value={form.requirements} onChange={e => setForm({ ...form, requirements:e.target.value })} placeholder="React, TypeScript, Node.js" />
                  </div>
                  <div style={{ gridColumn:isMobile ? "1" : "span 2" }}>
                    <FL>Description</FL>
                    <FTA value={form.description} onChange={e => setForm({ ...form, description:e.target.value })} placeholder="Describe the role and responsibilities…" />
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:"10px", padding:"14px 20px", borderTop:"1px solid #f4f4f5", background:"#fafafa", borderRadius:isMobile ? "0" : "0 0 20px 20px", flexShrink:0 }}>
                <button onClick={closeModal} style={{ padding:"9px 16px", borderRadius:"8px", border:"1px solid #e4e4e7", background:"transparent", color:"#52525b", fontSize:"13px", fontWeight:500, cursor:"pointer" }}>Cancel</button>
                <button onClick={handleSaveJob} disabled={!form.title.trim() || !form.location.trim()} style={{ padding:"9px 20px", borderRadius:"8px", background:"#4f46e5", color:"#fff", border:"none", fontSize:"13px", fontWeight:600, cursor:"pointer", opacity:(!form.title.trim() || !form.location.trim()) ? 0.4 : 1 }}>
                  {editingId ? "Save Changes" : "Publish"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Delete Confirmation ─────────────────────────────────────── */}
        {deleteConfirm && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(4px)", zIndex:50, display:"flex", alignItems:isMobile ? "flex-end" : "center", justifyContent:"center", padding:isMobile ? "0" : "16px" }}>
            <div style={{ background:"transparent", border:"1px solid #e4e4e7", borderRadius:isMobile ? "20px 20px 0 0" : "16px", padding:"20px", width:"100%", maxWidth:isMobile ? "100%" : "360px", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
              {isMobile && <div style={{ display:"flex", justifyContent:"center", marginBottom:"16px" }}><div style={{ width:"32px", height:"4px", borderRadius:"2px", background:"#e4e4e7" }} /></div>}
              <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"#fef2f2", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"12px" }}><Trash2 size={16} color="#ef4444" /></div>
              <h3 className="text-zinc-900 dark:text-white" style={{ fontSize:"14px", fontWeight:700, margin:"0 0 6px" }}>Remove this listing?</h3>
              <p className="text-zinc-600 dark:text-zinc-400" style={{ fontSize:"12px", margin:"0 0 20px", lineHeight:1.6 }}>This job opening will be permanently deleted and cannot be recovered.</p>
              <div style={{ display:"flex", gap:"10px" }}>
                <button onClick={() => setDeleteConfirm(null)} style={{ flex:1, padding:"11px", borderRadius:"10px", border:"1px solid #e4e4e7", background:"transparent", color:"#52525b", fontSize:"13px", fontWeight:500, cursor:"pointer" }}>Cancel</button>
                <button onClick={() => handleDeleteJob(deleteConfirm)} style={{ flex:1, padding:"11px", borderRadius:"10px", background:"#dc2626", color:"#fff", border:"none", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>Delete</button>
              </div>
            </div>
          </div>
        )}

      </AdminLayout>
    </RoleBasedRoute>
  );
}