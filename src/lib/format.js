// Shared formatting + label helpers.
export function fmtDate(iso, opts) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  });
}

export function relDate(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const day = 86400000;
  if (Math.abs(diff) < day) return "Today";
  const days = Math.round(diff / day);
  if (days > 0) return days === 1 ? "Yesterday" : `${days} days ago`;
  const ahead = -days;
  return ahead === 1 ? "Tomorrow" : `In ${ahead} days`;
}

// Human labels for enum-ish columns.
export const LABELS = {
  category: {
    academic: "Academic",
    circular: "Circular",
    placement: "Placement",
    internship: "Internship",
    workshop: "Workshop",
    timetable: "Timetable",
    syllabus: "Syllabus",
    notes: "Notes",
    lab_manual: "Lab Manual",
    form: "Form",
  },
  type: {
    symposium: "Symposium",
    workshop: "Workshop",
    guest_lecture: "Guest Lecture",
    conference: "Conference",
    competition: "Competition",
    student: "Student",
    faculty: "Faculty",
    placement: "Placement",
    award: "Award",
    project: "Project",
    holiday: "Holiday",
    internal_exam: "Internal Exam",
    academic: "Academic",
    college: "College",
    photo: "Photo",
    video: "Video",
  },
  severity: {
    info: "Info",
    important: "Important",
    emergency: "Emergency",
  },
};

export const label = (group, key) => LABELS[group]?.[key] ?? key;
