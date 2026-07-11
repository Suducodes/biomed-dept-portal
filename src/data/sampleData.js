// Sample content shown in "demo" mode (no Supabase configured yet).
// Shapes mirror the Postgres tables in supabase/schema.sql so the UI behaves
// identically once real data flows in. `poster_url` / `image_url` use inline
// SVG data URIs so the demo needs no uploaded files.
const poster = (label, c1, c2) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>
       <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
         <stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/>
       </linearGradient></defs>
       <rect width='800' height='500' fill='#0a0e17'/>
       <rect width='800' height='500' fill='url(#g)' opacity='0.22'/>
       <path d='M40 260 h150 l30 -90 l45 190 l40 -240 l35 140 l30 -60 h345'
             fill='none' stroke='${c1}' stroke-width='4' opacity='0.85'/>
       <text x='50' y='120' fill='#e6edf7' font-family='Inter,sans-serif'
             font-size='42' font-weight='700'>${label}</text>
     </svg>`
  );

const daysFromNow = (d) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString();
};

export const sampleData = {
  announcements: [
    {
      id: "a1",
      message:
        "Lab-2 (Medical Instrumentation) relocated to Block C, Room 214 from Monday.",
      severity: "important",
      active: true,
      published_at: daysFromNow(-1),
    },
    {
      id: "a2",
      message: "Internal Assessment-II begins next week — hall tickets on the portal.",
      severity: "info",
      active: true,
      published_at: daysFromNow(-3),
    },
  ],

  notices: [
    {
      id: "n1",
      title: "Internal Assessment-II Timetable Released",
      body: "The IA-II schedule for all semesters is now available under Downloads → Timetable. Report 15 minutes before each session.",
      category: "academic",
      attachment_url: null,
      is_pinned: true,
      published_at: daysFromNow(-1),
    },
    {
      id: "n2",
      title: "Medtronic Off-Campus Drive — Register by Friday",
      body: "Biomedical & Instrumentation students of the 2026 batch are eligible. CGPA cut-off 7.0. Register through the placement cell link.",
      category: "placement",
      attachment_url: null,
      is_pinned: false,
      published_at: daysFromNow(-2),
    },
    {
      id: "n3",
      title: "Summer Internship @ Christian Medical College, Vellore",
      body: "Six-week clinical instrumentation internship. Limited seats. Faculty recommendation required.",
      category: "internship",
      attachment_url: null,
      is_pinned: false,
      published_at: daysFromNow(-4),
    },
    {
      id: "n4",
      title: "Hands-on Workshop: FPGA for Biomedical Signal Processing",
      body: "Two-day workshop conducted by the department in association with IEEE EMBS. Certificate provided.",
      category: "workshop",
      attachment_url: null,
      is_pinned: false,
      published_at: daysFromNow(-6),
    },
    {
      id: "n5",
      title: "Circular: Revised Academic Calendar for Odd Semester",
      body: "The revised calendar reflecting the extended Pongal break is published. Refer to the Academic Calendar page.",
      category: "circular",
      attachment_url: null,
      is_pinned: false,
      published_at: daysFromNow(-8),
    },
  ],

  events: [
    {
      id: "e1",
      title: "BioSpark 2026 — National Level Symposium",
      description:
        "Paper presentations, project expo, and a keynote on wearable biosensors. Open to all biomedical students across Tamil Nadu.",
      type: "symposium",
      event_date: daysFromNow(12),
      venue: "Main Auditorium",
      poster_url: poster("BioSpark '26", "#34d399", "#22d3ee"),
    },
    {
      id: "e2",
      title: "Guest Lecture: AI in Medical Imaging",
      description:
        "Dr. R. Anand (IIT Madras) on deep learning for radiology. Followed by an interactive Q&A.",
      type: "guest_lecture",
      event_date: daysFromNow(5),
      venue: "Seminar Hall B",
      poster_url: poster("AI in Imaging", "#22d3ee", "#818cf8"),
    },
    {
      id: "e3",
      title: "Design-a-thon: Assistive Devices",
      description:
        "24-hour competition to prototype low-cost assistive technology. Teams of 3-4.",
      type: "competition",
      event_date: daysFromNow(-9),
      venue: "Innovation Lab",
      poster_url: poster("Design-a-thon", "#f472b6", "#fb7185"),
    },
  ],

  achievements: [
    {
      id: "ac1",
      title: "Best Paper Award — ICBME 2026",
      description:
        "Final-year team's paper on a low-cost pulse-oximeter won Best Paper at the International Conference on Biomedical Engineering.",
      type: "student",
      image_url: poster("Best Paper", "#34d399", "#22d3ee"),
      date: daysFromNow(-15),
    },
    {
      id: "ac2",
      title: "Faculty Patent Granted — Wearable ECG Patch",
      description:
        "Dr. S. Priya's design for a flexible dry-electrode ECG patch received a patent grant.",
      type: "faculty",
      image_url: poster("Patent Granted", "#22d3ee", "#818cf8"),
      date: daysFromNow(-30),
    },
    {
      id: "ac3",
      title: "100% Placement — Instrumentation Track",
      description:
        "The 2025 outgoing batch's instrumentation specialisation achieved full placement across medical-device firms.",
      type: "placement",
      image_url: poster("100% Placed", "#f59e0b", "#fb7185"),
      date: daysFromNow(-45),
    },
  ],

  calendar_events: [
    { id: "c1", title: "Internal Assessment-II", date: daysFromNow(7), type: "internal_exam", description: "All semesters" },
    { id: "c2", title: "Pongal Holiday", date: daysFromNow(20), type: "holiday", description: "College closed" },
    { id: "c3", title: "Last Working Day — Odd Sem", date: daysFromNow(40), type: "academic", description: "Odd semester ends" },
    { id: "c4", title: "Semester Practical Exams", date: daysFromNow(48), type: "internal_exam", description: "Lab end-semester" },
  ],

  downloads: [
    { id: "d1", title: "IA-II Timetable (All Sems)", category: "timetable", file_url: "#", uploaded_at: daysFromNow(-1) },
    { id: "d2", title: "R2021 BME Syllabus — Sem 5", category: "syllabus", file_url: "#", uploaded_at: daysFromNow(-20) },
    { id: "d3", title: "Medical Instrumentation Lab Manual", category: "lab_manual", file_url: "#", uploaded_at: daysFromNow(-25) },
    { id: "d4", title: "Internship Application Form", category: "form", file_url: "#", uploaded_at: daysFromNow(-10) },
    { id: "d5", title: "Revised Academic Calendar Circular", category: "circular", file_url: "#", uploaded_at: daysFromNow(-8) },
  ],

  gallery_items: [
    { id: "g1", title: "BioSpark 2025 — Project Expo", media_url: poster("Expo 2025", "#34d399", "#22d3ee"), type: "photo", event_id: null },
    { id: "g2", title: "Industrial Visit — Trivitron Healthcare", media_url: poster("Industrial Visit", "#22d3ee", "#818cf8"), type: "photo", event_id: null },
    { id: "g3", title: "Best Paper Team @ ICBME", media_url: poster("ICBME Team", "#f59e0b", "#fb7185"), type: "photo", event_id: null },
    { id: "g4", title: "Design-a-thon Highlights", media_url: poster("Design-a-thon", "#f472b6", "#fb7185"), type: "video", event_id: null },
  ],
};
