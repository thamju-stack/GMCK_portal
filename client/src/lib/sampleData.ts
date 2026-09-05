/* ============================================================
   GMC KOZHIKODE — sample data (clearly marked as placeholder)
   Replaced at runtime by GET /api/bootstrap from the backend.
   ============================================================ */
import type {
  AdmItem, BootstrapData, Department, Doctor, EmergencyConfig,
  NavRoute, Notice, NotificationItem, OpdRow, ServiceTile, TestItem,
} from '@/types';

export const DEPTS: Department[] = [
  { name: 'Cardiology', desc: 'Heart & cardiovascular care', cat: 'Super Speciality', loc: 'Main Hospital', opd: 'Mon–Sat, sample', services: ['ECG & ECHO', 'Cardiac OPD', 'Pre-op cardiac evaluation', 'Heart failure clinic'] },
  { name: 'Pulmonology', desc: 'Lungs & respiratory care', cat: 'Super Speciality', loc: 'OPD Block', opd: 'Mon–Sat, sample', services: ['Pulmonary function test', 'Asthma & allergy clinic', 'Chest OPD', 'Sleep clinic'] },
  { name: 'Neurology', desc: 'Brain, spine & nervous system', cat: 'Super Speciality', loc: 'Main Hospital', opd: 'Sample timing', services: ['Stroke unit', 'Epilepsy clinic', 'Neuro-OPD', 'EEG & EMG'] },
  { name: 'Orthopaedics', desc: 'Bones, joints & trauma care', cat: 'Surgical', loc: 'Ortho Block', opd: 'Mon–Sat, sample', services: ['Fracture care', 'Joint replacement', 'Sports injury', 'Spine clinic'] },
  { name: 'Ophthalmology', desc: 'Eye care & vision services', cat: 'Clinical', loc: 'OPD Block', opd: 'Sample timing', services: ['Cataract clinic', 'Retina clinic', 'Vision testing', 'Ocular medicines'] },
  { name: 'ENT', desc: 'Ear, nose & throat care', cat: 'Clinical', loc: 'OPD Block', opd: 'Sample timing', services: ['Hearing tests', 'Voice clinic', 'Sinus care', 'Minor ENT procedures'] },
  { name: 'Paediatrics', desc: 'Child health & care', cat: 'Clinical', loc: 'OPD Block', opd: 'Sample timing', services: ['Newborn care', 'Vaccination', 'Child development clinic', 'Paediatric OPD'] },
  { name: 'Obstetrics & Gynaecology', desc: 'Pregnancy & womens health', cat: 'Clinical', loc: 'Maternity Block', opd: 'Sample timing', services: ['Antenatal clinic', 'Labour & delivery', 'Gynaecology OPD', 'Family planning'] },
  { name: 'Dentistry', desc: 'Dental & oral health', cat: 'Clinical', loc: 'OPD Block', opd: 'Sample timing', services: ['General dentistry', 'Oral surgery', 'Root canal', 'Paediatric dentistry'] },
  { name: 'Dermatology', desc: 'Skin, hair & nail care', cat: 'Clinical', loc: 'OPD Block', opd: 'Sample timing', services: ['Skin OPD', 'Allergy clinic', 'Cosmetic procedures', 'Dermatological surgery'] },
  { name: 'General Medicine', desc: 'Adult internal medicine', cat: 'Clinical', loc: 'Main Hospital', opd: 'Mon–Sat, sample', services: ['Physician OPD', 'Diabetes clinic', 'Hypertension clinic', 'Fever clinic'] },
  { name: 'Radiology', desc: 'Diagnostic imaging services', cat: 'Diagnostic', loc: 'Radiology Wing', opd: 'Sample timing', services: ['X-Ray', 'Ultrasound', 'CT scan', 'MRI'] },
];

export const DOCS: Doctor[] = [
  { name: 'Dr. [Sample Name]', des: 'Professor & HOD', dept: 'Cardiology', spec: 'Interventional Cardiology' },
  { name: 'Dr. [Sample Name]', des: 'Associate Professor', dept: 'Cardiology', spec: 'Non-invasive Cardiology' },
  { name: 'Dr. [Sample Name]', des: 'Assistant Professor', dept: 'Medicine', spec: 'General & Internal Medicine' },
  { name: 'Dr. [Sample Name]', des: 'Professor', dept: 'Orthopaedics', spec: 'Joint Replacement & Trauma' },
  { name: 'Dr. [Sample Name]', des: 'Assistant Professor', dept: 'Paediatrics', spec: 'Neonatology' },
  { name: 'Dr. [Sample Name]', des: 'Consultant', dept: 'Neurology', spec: 'Stroke & Epilepsy' },
  { name: 'Dr. [Sample Name]', des: 'Associate Professor', dept: 'Dermatology', spec: 'Clinical Dermatology' },
];

export const NOTICES: Notice[] = [
  { t: 'OPD schedule update for the week', cat: 'Hospital', c: 'cat-hosp', d: '5 Sep 2026', s: 'Sample notice text. Weekly OPD timings may be updated. Refer to the OPD desk.' },
  { t: 'UG admission counselling schedule', cat: 'Admission', c: 'cat-adm', d: '4 Sep 2026', s: 'Sample notice. Candidates should refer to the official admission portal for dates.' },
  { t: 'Final year examination timetable', cat: 'Examination', c: 'cat-exam', d: '2 Sep 2026', s: 'Sample notice. Examination schedule issued by the examination cell.' },
  { t: 'Emergency preparedness drill announced', cat: 'Hospital', c: 'cat-emo', d: '30 Aug 2026', s: 'Sample notice. Periodic emergency drill for hospital staff.' },
  { t: 'Research colloquium registration open', cat: 'Academics', c: 'cat-acad', d: '28 Aug 2026', s: 'Sample notice. Research colloquium for postgraduate students and faculty.' },
];

export const NOTIFS: NotificationItem[] = [
  { t: 'OPD schedule update', s: 'OPD timings updated for this week.', time: '2h ago', unread: true, b: 'var(--primary-light)', col: 'var(--primary)' },
  { t: 'Hospital notice', s: 'Main block maintenance notice.', time: '5h ago', unread: true, b: 'var(--primary-light)', col: 'var(--primary)' },
  { t: 'Admission notice', s: 'UG counselling schedule published.', time: '1d ago', unread: true, b: 'var(--amber-light)', col: 'var(--amber)' },
  { t: 'Exam notification', s: 'Timetable for final year released.', time: '2d ago', unread: false, b: '#F0EBFA', col: '#6B4FA0' },
  { t: 'Emergency announcement', s: 'Emergency drill scheduled this week.', time: '3d ago', unread: false, b: 'var(--danger-light)', col: 'var(--danger)' },
];

/* Problem-based (symptom) → department mapping */
export const PROBLEM_MAP: Record<string, string> = {
  'chest pain': 'Cardiology', 'chest': 'Cardiology', 'heart': 'Cardiology', 'cardiac': 'Cardiology',
  'breathing problem': 'Pulmonology', 'breathing': 'Pulmonology', 'lung': 'Pulmonology',
  'bone pain': 'Orthopaedics', 'bone': 'Orthopaedics', 'joint': 'Orthopaedics', 'fracture': 'Orthopaedics',
  'skin problem': 'Dermatology', 'skin': 'Dermatology', 'rash': 'Dermatology',
  'headache': 'Neurology', 'brain': 'Neurology', 'nerve': 'Neurology', 'seizure': 'Neurology',
  'eye': 'Ophthalmology', 'vision': 'Ophthalmology',
  'ear': 'ENT', 'nose': 'ENT', 'throat': 'ENT', 'ent': 'ENT',
  'child': 'Paediatrics', 'baby': 'Paediatrics', 'vaccination': 'Paediatrics',
  'pregnancy': 'Obstetrics & Gynaecology', 'pregnant': 'Obstetrics & Gynaecology',
  'dental': 'Dentistry', 'tooth': 'Dentistry',
};

export const HOME_SERVICES: ServiceTile[] = [
  { t: "Doctor's Directory", icon: 'doctors', to: '/doctors' },
  { t: 'OPD Schedule', icon: 'opd', to: '/opd' },
  { t: 'Departments', icon: 'depts', to: '/departments' },
  { t: 'Hospital Navigation', icon: 'nav', to: '/navigation' },
  { t: 'Admissions', icon: 'admissions', to: '/admissions' },
];

export const OPD_FALLBACK: OpdRow[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => ({
  day,
  morning: i === 5 ? 'Limited OPD' : '<b>Sample</b> • OPD',
  afternoon: '<b>Sample</b> • OPD',
}));

export const EMERGENCY_FALLBACK: EmergencyConfig = {
  phone: 'Placeholder — official emergency number will be added',
  helpdesk: 'Helpdesk (sample) — check at main reception',
};

export const TESTS: TestItem[] = [
  { title: 'Complete Blood Count (CBC)', type: 'Laboratory', sample: 'Venous blood', prep: 'Collect on empty stomach. Sample collection at Central Laboratory, Ground Floor.' },
  { title: 'Blood Sugar (Fasting)', type: 'Laboratory', sample: 'Venous blood', prep: 'Fasting required (8–10 hours). Sample at Central Laboratory, Ground Floor.' },
  { title: 'Lipid Profile', type: 'Laboratory', sample: 'Venous blood', prep: 'Fasting required (10–12 hours). Sample collection, Ground Floor lab.' },
  { title: 'X-Ray', type: 'Radiology', sample: 'Imaging', prep: 'Radiology Wing, Ground Floor. Report at Radiology counter.' },
  { title: 'CT Scan', type: 'Radiology', sample: 'Imaging', prep: 'CT Suite, Radiology Wing. Prior appointment required.' },
  { title: 'MRI', type: 'Radiology', sample: 'Imaging', prep: 'MRI Suite, Radiology Wing. Prior appointment required.' },
  { title: 'Ultrasound', type: 'Radiology', sample: 'Imaging', prep: 'USG Suite, Radiology Wing.' },
];

export const ADM: AdmItem[] = [
  { t: 'UG Admissions', d: 'MBBS (Bachelor of Medicine & Bachelor of Surgery)', o: 'MBBS admissions are conducted centrally through the national entrance examination (NEET-UG). Eligibility, merit list and counselling are decided by the competent admission authority.' },
  { t: 'PG Admissions', d: 'MD / MS postgraduate courses', o: 'Postgraduate (MD/MS) admissions follow national eligibility criteria (NEET-PG) with counselling by the competent authority.' },
  { t: 'Super Speciality', d: 'DM / MCh super speciality courses', o: 'DM / MCh admissions follow the national super-speciality entrance (NEET-SS) and merit-based counselling.' },
  { t: 'Nursing', d: 'Nursing education programmes', o: 'Nursing courses follow the eligibility and admission procedures issued by the university and the State.' },
  { t: 'Allied Health', d: 'Allied health sciences courses', o: 'Allied health science courses follow their respective eligibility and admission guidelines.' },
];

export const NAV_RESULTS: NavRoute[] = [
  ['Cardiology', 'Main Hospital', 'Ground Floor', 'Room 3'],
  ['Emergency', 'Main Block', 'Ground Floor', 'Casualty Reception'],
  ['Laboratory', 'Main Block', 'Ground Floor', 'Lab Reception'],
  ['Pharmacy', 'OPD Block', 'Ground Floor', 'Pharmacy Counter'],
  ['Radiology', 'Radiology Wing', 'Ground Floor', 'Imaging Reception'],
  ['Blood Bank', 'Main Block', 'First Floor', 'Blood Bank Wing'],
];

export const ACADEMIC_CAL: Array<[string, string]> = [
  ['Term 1', 'Sample: June – October'],
  ['Term 2', 'Sample: November – April'],
  ['Term Break', 'Sample: December (tbc)'],
];

export const SAMPLE_BOOTSTRAP: BootstrapData = {
  departments: DEPTS,
  doctors: DOCS,
  notices: NOTICES,
  notifications: NOTIFS,
  opd: OPD_FALLBACK,
  emergency: EMERGENCY_FALLBACK,
};