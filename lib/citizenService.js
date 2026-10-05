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

// Department name translation dictionary
export const DEPT_NAME_HINDI = {
  'Sanitation': 'स्वास्थ्य एवं स्वच्छता शाखा',
  'Engineering': 'निर्माण एवं इंजीनियरिंग शाखा',
  'Water Supply': 'जल प्रदाय शाखा',
  'Electrical': 'विद्युत अनुभाग',
  'Parks & Garden': 'उद्यान विकास शाखा',
  'Animal Control': 'पशु नियंत्रण एवं स्वच्छता शाखा',
  'Other': 'सामान्य प्रशासन अनुभाग',
};

// Cached metadata for high-speed offline & online matching
let cachedWardsMap = null;
let cachedCategoriesList = null;

export async function getSupabaseWardsMap() {
  if (cachedWardsMap) return cachedWardsMap;
  try {
    if (supabase) {
      const { data } = await supabase.from('wards').select('id, ward_number');
      if (data && data.length) {
        cachedWardsMap = {};
        data.forEach(w => {
          cachedWardsMap[String(w.ward_number)] = w.id;
        });
        return cachedWardsMap;
      }
    }
  } catch (_) {}
  return {};
}

export async function getSupabaseCategoriesList() {
  if (cachedCategoriesList) return cachedCategoriesList;
  try {
    if (supabase) {
      const { data } = await supabase.from('categories').select('id, name, name_hindi, department_id, sla_hours');
      if (data && data.length) {
        cachedCategoriesList = data;
        return cachedCategoriesList;
      }
    }
  } catch (_) {}
  return [];
}

export function resolveSupabaseCategory(catStr, categories) {
  if (!catStr || !categories?.length) return null;
  const lower = catStr.toLowerCase();
  for (const c of categories) {
    if (lower.includes(c.name.toLowerCase()) || (c.name_hindi && lower.includes(c.name_hindi.toLowerCase()))) {
      return c;
    }
  }
  if (lower.includes('कचरा') || lower.includes('सफाई') || lower.includes('waste') || lower.includes('garbage')) {
    return categories.find(c => c.name_hindi?.includes('कचरा'));
  }
  if (lower.includes('नाला') || lower.includes('नाली') || lower.includes('सीवरेज') || lower.includes('drain')) {
    return categories.find(c => c.name_hindi?.includes('नाला'));
  }
  if (lower.includes('सड़क') || lower.includes('गड्ढा') || lower.includes('road') || lower.includes('pothole')) {
    return categories.find(c => c.name_hindi?.includes('सड़क'));
  }
  if (lower.includes('पानी') || lower.includes('जल') || lower.includes('water') || lower.includes('लीकेज')) {
    return categories.find(c => c.name_hindi?.includes('पानी की आपूर्ति')) || categories.find(c => c.name_hindi?.includes('रिसाव'));
  }
  if (lower.includes('लाइट') || lower.includes('light') || lower.includes('बिजली')) {
    return categories.find(c => c.name_hindi?.includes('स्ट्रीट लाइट'));
  }
  if (lower.includes('पार्क') || lower.includes('उद्यान') || lower.includes('park')) {
    return categories.find(c => c.name_hindi?.includes('पार्क'));
  }
  if (lower.includes('पशु') || lower.includes('animal') || lower.includes('कुत्ते')) {
    return categories.find(c => c.name_hindi?.includes('आवारा पशु'));
  }
  return categories.find(c => c.name === 'Other') || categories[0];
}

export function parseAddressCitizen(address) {
  let location = address || '';
  let citizenName = 'राजेश कुमार शर्मा';
  let citizenPhone = '9829012345';

  const match = address?.match(/\[नागरिक:\s*([^|\]]+)(?:\|\s*([^\]]+))?\]/);
  if (match) {
    citizenName = match[1]?.trim() || citizenName;
    citizenPhone = match[2]?.trim() || citizenPhone;
    location = address.replace(match[0], '').trim();
  }
  return { location, citizenName, citizenPhone };
}

export function rowToComplaint(row) {
  const { location, citizenName, citizenPhone } = parseAddressCitizen(row.address);
  const wardNumber = row.ward?.ward_number ? String(row.ward.ward_number) : '24';
  const createdDate = row.created_at ? new Date(row.created_at) : new Date();
  const dateStr = createdDate.toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const deptName = row.department?.name ? (DEPT_NAME_HINDI[row.department.name] || row.department.name) : 'सामान्य प्रशासन अनुभाग';

  const statusDetailsMap = {
    submitted: 'शिकायत दर्ज — स्वतः विभागीय आवंटन पूर्ण, क्षेत्रीय टीम को प्रेषित।',
    acknowledged: 'शिकायत स्वीकृत — संबंधित शाखा द्वारा संज्ञान में ली गई।',
    assigned: 'कार्य आवंटित — फील्ड दल को स्थल निरीक्षण हेतु प्रेषित।',
    in_progress: 'कार्य प्रगति पर — स्थल पर समाधान कार्य चल रहा है।',
    resolved: 'शिकायत निस्तारित — कार्य पूर्ण कर समाधान दर्ज किया गया।',
    closed: 'प्रकरण बंद — नागरिक संतुष्टि उपरांत निस्तारित।',
    reopened: 'शिकायत पुनः खोली गई — पुनर्निरीक्षण जारी।',
  };

  return {
    id: row.id,
    code: row.complaint_code || `CTNP-2026-${String(row.id).slice(0, 6)}`,
    category: row.title || (row.category?.name_hindi ? `${row.category.name_hindi} (${row.category.name})` : 'नागरिक शिकायत'),
    ward: `वार्ड ${wardNumber}`,
    wardNumber: parseInt(wardNumber, 10),
    dept: deptName,
    status: row.status || 'submitted',
    priority: row.priority || 'normal',
    date: dateStr,
    sla: row.category?.sla_hours ? `${row.category.sla_hours} घंटे` : '48 घंटे',
    sla_deadline: row.sla_deadline,
    statusDetail: statusDetailsMap[row.status] || 'शिकायत दर्ज — प्रक्रियाधीन।',
    description: row.description || 'नागरिक द्वारा प्रस्तुत वार्ड समस्या का विवरण।',
    location: location || `वार्ड नं. ${wardNumber}, चित्तौड़गढ़`,
    citizenName,
    citizenPhone,
    hasPhoto: !!row.photo_url,
    photo_url: row.photo_url,
    isNew: true,
    created_at: row.created_at,
  };
}

/**
 * Get real complaints filed by this citizen phone number
 * Reads from Supabase live database with localStorage fallback and sync
 */
export async function getCitizenComplaints(phone) {
  if (!phone) return [];
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const storageKey = `sc_citizen_complaints_${cleanPhone}`;

  // 1. Initial cached reading
  let cached = [];
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw !== null) {
        cached = JSON.parse(raw);
        if (cleanPhone === '9829012345' && Array.isArray(cached)) {
          cached = cached.filter(c => c.id !== 101 && c.id !== 102 && c.code !== 'CTNP-2026-000125' && c.code !== 'CTNP-2026-000109');
        }
      }
    } catch (_) {}
  }

  // 2. Fetch live from Supabase
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('complaints')
        .select('*, ward:wards(ward_number, ward_name), category:categories(name, name_hindi), department:departments(name)')
        .ilike('address', `%${cleanPhone}%`)
        .order('created_at', { ascending: false });

      if (data && !error) {
        const liveItems = data.map(rowToComplaint);

        // Pre-configured mock citizen demo complaints (only for numbers other than Rajesh Kumar Sharma 9829012345)
        let defaultList = [];
        if (cleanPhone !== '9829012345' && DEFAULT_MOCK_CITIZENS[cleanPhone]) {
          defaultList = DEFAULT_MOCK_CITIZENS[cleanPhone].complaints || [];
        }

        // Combine live items and mock items, deduplicating by code
        const seenCodes = new Set();
        const combined = [];
        for (const item of [...liveItems, ...defaultList]) {
          if (!seenCodes.has(item.code)) {
            seenCodes.add(item.code);
            combined.push(item);
          }
        }

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(storageKey, JSON.stringify(combined));
          } catch (_) {}
        }

        return combined;
      }
    }
  } catch (err) {
    console.warn('Supabase getCitizenComplaints failed:', err?.message);
  }

  // 3. Fallback to cache or mock
  if (cached.length > 0) return cached;
  if (cleanPhone !== '9829012345' && DEFAULT_MOCK_CITIZENS[cleanPhone]) {
    return DEFAULT_MOCK_CITIZENS[cleanPhone].complaints || [];
  }

  return [];
}

/**
 * Add a new real complaint for this citizen
 * Stores into Supabase live database & notifies listeners
 */
export async function addCitizenComplaint(complaintData) {
  const profile = getStoredCitizenProfile();
  const phone = profile?.phone || '9829012345';
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const citizenName = profile?.name || 'राजेश कुमार शर्मा';
  const wardNumber = String(complaintData.ward || profile?.ward || '24').replace(/\D/g, '') || '24';
  const storageKey = `sc_citizen_complaints_${cleanPhone}`;

  // 1. Resolve Supabase IDs for Ward, Category & Department
  const wardsMap = await getSupabaseWardsMap();
  const wardId = wardsMap[wardNumber] || null;

  const categories = await getSupabaseCategoriesList();
  const matchedCategory = resolveSupabaseCategory(complaintData.category, categories);
  const categoryId = matchedCategory?.id || null;
  const departmentId = matchedCategory?.department_id || null;

  const generatedCode = complaintData.code || `CTNP-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;
  const addressString = `${complaintData.location || `वार्ड नं. ${wardNumber}, चित्तौड़गढ़`} [नागरिक: ${citizenName} | ${cleanPhone}]`;

  let createdComplaint = null;

  // 2. Insert into Supabase live database
  try {
    if (supabase) {
      const payload = {
        complaint_code: generatedCode,
        title: complaintData.category,
        description: complaintData.description || 'नागरिक द्वारा प्रस्तुत वार्ड समस्या का विवरण।',
        address: addressString,
        status: 'submitted',
        priority: 'normal',
      };
      if (wardId) payload.ward_id = wardId;
      if (categoryId) payload.category_id = categoryId;
      if (departmentId) payload.department_id = departmentId;

      const { data, error } = await supabase
        .from('complaints')
        .insert([payload])
        .select('*, ward:wards(ward_number, ward_name), category:categories(name, name_hindi), department:departments(name)');

      if (data && data.length > 0 && !error) {
        createdComplaint = rowToComplaint(data[0]);
      } else if (error) {
        console.warn('Supabase complaint insert error, falling back locally:', error.message);
      }
    }
  } catch (err) {
    console.warn('Supabase addCitizenComplaint failed:', err?.message);
  }

  // 3. Fallback object if Supabase insert was not returned
  if (!createdComplaint) {
    const now = new Date();
    const timeStr = now.toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const deptTitle = matchedCategory?.department_id ? 'स्वास्थ्य एवं स्वच्छता शाखा' : (complaintData.dept || 'स्वास्थ्य एवं स्वच्छता शाखा');
    createdComplaint = {
      id: Date.now(),
      code: generatedCode,
      category: complaintData.category,
      ward: `वार्ड ${wardNumber}`,
      wardNumber: parseInt(wardNumber, 10),
      dept: deptTitle,
      status: 'submitted',
      date: timeStr,
      sla: complaintData.sla || '48 घंटे',
      statusDetail: 'शिकायत दर्ज — स्वतः विभागीय आवंटन पूर्ण, क्षेत्रीय टीम को प्रेषित।',
      description: complaintData.description || '',
      location: complaintData.location || `वार्ड नं. ${wardNumber}, चित्तौड़गढ़`,
      citizenName,
      citizenPhone: cleanPhone,
      hasPhoto: !!complaintData.photo,
      isNew: true,
      created_at: new Date().toISOString(),
    };
  }

  // 4. Update localStorage caches
  if (typeof window !== 'undefined') {
    try {
      // Citizen's personal complaints cache
      const rawCurrent = localStorage.getItem(storageKey);
      const currentList = rawCurrent ? JSON.parse(rawCurrent) : [];
      const updatedPersonal = [createdComplaint, ...currentList.filter(c => c.code !== createdComplaint.code)];
      localStorage.setItem(storageKey, JSON.stringify(updatedPersonal));

      // Shared cross-portal register
      const rawShared = localStorage.getItem('sc_shared_live_complaints');
      const sharedList = rawShared ? JSON.parse(rawShared) : [];
      const updatedShared = [createdComplaint, ...sharedList.filter(c => c.code !== createdComplaint.code)];
      localStorage.setItem('sc_shared_live_complaints', JSON.stringify(updatedShared));

      // Dispatch real-time events for open tabs
      window.dispatchEvent(new CustomEvent('sc_complaints_updated', { detail: createdComplaint }));
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}
  }

  return createdComplaint;
}

/**
 * Retrieve shared live complaints synchronously from localStorage cache
 */
export function getSharedLiveComplaints(filterWard = null) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('sc_shared_live_complaints');
    const list = raw ? JSON.parse(raw) : [];
    const cleanedList = list.filter(c => c.id !== 101 && c.id !== 102 && c.code !== 'CTNP-2026-000125' && c.code !== 'CTNP-2026-000109');
    if (cleanedList.length !== list.length) {
      localStorage.setItem('sc_shared_live_complaints', JSON.stringify(cleanedList));
    }
    if (!filterWard) return cleanedList;
    const cleanW = String(filterWard).replace(/\D/g, '');
    return cleanedList.filter(c => {
      const cWard = String(c.ward || c.wardNumber || '').replace(/\D/g, '');
      return cWard === cleanW;
    });
  } catch (e) {
    return [];
  }
}

/**
 * Retrieve shared live complaints asynchronously directly from Supabase database
 * Syncs the fresh Supabase rows to localStorage and notifies UI listeners
 */
export async function fetchSharedLiveComplaints(filterWard = null) {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('complaints')
        .select('*, ward:wards(ward_number, ward_name), category:categories(name, name_hindi), department:departments(name)')
        .order('created_at', { ascending: false });

      if (data && !error) {
        const formatted = data.map(rowToComplaint);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('sc_shared_live_complaints', JSON.stringify(formatted));
            window.dispatchEvent(new CustomEvent('sc_complaints_updated', { detail: formatted }));
          } catch (_) {}
        }
        if (!filterWard) return formatted;
        const cleanW = String(filterWard).replace(/\D/g, '');
        return formatted.filter(c => {
          const cWard = String(c.ward || c.wardNumber || '').replace(/\D/g, '');
          return cWard === cleanW;
        });
      }
    }
  } catch (err) {
    console.warn('Supabase fetchSharedLiveComplaints failed:', err?.message);
  }
  return getSharedLiveComplaints(filterWard);
}

// Singleton Realtime subscriber set & channel
const realtimeListeners = new Set();
let globalComplaintsChannel = null;

function ensureGlobalRealtimeChannel() {
  if (typeof window === 'undefined' || !supabase || typeof supabase.channel !== 'function') return;
  if (globalComplaintsChannel) return;

  try {
    globalComplaintsChannel = supabase
      .channel('sc_complaints_global_stream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, async () => {
        const fresh = await fetchSharedLiveComplaints();
        realtimeListeners.forEach(listener => {
          try {
            if (typeof listener === 'function') listener(fresh);
          } catch (_) {}
        });
      })
      .subscribe();
  } catch (err) {
    console.warn('Realtime channel init error:', err?.message);
  }
}

/**
 * Live subscription helper: listens to localStorage, custom events, and Supabase Realtime channel
 */
export function subscribeToLiveComplaints(callback) {
  if (typeof window === 'undefined') return () => {};

  if (typeof callback === 'function') {
    realtimeListeners.add(callback);
    ensureGlobalRealtimeChannel();
  }

  function handleUpdate() {
    if (typeof callback === 'function') {
      callback(getSharedLiveComplaints());
    }
  }

  window.addEventListener('storage', handleUpdate);
  window.addEventListener('sc_complaints_updated', handleUpdate);

  return () => {
    if (typeof callback === 'function') {
      realtimeListeners.delete(callback);
    }
    window.removeEventListener('storage', handleUpdate);
    window.removeEventListener('sc_complaints_updated', handleUpdate);
    if (realtimeListeners.size === 0 && globalComplaintsChannel) {
      try {
        supabase.removeChannel(globalComplaintsChannel);
      } catch (_) {}
      globalComplaintsChannel = null;
    }
  };
}

/**
 * Clear stored citizen profile from localStorage
 */
export function clearStoredCitizenProfile() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PROFILE_KEY);
  }
}


