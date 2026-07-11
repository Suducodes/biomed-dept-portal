-- ============================================================================
-- Seed data + admin bootstrap.
-- Run AFTER schema.sql, and AFTER you have signed up your admin account once
-- through the app's /admin login (magic path: sign up, then run the INSERT
-- below with your user's email).
-- ============================================================================

-- 1) Make yourself an admin. Replace the email with the one you signed up with.
insert into public.admins (id, email, display_name)
select id, email, 'Department Admin'
from auth.users
where email = 'REPLACE_WITH_YOUR_EMAIL@example.com'
on conflict (id) do nothing;

-- 2) Sample content so the site isn't empty on first load.
insert into public.announcements (message, severity, active) values
  ('Lab-2 (Medical Instrumentation) relocated to Block C, Room 214 from Monday.', 'important', true),
  ('Internal Assessment-II begins next week — hall tickets on the portal.', 'info', true);

insert into public.notices (title, body, category, is_pinned) values
  ('Internal Assessment-II Timetable Released',
   'The IA-II schedule for all semesters is now available under Downloads. Report 15 minutes before each session.',
   'academic', true),
  ('Medtronic Off-Campus Drive — Register by Friday',
   'Biomedical & Instrumentation students of the 2026 batch are eligible. CGPA cut-off 7.0.',
   'placement', false),
  ('Summer Internship @ CMC Vellore',
   'Six-week clinical instrumentation internship. Faculty recommendation required.',
   'internship', false),
  ('Workshop: FPGA for Biomedical Signal Processing',
   'Two-day hands-on workshop with IEEE EMBS. Certificate provided.',
   'workshop', false);

insert into public.events (title, description, type, event_date, venue) values
  ('BioSpark 2026 — National Symposium',
   'Paper presentations, project expo, and a keynote on wearable biosensors.',
   'symposium', now() + interval '12 days', 'Main Auditorium'),
  ('Guest Lecture: AI in Medical Imaging',
   'Dr. R. Anand (IIT Madras) on deep learning for radiology.',
   'guest_lecture', now() + interval '5 days', 'Seminar Hall B');

insert into public.achievements (title, description, type) values
  ('Best Paper Award — ICBME 2026',
   'Final-year team won Best Paper for a low-cost pulse-oximeter.', 'student'),
  ('Faculty Patent Granted — Wearable ECG Patch',
   'Patent granted for a flexible dry-electrode ECG patch.', 'faculty');

insert into public.calendar_events (title, date, type, description) values
  ('Internal Assessment-II', now() + interval '7 days', 'internal_exam', 'All semesters'),
  ('Pongal Holiday', now() + interval '20 days', 'holiday', 'College closed');

insert into public.downloads (title, category, file_url) values
  ('IA-II Timetable (All Sems)', 'timetable', '#'),
  ('R2021 BME Syllabus — Sem 5', 'syllabus', '#'),
  ('Internship Application Form', 'form', '#');
