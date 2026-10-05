// lib/citizenService.js
// Client-side & Supabase persistent storage service for Zero-OTP Citizens

import supabase from './supabaseClient';

const PROFILE_KEY = 'sc_citizen_profile';
const REGISTRY_KEY = 'sc_all_registered_citizens';

export const DEFAULT_MOCK_CITIZENS = {
  '9829012345': {
    name: 'राजेश कुमार शर्मा',
    phone: '9829012345',
    ward: '24',
    mohalla: 'भारत माता चौक, मुख्य बाजार',
    pin: '1234', // WITH PIN
    role: 'citizen',
    complaints: [] // Fresh zero slate for live user testing
  },
  '9829023456': {
    name: 'सुनीता शर्मा',
    phone: '9829023456',
    ward: '12',
    mohalla: 'स्टेशन रोड, गांधी नगर',
    pin: '', // WITHOUT PIN (Instant 1-click login)
    role: 'citizen',
    complaints: [
      {
        id: 103,
        code: 'CTNP-2026-000104',
        category: 'पेयजल पाइपलाइन लीकेज (Water Pipeline)',
        ward: 'वार्ड 12',
        dept: 'जल प्रदाय शाखा',
        status: 'assigned',
        date: '30 सितं 2026',
        sla: '24 घंटे',
        location: 'स्टेशन रोड, मुख्य चौराहा',
        description: 'मुख्य पाइपलाइन में रिसाव से पानी बह रहा है।',
        statusDetail: 'कार्य आवंटित — प्लम्बर दल को मौके पर भेजा गया है।',
        assignedStaff: 'कैलाश चंद्र (जल प्रदाय प्रभारी)',
      }
    ]
  },
  '9829034567': {
    name: 'कैलाश चंद्र वैष्णव',
    phone: '9829034567',
    ward: '8',
    mohalla: 'सुभाष पार्क, किला रोड',
    pin: '9999', // WITH PIN
    role: 'citizen',
    complaints: [
      {
        id: 104,
        code: 'CTNP-2026-000130',
        category: 'पार्क में सूखी झाड़ियां व कटाई (Park Maintenance)',
        ward: 'वार्ड 8',
        dept: 'उद्यान विकास शाखा',
        status: 'submitted',
        date: '01 अक्टू 2026',
        sla: '72 घंटे',
        location: 'सुभाष पार्क परिसर, वार्ड 08',
        description: 'पार्क में खरपतवार व सूखी झाड़ियां अधिक हो गई हैं, कटाई अपेक्षित है।',
        statusDetail: 'शिकायत दर्ज — उद्यान शाखा को निरीक्षण प्रेषित।',
      }
    ]
  },
  '9829045678': {
    name: 'पूजा टेलर',
    phone: '9829045678',
    ward: '41',
    mohalla: 'सेंथी आवासीय योजना, सेक्टर 2',
    pin: '', // WITHOUT PIN (Instant 1-click login)
    role: 'citizen',
    complaints: [
      {
        id: 105,
        code: 'CTNP-2026-000132',
        category: 'सड़क पुलिया मरम्मत (Road / Civil)',
        ward: 'वार्ड 41',
        dept: 'निर्माण एवं इंजीनियरिंग शाखा',
        status: 'in_progress',
        date: '29 सितं 2026',
        sla: '72 घंटे',
        location: 'सेंथी मुख्य संपर्क मार्ग पुलिया',
        description: 'पुलिया के किनारे दीवार क्षतिग्रस्त है, सुरक्षा दीवार बनवाई जाए।',
        statusDetail: 'कार्य प्रगति पर — सिविल विंग द्वारा सामग्री पहुंचाई गई है।',
        assignedStaff: 'विक्रम राठौड़ (सहायक अभियंता)',
      }
    ]
  },
  '9829056789': {
    name: 'मोहम्मद इमरान',
    phone: '9829056789',
    ward: '17',
    mohalla: 'प्रताप नगर, सामुदायिक भवन पास',
    pin: '4321', // WITH PIN
    role: 'citizen',
    complaints: [
      {
        id: 106,
        code: 'CTNP-2026-000135',
        category: 'कचरा पात्र स्थापना (Waste Bin)',
        ward: 'वार्ड 17',
        dept: 'स्वास्थ्य एवं स्वच्छता शाखा',
        status: 'submitted',
        date: '01 अक्टू 2026',
        sla: '48 घंटे',
        location: 'सामुदायिक भवन के पास, वार्ड 17',
        description: 'कचरा पात्र टूट गया है, नया डस्टबिन लगाया जाए।',
        statusDetail: 'शिकायत दर्ज — स्टोर से नया पात्र आवंटन प्रक्रियाधीन।',
      }
    ]
  },
  '9829067890': {
    name: 'दिनेश कुमावत',
    phone: '9829067890',
    ward: '24',
    mohalla: 'न्यू कॉलोनी, गली नं. 4',
    pin: '', // WITHOUT PIN (Instant 1-click login, 0 complaints to test empty state!)
    role: 'citizen',
    complaints: []
  },
};

/**
 * Get active citizen profile from localStorage
 */
export function getStoredCitizenProfile() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to read citizen profile:', e);
    return null;
  }
}

/**
 * Save new or updated citizen profile to localStorage and Supabase
 */
export async function saveCitizenProfile({ name, phone, ward, mohalla = '', pin = '' }) {
  if (!name || !phone || !ward) {
    throw new Error('कृपया पूरा नाम, 10 अंकों का मोबाइल नंबर एवं वार्ड संख्या अवश्य भरें।');
  }

  // Clean phone to 10 digits
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  if (cleanPhone.length !== 10) {
    throw new Error('कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें।');
  }

  const cleanWard = String(ward).replace('वार्ड ', '').replace('वार्ड नं. ', '').trim();
  const cleanPin = pin ? String(pin).replace(/\D/g, '').slice(0, 4) : '';

  const profileData = {
    name: name.trim(),
    phone: cleanPhone,
    ward: cleanWard,
    mohalla: (mohalla || '').trim(),
    pin: cleanPin,
    role: 'citizen',
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    // 1. Save as current active profile
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));

    // 2. Also register in local lookup dictionary by phone
    try {
      const rawReg = localStorage.getItem(REGISTRY_KEY);
      const reg = rawReg ? JSON.parse(rawReg) : {};
      reg[cleanPhone] = profileData;
      localStorage.setItem(REGISTRY_KEY, JSON.stringify(reg));
    } catch (_) {}
  }

  // 3. Sync to Supabase in background
  try {
    if (supabase) {
      await supabase.from('profiles').upsert({
        full_name: profileData.name,
        phone: cleanPhone,
        role: 'citizen',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'phone' });
    }
  } catch (err) {
    console.warn('Supabase sync skipped/failed:', err?.message);
  }

  return profileData;
}

/**
 * Frictionless Phone Lookup with 4-Digit MPIN Security
 * Retrieves a previously registered citizen by their 10-digit mobile number and PIN.
 */
export async function lookupCitizenByPhone(rawPhone, enteredPin = '') {
  const cleanPhone = (rawPhone || '').replace(/\D/g, '').slice(-10);
  if (cleanPhone.length !== 10) {
    throw new Error('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
  }

  let foundRecord = null;

  // 0. Check pre-configured mock citizens first
  if (DEFAULT_MOCK_CITIZENS[cleanPhone]) {
    foundRecord = { ...DEFAULT_MOCK_CITIZENS[cleanPhone] };
  }

  // 1. Check local registry
  if (!foundRecord && typeof window !== 'undefined') {
    try {
      const rawReg = localStorage.getItem(REGISTRY_KEY);
      const reg = rawReg ? JSON.parse(rawReg) : {};
      if (reg[cleanPhone]) {
        foundRecord = reg[cleanPhone];
      }
    } catch (_) {}
  }

  // 2. Check Supabase if not found locally
  if (!foundRecord) {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', cleanPhone)
          .maybeSingle();

        if (data && !error) {
          foundRecord = {
            name: data.full_name || 'नागरिक',
            phone: cleanPhone,
            ward: data.ward_id ? String(data.ward_id).replace(/\D/g, '') || '24' : '24',
            mohalla: data.address || '',
            pin: '',
            role: 'citizen',
            updatedAt: data.updated_at || new Date().toISOString(),
          };
        }
      }
    } catch (err) {
      console.warn('Supabase lookup failed:', err?.message);
    }
  }

  if (!foundRecord) {
    return null; // Not registered
  }

  // 3. If account has a PIN and no PIN is provided, request PIN
  if (foundRecord.pin && !enteredPin) {
    return { requiresPin: true, name: foundRecord.name, phone: cleanPhone };
  }

  // 4. If account has a PIN and PIN is provided, verify it
  if (foundRecord.pin && enteredPin) {
    const cleanEntered = String(enteredPin).replace(/\D/g, '').slice(0, 4);
    if (cleanEntered !== foundRecord.pin) {
      throw new Error('गलत 4-अंकीय सुरक्षा पिन (Invalid MPIN)। कृपया सही पिन दर्ज करें।');
    }
  }

  // 5. Success: store active profile
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(foundRecord));
  }

  return foundRecord;
}

/**
 * Get real complaints filed by this citizen phone number
 */
export async function getCitizenComplaints(phone) {
  if (!phone) return [];
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const storageKey = `sc_citizen_complaints_${cleanPhone}`;

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        // Ensure legacy mock complaints (id 101, 102) for Rajesh Kumar (9829012345) are purged for clean slate
        if (cleanPhone === '9829012345' && Array.isArray(parsed)) {
          const cleaned = parsed.filter(c => c.id !== 101 && c.id !== 102 && c.code !== 'CTNP-2026-000125' && c.code !== 'CTNP-2026-000109');
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(storageKey, JSON.stringify(cleaned));
          }
          return cleaned;
        }
        return parsed;
      }
    } catch (_) {}
  }

  // Check pre-configured mock citizen complaints if not saved in localStorage yet
  if (DEFAULT_MOCK_CITIZENS[cleanPhone]) {
    const defaultList = DEFAULT_MOCK_CITIZENS[cleanPhone].complaints || [];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(defaultList));
      } catch (_) {}
    }
    return defaultList;
  }

  return [];
}

/**
 * Add a new real complaint for this citizen
 */
export async function addCitizenComplaint(complaintData) {
  const profile = getStoredCitizenProfile();
  const phone = profile?.phone || '9829012345';
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const storageKey = `sc_citizen_complaints_${cleanPhone}`;

  const currentComplaints = await getCitizenComplaints(cleanPhone);

  const now = new Date();
  const timeStr = now.toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Map category to department automatically
  const deptMapping = {
    'कचरा': 'स्वास्थ्य एवं स्वच्छता शाखा',
    'सफाई': 'स्वास्थ्य एवं स्वच्छता शाखा',
    'नाली': 'स्वास्थ्य एवं स्वच्छता शाखा',
    'सीवरेज': 'स्वास्थ्य एवं स्वच्छता शाखा',
    'सड़क': 'निर्माण एवं इंजीनियरिंग शाखा',
    'गड्ढा': 'निर्माण एवं इंजीनियरिंग शाखा',
    'पेयजल': 'जल प्रदाय शाखा',
    'पाइपलाइन': 'जल प्रदाय शाखा',
    'स्ट्रीट लाइट': 'विद्युत अनुभाग',
    'लाइट': 'विद्युत अनुभाग',
    'पार्क': 'उद्यान विकास शाखा',
    'उद्यान': 'उद्यान विकास शाखा',
    'पशु': 'पशु नियंत्रण एवं स्वच्छता शाखा',
    'कुत्ते': 'पशु नियंत्रण एवं स्वच्छता शाखा',
  };

  let assignedDept = 'सामान्य प्रशासन अनुभाग';
  for (const [kw, d] of Object.entries(deptMapping)) {
    if ((complaintData.category || '').includes(kw)) {
      assignedDept = d;
      break;
    }
  }

  const newComplaint = {
    id: Date.now(),
    code: complaintData.code || `CTNP-2026-${String(Math.floor(100000 + Math.random() * 900000))}`,
    category: complaintData.category,
    ward: `वार्ड ${complaintData.ward || profile?.ward || '24'}`,
    dept: assignedDept,
    status: 'submitted',
    date: timeStr,
    sla: complaintData.sla || '48 घंटे',
    statusDetail: 'शिकायत दर्ज — स्वतः विभागीय आवंटन पूर्ण, क्षेत्रीय टीम को प्रेषित।',
    description: complaintData.description || '',
    location: complaintData.location || `वार्ड नं. ${complaintData.ward || profile?.ward || '24'}, चित्तौड़गढ़`,
    citizenName: profile?.name || 'राजेश कुमार शर्मा',
    citizenPhone: cleanPhone,
    hasPhoto: !!complaintData.photo,
    isNew: true, // Marked freshly raised for live Parshad highlight
  };

  const updated = [newComplaint, ...currentComplaints];

  if (typeof window !== 'undefined') {
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Also persist in shared cross-portal register so Parshad & Chairman view it instantly
    try {
      const rawShared = localStorage.getItem('sc_shared_live_complaints');
      const sharedList = rawShared ? JSON.parse(rawShared) : [];
      // Deduplicate by code
      const filtered = sharedList.filter(item => item.code !== newComplaint.code);
      localStorage.setItem('sc_shared_live_complaints', JSON.stringify([newComplaint, ...filtered]));
    } catch (_) {}
  }

  // Background Supabase insert
  try {
    if (supabase) {
      await supabase.from('complaints').insert([{
        complaint_code: newComplaint.code,
        title: newComplaint.category,
        description: newComplaint.description,
        address: newComplaint.location,
        status: 'submitted',
      }]);
    }
  } catch (err) {
    console.warn('Supabase insert failed/skipped:', err?.message);
  }

  return newComplaint;
}

/**
 * Retrieve shared live complaints filed from the citizen portal for a specific ward
 */
export function getSharedLiveComplaints(filterWard = null) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('sc_shared_live_complaints');
    const list = raw ? JSON.parse(raw) : [];
    // Filter out legacy dummy complaints for ward 24 if any
    const cleanedList = list.filter(c => c.id !== 101 && c.id !== 102 && c.code !== 'CTNP-2026-000125' && c.code !== 'CTNP-2026-000109');
    if (cleanedList.length !== list.length) {
      localStorage.setItem('sc_shared_live_complaints', JSON.stringify(cleanedList));
    }
    if (!filterWard) return cleanedList;
    const cleanW = String(filterWard).replace(/\D/g, '');
    return cleanedList.filter(c => {
      const cWard = String(c.ward || '').replace(/\D/g, '');
      return cWard === cleanW;
    });
  } catch (e) {
    return [];
  }
}

/**
 * Clear stored citizen profile from localStorage
 */
export function clearStoredCitizenProfile() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PROFILE_KEY);
  }
}

