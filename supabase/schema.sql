-- ============================================================
-- SMART CHITTORGARH NAGAR PARISHAD
-- Complete Supabase PostgreSQL Schema + RLS + Seed Data
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. WARDS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wards (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ward_number   INTEGER NOT NULL UNIQUE CHECK (ward_number BETWEEN 1 AND 60),
  ward_name     TEXT NOT NULL,
  area_name     TEXT,
  councillor_id UUID,
  lat           DECIMAL(10,8),
  lng           DECIMAL(11,8),
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. DEPARTMENTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  officer_id  UUID,
  color_code  TEXT DEFAULT '#2563eb',
  icon        TEXT DEFAULT 'building',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. PROFILES (extends auth.users) ─────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  phone         TEXT,
  role          TEXT NOT NULL CHECK (role IN ('citizen','employee','parshad','officer','chairman','super_admin')),
  ward_id       UUID REFERENCES wards(id),
  department_id UUID REFERENCES departments(id),
  employee_code TEXT UNIQUE,
  is_active     BOOLEAN DEFAULT TRUE,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE wards ADD CONSTRAINT wards_councillor_fk
  FOREIGN KEY (councillor_id) REFERENCES profiles(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE departments ADD CONSTRAINT departments_officer_fk
  FOREIGN KEY (officer_id) REFERENCES profiles(id) DEFERRABLE INITIALLY DEFERRED;

-- ── 4. CATEGORIES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL UNIQUE,
  name_hindi    TEXT,
  department_id UUID NOT NULL REFERENCES departments(id),
  sla_hours     INTEGER NOT NULL DEFAULT 48,
  icon          TEXT DEFAULT 'alert-circle',
  color_code    TEXT DEFAULT '#6366f1',
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. COMPLAINTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS complaints (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_code TEXT UNIQUE,
  citizen_id     UUID NOT NULL REFERENCES profiles(id),
  ward_id        UUID NOT NULL REFERENCES wards(id),
  category_id    UUID NOT NULL REFERENCES categories(id),
  department_id  UUID NOT NULL REFERENCES departments(id),
  assigned_to    UUID REFERENCES profiles(id),
  title          TEXT,
  description    TEXT,
  photo_url      TEXT,
  address        TEXT,
  lat            DECIMAL(10,8),
  lng            DECIMAL(11,8),
  status         TEXT NOT NULL DEFAULT 'submitted'
                 CHECK (status IN ('submitted','acknowledged','assigned','in_progress','resolved','closed','reopened')),
  priority       TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high','critical')),
  sla_deadline   TIMESTAMPTZ,
  is_overdue     BOOLEAN DEFAULT FALSE,
  is_reopened    BOOLEAN DEFAULT FALSE,
  resolved_at    TIMESTAMPTZ,
  closed_at      TIMESTAMPTZ,
  feedback       TEXT CHECK (feedback IN ('yes','no')),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate complaint code
CREATE OR REPLACE FUNCTION generate_complaint_code()
RETURNS TRIGGER AS $$
DECLARE seq_num INTEGER;
BEGIN
  SELECT COUNT(*)+1 INTO seq_num FROM complaints;
  NEW.complaint_code := 'CTNP-'||TO_CHAR(NOW(),'YYYY')||'-'||LPAD(seq_num::TEXT,6,'0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_complaint_code
  BEFORE INSERT ON complaints
  FOR EACH ROW WHEN (NEW.complaint_code IS NULL OR NEW.complaint_code = '')
  EXECUTE FUNCTION generate_complaint_code();

-- Auto-set SLA deadline
CREATE OR REPLACE FUNCTION set_sla_deadline()
RETURNS TRIGGER AS $$
DECLARE sla_h INTEGER;
BEGIN
  SELECT sla_hours INTO sla_h FROM categories WHERE id = NEW.category_id;
  NEW.sla_deadline := NOW() + (sla_h||' hours')::INTERVAL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_complaint_sla
  BEFORE INSERT ON complaints FOR EACH ROW
  EXECUTE FUNCTION set_sla_deadline();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at := NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER complaints_updated_at
  BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 6. TASKS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID REFERENCES complaints(id),
  employee_id  UUID NOT NULL REFERENCES profiles(id),
  assigned_by  UUID NOT NULL REFERENCES profiles(id),
  ward_id      UUID NOT NULL REFERENCES wards(id),
  title        TEXT NOT NULL,
  description  TEXT,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 7. ATTENDANCE ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES profiles(id),
  ward_id     UUID NOT NULL REFERENCES wards(id),
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  time        TIMETZ NOT NULL DEFAULT CURRENT_TIME,
  gps_lat     DECIMAL(10,8),
  gps_lng     DECIMAL(11,8),
  status      TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present','absent','late')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

-- ── 8. NOTIFICATIONS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id),
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT DEFAULT 'info' CHECK (type IN ('info','success','warning','error','alert')),
  link       TEXT,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 9. COMPLAINT HISTORY ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS complaint_history (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES complaints(id),
  changed_by   UUID NOT NULL REFERENCES profiles(id),
  old_status   TEXT,
  new_status   TEXT NOT NULL,
  note         TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── INDEXES ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_complaints_ward       ON complaints(ward_id);
CREATE INDEX IF NOT EXISTS idx_complaints_dept       ON complaints(department_id);
CREATE INDEX IF NOT EXISTS idx_complaints_citizen    ON complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status     ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_assigned   ON complaints(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_employee        ON tasks(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_emp_date   ON attendance(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_notifications_user    ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_profiles_role         ON profiles(role);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────
ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE wards        ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints   ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance   ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_history ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_my_role() RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_my_ward_id() RETURNS UUID AS $$
  SELECT ward_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_my_dept_id() RETURNS UUID AS $$
  SELECT department_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT
  USING (id = auth.uid() OR get_my_role() IN ('super_admin','chairman','officer','parshad'));
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update" ON profiles FOR UPDATE
  USING (id = auth.uid() OR get_my_role() = 'super_admin');

-- Wards & Departments & Categories (everyone reads, admin writes)
CREATE POLICY "wards_read"   ON wards       FOR SELECT USING (TRUE);
CREATE POLICY "wards_admin"  ON wards       FOR ALL USING (get_my_role()='super_admin');
CREATE POLICY "depts_read"   ON departments FOR SELECT USING (TRUE);
CREATE POLICY "depts_admin"  ON departments FOR ALL USING (get_my_role()='super_admin');
CREATE POLICY "cats_read"    ON categories  FOR SELECT USING (TRUE);
CREATE POLICY "cats_admin"   ON categories  FOR ALL USING (get_my_role()='super_admin');

-- Complaints
CREATE POLICY "complaints_read" ON complaints FOR SELECT USING (
  citizen_id = auth.uid() OR
  get_my_role() IN ('super_admin','chairman') OR
  (get_my_role()='parshad'  AND ward_id=get_my_ward_id()) OR
  (get_my_role()='officer'  AND department_id=get_my_dept_id()) OR
  (get_my_role()='employee' AND assigned_to=auth.uid())
);
CREATE POLICY "complaints_insert" ON complaints FOR INSERT WITH CHECK (citizen_id=auth.uid());
CREATE POLICY "complaints_update" ON complaints FOR UPDATE USING (
  (get_my_role()='officer' AND department_id=get_my_dept_id()) OR
  get_my_role() IN ('super_admin','chairman') OR
  (get_my_role()='citizen' AND citizen_id=auth.uid())
);

-- Tasks
CREATE POLICY "tasks_read" ON tasks FOR SELECT USING (
  employee_id=auth.uid() OR get_my_role() IN ('super_admin','chairman','officer') OR
  (get_my_role()='parshad' AND ward_id=get_my_ward_id())
);
CREATE POLICY "tasks_insert" ON tasks FOR INSERT WITH CHECK (get_my_role() IN ('officer','super_admin'));
CREATE POLICY "tasks_update" ON tasks FOR UPDATE USING (employee_id=auth.uid() OR get_my_role() IN ('officer','super_admin'));

-- Attendance
CREATE POLICY "attendance_read" ON attendance FOR SELECT USING (
  employee_id=auth.uid() OR get_my_role() IN ('super_admin','chairman','officer') OR
  (get_my_role()='parshad' AND ward_id=get_my_ward_id())
);
CREATE POLICY "attendance_insert" ON attendance FOR INSERT WITH CHECK (employee_id=auth.uid() AND get_my_role()='employee');

-- Notifications
CREATE POLICY "notifications_own" ON notifications FOR SELECT USING (user_id=auth.uid());
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (user_id=auth.uid());
CREATE POLICY "notifications_insert" ON notifications FOR INSERT
  WITH CHECK (get_my_role() IN ('super_admin','officer','chairman') OR user_id=auth.uid());

-- History
CREATE POLICY "history_read" ON complaint_history FOR SELECT USING (
  get_my_role() IN ('super_admin','chairman','officer') OR
  EXISTS (SELECT 1 FROM complaints c WHERE c.id=complaint_id AND c.citizen_id=auth.uid())
);
CREATE POLICY "history_insert" ON complaint_history FOR INSERT WITH CHECK (changed_by=auth.uid());

-- ── SEED DATA ─────────────────────────────────────────────────

-- Departments
INSERT INTO departments (id, name, description, color_code, icon) VALUES
  ('11111111-0000-0000-0000-000000000001','Sanitation',    'Garbage and cleanliness','#10b981','trash-2'),
  ('11111111-0000-0000-0000-000000000002','Engineering',   'Roads and infrastructure','#3b82f6','hard-hat'),
  ('11111111-0000-0000-0000-000000000003','Water Supply',  'Water and pipelines','#06b6d4','droplets'),
  ('11111111-0000-0000-0000-000000000004','Electrical',    'Street lights','#f59e0b','zap'),
  ('11111111-0000-0000-0000-000000000005','Parks & Garden','Parks and green spaces','#84cc16','tree-pine'),
  ('11111111-0000-0000-0000-000000000006','Animal Control','Stray animals','#8b5cf6','paw-print')
ON CONFLICT (name) DO NOTHING;

-- Wards 1-60
INSERT INTO wards (ward_number, ward_name, area_name, lat, lng) VALUES
(1,'Ward 1','Fort Area',24.8835,74.6274),(2,'Ward 2','Rana Sanga Road',24.8841,74.6301),
(3,'Ward 3','Gandhi Nagar',24.8850,74.6320),(4,'Ward 4','Nehru Nagar',24.8860,74.6245),
(5,'Ward 5','Subhash Nagar',24.8815,74.6290),(6,'Ward 6','Ambedkar Nagar',24.8900,74.6310),
(7,'Ward 7','Tilak Nagar',24.8780,74.6260),(8,'Ward 8','Sadar Bazaar',24.8812,74.6280),
(9,'Ward 9','Station Road',24.8795,74.6235),(10,'Ward 10','Railway Colony',24.8770,74.6210),
(11,'Ward 11','Old City',24.8856,74.6268),(12,'Ward 12','New Market',24.8830,74.6252),
(13,'Ward 13','Bhupalpura',24.8745,74.6310),(14,'Ward 14','Pratap Nagar',24.8715,74.6285),
(15,'Ward 15','Collectorate Area',24.8870,74.6198),(16,'Ward 16','Civil Lines',24.8884,74.6185),
(17,'Ward 17','Shastri Nagar',24.8901,74.6225),(18,'Ward 18','Vijay Nagar',24.8756,74.6345),
(19,'Ward 19','Patel Nagar',24.8780,74.6360),(20,'Ward 20','Chandra Nagar',24.8800,74.6375),
(21,'Ward 21','Lok Nayak Nagar',24.8823,74.6395),(22,'Ward 22','Jawahar Nagar',24.8840,74.6415),
(23,'Ward 23','Azad Nagar',24.8860,74.6340),(24,'Ward 24','Bharat Mata Chowk',24.8880,74.6360),
(25,'Ward 25','Ram Nagar',24.8895,74.6380),(26,'Ward 26','Krishna Nagar',24.8910,74.6395),
(27,'Ward 27','Shiv Nagar',24.8925,74.6280),(28,'Ward 28','Hanuman Nagar',24.8940,74.6265),
(29,'Ward 29','Guru Nanak Colony',24.8752,74.6180),(30,'Ward 30','Adarsh Nagar',24.8735,74.6200),
(31,'Ward 31','Indira Colony',24.8718,74.6215),(32,'Ward 32','Sanjay Nagar',24.8701,74.6230),
(33,'Ward 33','Malviya Nagar',24.8684,74.6245),(34,'Ward 34','Sindhi Colony',24.8670,74.6260),
(35,'Ward 35','Rajput Colony',24.8655,74.6275),(36,'Ward 36','Brahmins Colony',24.8640,74.6290),
(37,'Ward 37','Teli Para',24.8628,74.6305),(38,'Ward 38','Kumhar Mohalla',24.8615,74.6318),
(39,'Ward 39','Darji Para',24.8602,74.6332),(40,'Ward 40','Goldsmith Colony',24.8590,74.6345),
(41,'Ward 41','Mata Ji Ka Chowk',24.8578,74.6358),(42,'Ward 42','Devali Road',24.8930,74.6420),
(43,'Ward 43','Nimbahera Road',24.8945,74.6435),(44,'Ward 44','Udaipur Road North',24.8960,74.6250),
(45,'Ward 45','Udaipur Road South',24.8972,74.6235),(46,'Ward 46','Bus Stand Area',24.8760,74.6150),
(47,'Ward 47','Airport Road',24.8740,74.6165),(48,'Ward 48','Industrial Area',24.8720,74.6140),
(49,'Ward 49','Santoshi Mata Colony',24.8700,74.6155),(50,'Ward 50','Chamunda Colony',24.8685,74.6168),
(51,'Ward 51','Bhopal Nagar Extension',24.8668,74.6180),(52,'Ward 52','New Colony',24.8652,74.6195),
(53,'Ward 53','Ramnagar Extension',24.8635,74.6210),(54,'Ward 54','Rampur',24.8618,74.6225),
(55,'Ward 55','Kalyanpur',24.8601,74.6240),(56,'Ward 56','Balaji Nagar',24.8584,74.6255),
(57,'Ward 57','Sai Nagar',24.8567,74.6268),(58,'Ward 58','Om Nagar',24.8550,74.6282),
(59,'Ward 59','Shree Nagar',24.8533,74.6296),(60,'Ward 60','Chittorgarh Extension',24.8516,74.6310)
ON CONFLICT (ward_number) DO NOTHING;

-- Categories with department mapping
INSERT INTO categories (name, name_hindi, department_id, sla_hours, icon, color_code) VALUES
('Garbage / Cleanliness','कचरा / सफाई','11111111-0000-0000-0000-000000000001',24,'trash-2','#10b981'),
('Drainage / Sewerage','नाला / सीवरेज','11111111-0000-0000-0000-000000000001',48,'waves','#06b6d4'),
('Road / Pothole','सड़क / गड्ढा','11111111-0000-0000-0000-000000000002',72,'construction','#3b82f6'),
('Public Infrastructure','सार्वजनिक बुनियादी ढांचा','11111111-0000-0000-0000-000000000002',72,'building','#6366f1'),
('Water Supply','पानी की आपूर्ति','11111111-0000-0000-0000-000000000003',24,'droplets','#06b6d4'),
('Water Leakage','पानी का रिसाव','11111111-0000-0000-0000-000000000003',24,'droplet','#0ea5e9'),
('Street Light','स्ट्रीट लाइट','11111111-0000-0000-0000-000000000004',48,'zap','#f59e0b'),
('Electrical Issue','बिजली की समस्या','11111111-0000-0000-0000-000000000004',48,'bolt','#f97316'),
('Public Park','सार्वजनिक पार्क','11111111-0000-0000-0000-000000000005',96,'tree-pine','#84cc16'),
('Stray Animals','आवारा पशु','11111111-0000-0000-0000-000000000006',48,'paw-print','#8b5cf6'),
('Other','अन्य','11111111-0000-0000-0000-000000000001',72,'help-circle','#6b7280')
ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════════════════════════════
-- DEMO USERS SETUP INSTRUCTIONS:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add User" for each:
--    citizen@demo.in  / Demo@1234
--    employee@demo.in / Demo@1234
--    parshad@demo.in  / Demo@1234
--    officer@demo.in  / Demo@1234
--    chairman@demo.in / Demo@1234
--    admin@demo.in    / Demo@1234
-- 3. Copy each UUID from the Users list
-- 4. Replace the UUIDs below and run:
-- ── 12. SABHAPATI APPOINTMENTS (Janata Darbar & Citizen Hearing) ────
CREATE TABLE IF NOT EXISTS sabhapati_appointments (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_code          TEXT NOT NULL UNIQUE, -- e.g. CTNP-APT-2610-0042 (Collision-Proof)
  full_name           TEXT NOT NULL,
  community_surname   TEXT,
  phone_primary       TEXT NOT NULL,
  phone_secondary     TEXT NOT NULL, -- Mandatory backup number for Secretariat coordination
  ward_number         INTEGER NOT NULL CHECK (ward_number BETWEEN 1 AND 60),
  department          TEXT NOT NULL,
  urgency             TEXT NOT NULL DEFAULT 'normal' CHECK (urgency IN ('urgent', 'normal', 'courtesy')),
  preferred_date      DATE,
  preferred_window    TEXT CHECK (preferred_window IN ('morning', 'afternoon')),
  subject             TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rescheduled', 'completed', 'cancelled')),
  slot_time           TEXT, -- e.g. '11:30 AM'
  officer_notes       TEXT,
  reschedule_reason   TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Index for instant lookup by token_code and ward_number
CREATE INDEX IF NOT EXISTS idx_appointments_token ON sabhapati_appointments(token_code);
CREATE INDEX IF NOT EXISTS idx_appointments_ward ON sabhapati_appointments(ward_number);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON sabhapati_appointments(status);

-- Enable RLS and permissive policies for sabhapati_appointments
ALTER TABLE sabhapati_appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on sabhapati_appointments" ON sabhapati_appointments;
CREATE POLICY "Allow public read on sabhapati_appointments" ON sabhapati_appointments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on sabhapati_appointments" ON sabhapati_appointments;
CREATE POLICY "Allow public insert on sabhapati_appointments" ON sabhapati_appointments FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on sabhapati_appointments" ON sabhapati_appointments;
CREATE POLICY "Allow public update on sabhapati_appointments" ON sabhapati_appointments FOR UPDATE USING (true);

-- Seed demo appointments for other wards (Ward 24 is left empty for fresh live user testing)
INSERT INTO sabhapati_appointments (id, token_code, full_name, community_surname, phone_primary, phone_secondary, ward_number, department, urgency, preferred_date, preferred_window, subject, status, slot_time, officer_notes)
VALUES
('b1111111-0000-0000-0000-000000000001', 'CTNP-APT-2610-0039', 'श्रीमती सुनीता शर्मा', 'ब्राह्मण समाज', '9829023456', '9829088776', 12, 'पट्टा एवं राजस्व शाखा', 'normal', '2026-10-06', 'morning', 'प्रशासन शहरों के संग अभियान अंतर्गत धारा 69A पट्टा पत्रावली स्वीकृति बाबत।', 'approved', '11:35 AM', 'पट्टा शाखा लिपिक को पत्रावली सहित उपस्थित रहने के निर्देश।'),
('b1111111-0000-0000-0000-000000000002', 'CTNP-APT-2610-0040', 'कैलाश चंद्र धाकड़', 'किसान / धाकड़', '9829034567', '9414099887', 31, 'निर्माण एवं Engineering शाखा', 'urgent', '2026-10-06', 'afternoon', 'सेंथी मुख्य संपर्क मार्ग पुलिया सुरक्षा दीवार निर्माण व पेचवर्क।', 'pending', 'प्रतीक्षारत', ''),
('b1111111-0000-0000-0000-000000000003', 'CTNP-APT-2610-0041', 'महेंद्र सिंह राठौड़', 'राजपूत समाज', '9829045678', '9829011223', 8, 'विद्युत अनुभाग (स्ट्रीट लाइट)', 'normal', '2026-10-07', 'morning', 'किला रोड प्रवेश मार्ग पर नई हाई-मास्ट एलईडी लाइट स्थापना प्रस्ताव।', 'pending', 'प्रतीक्षारत', '')
ON CONFLICT (token_code) DO NOTHING;


