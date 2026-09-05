import type {
  BootstrapData, Department, Doctor, EmergencyConfig, Notice, NotificationItem, OpdRow,
} from './types.js';

export const SEED_DEPARTMENTS: Department[] = [
  { name: 'Cardiology', desc: 'Heart & cardiovascular care', cat: 'Super Speciality', loc: 'Main Hospital', opd: 'Mon–Sat', services: ['ECG & ECHO', 'Cardiac OPD', 'Pre-op cardiac evaluation', 'Heart failure clinic'] },
  { name: 'Pulmonology', desc: 'Lungs & respiratory care', cat: 'Super Speciality', loc: 'OPD Block', opd: 'Mon–Sat', services: ['Pulmonary function test', 'Asthma & allergy clinic', 'Chest OPD', 'Sleep clinic'] },
  { name: 'Neurology', desc: 'Brain, spine & nervous system', cat: 'Super Speciality', loc: 'Main Hospital', opd: 'Sample', services: ['Stroke unit', 'Epilepsy clinic', 'Neuro-OPD', 'EEG & EMG'] },
  { name: 'Orthopaedics', desc: 'Bones, joints & trauma care', cat: 'Surgical', loc: 'Ortho Block', opd: 'Mon–Sat', services: ['Fracture care', 'Joint replacement', 'Sports injury', 'Spine clinic'] },
  { name: 'Ophthalmology', desc: 'Eye care & vision services', cat: 'Clinical', loc: 'OPD Block', opd: 'Sample', services: ['Cataract clinic', 'Retina clinic', 'Vision testing', 'Ocular medicines'] },
  { name: 'ENT', desc: 'Ear, nose & throat care', cat: 'Clinical', loc: 'OPD Block', opd: 'Sample', services: ['Hearing tests', 'Voice clinic', 'Sinus care', 'Minor ENT procedures'] },
  { name: 'Paediatrics', desc: 'Child health & care', cat: 'Clinical', loc: 'OPD Block', opd: 'Sample', services: ['Newborn care', 'Vaccination', 'Child development clinic', 'Paediatric OPD'] },
  { name: 'Obstetrics & Gynaecology', desc: 'Pregnancy & womens health', cat: 'Clinical', loc: 'Maternity Block', opd: 'Sample', services: ['Antenatal clinic', 'Labour & delivery', 'Gynaecology OPD', 'Family planning'] },
  { name: 'Dentistry', desc: 'Dental & oral health', cat: 'Clinical', loc: 'OPD Block', opd: 'Sample', services: ['General dentistry', 'Oral surgery', 'Root canal', 'Paediatric dentistry'] },
  { name: 'Dermatology', desc: 'Skin, hair & nail care', cat: 'Clinical', loc: 'OPD Block', opd: 'Sample', services: ['Skin OPD', 'Allergy clinic', 'Cosmetic procedures', 'Dermatological surgery'] },
  { name: 'General Medicine', desc: 'Adult internal medicine', cat: 'Clinical', loc: 'Main Hospital', opd: 'Mon–Sat', services: ['Physician OPD', 'Diabetes clinic', 'Hypertension clinic', 'Fever clinic'] },
  { name: 'Radiology', desc: 'Diagnostic imaging services', cat: 'Diagnostic', loc: 'Radiology Wing', opd: 'Sample', services: ['X-Ray', 'Ultrasound', 'CT scan', 'MRI'] },
];

export const SEED_DOCTORS: Doctor[] = [
  { name: 'Dr. [Sample Name]', des: 'Professor & HOD', dept: 'Cardiology', spec: 'Interventional Cardiology' },
  { name: 'Dr. [Sample Name]', des: 'Associate Professor', dept: 'Cardiology', spec: 'Non-invasive Cardiology' },
  { name: 'Dr. [Sample Name]', des: 'Assistant Professor', dept: 'General Medicine', spec: 'General & Internal Medicine' },
  { name: 'Dr. [Sample Name]', des: 'Professor', dept: 'Orthopaedics', spec: 'Joint Replacement & Trauma' },
  { name: 'Dr. [Sample Name]', des: 'Assistant Professor', dept: 'Paediatrics', spec: 'Neonatology' },
  { name: 'Dr. [Sample Name]', des: 'Consultant', dept: 'Neurology', spec: 'Stroke & Epilepsy' },
  { name: 'Dr. [Sample Name]', des: 'Associate Professor', dept: 'Dermatology', spec: 'Clinical Dermatology' },
];

export const SEED_NOTICES: Notice[] = [
  { t: 'OPD schedule update for the week', cat: 'Hospital', c: 'cat-hosp', d: '5 Sep 2026', s: 'Sample notice text. Weekly OPD timings may be updated. Refer to the OPD desk.' },
  { t: 'UG admission counselling schedule', cat: 'Admission', c: 'cat-adm', d: '4 Sep 2026', s: 'Sample notice. Candidates should refer to the official admission portal for dates.' },
  { t: 'Final year examination timetable', cat: 'Examination', c: 'cat-exam', d: '2 Sep 2026', s: 'Sample notice. Examination schedule issued by the examination cell.' },
  { t: 'Emergency preparedness drill announced', cat: 'Hospital', c: 'cat-emo', d: '30 Aug 2026', s: 'Sample notice. Periodic emergency drill for hospital staff.' },
  { t: 'Research colloquium registration open', cat: 'Academics', c: 'cat-acad', d: '28 Aug 2026', s: 'Sample notice. Research colloquium for postgraduate students and faculty.' },
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  { t: 'OPD schedule update', s: 'OPD timings updated for this week.', time: '2h ago', unread: true, b: 'var(--primary-light)', col: 'var(--primary)' },
  { t: 'Hospital notice', s: 'Main block maintenance notice.', time: '5h ago', unread: true, b: 'var(--primary-light)', col: 'var(--primary)' },
  { t: 'Admission notice', s: 'UG counselling schedule published.', time: '1d ago', unread: true, b: 'var(--amber-light)', col: 'var(--amber)' },
  { t: 'Exam notification', s: 'Timetable for final year released.', time: '2d ago', unread: false, b: '#F0EBFA', col: '#6B4FA0' },
  { t: 'Emergency announcement', s: 'Emergency drill scheduled this week.', time: '3d ago', unread: false, b: 'var(--danger-light)', col: 'var(--danger)' },
];

export const SEED_OPD: OpdRow[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => ({
  day,
  morning: i === 5 ? 'Limited OPD' : 'OPD 9:00–13:00',
  afternoon: 'OPD 14:00–16:00',
}));

export const SEED_EMERGENCY: EmergencyConfig = {
  phone: 'Placeholder — official emergency number will be added',
  helpdesk: 'Helpdesk (sample) — check at main reception',
};

export function seedBootstrap(): BootstrapData {
  return {
    departments: SEED_DEPARTMENTS,
    doctors: SEED_DOCTORS,
    notices: SEED_NOTICES,
    notifications: SEED_NOTIFICATIONS,
    opd: SEED_OPD,
    emergency: SEED_EMERGENCY,
  };
}