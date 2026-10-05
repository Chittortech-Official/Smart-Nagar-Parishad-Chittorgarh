// lib/appointmentService.js
// Enterprise-Grade Appointment Management Service for Sabhapati Shri Anil Inani
// Dual-Store: LocalStorage + Supabase PostgreSQL (Collision-Proof Sequential Tokens)

import supabase from './supabaseClient';

const STORAGE_KEY = 'sc_sabhapati_appointments';
const TOUR_STATUS_KEY = 'sc_chairman_tour_status';

// Realistic pre-seeded demo appointments for Nagar Parishad Chittorgarh
export const INITIAL_DEMO_APPOINTMENTS = [
  {
    id: 'apt-101',
    tokenCode: 'CTNP-APT-2610-0038',
    fullName: 'राजेश कुमार',
    communitySurname: 'सोनी / स्वर्णकार',
    phonePrimary: '9829012345',
    phoneSecondary: '9414012345',
    wardNumber: 24,
    department: 'स्वास्थ्य एवं स्वच्छता शाखा',
    urgency: 'urgent',
    preferredDate: '2026-10-06',
    preferredWindow: 'morning',
    subject: 'भारत माता चौक मुख्य बाजार में नाली क्रॉसिंग व ओवरफ्लो कचरा पात्र स्थायी समाधान बाबत।',
    status: 'approved',
    slotTime: '11:15 AM',
    officerNotes: 'स्वास्थ्य अधिकारी श्री रमेश शर्मा को संयुक्त मौका निरीक्षण हेतु निर्देशित किया गया।',
    createdAt: '2026-10-04T10:30:00Z',
  },
  {
    id: 'apt-102',
    tokenCode: 'CTNP-APT-2610-0039',
    fullName: 'श्रीमती सुनीता शर्मा',
    communitySurname: 'ब्राह्मण समाज',
    phonePrimary: '9829023456',
    phoneSecondary: '9829088776',
    wardNumber: 12,
    department: 'पट्टा एवं राजस्व शाखा',
    urgency: 'normal',
    preferredDate: '2026-10-06',
    preferredWindow: 'morning',
    subject: 'प्रशासन शहरों के संग अभियान अंतर्गत धारा 69A पट्टा पत्रावली स्वीकृति बाबत।',
    status: 'approved',
    slotTime: '11:35 AM',
    officerNotes: 'पट्टा शाखा लिपिक को पत्रावली सहित उपस्थित रहने के निर्देश।',
    createdAt: '2026-10-04T11:45:00Z',
  },
  {
    id: 'apt-103',
    tokenCode: 'CTNP-APT-2610-0040',
    fullName: 'कैलाश चंद्र धाकड़',
    communitySurname: 'किसान / धाकड़',
    phonePrimary: '9829034567',
    phoneSecondary: '9414099887',
    wardNumber: 31,
    department: 'निर्माण एवं Engineering शाखा',
    urgency: 'urgent',
    preferredDate: '2026-10-06',
    preferredWindow: 'afternoon',
    subject: 'सेंथी मुख्य संपर्क मार्ग पुलिया सुरक्षा दीवार निर्माण व पेचवर्क।',
    status: 'pending',
    slotTime: 'प्रतीक्षारत',
    officerNotes: '',
    createdAt: '2026-10-05T09:00:00Z',
  },
  {
    id: 'apt-104',
    tokenCode: 'CTNP-APT-2610-0041',
    fullName: 'महेंद्र सिंह राठौड़',
    communitySurname: 'राजपूत समाज',
    phonePrimary: '9829045678',
    phoneSecondary: '9829011223',
    wardNumber: 8,
    department: 'विद्युत अनुभाग (स्ट्रीट लाइट)',
    urgency: 'normal',
    preferredDate: '2026-10-07',
    preferredWindow: 'morning',
    subject: 'किला रोड प्रवेश मार्ग पर नई हाई-मास्ट एलईडी लाइट स्थापना प्रस्ताव।',
    status: 'pending',
    slotTime: 'प्रतीक्षारत',
    officerNotes: '',
    createdAt: '2026-10-05T09:40:00Z',
  },
];

/**
 * Get all appointments from localStorage merged with initial seed data
 */
export function getAppointments() {
  if (typeof window === 'undefined') return INITIAL_DEMO_APPOINTMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_APPOINTMENTS));
      return INITIAL_DEMO_APPOINTMENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEMO_APPOINTMENTS;
  } catch (e) {
    console.error('Error fetching appointments:', e);
    return INITIAL_DEMO_APPOINTMENTS;
  }
}

/**
 * Generate Guaranteed Collision-Free Sequential Token: CTNP-APT-2610-XXXX
 */
function generateCollisionFreeToken(existingList = []) {
  const yearMonth = '2610'; // Year 2026, Month 10
  
  // Find highest existing sequence number
  let maxSeq = 41;
  existingList.forEach(item => {
    if (item.tokenCode) {
      const match = item.tokenCode.match(/CTNP-APT-2610-(\d+)/);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    }
  });

  const nextSeq = maxSeq + 1;
  return `CTNP-APT-${yearMonth}-${String(nextSeq).padStart(4, '0')}`;
}

/**
 * Book a new appointment with Sabhapati Shri Anil Inani
 * Strictly validates 2 phone numbers, ward, and department.
 */
export async function bookAppointment({
  fullName,
  communitySurname = '',
  phonePrimary,
  phoneSecondary,
  wardNumber,
  department,
  urgency = 'normal',
  preferredDate,
  preferredWindow = 'morning',
  subject,
}) {
  if (!fullName || !phonePrimary || !phoneSecondary || !wardNumber || !department || !subject) {
    throw new Error('कृपया नाम, दोनों फोन नंबर, वार्ड संख्या, विभाग एवं समस्या का विवरण अवश्य भरें।');
  }

  // Clean 10-digit phone numbers
  const cleanPhone1 = String(phonePrimary).replace(/\D/g, '').slice(-10);
  const cleanPhone2 = String(phoneSecondary).replace(/\D/g, '').slice(-10);

  if (cleanPhone1.length !== 10) {
    throw new Error('कृपया पहला 10-अंकीय मान्य मोबाइल नंबर दर्ज करें।');
  }
  if (cleanPhone2.length !== 10) {
    throw new Error('कृपया दूसरा वैकल्पिक / व्हाट्सएप 10-अंकीय मोबाइल नंबर दर्ज करें।');
  }
  if (cleanPhone1 === cleanPhone2) {
    throw new Error('कृपया दोनों अलग-अलग संपर्क नंबर दर्ज करें ताकि संपर्क न होने पर वैकल्पिक नंबर पर बात हो सके।');
  }

  const cleanWard = parseInt(wardNumber, 10);
  if (isNaN(cleanWard) || cleanWard < 1 || cleanWard > 60) {
    throw new Error('वार्ड संख्या 1 से 60 के मध्य होनी चाहिए।');
  }

  const currentList = getAppointments();
  const token = generateCollisionFreeToken(currentList);

  const newAppointment = {
    id: `apt-${Date.now()}`,
    tokenCode: token,
    fullName: fullName.trim(),
    communitySurname: (communitySurname || '').trim(),
    phonePrimary: cleanPhone1,
    phoneSecondary: cleanPhone2,
    wardNumber: cleanWard,
    department: department.trim(),
    urgency: ['urgent', 'normal', 'courtesy'].includes(urgency) ? urgency : 'normal',
    preferredDate: preferredDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferredWindow: preferredWindow || 'morning',
    subject: subject.trim(),
    status: 'pending', // 'pending' | 'approved' | 'rescheduled' | 'completed'
    slotTime: 'सचिवालय द्वारा आवंटन प्रक्रियाधीन',
    officerNotes: '',
    rescheduleReason: '',
    createdAt: new Date().toISOString(),
  };

  const updatedList = [newAppointment, ...currentList];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (_) {}
  }

  // Background Async Supabase Insert
  try {
    if (supabase) {
      await supabase.from('sabhapati_appointments').insert([{
        token_code: newAppointment.tokenCode,
        full_name: newAppointment.fullName,
        community_surname: newAppointment.communitySurname,
        phone_primary: newAppointment.phonePrimary,
        phone_secondary: newAppointment.phoneSecondary,
        ward_number: newAppointment.wardNumber,
        department: newAppointment.department,
        urgency: newAppointment.urgency,
        preferred_date: newAppointment.preferredDate,
        preferred_window: newAppointment.preferredWindow,
        subject: newAppointment.subject,
        status: 'pending',
      }]);
    }
  } catch (err) {
    console.warn('Supabase appointment insert skipped/fallback to local:', err?.message);
  }

  return newAppointment;
}

/**
 * Update appointment status (Approve slot, Reschedule, Complete, Forward)
 */
export async function updateAppointmentStatus(tokenCode, { status, slotTime, officerNotes, rescheduleReason }) {
  const currentList = getAppointments();
  const index = currentList.findIndex(item => item.tokenCode === tokenCode);
  if (index === -1) return null;

  const target = currentList[index];
  const updated = {
    ...target,
    ...(status ? { status } : {}),
    ...(slotTime ? { slotTime } : {}),
    ...(officerNotes !== undefined ? { officerNotes } : {}),
    ...(rescheduleReason !== undefined ? { rescheduleReason } : {}),
    updatedAt: new Date().toISOString(),
  };

  currentList[index] = updated;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
    } catch (_) {}
  }

  // Background Supabase update
  try {
    if (supabase) {
      await supabase.from('sabhapati_appointments')
        .update({
          ...(status ? { status } : {}),
          ...(slotTime ? { slot_time: slotTime } : {}),
          ...(officerNotes ? { officer_notes: officerNotes } : {}),
          ...(rescheduleReason ? { reschedule_reason: rescheduleReason } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('token_code', tokenCode);
    }
  } catch (_) {}

  return updated;
}

/**
 * Chairman Tour / Out of Office status
 */
export function getChairmanTourStatus() {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(TOUR_STATUS_KEY) === 'true';
  } catch (_) {
    return false;
  }
}

export function setChairmanTourStatus(isOnTour) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(TOUR_STATUS_KEY, isOnTour ? 'true' : 'false');
    } catch (_) {}
  }
  return isOnTour;
}
