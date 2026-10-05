// lib/data/routerData.js
// Chittorgarh Nagar Parishad - Central Router & 60 Wards Data

export const MUNICIPAL_DEPARTMENTS = [
  { id: 'sanitation', name: 'स्वास्थ्य एवं स्वच्छता शाखा', icon: '🧹', color: '#16a34a', bg: '#f0fdf4' },
  { id: 'civil',      name: 'निर्माण एवं इंजीनियरिंग शाखा', icon: '🛣️', color: '#2563eb', bg: '#eff6ff' },
  { id: 'electrical', name: 'विद्युत अनुभाग (स्ट्रीट लाइट)', icon: '💡', color: '#d97706', bg: '#fffbeb' },
  { id: 'water',      name: 'जल प्रदाय शाखा',            icon: '🚰', color: '#0284c7', bg: '#f0f9ff' },
  { id: 'garden',     name: 'उद्यान विकास शाखा',        icon: '🌳', color: '#65a30d', bg: '#f7fee7' },
];

import { CHITTORGARH_60_WARDS } from './wardsResults';

export const ALL_60_WARDS = CHITTORGARH_60_WARDS.map((ward, i) => {
  const num = ward.num;
  const isWard24 = num === 24;
  const isWard12 = num === 12;
  const isWard8  = num === 8;
  const isWard41 = num === 41;
  const isWard17 = num === 17;

  let pendingCount = 0;
  let routedCount = ((num * 3 + 5) % 4) + 1;
  let resolvedCount = ((num * 7 + 2) % 6) + 3;

  if (isWard24) { pendingCount = 2; routedCount = 2; resolvedCount = 3; }
  else if (isWard12) { pendingCount = 1; routedCount = 1; resolvedCount = 2; }
  else if (isWard8)  { pendingCount = 1; routedCount = 1; resolvedCount = 4; }
  else if (isWard41) { pendingCount = 1; routedCount = 1; resolvedCount = 2; }
  else if (isWard17) { pendingCount = 1; routedCount = 2; resolvedCount = 3; }

  const areas = [
    'मुख्य बाजार, क्लॉक टावर चौराहा',
    'स्टेशन रोड, गांधी नगर',
    'कलेक्टर सर्किल, न्यू कॉलोनी',
    'किला रोड, पाडन पोल',
    'मीरा मार्केट, प्रताप नगर',
    'सेंथी आवासीय कॉलोनी',
    'चंंदेरिया लिंक रोड',
    'सुभाष पार्क, नेहरू नगर'
  ];

  return {
    num,
    name: `वार्ड संख्या ${num}`,
    councillor: ward.councillor,
    party: ward.party,
    reservation: ward.reservation,
    votes: ward.votes,
    margin: ward.margin,
    runnerUp: ward.runnerUp,
    phone: `98290-${String(20000 + num * 143).slice(0, 5)}`,
    area: isWard24 ? 'भारत माता चौक, बस स्टैंड, स्टेशन रोड' : areas[i % areas.length],
    pendingCount,
    routedCount,
    resolvedCount,
    totalComplaints: pendingCount + routedCount + resolvedCount,
  };
});

export const INITIAL_COMPLAINTS = [
  // Ward 24 Complaints
  {
    id: 1,
    code: 'CTNP-2026-000109',
    wardNum: 24,
    wardName: 'वार्ड संख्या 24',
    category: 'स्ट्रीट लाइट बंद',
    location: 'न्यू कॉलोनी, गली नं. 2, खंभा सं. 08',
    date: '01 अक्टू 2026, 02:15 PM',
    citizen: 'सुनीता देवी',
    citizenPhone: '98290-33445',
    description: 'गली नं. 2 के खंभा संख्या 08 की एलईडी लाइट विगत तीन दिवस से बंद है, पूरा मोहल्ला अंधेरे में है। रात्रि में आवागमन में असुविधा हो रही है।',
    photo: false,
    routedDept: null,
    status: 'submitted',
    routedAt: null,
    suggestedDept: 'विद्युत अनुभाग (स्ट्रीट लाइट)',
  },
  {
    id: 2,
    code: 'CTNP-2026-000112',
    wardNum: 24,
    wardName: 'वार्ड संख्या 24',
    category: 'नाली जाम एवं जलभराव',
    location: 'प्राथमिक विद्यालय के सामने, वार्ड 24',
    date: '01 अक्टू 2026, 11:30 AM',
    citizen: 'दिनेश कुमावत',
    citizenPhone: '98290-88776',
    description: 'विद्यालय के मुख्य द्वार के पास नाली में प्लास्टिक व कचरा फंसने से गंदा पानी सड़क पर आ रहा है। छात्र-छात्राओं को आने-जाने में भारी परेशानी है।',
    photo: true,
    routedDept: null,
    status: 'submitted',
    routedAt: null,
    suggestedDept: 'स्वास्थ्य एवं स्वच्छता शाखा',
  },
  {
    id: 3,
    code: 'CTNP-2026-000125',
    wardNum: 24,
    wardName: 'वार्ड संख्या 24',
    category: 'कचरा ओवरफ्लो',
    location: 'बस स्टैंड के पास, मुख्य सड़क',
    date: '01 अक्टू 2026, 09:30 AM',
    citizen: 'राजेश कुमार',
    citizenPhone: '98290-54321',
    description: 'बस स्टैंड के मुख्य तिराहे पर कचरा पात्र ओवरफ्लो हो रहा है एवं आवारा पशु जमा हैं। कृपया तत्काल कचरा वाहन भेजकर सफाई करवाई जाए।',
    photo: true,
    routedDept: 'स्वास्थ्य एवं स्वच्छता शाखा',
    status: 'assigned',
    routedAt: '01 अक्टू 2026, 09:45 AM',
    suggestedDept: 'स्वास्थ्य एवं स्वच्छता शाखा',
  },
  {
    id: 4,
    code: 'CTNP-2026-000118',
    wardNum: 24,
    wardName: 'वार्ड संख्या 24',
    category: 'सड़क गड्ढा मरम्मत',
    location: 'मुख्य बाजार सड़क, निकट क्लॉक टावर',
    date: '30 सितं 2026, 04:15 PM',
    citizen: 'महेश सोनी',
    citizenPhone: '98290-67890',
    description: 'मुख्य बाजार सड़क पर गहरा गड्ढा हो गया है, रात्रि में दुपहिया वाहन चालकों के गिरने का खतरा है। डामरीकरण पैचवर्क आवश्यक है।',
    photo: true,
    routedDept: 'निर्माण एवं इंजीनियरिंग शाखा',
    status: 'assigned',
    routedAt: '30 सितं 2026, 04:30 PM',
    suggestedDept: 'निर्माण एवं इंजीनियरिंग शाखा',
  },

  // Ward 12 Complaints
  {
    id: 5,
    code: 'CTNP-2026-000104',
    wardNum: 12,
    wardName: 'वार्ड संख्या 12',
    category: 'पेयजल पाइपलाइन लीकेज',
    location: 'स्टेशन रोड, मुख्य चौराहा',
    date: '01 अक्टू 2026, 10:15 AM',
    citizen: 'कैलाश चंद्र',
    citizenPhone: '98290-22114',
    description: 'स्टेशन रोड पर मुख्य पाइपलाइन में भारी रिसाव हो रहा है, हजारों लीटर स्वच्छ पेयजल व्यर्थ बह रहा है। तत्काल प्लम्बर टीम भेजी जाए।',
    photo: true,
    routedDept: null,
    status: 'submitted',
    routedAt: null,
    suggestedDept: 'जल प्रदाय शाखा',
  },
  {
    id: 6,
    code: 'CTNP-2026-000099',
    wardNum: 12,
    wardName: 'वार्ड संख्या 12',
    category: 'नाली सफाई एवं गाद निकासी',
    location: 'गांधी नगर, गली नं. 4',
    date: '30 सितं 2026, 03:00 PM',
    citizen: 'विष्णु पारीक',
    citizenPhone: '98290-33991',
    description: 'गली नंबर 4 की नालियों में सिल्ट जमा है, बदबू फैल रही है।',
    photo: false,
    routedDept: 'स्वास्थ्य एवं स्वच्छता शाखा',
    status: 'assigned',
    routedAt: '30 सितं 2026, 03:40 PM',
    suggestedDept: 'स्वास्थ्य एवं स्वच्छता शाखा',
  },

  // Ward 08 Complaints
  {
    id: 7,
    code: 'CTNP-2026-000130',
    wardNum: 8,
    wardName: 'वार्ड संख्या 8',
    category: 'सार्वजनिक पार्क में सूखी झाड़ियां व सफाई',
    location: 'सुभाष पार्क, वार्ड 08',
    date: '01 अक्टू 2026, 08:45 AM',
    citizen: 'रामगोपाल शर्मा',
    citizenPhone: '98290-44556',
    description: 'सुभाष पार्क में सूखी झाड़ियां व खरपतवार अधिक हो गई हैं, बच्चों व बुजुर्गों के टहलने में बाधा आ रही है। कटाई एवं उद्यान टीम अपेक्षित है।',
    photo: false,
    routedDept: null,
    status: 'submitted',
    routedAt: null,
    suggestedDept: 'उद्यान विकास शाखा',
  },
  {
    id: 8,
    code: 'CTNP-2026-000085',
    wardNum: 8,
    wardName: 'वार्ड संख्या 8',
    category: 'सड़क प्रकाश व्यवस्था',
    location: 'किला रोड तिराहा, वार्ड 08',
    date: '28 सितं 2026, 07:15 PM',
    citizen: 'भंवर लाल तेली',
    citizenPhone: '98290-77112',
    description: 'किला रोड पर 2 लाइटें नहीं जल रही हैं।',
    photo: true,
    routedDept: 'विद्युत अनुभाग (स्ट्रीट लाइट)',
    status: 'assigned',
    routedAt: '28 सितं 2026, 07:30 PM',
    suggestedDept: 'विद्युत अनुभाग (स्ट्रीट लाइट)',
  },

  // Ward 41 Complaint
  {
    id: 9,
    code: 'CTNP-2026-000132',
    wardNum: 41,
    wardName: 'वार्ड संख्या 41',
    category: 'सड़क पुलिया मरम्मत',
    location: 'सेंथी मुख्य संपर्क मार्ग पुलिया',
    date: '01 अक्टू 2026, 01:20 PM',
    citizen: 'सुरेश गुर्जर',
    citizenPhone: '98290-99443',
    description: 'पुलिया के किनारे की दीवार क्षतिग्रस्त हो गई है, भारी वाहन गुजरने पर दुर्घटना की आशंका बनी हुई है।',
    photo: true,
    routedDept: null,
    status: 'submitted',
    routedAt: null,
    suggestedDept: 'निर्माण एवं इंजीनियरिंग शाखा',
  },

  // Ward 17 Complaint
  {
    id: 10,
    code: 'CTNP-2026-000135',
    wardNum: 17,
    wardName: 'वार्ड संख्या 17',
    category: 'कचरा पात्र स्थापना एवं सफाई',
    location: 'प्रताप नगर, सामुदायिक भवन के पास',
    date: '01 अक्टू 2026, 02:45 PM',
    citizen: 'अशोक पटवा',
    citizenPhone: '98290-66778',
    description: 'सामुदायिक भवन के पास कचरा डिब्बा टूट चुका है, लोग खुले में कचरा फेंक रहे हैं। नया डस्टबिन लगाया जाए।',
    photo: false,
    routedDept: null,
    status: 'submitted',
    routedAt: null,
    suggestedDept: 'स्वास्थ्य एवं स्वच्छता शाखा',
  },
];
