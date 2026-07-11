import { icons } from "../../components/Icons.jsx";

// Declarative form config per table. The dashboard renders these generically,
// so adding a field is a one-line change here. `bucket` marks a Storage upload.
const opt = (values, group) => values.map((v) => ({ value: v, label: labelFor(group, v) }));

// tiny local label map (kept in sync with lib/format LABELS)
function labelFor(group, v) {
  const M = {
    category: { academic: "Academic", circular: "Circular", placement: "Placement", internship: "Internship", workshop: "Workshop", timetable: "Timetable", syllabus: "Syllabus", notes: "Notes", lab_manual: "Lab Manual", form: "Form" },
    type: { symposium: "Symposium", workshop: "Workshop", guest_lecture: "Guest Lecture", conference: "Conference", competition: "Competition", student: "Student", faculty: "Faculty", placement: "Placement", award: "Award", project: "Project", holiday: "Holiday", internal_exam: "Internal Exam", academic: "Academic", college: "College", photo: "Photo", video: "Video" },
    severity: { info: "Info", important: "Important", emergency: "Emergency" },
  };
  return M[group]?.[v] ?? v;
}

export const SCHEMA = {
  notices: {
    label: "Notices",
    icon: icons.bell,
    titleField: "title",
    fields: [
      { name: "title", type: "text", required: true },
      { name: "body", type: "textarea", label: "Body" },
      { name: "category", type: "select", options: opt(["academic", "circular", "placement", "internship", "workshop"], "category") },
      { name: "attachment_url", type: "file", label: "Attachment (PDF)", bucket: "attachments" },
      { name: "is_pinned", type: "checkbox", label: "Pin to top" },
      { name: "published_at", type: "date", label: "Published", default: "now" },
    ],
  },
  announcements: {
    label: "Announcements",
    icon: icons.megaphone,
    titleField: "message",
    fields: [
      { name: "message", type: "textarea", required: true },
      { name: "severity", type: "select", options: opt(["info", "important", "emergency"], "severity") },
      { name: "active", type: "checkbox", label: "Active", default: true },
      { name: "published_at", type: "date", label: "Published", default: "now" },
    ],
  },
  events: {
    label: "Events",
    icon: icons.calendar,
    titleField: "title",
    fields: [
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea" },
      { name: "type", type: "select", options: opt(["symposium", "workshop", "guest_lecture", "conference", "competition"], "type") },
      { name: "event_date", type: "date", label: "Event date", required: true, default: "now" },
      { name: "venue", type: "text" },
      { name: "poster_url", type: "file", label: "Poster", bucket: "posters" },
    ],
  },
  achievements: {
    label: "Achievements",
    icon: icons.trophy,
    titleField: "title",
    fields: [
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea" },
      { name: "type", type: "select", options: opt(["student", "faculty", "placement", "award", "project"], "type") },
      { name: "image_url", type: "file", label: "Image / Poster", bucket: "posters" },
      { name: "date", type: "date", default: "now" },
    ],
  },
  calendar_events: {
    label: "Calendar",
    icon: icons.calendar,
    titleField: "title",
    fields: [
      { name: "title", type: "text", required: true },
      { name: "date", type: "date", required: true, default: "now" },
      { name: "type", type: "select", options: opt(["academic", "college", "internal_exam", "holiday"], "type") },
      { name: "description", type: "text" },
    ],
  },
  downloads: {
    label: "Downloads",
    icon: icons.doc,
    titleField: "title",
    fields: [
      { name: "title", type: "text", required: true },
      { name: "category", type: "select", options: opt(["circular", "timetable", "syllabus", "notes", "lab_manual", "form"], "category") },
      { name: "file_url", type: "file", label: "File (PDF)", bucket: "attachments", required: true },
      { name: "uploaded_at", type: "date", label: "Uploaded", default: "now" },
    ],
  },
  gallery_items: {
    label: "Gallery",
    icon: icons.images,
    titleField: "title",
    fields: [
      { name: "title", type: "text", required: true },
      { name: "media_url", type: "file", label: "Photo / Video", bucket: "gallery", required: true },
      { name: "type", type: "select", options: opt(["photo", "video"], "type") },
    ],
  },
};

export const TABLE_ORDER = [
  "notices",
  "announcements",
  "events",
  "achievements",
  "calendar_events",
  "downloads",
  "gallery_items",
];
