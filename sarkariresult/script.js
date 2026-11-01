/* =====================================================================
   SARKARI RESULT UP ALL — script.js
   CSP-सेफ: कोई eval / innerHTML / inline handler नहीं। सारा टेक्स्ट textContent से जाता है।

   नया पोस्ट कैसे जोड़ें (सिर्फ़ नीचे वाले DATA हिस्से में):
   ---------------------------------------------------------------------
   DATA की किसी भी लिस्ट में ऊपर (सबसे नया पहले) यह डालो:

   {
     "id": "rrb-ntpc-2026",            // अनोखा, सिर्फ़ a-z 0-9 और -
     "title": "RRB NTPC Online Form 2026 (1688 Posts)",
     "org": "rrb",                     // PORTALS की key (लिंक अपने-आप लगेंगे) — खाली छोड़ सकते हो
     "posts": 1688,                    // कुल पद (संख्या या टेक्स्ट) — खाली तो "जल्द अपडेट"
     "short": "छोटी जानकारी",
     "line": "Last Date: 13 November 2026",   // लिस्ट में नाम के नीचे की लाइन
     "deadline": "2026-11-13",         // सिर्फ़ Latest Jobs में: आख़िरी तारीख (YYYY-MM-DD)
     "extended": false,                // तारीख बढ़ी हो तो true
     "tag": "Out",                     // छोटा लाल टैग (वैकल्पिक)
     "date": "2026-10-13",             // पोस्ट/अपडेट की तारीख (वैकल्पिक)
     "dates":  [["Apply Start", "15 October 2026"], ["Last Date", "13 November 2026"]],
     "fee":    ["General / OBC : ₹ 500/-", "SC / ST : ₹ 250/-"],
     "qualification": ["12th पास"],    // पढ़ाई की योग्यता (वैकल्पिक)
     "eligibility": ["Age Limit As On : 01 January 2027", "Minimum Age : 18 Years"],
     "apply":    "https://...",        // इस पोस्ट का अपना Apply/Login लिंक (वैकल्पिक, PORTALS को ओवरराइड)
     "official": "https://..."         // इस पोस्ट की अपनी ऑफिशियल साइट (वैकल्पिक)
   }

   लिस्ट के नाम:  latest | result | admit | jobs10 | outsource | syllabus | answerkey | admission
   खाली लिस्ट [] हो तो बॉक्स में "जल्द अपडेट होगा" दिखता है — कुछ टूटता नहीं।
   ===================================================================== */
'use strict';

/* ---------- 0. क्लिकजैकिंग से बचाव ---------- */
if (window.top !== window.self) {
  try { window.top.location.href = window.self.location.href; } catch (err) { /* cross-origin */ }
  document.documentElement.hidden = true;
}

/* @@DATA-START */
/* ===== यहीं से डेटा शुरू — नया डेटा सिर्फ़ यहाँ चढ़ाओ ===== */

/* सोशल लिंक: खाली '' हो तो फुटर में वह बटन छिपा रहता है। अपनी https लिंक भर दो। */
const SOCIAL = {
  "telegram": "",
  "whatsapp": "",
  "instagram": "",
  "youtube": "",
  "facebook": "",
  "x": ""
};

/* पोर्टल: org की key से लिंक अपने-आप लगते हैं।
   official = सिर्फ़ ऑफिशियल वेबसाइट देखने के लिए | apply = सीधे Apply / Login पोर्टल।
   ज़रूरत हो तो किसी पोस्ट में अपना "apply" / "official" डालकर ओवरराइड कर सकते हो।
   ध्यान: ये लिंक प्रकाशित करने से पहले एक बार खोलकर जाँच लेना। */
const PORTALS = {
  "rrb": { "name": "Railway RRB", "official": "https://www.rrbcdg.gov.in/", "apply": "https://www.rrbapply.gov.in/" },
  "rrcnwr": { "name": "Railway RRC NWR", "official": "https://www.rrcjaipur.in/", "apply": "https://www.rrcjaipur.in/" },
  "upessc": { "name": "UPESSC", "official": "https://upessc.up.gov.in/", "apply": "https://upessc.up.gov.in/" },
  "upsssc": { "name": "UPSSSC", "official": "https://upsssc.gov.in/", "apply": "https://upsssc.gov.in/" },
  "uppsc": { "name": "UPPSC", "official": "https://uppsc.up.nic.in/", "apply": "https://uppsconline.up.nic.in/" },
  "bpsc": { "name": "BPSC Bihar", "official": "https://bpsc.bihar.gov.in/", "apply": "https://onlinebpsc.bihar.gov.in/" },
  "bssc": { "name": "BSSC Bihar", "official": "https://bssc.bihar.gov.in/", "apply": "https://www.onlinebssc.com/" },
  "ssc": { "name": "SSC", "official": "https://ssc.gov.in/", "apply": "https://ssc.gov.in/login" },
  "upsc": { "name": "UPSC", "official": "https://upsc.gov.in/", "apply": "https://upsconline.nic.in/" },
  "ibps": { "name": "IBPS", "official": "https://www.ibps.in/", "apply": "https://www.ibps.in/" },
  "sbi": { "name": "SBI", "official": "https://bank.sbi/web/careers", "apply": "https://bank.sbi/web/careers" },
  "rbi": { "name": "RBI", "official": "https://www.rbi.org.in/", "apply": "https://opportunities.rbi.org.in/" },
  "nta": { "name": "NTA JEE Main", "official": "https://jeemain.nta.nic.in/", "apply": "https://jeemain.nta.nic.in/" },
  "sci": { "name": "Supreme Court of India", "official": "https://www.sci.gov.in/", "apply": "https://www.sci.gov.in/recruitments/" },
  "isro": { "name": "ISRO", "official": "https://www.isro.gov.in/", "apply": "https://www.isro.gov.in/" },
  "lichfl": { "name": "LIC HFL", "official": "https://www.lichousing.com/", "apply": "https://www.lichousing.com/careers" },
  "bhel": { "name": "BHEL", "official": "https://www.bhel.com/", "apply": "https://careers.bhel.in/" },
  "dsssb": { "name": "DSSSB Delhi", "official": "https://dsssb.delhi.gov.in/", "apply": "https://dsssbonline.nic.in/" },
  "iocl": { "name": "IOCL", "official": "https://iocl.com/", "apply": "https://iocl.com/" },
  "army": { "name": "Indian Army", "official": "https://joinindianarmy.nic.in/", "apply": "https://joinindianarmy.nic.in/" },
  "cwc": { "name": "CWC", "official": "https://cewacor.nic.in/", "apply": "https://cewacor.nic.in/" },
  "rssb": { "name": "RSSB Rajasthan", "official": "https://rssb.rajasthan.gov.in/", "apply": "https://sso.rajasthan.gov.in/" },
  "rpsc": { "name": "RPSC Rajasthan", "official": "https://rpsc.rajasthan.gov.in/", "apply": "https://sso.rajasthan.gov.in/" },
  "csjmu": { "name": "CSJMU Kanpur", "official": "https://www.csjmu.ac.in/", "apply": "https://www.csjmu.ac.in/" },
  "hpsc": { "name": "HPSC Haryana", "official": "https://hpsc.gov.in/", "apply": "https://hpsc.gov.in/" },
  "aiims": { "name": "AIIMS", "official": "https://www.aiimsexams.ac.in/", "apply": "https://www.aiimsexams.ac.in/" },
  "ongc": { "name": "ONGC", "official": "https://ongcindia.com/", "apply": "https://ongcindia.com/" },
  "cci": { "name": "Cotton Corporation of India", "official": "https://cotcorp.org.in/", "apply": "https://cotcorp.org.in/" },
  "ib": { "name": "Intelligence Bureau", "official": "https://www.mha.gov.in/", "apply": "https://www.mha.gov.in/" },
  "csbc": { "name": "Bihar Police CSBC", "official": "https://csbc.bihar.gov.in/", "apply": "https://csbc.bihar.gov.in/" },
  "bseb": { "name": "Bihar BSEB", "official": "https://www.biharboardonline.com/", "apply": "https://secondary.biharboardonline.com/" },
  "jeecup": { "name": "JEECUP", "official": "https://jeecup.admissions.nic.in/", "apply": "https://jeecup.admissions.nic.in/" },
  "utet": { "name": "Uttarakhand TET", "official": "https://ubse.uk.gov.in/", "apply": "https://ubse.uk.gov.in/" },
  "uppolice": { "name": "UP Police", "official": "https://uppbpb.gov.in/", "apply": "https://uppbpb.gov.in/" }
};

/* ऊपर वाला बड़ा बैनर (वैकल्पिक): null = छिपा रहेगा।
   उदाहरण: { "title": "…", "text": "…", "id": "किसी-पोस्ट-की-id", "button": "Details »" } */
const FEATURED = null;

const DATA = {
  /* ---- Latest Jobs (सबसे नया ऊपर) ---- */
  latest: [
    {
      "id": "railway-rrb-station-master-online-form-2026",
      "title": "Railway RRB Station Master Online Form 2026",
      "org": "rrb",
      "posts": 1265,
      "short": "Railway RRB Station Master Examination 2026 — Candidates are advised to confirm from the Railway RRB Station Master official website.",
      "deadline": "2026-11-25",
      "line": "Last Date: 25 November 2026",
      "dates": [
        ["Apply Online Start Date", "27 October 2026"],
        ["Apply Online Last Date", "25 November 2026"],
        ["Last Date For Fee Payment", "27 November 2026"],
        ["Correction Date", "28 November – 07 December 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card", "Before Exam"],
        ["Result Declared Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General / OBC / EWS : ₹ 500/-",
        "For SC / ST / EBC : ₹ 250/-",
        "For All Category female : ₹ 250/-",
        "Fee Refund : General / OBC : Rs. 400/- will be refunded and Other candidates : Rs. 250/- will be refunded to the bank account after appearing in Stage I Exam."
      ],
      "eligibility": [
        "Age Limit As On : 01 January 2027",
        "Minimum Age : 20 Years",
        "Maximum Age : 33 Years"
      ]
    },
    {
      "id": "bpsc-school-teacher-tre-4-0-online-form-2026-33-320-posts",
      "title": "BPSC School Teacher TRE 4.0 Online Form 2026 (33,320 Posts)",
      "org": "bpsc",
      "posts": 33320,
      "short": "BPSC School Teacher TRE 4.0 Examination 2025 — Candidates are advised to confirm from the Bihar BPSC official website.",
      "deadline": "2026-11-03",
      "extended": true,
      "line": "Last Date: 03 November 2026",
      "dates": [
        ["Online Apply Start Date", "25 September 2026"],
        ["Online Apply Last Date", "03 November 2026 Extended"],
        ["Last Date For Fee Payment", "02 November 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For All Category Candidates : ₹ 100/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 August 2026",
        "Minimum Age : 18 Years (Class 1, to 05 & 6 to 8)",
        "Minimum Age : 21 Years (Class 9 to 10 & 11 to 12)",
        "Maximum Age : 37 Years (UR-Male)",
        "Maximum Age : 40 Years (UR-Female)",
        "Maximum Age : 40 Years (BC/ EBC-Male & Female)",
        "Maximum Age : 42 Years (SC/ ST-Male & Female)"
      ]
    },
    {
      "id": "upessc-prt-assistant-teacher-online-form-2026-12405-posts-da",
      "title": "UPESSC PRT Assistant Teacher Online Form 2026 (12405 Posts) – Date Extend",
      "org": "upessc",
      "posts": 12405,
      "short": "UPESSC PRT Assistant Teacher Examination 2026 — Candidates are advised to confirm from the UPESSC official website.",
      "deadline": "2026-11-04",
      "extended": true,
      "line": "Last Date: 04 November 2026",
      "dates": [
        ["Online Apply Start Date", "16 September 2026"],
        ["Online Apply Last Date", "04 November 2026 Extended"],
        ["Last Date For Fee Payment", "04 November 2026"],
        ["Correction Last Date", "07 November 2026"],
        ["Exam Date", "03 – 04 December 2026"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General, EWS, OBC : ₹ 1000/-",
        "For SC, ST : ₹ 500/-",
        "For PH : ₹ 300/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "Minimum Age : 21 Years",
        "Maximum Age : 40 Years For Assistant Teacher (Primary – Urban)",
        "Maximum Age : 62 Years For Assistant Teacher (Attached Primary)"
      ]
    },
    {
      "id": "upessc-up-tgt-online-form-2026-17-735-posts",
      "title": "UPESSC UP TGT Online Form 2026 (17,735 Posts)",
      "org": "upessc",
      "posts": 17735,
      "short": "UPESSC UP TGT Assistant Teacher Examination 2026 — Candidates are advised to confirm from the UPESSC official website.",
      "deadline": "2026-11-23",
      "line": "Last Date: 23 November 2026",
      "dates": [
        ["Online Apply Start Date", "24 October 2026"],
        ["Online Apply Last Date", "23 November 2026"],
        ["Last Date For Fee Payment", "23 November 2026"],
        ["Correction Last Date", "26 November 2026"],
        ["Exam Date", "23 – 24 December 2026"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General, EWS, OBC : ₹ 1000/-",
        "For SC, ST : ₹ 500/-",
        "For PH : ₹ 300/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "Minimum Age : 21 Years",
        "Maximum Age : 62 Years For Assistant Teacher (Attached Primary)"
      ]
    },
    {
      "id": "uppsc-ro-aro-online-form-2026",
      "title": "UPPSC RO / ARO Online Form 2026",
      "org": "uppsc",
      "short": "UPPSC RO / ARO Examination 2026 — Candidates are advised to confirm from the UPPSC official website.",
      "deadline": "2026-11-26",
      "line": "Last Date: 26 November 2026",
      "dates": [
        ["Online Apply Start Date", "26 October 2026"],
        ["Online Apply Last Date", "26 November 2026"],
        ["Last Date For Fee Payment", "26 November 2026"],
        ["Correction Last Date", "03 December 2026"],
        ["Pre Exam Date", "Notify Later"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will be Updated Here Soon"]
      ],
      "fee": [
        "For General / OBC / EWS : ₹ 125/-",
        "For SC / ST :₹ 65/-",
        "For PH : ₹ 25/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "Minimum Age : 21 Years",
        "Maximum Age : 40 Years"
      ]
    },
    {
      "id": "rrb-ntpc-graduate-level-online-form-2026-3548-posts",
      "title": "RRB NTPC Graduate Level Online Form 2026 (3548 Posts)",
      "org": "rrb",
      "posts": 3548,
      "short": "RRB NTPC Graduate Level Examination 2026 — Candidates are advised to confirm from the RRB official website.",
      "deadline": "2026-11-06",
      "line": "Last Date: 06 November 2026",
      "dates": [
        ["Online Apply Start Date", "08 October 2026"],
        ["Online Apply Last Date", "06 November 2026"],
        ["Last Date For Fee Payment", "08 November 2026"],
        ["Correction Date", "09 – 18 November 2026"],
        ["Exam Date", "4th Week Of December"],
        ["Exam City Details", "10 Days Before Exam"],
        ["Admit Card", "04 Days Before Exam"]
      ],
      "fee": [
        "For General / OBC / EWS : ₹ 500/-",
        "For SC / ST / EBC : ₹ 250/-",
        "For All Category female : ₹ 250/-",
        "Fess Refund : General / OBC : Rs. 400/- will be refunded and Other candidates : Rs. 250/- will be refunded to the bank account after appearing in Stage I Exam."
      ],
      "eligibility": [
        "Age Limit As On : 01 January 2027",
        "Minimum Age : 18 Years",
        "Maximum Age : 33 Years"
      ]
    },
    {
      "id": "upsssc-inter-12th-level-online-form-2026",
      "title": "UPSSSC Inter (12th) Level Online Form 2026",
      "org": "upsssc",
      "short": "UPSSSC Inter (12th) Level Examination 2026",
      "deadline": "2026-12-01",
      "line": "Last Date: 01 December 2026",
      "dates": [
        ["Online Apply Start Date", "10 November 2026"],
        ["Online Apply Last Date", "01 December 2026"],
        ["Fee Payment Last Date", "01 December 2026"],
        ["Correction Last Date", "08 December 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card Available", "Before Exam"],
        ["Result Declared", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "General, OBC, EWS : ₹ 25/-",
        "SC, ST : ₹ 25/-",
        "PH Candidates : ₹ 25/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "For Minimum Age : 18 – 21 Years (Post Wise)",
        "For Maximum Age : 30 –40 Years"
      ]
    },
    {
      "id": "upessc-up-principal-inter-level-online-form-2026",
      "title": "UPESSC UP Principal Inter Level Online Form 2026",
      "org": "upessc",
      "short": "UPESSC UP Principal Inter Level Examination 2026 — Candidates are advised to confirm from the UPESSC official website.",
      "deadline": "2026-11-22",
      "line": "Last Date: 22 November 2026",
      "dates": [
        ["Online Apply Start Date", "23 October 2026"],
        ["Online Apply Last Date", "22 November 2026"],
        ["Last Date For Fee Payment", "22 November 2026"],
        ["Correction Last Date", "25 November 2026"],
        ["Exam Date", "07 January 2027"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General, EWS, OBC : ₹ 2000/-",
        "For SC, ST : ₹ 2000/-",
        "For PH : ₹ 2000/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "Minimum Age : 30 Years",
        "Maximum Age : 62 Years"
      ]
    },
    {
      "id": "upessc-up-headmaster-online-form-2026",
      "title": "UPESSC UP Headmaster Online Form 2026",
      "org": "upessc",
      "short": "UPESSC UP Headmaster Examination 2026 — Candidates are advised to confirm from the UPESSC official website.",
      "deadline": "2026-11-22",
      "line": "Last Date: 22 November 2026",
      "dates": [
        ["Online Apply Start Date", "23 October 2026"],
        ["Online Apply Last Date", "22 November 2026"],
        ["Last Date For Fee Payment", "22 November 2026"],
        ["Correction Last Date", "25 November 2026"],
        ["Exam Date", "07 January 2027"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General, EWS, OBC : ₹ 1500/-",
        "For SC, ST : ₹ 1500/-",
        "For PH : ₹ 1500/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "Minimum Age : 30 Years",
        "Maximum Age : 62 Years"
      ]
    },
    {
      "id": "up-anganwadi-bharti-online-form-2026-updated",
      "title": "UP Anganwadi Bharti Online Form 2026 (Updated)",
      "short": "UP Anganwadi Bharti Examination 2025",
      "line": "Last Date: District Wise",
      "dates": [
        ["Notification Date", "November 2025"],
        ["Application Start", "November 2025"],
        ["Last Date for Apply", "District Wise"],
        ["Form Complete Last Date", "District Wise"]
      ],
      "fee": [
        "There is no application fee for any candidate."
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2025",
        "For Minimum Age:18 years",
        "For Maximum Age:35 years"
      ]
    },
    {
      "id": "bssc-field-assistant-2025-mains-online-form",
      "title": "BSSC Field Assistant 2025 Mains Online Form",
      "org": "bssc",
      "short": "Bihar BSSC Field Assistant Examination 2025 — Candidates are advised to confirm from the Bihar BSSC official website.",
      "deadline": "2026-10-31",
      "line": "Last Date: 22 – 31 October 2026",
      "dates": [
        ["Online Apply Start Date", "25 April 2025"],
        ["Online Apply Last Date", "21 May 2025"],
        ["Last Date For Fee Payment", "23 May 2025"],
        ["Exam Date", "11 July 2025"],
        ["Revised Exam Date", "10 August 2025"],
        ["Admit Card", "30 July 2025"],
        ["Result Date", "22 January 2026"],
        ["Mains Form Date", "22 – 31 October 2026"]
      ],
      "fee": [
        "For General/ BC/ EBCCandidates : ₹ 540/-",
        "For Other State All Category : ₹ 540/-",
        "For SC/ ST PH Candidates : ₹ 135/-",
        "For Female Bihar Candidates : ₹ 135/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 August 2024.",
        "For Male (General/ EWS): 18-37 Year",
        "For Female (General) : 18-40 Year",
        "For Male /Female (OBC/ EBC): 18-40 Year",
        "For Male /Female (SC/ ST): 18-42 Year"
      ]
    },
    {
      "id": "csjmu-kanpur-teaching-post-online-form-2026",
      "title": "CSJMU Kanpur Teaching Post Online Form 2026",
      "org": "csjmu",
      "short": "CSJMU Kanpur Teaching Post Examination 2026 — Candidates are advised to confirm from the CSJMU official website.",
      "deadline": "2026-10-31",
      "line": "Last Date: 31 October 2026",
      "dates": [
        ["Online Apply Start Date", "26 September 2026"],
        ["Online Apply Last Date", "31 October 2026"],
        ["Last Date For Fee Payment", "31 October 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General, OBC, EWS : ₹ 2500/-",
        "For SC, ST, PH : ₹ 2000/-"
      ],
      "eligibility": [
        "Age Limit As On : CSJMU Rules",
        "Minimum Age : N/A",
        "Maximum Age : N/A"
      ]
    },
    {
      "id": "rajasthan-safai-karmchari-correction-edit-form-2026",
      "title": "Rajasthan Safai Karmchari Correction / Edit Form 2026",
      "short": "Rajasthan Safai Karmchari Examination 2026 — Candidates are advised to confirm from the Rajasthan Safai Karmchari official website.",
      "deadline": "2026-11-04",
      "line": "Last Date: 29 October – 04 November 2026",
      "dates": [
        ["Online Apply Start Date", "15 August 2026"],
        ["Online Apply Last Date", "28 October 2026 Extended"],
        ["Last Date For Fee Payment", "28 October 2026"],
        ["Correction Date", "29 October – 04 November 2026"],
        ["Exam Date", "Notify Soon"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "General, Other State: ₹ 600/- OBC, BC, SC, ST : ₹ 400/-",
        "Correction Charge : ₹ 100/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 January 2027",
        "Minimum Age : 21 Years.",
        "Maximum Age : 40 Years."
      ]
    },
    {
      "id": "bpsc-auditor-mains-online-form-2026",
      "title": "BPSC Auditor Mains Online Form 2026",
      "org": "bpsc",
      "short": "Bihar BPSC Auditor Examination 2026 — Candidates are advised to confirm from the Bihar BPSC official website.",
      "deadline": "2026-11-16",
      "line": "Last Date: 29 October – 16 November 2026",
      "dates": [
        ["Online Apply Start Date", "05 February 2026"],
        ["Online Apply Last Date", "26 February 2026"],
        ["Last Date For Fee Payment", "26 February 2026"],
        ["Exam Date", "05 July 2026"],
        ["Exam City Details", "28 June 2026"],
        ["Admit Card", "02 July 2026"],
        ["Answer Key", "13 July 2026"],
        ["Final Answer Key", "31 July 2026"],
        ["Result Date", "22 August 2026"],
        ["Mains Form Date", "29 October – 16 November 2026"]
      ],
      "fee": [
        "For All Candidates : ₹ 100/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 August 2025",
        "Minimum Age : 21 Years",
        "Maximum Age : 37 Years (Male UR)",
        "Maximum Age : 40 Years (Female UR, BC/ EBC-Male & Female)",
        "Maximum Age : 42 Years (SC/ ST-Male & Female)"
      ]
    },
    {
      "id": "nta-jee-mains-session-i-online-form-2027",
      "title": "NTA JEE Mains Session I Online Form 2027",
      "org": "nta",
      "short": "NTA JEE Mains Examination (January 2027)",
      "deadline": "2026-11-22",
      "line": "Last Date: 22 November 2026",
      "dates": [
        ["Online Apply Start Date", "24 October 2026"],
        ["Online Apply Last Date", "22 November 2026"],
        ["Fee Payment Last Date", "22 November 2026"],
        ["Exam Date", "20, 21, 22, 23, 24 & 28 January 2027"],
        ["Admit Card Available", "Notify Soon"],
        ["Result Declared", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General, OBC, EWS : ₹ 1000/- To 2000/-",
        "For SC / ST, PwD : ₹ 500/- To 1000/-"
      ],
      "eligibility": [
        "Age Limit As On : NTA Rules."
      ]
    },
    {
      "id": "isro-ursc-various-post-online-form-2026",
      "title": "ISRO URSC Various Post Online Form 2026",
      "org": "isro",
      "short": "ISRO URSC Various Post Examination 2026 — Candidates are advised to confirm from the ISRO official website.",
      "deadline": "2026-11-13",
      "line": "Last Date: 13 November 2026",
      "dates": [
        ["Online Apply Start Date", "24 October 2026"],
        ["Online Apply Last Date", "13 November 2026"],
        ["Last Date For Fee Payment", "13 November 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card", "Before Exam"],
        ["Result", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "All Category Candidate : Rs. 500/-",
        "Fees Refund After Appear CBT Exam",
        "General, OBC, EWS : Rs. 400/-",
        "SC, ST, PH, Women : Full Refund"
      ],
      "eligibility": [
        "Age Limit As On : 13 November 2026",
        "Minimum Age : 18 Years",
        "Maximum Age : 35 Years"
      ]
    },
    {
      "id": "supreme-court-sci-court-master-online-form-2026",
      "title": "Supreme Court SCI Court Master Online Form 2026",
      "org": "sci",
      "short": "Supreme Court SCI Court Master Examination 2026 — Candidates are advised to confirm from the Supreme Court Of India official website.",
      "deadline": "2026-11-15",
      "line": "Last Date: 15 November 2026",
      "dates": [
        ["Apply Online Start Date", "25 October 2026"],
        ["Apply Online Last Date", "15 November 2026"],
        ["Last Date For Fee Payment", "15 November 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card", "Before Exam"],
        ["Result Declared Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General/Unreserved : ₹ 1500/-",
        "For SC, ST, OBC – NCL, PwBD Candidates : ₹ 750/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 October 2026",
        "Minimum Age : 30 Years.",
        "Maximum Age : 45 Years"
      ]
    },
    {
      "id": "lic-hfl-apprentice-online-form-2026",
      "title": "LIC HFL Apprentice Online Form 2026",
      "org": "lichfl",
      "short": "LIC HFL Apprentice Examination 2026 — Candidates are advised to confirm from the LIC HFL official website.",
      "deadline": "2026-11-01",
      "line": "Last Date: 01 November 2026",
      "dates": [
        ["Online Apply Start Date", "20 October 2026"],
        ["Online Apply Last Date", "01 November 2026"],
        ["Last Date For Fee Payment", "01 November 2026"],
        ["Exam Date", "07 November 2026"],
        ["Admit Card", "Before Exam"],
        ["Result Declared Date", "15 November 2026"]
      ],
      "fee": [
        "For General/ OBC/ EWS: ₹ 800/- (For Male)",
        "For General/ OBC/ EWS: ₹ 800/- (For Female)",
        "For SC/ ST/ PH : ₹ 200/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 October 2026",
        "Minimum Age : 20 Year",
        "Maximum Age : 25 Year"
      ]
    },
    {
      "id": "railway-rrc-nwr-apprentice-online-form-2026",
      "title": "Railway RRC NWR Apprentice Online Form 2026",
      "org": "rrcnwr",
      "short": "Railway RRC NWR Apprentice Examination 2026 — Candidates are advised to confirm from the RRC NWR official website.",
      "deadline": "2026-11-22",
      "line": "Last Date: 22 November 2026",
      "dates": [
        ["Online Apply Start Date", "23 October 2026"],
        ["Online Apply Last Date", "22 November 2026"],
        ["Last Date For Fee Payment", "22 November 2026"],
        ["Merit List", "Notify Later"]
      ],
      "fee": [
        "For General/ OBC/ EWS: ₹ 100/-",
        "For SC/ ST/ PH : ₹ 00/-"
      ],
      "eligibility": [
        "Age Limit As On : 06 November 2026",
        "Minimum Age : 15 Year",
        "Maximum Age : 24 Year"
      ]
    },
    {
      "id": "bhel-artisan-various-trade-post-online-form-2026",
      "title": "BHEL Artisan Various Trade Post Online Form 2026",
      "org": "bhel",
      "short": "BHEL Artisan Various Trade Post Examination 2026 — Candidates are advised to confirm from the BHEL official website.",
      "deadline": "2026-11-18",
      "line": "Last Date: 18 November 2026",
      "dates": [
        ["Apply Online Start Date", "21 October 2026"],
        ["Apply Online Last Date", "18 November 2026"],
        ["Last Date For Fee Payment", "18 November 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card", "Before Exam"],
        ["Result Declared Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General / OBC / EWS : ₹ 1072/-",
        "For SC / ST / PH : ₹ 472/-",
        "Processing Fee : ₹ 400/- +GST"
      ],
      "eligibility": [
        "Age Limit As On : 01 October 2026",
        "Minimum Age : N/A",
        "Maximum Age : 27 Years"
      ]
    },
    {
      "id": "dsssb-sweeper-chowkidar-online-form-2026",
      "title": "DSSSB Sweeper & Chowkidar Online Form 2026",
      "org": "dsssb",
      "short": "DSSSB Sweeper & Chowkidar Examination 2026 — Candidates are advised to confirm from the DSSSB official website.",
      "deadline": "2026-11-11",
      "line": "Last Date: 11 November 2026",
      "dates": [
        ["Online Apply Start Date", "13 October 2026"],
        ["Online Apply Last Date", "11 November 2026"],
        ["Last Date For Fee Payment", "11 November 2026"],
        ["Exam Date", "Notify Soon"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General, OBC, EWS : ₹ 100/-",
        "For SC / ST, PH, Women : ₹ 00/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 June 2026",
        "Minimum Age : 18 Years",
        "Maximum Age : 27 Years"
      ]
    },
    {
      "id": "railway-rrb-isolated-categories-online-form-2026",
      "title": "Railway RRB Isolated Categories Online Form 2026",
      "org": "rrb",
      "short": "Railway RRB Isolated Categories Examination 2026 — Candidates are advised to confirm from the Railway RRB official website.",
      "deadline": "2026-12-04",
      "line": "Last Date: 04 December 2026",
      "dates": [
        ["Apply Online Start Date", "05 November 2026"],
        ["Apply Online Last Date", "04 December 2026"],
        ["Last Date For Fee Payment", "04 December 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card", "Before Exam"],
        ["Result Declared Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General / OBC / EWS : ₹ 500/-",
        "For SC / ST / EBC : ₹ 250/-",
        "For All Category female : ₹ 250/-",
        "Fee Refund : General / OBC : Rs. 400/- will be refunded and Other candidates : Rs. 250/- will be refunded to the bank account after appearing in Stage I Exam."
      ],
      "eligibility": [
        "Age Limit As On : RRB Rules.",
        "Minimum Age : Available Soon",
        "Maximum Age : Available Soon"
      ]
    },
    {
      "id": "isro-sdsc-shar-various-post-online-form-2026",
      "title": "ISRO SDSC SHAR Various Post Online Form 2026",
      "org": "isro",
      "short": "ISRO SDSC SHAR Various Post Examination 2026 — Candidates are advised to confirm from the ISRO official website.",
      "deadline": "2026-11-09",
      "line": "Last Date: 09 November 2026",
      "dates": [
        ["Online Apply Start Date", "19 October 2026"],
        ["Online Apply Last Date", "09 November 2026"],
        ["Last Date For Fee Payment", "09 November 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card", "Before Exam"],
        ["Result", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For Post Code (07 to 15)",
        "All Category Candidate : Rs. 750/-",
        "Fees Refund After Appear CBT Exam",
        "General, OBC, EWS : Rs. 500/-",
        "SC, ST, PH, Women : Full Refund",
        "For Post Code (16 to 30)",
        "All Category Candidate : Rs.500/-",
        "Fees Refund After Appear CBT Exam",
        "General, OBC, EWS : Rs. 400/-",
        "SC, ST, PH, Women : Full Refund"
      ],
      "eligibility": [
        "Age Limit As On : 09 November 2026",
        "Minimum Age : 18 Years",
        "Maximum Age : 25 Years (Post Code : 26 to 29)",
        "Maximum Age : 35 Years (Post Code : 07 to 25, 27, 28 & 30)"
      ]
    },
    {
      "id": "supreme-court-spa-online-form-2026",
      "title": "Supreme Court SPA Online Form 2026",
      "org": "sci",
      "short": "Supreme Court of India Senior Personal Assistant Examination 2026 — Candidates are advised to confirm from the Supreme Court Of India official website.",
      "deadline": "2026-11-10",
      "line": "Last Date: 10 November 2026",
      "dates": [
        ["Apply Online Start Date", "20 October 2026"],
        ["Apply Online Last Date", "10 November 2026"],
        ["Last Date For Fee Payment", "10 November 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card", "Before Exam"],
        ["Result Declared Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General/Unreserved : ₹ 1500/-",
        "For SC, ST, OBC – NCL, PwBD Candidates : ₹ 750/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 October 2026",
        "Minimum Age : 18 Years.",
        "Maximum Age : 30 Years"
      ]
    },
    {
      "id": "cwc-assistant-manager-junior-executive-online-form-2026",
      "title": "CWC Assistant Manager & Junior Executive Online Form 2026",
      "org": "cwc",
      "short": "CWC Assistant Manager & Junior Executive Examination 2026",
      "deadline": "2026-11-15",
      "line": "Last Date: 15 November 2026",
      "dates": [
        ["Online Apply Start Date", "17 October 2026"],
        ["Online Apply Last Date", "15 November 2026"],
        ["Fee Payment Last Date", "15 November 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card Available", "Before Exam"],
        ["Result Declared", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General, OBC, EWS : ₹ 1350/-",
        "For SC, ST, PH : ₹ 500/-",
        "For All Female Candidates : ₹ 500/-"
      ],
      "eligibility": [
        "Age Limit As On : 15 November 2026",
        "For Minimum Age : 18 Years",
        "For Maximum Age : 28 Years"
      ]
    },
    {
      "id": "upsssc-regional-youth-welfare-officer-online-form-2026",
      "title": "UPSSSC Regional Youth Welfare Officer Online Form 2026",
      "org": "upsssc",
      "short": "UPSSSC Regional Youth Welfare Officer Examination 2026 — Candidates are advised to confirm from the UPSSSC official website.",
      "deadline": "2026-11-06",
      "line": "Last Date: 06 November 2026",
      "dates": [
        ["Online Apply Start Date", "16 October 2026"],
        ["Online Apply Last Date", "06 November 2026"],
        ["Last Date For Fee Payment", "06 November 2026"],
        ["Correction Last Date", "13 November 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General, OBC, EWS : ₹ 25/-",
        "For SC / ST : ₹ 25/-",
        "For PH Candidates : ₹ 25/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "Minimum Age : 21 Years",
        "Maximum Age : 40 Years."
      ]
    },
    {
      "id": "supreme-court-junior-court-attendant-online-form-2026",
      "title": "Supreme Court Junior Court Attendant Online Form 2026",
      "org": "sci",
      "short": "Supreme Court Junior Court Attendant Examination 2026 — Candidates are advised to confirm from the Supreme Court Of India official website.",
      "deadline": "2026-11-25",
      "line": "Last Date: 25 November 2026",
      "dates": [
        ["Apply Online Start Date", "04 November 2026"],
        ["Apply Online Last Date", "25 November 2026"],
        ["Last Date For Fee Payment", "25 November 2026"],
        ["Exam Date", "26 December 2026"],
        ["Admit Card", "Before Exam"],
        ["Result Declared Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General/Unreserved : ₹ 1500/-",
        "For SC, ST, OBC – NCL, PwBD Candidates : ₹ 750/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 October 2026",
        "Minimum Age : 18 Years.",
        "Maximum Age : 27 Years"
      ]
    },
    {
      "id": "indian-army-tes-57th-online-form-2026",
      "title": "Indian Army TES 57th Online Form 2026",
      "org": "army",
      "short": "Indian Army 10+2 TES 57th Examination 2026 — Candidates are advised to confirm from the Indian Army 10+2 TES 57th official website.",
      "deadline": "2026-11-12",
      "line": "Last Date: 12 November 2026",
      "dates": [
        ["Apply Online Start Date", "14 October 2026"],
        ["Apply Online Last Date", "12 November 2026"],
        ["Last Date For Fee Payment", "12 November 2026"],
        ["SSB Interview", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "No application fee is required for any candidate."
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2027",
        "Minimum Age : 16.5 Years",
        "Maximum Age : 19.5 Years"
      ]
    },
    {
      "id": "upsssc-sports-directorate-online-form-2026",
      "title": "UPSSSC Sports Directorate Online Form 2026",
      "org": "upsssc",
      "short": "UPSSSC Sports Directorate Examination 2026 — Candidates are advised to confirm from the UPSSSC official website.",
      "deadline": "2026-11-04",
      "line": "Last Date: 04 November 2026",
      "dates": [
        ["Online Apply Start Date", "14 October 2026"],
        ["Online Apply Last Date", "04 November 2026"],
        ["Last Date For Fee Payment", "04 November 2026"],
        ["Correction Last Date", "11 November 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General, OBC, EWS : ₹ 25/-",
        "For SC / ST : ₹ 25/-",
        "For PH Candidates : ₹ 25/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "Minimum Age : 18 –21 Years",
        "Maximum Age : 40 Years."
      ]
    },
    {
      "id": "upsssc-junior-engineer-je-electrical-online-form-2026",
      "title": "UPSSSC Junior Engineer JE (Electrical) Online Form 2026",
      "org": "upsssc",
      "short": "UPSSSC Junior Engineer JE (Electrical) Examination 2026",
      "deadline": "2026-11-27",
      "line": "Last Date: 27 November 2026",
      "dates": [
        ["Online Apply Start Date", "06 November 2026"],
        ["Online Apply Last Date", "27 November 2026"],
        ["Fee Payment Last Date", "27 November 2026"],
        ["Correction Last Date", "04 December 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card Available", "Before Exam"],
        ["Result Declared", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "General, OBC, EWS : ₹ 25/-",
        "SC, ST : ₹ 25/-",
        "PH Candidates : ₹ 25/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "For Minimum Age : 18 – 21 Years (Post Wise)",
        "For Maximum Age : 40 Years"
      ]
    },
    {
      "id": "supreme-court-sci-court-assistant-online-form-2026",
      "title": "Supreme Court SCI Court Assistant Online Form 2026",
      "org": "sci",
      "short": "Supreme Court SCI Court Assistant Examination 2026 — Candidates are advised to confirm from the Supreme Court Of India official website.",
      "deadline": "2026-11-24",
      "line": "Last Date: 24 November 2026",
      "dates": [
        ["Apply Online Start Date", "03 November 2026"],
        ["Apply Online Last Date", "24 November 2026"],
        ["Last Date For Fee Payment", "24 November 2026"],
        ["Exam Date", "22 December 2026"],
        ["Admit Card", "Before Exam"],
        ["Result Declared Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General/Unreserved : ₹ 1500/-",
        "For SC, ST, OBC – NCL, PwBD Candidates : ₹ 750/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 October 2026",
        "Minimum Age : 18 Years.",
        "Maximum Age : 35 Years"
      ]
    },
    {
      "id": "upsssc-junior-engineer-je-mechanical-online-form-2026-1156-p",
      "title": "UPSSSC Junior Engineer JE (Mechanical) Online Form 2026 (1156 Posts)",
      "org": "upsssc",
      "posts": 1156,
      "short": "UPSSSC Junior Engineer JE (Mechanical) Examination 2026",
      "deadline": "2026-11-25",
      "line": "Last Date: 25 November 2026",
      "dates": [
        ["Online Apply Start Date", "03 November 2026"],
        ["Online Apply Last Date", "25 November 2026"],
        ["Fee Payment Last Date", "25 November 2026"],
        ["Correction Last Date", "02 December 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card Available", "Before Exam"],
        ["Result Declared", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "General, OBC, EWS : ₹ 25/-",
        "SC, ST : ₹ 25/-",
        "PH Candidates : ₹ 25/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "For Minimum Age : 18 – 21 Years (Post Wise)",
        "For Maximum Age : 40 Years"
      ]
    },
    {
      "id": "ibps-rrb-15th-correction-edit-form-2026",
      "title": "IBPS RRB 15th Correction / Edit Form 2026",
      "org": "ibps",
      "short": "IBPS RRB 15th Examination 2026",
      "deadline": "2026-10-08",
      "line": "Last Date: 07 – 08 October 2026",
      "dates": [
        ["Online Apply Start Date", "01 September 2026"],
        ["Online Apply Last Date", "27 September 2026 Extended"],
        ["Pay Exam Fee Last Date", "27 September 2026"],
        ["Correction Date", "07 – 08 October 2026"],
        ["PET Exam Date", "November 2026"],
        ["Admit Card", "Before Exam"],
        ["Pre Exam Date", "Notify Later"],
        ["Pre Admit Card", "Before Exam"],
        ["Pre Result", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General, OBC, EWS : ₹ 850/-",
        "For SC, ST, PH : ₹ 175/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 September 2026",
        "Office Assistant : 18-28 Years",
        "Officer Scale-I : 18-30 Years",
        "Officer Scale-II : 21-32 Years",
        "Officer Scale-III : 21-40 Years"
      ]
    },
    {
      "id": "dsssb-delhi-district-court-various-post-online-form-2026",
      "title": "DSSSB Delhi District Court Various Post Online Form 2026",
      "org": "dsssb",
      "short": "DSSSB Delhi District Court Various Post Examination 2026 — Candidates are advised to confirm from the DSSSB official website.",
      "deadline": "2026-11-04",
      "line": "Last Date: 04 November 2026",
      "dates": [
        ["Online Apply Start Date", "06 October 2026"],
        ["Online Apply Last Date", "04 November 2026"],
        ["Last Date For Fee Payment", "04 November 2026"],
        ["Exam Date", "Notify Soon"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General, OBC, EWS : ₹ 100/-",
        "For SC / ST, PH, Women : ₹ 00/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 June 2026",
        "Minimum Age : 18 Years",
        "Maximum Age : 37 Years"
      ]
    },
    {
      "id": "iocl-wr-apprentice-online-form-2026",
      "title": "IOCL WR Apprentice Online Form 2026",
      "org": "iocl",
      "short": "IOCL WR Apprentice Examination 2026 — Candidates are advised to confirm from the IOCL official website.",
      "deadline": "2026-11-04",
      "line": "Last Date: 04 November 2026",
      "dates": [
        ["Online Apply Start Date", "05 October 2026"],
        ["Online Apply Last Date", "04 November 2026"],
        ["Last Date For Fee Payment", "04 November 2026"],
        ["Exam Date", "Notify Later"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "No Application Fee For All Candidates : ₹ 00/-"
      ],
      "eligibility": [
        "Age Limit As On : 30 September 2026",
        "Minimum Age : 18 Years",
        "Maximum Age : 24 Years"
      ]
    },
    {
      "id": "upsssc-otr-one-time-registration-online-form-2026",
      "title": "UPSSSC OTR One Time Registration Online Form 2026",
      "org": "upsssc",
      "short": "UPSSSC OTR Notification 2026",
      "line": "Last Date: Soon",
      "dates": [
        ["Application Start", "14 July 2026"],
        ["Last Date for Apply Online", "Soon"]
      ],
      "fee": [
        "For General, OBC : ₹ 00/-",
        "For SC, ST :₹ 00/-",
        "For PH : ₹ 00/-"
      ],
      "eligibility": [
        "Age Limit As On : UPSSSC Rules.",
        "No Age Limit Check Official Website."
      ]
    },
    {
      "id": "rssb-support-engineer-online-form-2025-1050-posts",
      "title": "RSSB Support Engineer Online Form 2025 (1050 Posts)",
      "org": "rssb",
      "posts": 1050,
      "short": "RSSB Support Engineer Examination 2025 — Candidates are advised to confirm from the RSSB official website.",
      "line": "Last Date: Available Soon",
      "dates": [
        ["Notification Date", "17 July 2025"],
        ["Online Apply Start Date", "Available Soon"],
        ["Online Apply Last Date", "Available Soon"],
        ["Last Date For Fee Payment", "Available Soon"],
        ["Exam Date", "Notify Later"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General, EWS, OBC (Creamy Layer) : ₹ 600/-",
        "For EWS, OBC (Non Creamy Layer) : ₹ 400/-",
        "For SC, ST, PH : ₹ 400/-",
        "For Correction Charge : ₹ 300/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 January 2026",
        "Minimum Age : 21 Years",
        "Maximum Age : 40 Years"
      ]
    },
    {
      "id": "bihar-stet-2025-father-name-correction-link-active",
      "title": "Bihar STET 2025 Father Name Correction – Link Active",
      "org": "bseb",
      "short": "Bihar STET Examination 2025 — Candidates are advised to confirm from the Bihar BSEB official website.",
      "deadline": "2025-10-05",
      "extended": true,
      "line": "Last Date: 05 October 2025",
      "dates": [
        ["Online Apply Start Date", "19 September 2025"],
        ["Online Apply Last Date", "05 October 2025 (Extended)"],
        ["Last Date For Fee Payment", "05 October 2025"],
        ["Exam Date", "14 October 2025"],
        ["Admit Card", "11 October 2025"],
        ["Answer Key", "24 November 2025"],
        ["Result Date", "05 January 2026"],
        ["Father Name Correction", "25 May – 05 June 2026"]
      ],
      "fee": [
        "For Paper I or II",
        "For General/ EWS/ BC/ EBC: ₹ 960/-",
        "For Other State (All Category): ₹ 960/-",
        "For SC/ ST/ PWD: ₹ 760/-",
        "For Both Paper I & II",
        "For General/ EWS/ BC/ EBC: ₹ 1440/-",
        "For Other State (All Category): ₹ 1440/-",
        "For SC/ ST/ PWD: ₹ 1140/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 August 2025",
        "Minimum Age : 21 Years",
        "Maximum Age : 37 Years (Male)",
        "Maximum Age : 40 Years (Female UR, BC/ EBC-Male & Female)",
        "Maximum Age : 42 Years (SC/ ST-Male & Female)"
      ]
    },
    {
      "id": "1",
      "title": "यूपी पुलिस में होगी 1 लाख नई भर्तियां, छात्रों को मिलेगा मौका",
      "org": "uppolice",
      "posts": "1 लाख",
      "line": "Last Date: Will Be Updated Here Soon",
      "dates": [
        ["Online Apply Start Date", "Will Be Updated Here Soon"],
        ["Online Apply Last Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General/ EWS/ OBC : Will Be Updated Here Soon",
        "For SC / ST: Will Be Updated Here Soon"
      ],
      "eligibility": [
        "Age Limit",
        "Minimum Age : Will Be Updated Here Soon",
        "Maximum Age : Will Be Updated Here Soon"
      ]
    },
    {
      "id": "up-police-si-syllabus-exam-pattern-2025",
      "title": "UP Police SI Syllabus / Exam Pattern 2025",
      "org": "uppolice",
      "short": "UP Police SI Syllabus / Exam Pattern 2025 — Candidates are advised to confirm from the UP Police SI official website.",
      "deadline": "2025-09-11",
      "line": "Last Date: 11 September 2025",
      "dates": [
        ["Short Notice Date", "28 March 2025"],
        ["Online Apply Start Date", "12 August 2025"],
        ["Online Apply Last Date", "11 September 2025"],
        ["Last Date For Fee Payment", "11 September 2025"],
        ["Exam Date", "Notify Soon"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General/ EWS/ OBC : ₹ 500/-",
        "For SC / ST : ₹ 400/-"
      ],
      "eligibility": [
        "Age Limit As On : 1 July 2025",
        "Minimum Age : 21 Years",
        "Maximum Age : 28 Years"
      ]
    },
    {
      "id": "up-polytechnic-jeecup-online-counseling-2025",
      "title": "UP Polytechnic JEECUP Online Counseling 2025",
      "org": "jeecup",
      "short": "Uttar Pradesh Polytechnic Diploma Admission 2025",
      "deadline": "2025-05-20",
      "line": "Last Date: 20 May 2025",
      "dates": [
        ["Online Apply Start Date", "15 January 2025"],
        ["Last Date for Apply Online", "20 May 2025"],
        ["Last Date Online Payment", "00 May 2025"],
        ["Correction Date", "08-20 May 2025"],
        ["Exam Date", "05-13 June 2025"],
        ["Admit Card Available", "28 May 2025"],
        ["Answer Key", "17 June 2025"],
        ["Result Declared", "23 June 2025"],
        ["Counselling Start Date", "27 June 2025"],
        ["Counselling Last Date", "As Per Scheduled"]
      ],
      "fee": [
        "For Counselling Registration Fee : ₹ 250/-",
        "Seat Acceptance Fee : ₹ 3000/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2025",
        "Minimum Age : 14 Years",
        "Maximum Age : NA"
      ]
    },
    {
      "id": "mp-anganwadi-online-form-2025",
      "title": "MP Anganwadi Online Form 2025",
      "short": "WCD MP Anganwadi Worker, Helper Examination 2025",
      "deadline": "2025-07-04",
      "line": "Last Date: 04 July 2025",
      "dates": [
        ["Online Apply Start Date", "20 June 2025"],
        ["Apply Online Last Date", "04 July 2025"],
        ["Fee Payment Last Date", "04 July 2025"],
        ["Correction Last Date", "As Per Schedule"],
        ["Exam Date", "Notify Later"],
        ["Admit Card", "Before Exam"],
        ["Result Declared Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General/ OBC/ EWS : ₹ 100/-",
        "For SC/ ST : ₹ 100/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 January 2025",
        "For Minimum Age: 18 years",
        "For Maximum Age: 35 years"
      ]
    },
    {
      "id": "bihar-shs-ayush-medical-officer-online-form-2025",
      "title": "Bihar SHS Ayush Medical Officer Online Form 2025",
      "short": "Bihar SHS Ayush Medical Officer Examination 2025 — Candidates are advised to confirm from the Bihar SHSB official website.",
      "deadline": "2025-06-15",
      "line": "Last Date: 15 June 2025",
      "dates": [
        ["Application Start Date", "31 May 2025"],
        ["Last Date", "15 June 2025"],
        ["Last Date For Fee Payment", "15 June 2025"],
        ["Exam Date", "Notify Soon"],
        ["Admit Card", "Before Exam"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General/ BC/ EBC/ EWS Candidates : ₹ NA"
      ],
      "eligibility": []
    }
  ],
  /* ---- Result ---- */
  result: [
    {
      "id": "upsssc-stenographer-09-2023-online-document-upload",
      "title": "UPSSSC Stenographer 09/2023 Online Document upload",
      "org": "upsssc",
      "short": "UPSSSC Stenographer Examination 2025 — Candidates are advised to confirm from the UPSSSC official website.",
      "tag": "Out",
      "date": "2026-08-25",
      "line": "Admit Card: 25 August 2026",
      "dates": [
        ["Online Apply Start Date", "17 October 2023"],
        ["Online Apply Last Date", "06 November 2023"],
        ["Fee Payment Last Date", "06 November 2023"],
        ["Correction Date", "15 November 2023"],
        ["Exam Date", "16 November 2025"],
        ["Exam City Details", "07 November 2025"],
        ["Admit Card", "12 November 2025"],
        ["Revised Answer Key", "01 April 2026"],
        ["Result Date", "22 July 2026"],
        ["Skill Test Date", "01 September 2026"],
        ["Admit Card", "25 August 2026"],
        ["Documents Upload", "28 October 2026 to 11 November 2026"]
      ],
      "fee": [
        "For All Candidates : ₹ 25/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2023",
        "Minimum Age : 18 Year",
        "Maximum Age : 40 Year"
      ]
    },
    {
      "id": "upsssc-stenographer-2024-online-documents-upload",
      "title": "UPSSSC Stenographer 2024 Online Documents Upload",
      "org": "upsssc",
      "short": "UPSSSC Stenographer Exam 2024",
      "tag": "Out",
      "date": "2026-10-27",
      "line": "Skill Test Result: 27 October 2026",
      "dates": [
        ["Application Start", "26 December 2024"],
        ["Registration Last Date", "25 January 2025"],
        ["Fee Payment Last Date", "25 January 2025"],
        ["Last Date For Correction", "1 February 2025"],
        ["Eligibility Result", "14 October 2025"],
        ["Exam Date", "20 January 2026"],
        ["Exam City Details", "10 January 2026"],
        ["Admit Card", "16 January 2026"],
        ["Answer Key", "22 January 2026"],
        ["Revised Answer Key", "01 April 2026"],
        ["Result Available", "22 July 2026"],
        ["Skill Test Date", "01 September 2026"],
        ["Admit Card", "25 August 2026"],
        ["Skill Test Result", "27 October 2026"],
        ["Documents Upload", "29 October 2026 to 12 November 2026"]
      ],
      "fee": [
        "General / OBC / EWS : Rs 25/-",
        "SC / ST : Rs 25/-",
        "PH (Divyang) : Rs 25/-"
      ],
      "eligibility": [
        "Age Limit As On : 01.07.2024",
        "Minimum Age : 18 Years",
        "Maximum Age : 40 Years"
      ]
    },
    {
      "id": "rssb-driver-result-2026",
      "title": "RSSB Driver Result 2026",
      "org": "rssb",
      "short": "RSMSSB Driver Examination 2025 — Candidates are advised to confirm from the RSMSSB official website.",
      "tag": "Out",
      "date": "2026-02-01",
      "line": "Score Card Date: 01 February 2026",
      "dates": [
        ["Online Apply Start Date", "27th February 2025"],
        ["Online Apply Last Date", "28th March 2025"],
        ["Last Date For Fee Payment", "28th March 2025"],
        ["Exam Date", "23 November 2025"],
        ["Admit Card", "19 November 2025"],
        ["Answer Key", "10 December 2025"],
        ["Result Declared Date", "17 January 2026"],
        ["Score Card Date", "01 February 2026"]
      ],
      "fee": [
        "General, OBC, EWS: ₹ 600/-",
        "SC / ST, PWD: ₹ 400/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 January 2026",
        "Minimum Age : 18 Years",
        "Maximum Age : 40 Years"
      ]
    },
    {
      "id": "ssc-cpo-si-pet-pst-result-2026-out",
      "title": "SSC CPO SI PET / PST Result 2026 – Out",
      "org": "ssc",
      "short": "SSC CPO SI Examination 2025 — Candidates are advised to confirm from the SSC official website.",
      "tag": "Out",
      "date": "2026-10-29",
      "line": "PET / PST Result: 29 October 2026",
      "dates": [
        ["Online Apply Start Date", "26 September 2025"],
        ["Online Apply Last Date", "16 October 2025"],
        ["Last Date For Fee Payment", "17 October 2025"],
        ["Correction Date", "03 – 05 November 2025"],
        ["Self Slot Booking", "17-21 November 2025"],
        ["Exam Date", "09-12 December 2025"],
        ["Exam City Details", "29 November 2025"],
        ["Admit Card", "07 December 2025"],
        ["Answer Key", "24 December 2025"],
        ["Final Answer Key", "21 April 2026"],
        ["Marks", "21 April 2026"],
        ["PET / PST Date", "21 – 28 July 2026"],
        ["Admit Card", "14 July 2026"],
        ["PET / PST Result", "29 October 2026"]
      ],
      "fee": [
        "For General/ OBC/ EWS : ₹ 100/-",
        "For SC/ ST/ Female : ₹ 0/-",
        "For PH Candidates : ₹ 0/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 August 2025",
        "Minimum Age : 20 Years",
        "Maximum Age : 25 Years"
      ]
    },
    {
      "id": "rpsc-2nd-grade-teacher-result-2026-updated",
      "title": "RPSC 2nd Grade Teacher Result 2026 – Updated",
      "org": "rpsc",
      "short": "RPSC 2nd Grade Teacher Examination 2025 — Candidates are advised to confirm from the RPSC official website.",
      "tag": "Out",
      "date": "2026-10-13",
      "line": "Result Date: 13 October 2026",
      "dates": [
        ["Notification Date", "17 July 2025"],
        ["Online Apply Start Date", "19 August 2025"],
        ["Online Apply Last Date", "17 September 2025"],
        ["Last Date For Fee Payment", "17 September 2025"],
        ["Exam Date", "12 – 18 July 2026"],
        ["Admit Card", "09 July 2026"],
        ["Answer Key", "28 July 2026"],
        ["Result Date", "13 October 2026"]
      ],
      "fee": [
        "For General, Other State : ₹ 600/-",
        "For SC / ST, OBC / BC : ₹ 400/-",
        "For Correction Charge : ₹ 500/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 January 2026",
        "Minimum Age : 18 Years",
        "Maximum Age : 40 Years"
      ]
    },
    {
      "id": "uppsc-lt-grade-assistant-teacher-mains-result-2026-updated",
      "title": "UPPSC LT Grade Assistant Teacher Mains Result 2026 – Updated",
      "org": "uppsc",
      "short": "UPPSC LT Grade Assistant Teacher Examination 2025 — Candidates are advised to confirm from the UPPSC official website.",
      "line": "Computer Mains Admit Card: 11 August 2026",
      "dates": [
        ["Online Apply Start Date", "28 July 2025"],
        ["Online Apply Last Date", "28 August 2025"],
        ["Last Date For Fee Payment", "28 August 2025"],
        ["Exam Date", "06 December 2025 – 25 January 2026"],
        ["Admit Card", "26 November 2025"],
        ["Answer Key", "28 January 2026"],
        ["Result Date", "05 February 2026"],
        ["Computer Exam Date", "05 April 2026"],
        ["Computer Admit Card", "26 March 2026"],
        ["Mains Online Form Online Apply Start Date", "02 April 2026"],
        ["Online Apply Last Date", "17 April 2026"],
        ["Mains Exam Date (Comm. / Sanskrit)", "23 April 2026"],
        ["Mains Exam Date Sociology, Physical Education, Music, Hindi", "11 July 2026"],
        ["Mains Admit Card", "07 July 2026"],
        ["Mains Exam Date (Math, Home Science, Agri/ Horti, Science)", "16, 17, 18 May 2026"],
        ["Mains Admit Card", "12 May 2026"],
        ["Bio / Urdu / Art Mains Exam Date", "13 June 2026"],
        ["Mains Admit Card", "06 June 2026"],
        ["Mains Result", "Will Be Updated Here Soon"],
        ["Computer Mains Form Start Date", "23 June 2026"],
        ["Computer Mains Form Last Date", "07 July 2026"],
        ["Computer Mains Exam Date", "16 August 2026"],
        ["Computer Mains Admit Card", "11 August 2026"]
      ],
      "fee": [
        "For General / EWS/ OBC : ₹ 125/-",
        "SC/ ST Candidates : ₹ 65/-",
        "EX-Service Candidates : ₹ 65/-",
        "PH Candidates: ₹ 25/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2025",
        "Minimum Age : 21 Years",
        "Maximum Age : 40 Years"
      ]
    },
    {
      "id": "bpsc-aso-mains-result-2026",
      "title": "BPSC ASO Mains Result 2026",
      "org": "bpsc",
      "short": "BPSC Assistant Section Officer ASO Examination 2025 — Candidates are advised to confirm from the Bihar BPSC official website.",
      "tag": "Out",
      "date": "2026-10-27",
      "line": "Mains Result: 27 October 2026",
      "dates": [
        ["Online Apply Start Date", "29 May 2025"],
        ["Online Apply Last Date", "23 June 2025"],
        ["Last Date For Fee Payment", "23 June 2025"],
        ["Pre Exam Date", "10 September 2025"],
        ["Admit Card", "04 September 2025"],
        ["Pre Answer Key", "18 September 2025"],
        ["Result Date", "23 December 2025"],
        ["Mains Form Start Date", "12 January 2026"],
        ["Mains Form Last Date", "31 January 2026"],
        ["Mains Exam Date", "27 February 2026"],
        ["Mains Admit Card", "20 February 2026"],
        ["Final Answer Key", "06 April 2026"],
        ["Mains Result", "27 October 2026"]
      ],
      "fee": [
        "For General/ OBC/ EWS : ₹ 600/-",
        "For SC/ ST/ Female Candidates Of Bihar : ₹ 150/-",
        "For PH Candidates : ₹ 200/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 August 2025",
        "Minimum Age : 21 Yrs",
        "Maximum Age : 37 Yrs. (Male)",
        "Maximum Age : 40 Yrs (Female UR, BC/ EBC-Male & Female)",
        "Maximum Age : 42 Yrs (SC/ ST-Male & Female)"
      ]
    },
    {
      "id": "upsc-cds-ii-name-wise-result-2026-out",
      "title": "UPSC CDS-II (Name Wise) Result 2026 – Out",
      "org": "upsc",
      "short": "UPSC Combined Defence Services CDS II Examination 2026 — Candidates are advised to confirm from the UPSC official website.",
      "tag": "Out",
      "date": "2026-10-19",
      "line": "Result Date: 19 October 2026",
      "dates": [
        ["Online Apply Start Date", "20 May 2026"],
        ["Online Apply Last Date", "11 June 2026"],
        ["Last Date For Fee Payment", "11 June 2026"],
        ["Exam Date", "13 September 2026"],
        ["Admit Card", "03 September 2026"],
        ["Answer Key", "16 September 2026"],
        ["Result Date", "19 October 2026"]
      ],
      "fee": [
        "General / OBC : ₹ 200/-",
        "SC / ST/ All Female :₹ 0/-"
      ],
      "eligibility": [
        "Age Limit As On : UPSC Rules.",
        "candidates born not earlier than 01 July 2003 and not later than 01 July 2008 are eligible.",
        "Age Relaxation Extra as per UPSC Examination 2026"
      ]
    },
    {
      "id": "rrb-section-controller-answer-key-2026-out",
      "title": "RRB Section Controller Answer Key 2026 – Out",
      "org": "rrb",
      "short": "RRB Section Controller Examination 2026 — Candidates are advised to confirm from the RRB official website.",
      "tag": "Out",
      "date": "2026-10-26",
      "line": "Answer Key: 26 October 2026",
      "dates": [
        ["Online Apply Start Date", "15 July 2026"],
        ["Online Apply Last Date", "14 August 2026 (23:59 PM)"],
        ["Last Date For Fee Payment", "16 August 2026"],
        ["Correction Date", "17 – 26 August 2026"],
        ["Exam Date", "12 – 13 October 2026"],
        ["Exam City Details", "02 October 2026"],
        ["Admit Card", "08 October 2026"],
        ["Answer Key", "26 October 2026"],
        ["Result Date", "Will Be Updated Here Soon"]
      ],
      "fee": [
        "For General / OBC / EWS : ₹ 500/-",
        "For SC / ST / EBC : ₹ 250/-",
        "For All Category female : ₹ 250/-",
        "After Appearing in CBT-I Exam",
        "UR / OBC / EWS Fee Refund : Rs.400/-",
        "SC / ST / PH & Female Refund : Rs. 250/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "Minimum Age : 20 Years",
        "Maximum Age : 33 Years"
      ]
    },
    {
      "id": "up-home-guard-final-marks-2026-out",
      "title": "UP Home Guard Final Marks 2026 – Out",
      "org": "uppolice",
      "short": "UP Police Home guard Examination 2025 — Candidates are advised to confirm from the UP Home Guard official website.",
      "tag": "Out",
      "date": "2026-10-24",
      "line": "Final Marks: 24 October 2026",
      "dates": [
        ["Online Apply Start Date", "18 November 2025"],
        ["Online Apply Last Date", "17 December 2025"],
        ["Last Date For Fee Payment", "17 December 2025"],
        ["Correction Date", "18 – 21 December 2025"],
        ["Exam Date", "25, 26 & 27 April 2026"],
        ["Exam City Details", "18 April 2026"],
        ["Admit Card", "22 April 2026"],
        ["Answer Key", "07 May 2026"],
        ["Final Answer Key", "28 June 2026"],
        ["Result Date", "28 June 2026"],
        ["DV / PST Exam Date", "13 July to 07 August 2026"],
        ["DV / PST Admit Card", "06 July 2026"],
        ["PET / PST Date", "08 – 16 September 2026"],
        ["PET / PST Admit Card", "01 September 2026"],
        ["New PET Date", "15 September 2026"],
        ["PET Admit Card", "13 September 2026"],
        ["Final Result", "03 October 2026"],
        ["Final Marks", "24 October 2026"]
      ],
      "fee": [
        "For General/ EWS/ OBC : ₹ 400/-",
        "For SC / ST : ₹ 300/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2025",
        "Minimum Age : 18 Years",
        "Maximum Age : 30 Years"
      ]
    },
    {
      "id": "cci-various-post-result-2026-out",
      "title": "CCI Various Post Result 2026 – Out",
      "org": "cci",
      "short": "Cotton Corporation of India CCIL Various Post Examination 2026 — Candidates are advised to confirm from the CCIL official website.",
      "tag": "Out",
      "date": "2026-10-23",
      "line": "Result Date: 23 October 2026",
      "dates": [
        ["Online Apply Start Date", "09 July 2026"],
        ["Online Apply Last Date", "24 July 2026"],
        ["Last Date For Fee Payment", "24 July 2026"],
        ["Exam Date", "01 September 2026"],
        ["Exam City Details", "18 August 2026"],
        ["Admit Card", "21 August 2026"],
        ["Answer Key", "03 September 2026"],
        ["Result Date", "23 October 2026"]
      ],
      "fee": [
        "For General/ OBC/ EWS : ₹ 1770/-",
        "For SC/ ST/ PH : ₹ 590/-",
        "Intimation Charges & GST Included"
      ],
      "eligibility": [
        "Age Limit As On : 09 July 2026",
        "Minimum. Age : 18 Years",
        "Maximum. Age : 30 Years (For Other Post)",
        "Maximum. Age : 32 Years"
      ]
    },

    {
    "id": "ssc-gd-constable-revised-result-2026-out",
      "title": "SSC GD Constable Revised Result 2026 – Out",
      "org": "ssc",
      "short": "SSC GD Constable Examination 2026 — Candidates are advised to confirm from the SSC official website.",
      "tag": "Out",
      "date": "2026-10-20",
      "line": "Revised Result: Available Now",
      "dates": [
        ["Online Apply Start Date", "01 December 2025"],
        ["Online Apply Last Date", "31 December 2025"],
        ["Last Date For Fee Payment", "01 January 2026"],
        ["Correction Form", "10 – 13 January 2026"],
        ["Exam Date", "27 April – 30 May 2026"],
        ["Slot Selection", "11 – 15 April 2026"],
        ["Exam City Details", "19 April 2026"],
        ["Admit Card", "24 April 2026"],
        ["Answer Key", "15 June 2026"],
        ["Result Date", "Available Now"]
      ],
      "fee": [
        "For General, EWS, OBC: Rs. 100/-",
        "For SC, ST & All Female Candidates : Rs. 0/-",
        "Correction Charge : Rs. 200/- (First Time) | Rs. 500/- (Second Time)"
      ],
      "eligibility": [
        "Age Limit As On : 01 January 2026",
        "Minimum Age : 18 Year",
        "Maximum Age : 23 Year"
      ]
    },
    {
      "id": "hpsc-hcs-final-result-2026",
      "title": "HPSC HCS Final Result 2026",
      "org": "hpsc",
      "short": "Haryana HPSC HCS Examination 2026 — Candidates are advised to confirm from the HPSC official website.",
      "tag": "Out",
      "date": "2026-10-17",
      "line": "Final Result: 17 October 2026",
      "dates": [
        ["Online Apply Start Date", "06 February 2026"],
        ["Online Apply Last Date", "26 February 2026"],
        ["Pre Exam Date", "26 April 2026"],
        ["Pre Result Date", "03 May 2026"],
        ["Mains Exam Date", "27 – 29 June 2026"],
        ["Mains Result Date", "17 September 2026"],
        ["Interview Date", "03 – 08 October 2026"],
        ["Final Result", "17 October 2026"]
      ],
      "fee": [
        "For General / Other State : ₹ 1000/-",
        "For Reserved Categories / Women (Haryana) : ₹ 250/-",
        "For PH : ₹ 00/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 January 2026",
        "Minimum Age : 18 Years",
        "Maximum Age : 27 Years (DSP) | 42 Years (Others)"
      ]
    },
    {
      "id": "rbi-officer-grade-b-final-result-2026",
      "title": "RBI Officer Grade-B Final Result 2026",
      "org": "rbi",
      "short": "RBI Officer Grade-B Examination 2026 — Candidates are advised to confirm from the RBI official website.",
      "tag": "Updated",
      "date": "2026-08-25",
      "line": "Result Date: 25 August 2026",
      "dates": [
        ["Online Apply Start Date", "29 April 2026"],
        ["Online Apply Last Date", "20 May 2026"],
        ["Phase-I Exam Date", "13 – 14 June 2026"],
        ["Phase-II Exam Date", "25 – 26 July 2026"],
        ["Result Date", "25 August 2026 Updated"]
      ],
      "fee": [
        "For General, OBC, EWS : ₹ 850/-",
        "For SC / ST, PH : ₹ 100/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 April 2026",
        "Minimum Age : 21 Years",
        "Maximum Age : 30 Years"
      ]
    },
    {
      "id": "railway-rrb-technician-answer-key-2026-out",
      "title": "Railway RRB Technician Answer Key 2026 – Out",
      "org": "rrb",
      "short": "Railway RRB Technician Examination 2026 — Candidates are advised to confirm from the Railway RRB official website.",
      "tag": "Out",
      "date": "2026-10-15",
      "line": "Answer Key: 15 October 2026",
      "dates": [
        ["Online Apply Start Date", "30 June 2026"],
        ["Online Apply Last Date", "29 July 2026"],
        ["Exam Date", "06 – 09 October 2026"],
        ["Admit Card", "02 October 2026"],
        ["Answer Key", "15 October 2026"]
      ],
      "fee": [
        "For General, EWS, OBC : ₹ 500/-",
        "For SC, ST, PH & All Category Female : ₹ 250/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "Minimum Age : 18 Years",
        "Maximum Age : 30 Years (Gr-III) | 33 Years (Gr-I Signal)"
      ]
    },
    {
      "id": "sbi-po-mains-result-2026",
      "title": "SBI PO Mains Result 2026",
      "org": "sbi",
      "short": "SBI Bank PO Examination 2026 — Candidates are advised to confirm from the SBI official website.",
      "tag": "Out",
      "date": "2026-10-15",
      "line": "Mains Result: 15 October 2026",
      "dates": [
        ["Online Apply Start Date", "18 June 2026"],
        ["Online Apply Last Date", "08 July 2026"],
        ["Pre Exam Date", "02 August 2026"],
        ["Pre Result", "28 August 2026"],
        ["Mains Exam Date", "12 September 2026"],
        ["Mains Result", "15 October 2026"]
      ],
      "fee": [
        "For General, OBC, EWS : ₹ 750/-",
        "For SC / ST, PH : ₹ 00/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 April 2026",
        "Minimum Age : 21 Years",
        "Maximum Age : 30 Years"
      ]
    },
    {
      "id": "up-police-constable-final-result-2026",
      "title": "UP Police Constable Final Result 2026",
      "org": "uppolice",
      "short": "UP Police Constable Examination 2026 — Candidates are advised to confirm from the UP Police official website.",
      "tag": "Out",
      "date": "2026-10-14",
      "line": "Final Result: 14 October 2026",
      "dates": [
        ["Online Apply Start Date", "31 December 2025"],
        ["Online Apply Last Date", "30 January 2026"],
        ["Exam Date", "08, 09, 10 June 2026"],
        ["Result Declared Date", "31 July 2026"],
        ["DV / PST Date", "17 August 2026"],
        ["PET Date", "08 October 2026"],
        ["Final Result", "14 October 2026"]
      ],
      "fee": [
        "For General/ EWS/ OBC : ₹ 500/-",
        "For SC / ST : ₹ 400/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2025",
        "Minimum Age : 18 Years",
        "Maximum Age : 25 Years (UR Male) | 28 Years (UR Female) | 30-33 Years (OBC/SC/ST)"
      ]
    },
    {
      "id": "upsc-nda-ii-result-name-wise-2026-out",
      "title": "UPSC NDA II Result (Name Wise) 2026 – Out",
      "org": "upsc",
      "short": "UPSC National Defence Academy & Naval Academy II Examination 2026",
      "tag": "Out",
      "date": "2026-10-09",
      "line": "Result Date: 09 October 2026",
      "dates": [
        ["Online Apply Start Date", "20 May 2026"],
        ["Online Apply Last Date", "11 June 2026"],
        ["Exam Date", "13 September 2026"],
        ["Admit Card", "03 September 2026"],
        ["Result Date", "09 October 2026"]
      ],
      "fee": [
        "General, OBC : ₹ 100/-",
        "SC / ST / All Female : ₹ 0/-"
      ],
      "eligibility": [
        "Candidate date of birth must be between 01 January 2008 and 01 January 2011."
      ]
    },
    {
      "id": "dsssb-assistant-teacher-primary-result-2026",
      "title": "DSSSB Assistant Teacher (Primary) Result 2026",
      "org": "dsssb",
      "short": "DSSSB Primary Teacher PRT Examination 2025 — Candidates are advised to confirm from the DSSSB official website.",
      "tag": "Out",
      "date": "2026-10-13",
      "line": "Result Date: 13 October 2026",
      "dates": [
        ["Online Apply Start Date", "17 September 2025"],
        ["Online Apply Last Date", "16 October 2025"],
        ["Exam Date", "Feb – April 2026"],
        ["Result Date", "13 October 2026"]
      ],
      "fee": [
        "For General, OBC, EWS : ₹ 100/-",
        "For SC / ST, PH, Women : ₹ 00/-"
      ],
      "eligibility": [
        "Age Limit As On : 16 September 2025",
        "Maximum Age : 30 Years"
      ]
    },
    {
      "id": "upessc-principal-result-2026",
      "title": "UPESSC Principal Result 2026",
      "org": "upessc",
      "short": "UPESSC Principal Examination 2026 — Candidates are advised to confirm from the UPESSC official website.",
      "tag": "Out",
      "date": "2026-10-12",
      "line": "Result Date: 12 October 2026",
      "dates": [
        ["Online Apply Start Date", "21 July 2026"],
        ["Online Apply Last Date", "20 August 2026"],
        ["Exam Date", "24 September 2026"],
        ["Answer Key", "26 September 2026"],
        ["Result Date", "12 October 2026"]
      ],
      "fee": [
        "For All Categories : ₹ 3000/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "Maximum Age : 62 Years"
      ]
    },
    {
      "id": "upsssc-cane-supervisor-eligibility-result-2026",
      "title": "UPSSSC Cane Supervisor Eligibility Result 2026",
      "org": "upsssc",
      "short": "UPSSSC Cane Supervisor Examination 2026 — Candidates are advised to confirm from the UPSSSC official website.",
      "tag": "Out",
      "date": "2026-10-12",
      "line": "Eligibility Result: 12 October 2026",
      "dates": [
        ["Online Apply Start Date", "07 July 2026"],
        ["Online Apply Last Date", "28 July 2026"],
        ["Eligibility Result", "12 October 2026"]
      ],
      "fee": [
        "For All Candidates : ₹ 25/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "Minimum Age : 21 Years",
        "Maximum Age : 40 Years"
      ]
    },
    {
      "id": "upsssc-moharir-2022-eligibility-result",
      "title": "UPSSSC Moharir 2022 Eligibility Result",
      "org": "upsssc",
      "short": "UPSSSC Moharir Examination 2022 — Candidates are advised to confirm from the UPSSSC official website.",
      "tag": "Out",
      "date": "2026-10-12",
      "line": "Eligibility Result: 12 October 2026",
      "dates": [
        ["Online Apply Start Date", "29 October 2022"],
        ["Online Apply Last Date", "18 November 2022"],
        ["Eligibility Result", "12 October 2026"]
      ],
      "fee": [
        "For All Candidates : ₹ 25/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "Minimum Age : 18 Years",
        "Maximum Age : 40 Years"
      ]
    },
    {
      "id": "aiims-norcet-11th-stage-ii-result-2026-out",
      "title": "AIIMS NORCET 11th Stage-II Result 2026 – Out",
      "org": "aiims",
      "short": "AIIMS NORCET 11th Nursing Officer Examination 2026",
      "tag": "Out",
      "date": "2026-10-10",
      "line": "Stage-II Result: 10 October 2026",
      "dates": [
        ["Online Apply Start Date", "24 July 2026"],
        ["Online Apply Last Date", "13 August 2026"],
        ["CBT-I Exam Date", "12 September 2026"],
        ["CBT-II Exam Date", "30 September 2026"],
        ["Stage-II Result", "10 October 2026"]
      ],
      "fee": [
        "For General, OBC : ₹ 3000/-",
        "For SC / ST, EWS : ₹ 2400/-",
        "For PwD : ₹ 00/-"
      ],
      "eligibility": [
        "Age Limit As On : 13 August 2026",
        "Minimum Age : 18 Years",
        "Maximum Age : 30 Years"
      ]
    },
    {
      "id": "bihar-police-csbc-constable-gd-final-result-2026-out",
      "title": "Bihar Police CSBC Constable GD Final Result 2026 – Out",
      "org": "csbc",
      "short": "Bihar Police CSBC Constable Examination 2026",
      "tag": "Out",
      "date": "2026-10-09",
      "line": "Final Result: 09 October 2026",
      "dates": [
        ["Online Apply Start Date", "06 February 2026"],
        ["Online Apply Last Date", "05 March 2026"],
        ["Exam Date", "24 June 2026"],
        ["PST/ DV Exam Date", "12 September 2026"],
        ["Final Result", "09 October 2026"]
      ],
      "fee": [
        "For All Category Candidates : ₹ 100/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 August 2026",
        "Minimum Age : 18 Years",
        "Maximum Age : 25 – 30 Years (Category Wise)"
      ]
    },
    {
      "id": "ongc-geologists-and-engineers-e1-result-2026",
      "title": "ONGC Geologists and Engineers E1 Result 2026",
      "org": "ongc",
      "short": "ONGC Geologists and Engineers E1 Examination 2026",
      "tag": "Out",
      "date": "2026-10-08",
      "line": "Result Date: 08 October 2026",
      "dates": [
        ["Online Apply Start Date", "17 July 2026"],
        ["Online Apply Last Date", "31 July 2026"],
        ["Exam Date", "06 September 2026"],
        ["Result Date", "08 October 2026"]
      ],
      "fee": [
        "For General, OBC, EWS : ₹ 1000/-",
        "For SC, ST, PWD : ₹ 00/-"
      ],
      "eligibility": [
        "Maximum Age : 26 – 32 Years (Stream & Category Wise)"
      ]
    },{
      "id": "ssc-stenographer-c-d-2025-final-result-with-marks-out",
      "title": "SSC Stenographer C, D 2025 Final Result With Marks – Out",
      "org": "ssc",
      "short": "SSC Stenographer C, D Examination 2025",
      "tag": "Out",
      "date": "2026-08-25",
      "line": "Final Result: 25 August 2026",
      "dates": [
        ["Online Apply Start Date", "05 June 2025"],
        ["Online Apply Last Date", "26 June 2025"],
        ["Exam Date", "06-08 August 2025"],
        ["Skill Test Date", "28, 29 January 2026"],
        ["Final Result", "25 August 2026"]
      ],
      "fee": [
        "For General/ OBC/ EWS : ₹ 100/-",
        "For SC/ ST/ Female / PH : ₹ 0/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 August 2025",
        "Minimum Age : 18 Years",
        "Maximum Age : 27 Years (Grade-D) | 30 Years (Grade-C)"
      ]
    },
    {
      "id": "ssc-10-2-chsl-2025-final-result-out",
      "title": "SSC 10+2 CHSL 2025 Final Result – Out",
      "org": "ssc",
      "short": "SSC 10+2 CHSL Examination 2025",
      "tag": "Out",
      "date": "2026-06-25",
      "line": "Final Result: Available Now",
      "dates": [
        ["Online Apply Start Date", "23 June 2025"],
        ["Online Apply Last Date", "18 July 2025"],
        ["Tier-I Exam Start", "12 November 2025"],
        ["Tier-II Exam Date", "10 & 22 April 2026"],
        ["Option Form", "19 – 25 June 2026"]
      ],
      "fee": [
        "For General/ OBC/ EWS : ₹ 100/-",
        "For SC/ ST/ Female / PH : ₹ 0/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 August 2025",
        "Minimum Age : 18 Years",
        "Maximum Age : 27 Years"
      ]
    },
    {
      "id": "ssc-mts-havaldar-final-result-2026-out",
      "title": "SSC MTS / Havaldar Final Result 2026 – Out",
      "org": "ssc",
      "short": "SSC Multi Tasking Staff MTS Examination 2025",
      "tag": "Out",
      "date": "2026-10-07",
      "line": "Final Result: 07 October 2026",
      "dates": [
        ["Online Apply Start Date", "26 June 2025"],
        ["Online Apply Last Date", "24 July 2025"],
        ["Exam Start Date", "04 February 2026"],
        ["PET / PST Exam Date", "24 – 31 August 2026"],
        ["Final Result", "07 October 2026"]
      ],
      "fee": [
        "For General/ OBC/ EWS : ₹ 100/-",
        "For SC/ ST/ Female / PH : ₹ 0/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 August 2025",
        "Minimum Age : 18 Years",
        "Maximum Age : 25-27 Years"
      ]
    },
    {
      "id": "rssb-clerk-jr-ii-junior-assistant-score-card-2026",
      "title": "RSSB Clerk Jr-II / Junior Assistant Score Card 2026",
      "org": "rssb",
      "short": "RSSB Clerk Jr-II / Junior Assistant Examination 2026",
      "tag": "Out",
      "date": "2026-09-28",
      "line": "Result Date: 28 September 2026",
      "dates": [
        ["Online Apply Start Date", "15 January 2026"],
        ["Online Apply Last Date", "13 February 2026"],
        ["Exam Date", "05 July 2026"],
        ["Result Date", "28 September 2026"]
      ],
      "fee": [
        "For General, EWS, OBC (CL) : ₹ 600/-",
        "For OBC (NCL), SC, ST, PH : ₹ 400/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 January 2027",
        "Minimum Age : 18 Years",
        "Maximum Age : 40 Years"
      ]
    },
    {
      "id": "rajasthan-state-eligibility-test-set-answer-key-2026",
      "title": "Rajasthan State Eligibility Test SET Answer Key 2026",
      "org": "rpsc",
      "short": "Rajasthan State Eligibility Test SET Examination 2026",
      "tag": "Out",
      "date": "2026-10-05",
      "line": "Answer Key: 05 October 2026",
      "dates": [
        ["Online Apply Start Date", "14 June 2026"],
        ["Online Apply Last Date", "10 August 2026"],
        ["Exam Date", "13 September 2026"],
        ["Answer Key", "05 October 2026"]
      ],
      "fee": [
        "For General, OBC (CL) : ₹ 1500/-",
        "For EWS, OBC (NCL) : ₹ 1200/-",
        "For SC, ST, PH : ₹ 750/-"
      ],
      "eligibility": [
        "No Age Limit as per Rajasthan SET Rules."
      ]
    },
    {
      "id": "ib-mts-final-result-2026-out",
      "title": "IB MTS Final Result 2026 – Out",
      "org": "ib",
      "short": "Intelligence Bureau (IB) MTS Examination 2025",
      "tag": "Out",
      "date": "2026-10-05",
      "line": "Final Result: 05 October 2026",
      "dates": [
        ["Online Apply Start Date", "22 November 2025"],
        ["Online Apply Last Date", "14 December 2025"],
        ["Tier-I Exam Date", "27 January 2026"],
        ["Tier-II Exam Date", "12 July 2026"],
        ["Final Result", "05 October 2026"]
      ],
      "fee": [
        "For General, OBC, EWS : Rs 650/-",
        "For SC, ST : Rs 550/-"
      ],
      "eligibility": [
        "Age Limit As On : 14 December 2025",
        "Minimum Age : 18 Years",
        "Maximum Age : 25 Years"
      ]
    },
    {
      "id": "rpsc-apo-marks-2026",
      "title": "RPSC APO Marks 2026",
      "org": "rpsc",
      "short": "RPSC APO Examination 2026",
      "tag": "Out",
      "date": "2026-10-01",
      "line": "Result Date: 01 October 2026",
      "dates": [
        ["Online Apply Start Date", "08 June 2026"],
        ["Online Apply Last Date", "07 July 2026"],
        ["Pre Exam Date", "02 September 2026"],
        ["Result Date", "01 October 2026"]
      ],
      "fee": [
        "For General & Other State : ₹ 600/-",
        "For SC / ST, OBC (NCL), PH : ₹ 400/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 January 2027",
        "Minimum Age : 21 Years",
        "Maximum Age : 40 Years"
      ]
    },
    {
      "id": "rpsc-veterinary-officer-2025-merit-list-marks",
      "title": "RPSC Veterinary Officer 2025 Merit List, Marks",
      "org": "rpsc",
      "short": "RPSC Veterinary Officer Examination 2025",
      "tag": "Out",
      "date": "2026-10-05",
      "line": "Marks: 05 October 2026",
      "dates": [
        ["Online Apply Start Date", "05 August 2025"],
        ["Online Apply Last Date", "03 September 2025"],
        ["Exam Date", "19 April 2026"],
        ["Result Date", "16 June 2026"],
        ["Marks", "05 October 2026"]
      ],
      "fee": [
        "For General, Other State : ₹ 600/-",
        "For SC / ST, OBC : ₹ 400/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 January 2026",
        "Minimum Age : 20 Years",
        "Maximum Age : 40 Years"
      ]
    },
    {
      "id": "uttarakhand-tet-answer-key-2026-out",
      "title": "Uttarakhand TET Answer Key 2026 – Out",
      "org": "utet",
      "short": "UTET Examination 2026",
      "tag": "Out",
      "date": "2026-10-05",
      "line": "Answer Key: 05 October 2026",
      "dates": [
        ["Apply Online Start Date", "14 July 2026"],
        ["Apply Online Last Date", "03 August 2026"],
        ["Exam Date", "29 September 2026"],
        ["Answer Key", "05 October 2026"]
      ],
      "fee": [
        "Single Paper : ₹ 600/- (UR/OBC) | ₹ 300/- (SC/ST)",
        "Both Paper : ₹ 1000/- (UR/OBC) | ₹ 500/- (SC/ST)"
      ],
      "eligibility": [
        "Age Limit As On Uttarakhand TET Rules."
      ]
    },
    {
      "id": "upsssc-platoon-commander-block-organizer-eligibility-result-2026",
      "title": "UPSSSC Platoon Commander / Block Organizer Eligibility Result 2026",
      "org": "upsssc",
      "short": "UPSSSC Platoon Commander / Block Organizer Examination 2026",
      "tag": "Out",
      "date": "2026-10-01",
      "line": "Eligibility Result: Available Now",
      "dates": [
        ["Online Apply Start Date", "16 June 2026"],
        ["Online Apply Last Date", "06 July 2026"],
        ["Correction Last Date", "13 July 2026"]
      ],
      "fee": [
        "For All Candidates : ₹ 25/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "Minimum Age : 21 Years",
        "Maximum Age : 40 Years"
      ]
    },
    {
      "id": "upsssc-havildar-instructor-eligibility-result-2026",
      "title": "UPSSSC Havildar Instructor Eligibility Result 2026",
      "org": "upsssc",
      "short": "UPSSSC Havildar Instructor Examination 2026",
      "tag": "Out",
      "date": "2026-10-01",
      "line": "Eligibility Result: Available Now",
      "dates": [
        ["Online Apply Start Date", "19 June 2026"],
        ["Online Apply Last Date", "09 July 2026"],
        ["Correction Last Date", "16 July 2026"]
      ],
      "fee": [
        "For All Candidates : ₹ 25/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2026",
        "Minimum Age : 18 Years",
        "Maximum Age : 40 Years"
      ]
    },
    {
      "id": "upsssc-enforcement-constable-2023-final-result",
      "title": "UPSSSC Enforcement Constable 2023 Final Result",
      "org": "upsssc",
      "short": "UPSSSC Enforcement Constable Examination 2023",
      "tag": "Out",
      "date": "2026-09-30",
      "line": "Final Result: 30 September 2026",
      "dates": [
        ["Online Apply Start Date", "07 July 2023"],
        ["Online Apply Last Date", "28 July 2023"],
        ["Exam Date", "11 May 2025"],
        ["PET Exam Date", "22 February 2026"],
        ["Final Result", "30 September 2026"]
      ],
      "fee": [
        "For All Candidates : ₹ 25/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 July 2023",
        "Minimum Age : 18 Years",
        "Maximum Age : 40 Years"
      ]
    },
    {
      "id": "dsssb-delhi-high-court-attendant-result-2026",
      "title": "DSSSB Delhi High Court Attendant Result 2026",
      "org": "dsssb",
      "short": "DSSSB Delhi High Court Attendant Examination 2025",
      "tag": "Out",
      "date": "2026-09-30",
      "line": "Result Date: 30 September 2026",
      "dates": [
        ["Online Apply Start Date", "26 August 2025"],
        ["Online Apply Last Date", "24 September 2025"],
        ["Exam Date", "01 – 30 June 2026"],
        ["Admit Card", "29 May 2026"],
        ["Result Date", "30 September 2026"]
      ],
      "fee": [
        "For General, OBC, EWS : ₹ 100/-",
        "For SC / ST, PH, Women : ₹ 00/-"
      ],
      "eligibility": [
        "Age Limit As On : 01 January 2025",
        "Minimum Age : 18 Years",
        "Maximum Age : 27 Years"
      ]
    }
  ],
  admit: [],
  jobs10: [],
  outsource: [],
  syllabus: [],
  answerkey: [],
  admission: []
};
/* @@DATA-END */

/* =====================================================================
   UNIVERSAL CSP-SAFE RENDERING ENGINE (View All Expandable & LIVE Fixed)
   ===================================================================== */
(function () {
  function safeUrl(u) {
    if (typeof u !== 'string') return '#';
    const s = u.trim();
    return /^https?:\/\//i.test(s) ? s : '#';
  }

  function findPost(id) {
    const keys = Object.keys(DATA);
    for (let i = 0; i < keys.length; i++) {
      const arr = DATA[keys[i]];
      if (Array.isArray(arr)) {
        for (let j = 0; j < arr.length; j++) {
          if (arr[j] && arr[j].id === id) {
            return { post: arr[j], section: keys[i] };
          }
        }
      }
    }
    return null;
  }

  function resolveLinks(post) {
    const p = (post.org && PORTALS[post.org]) ? PORTALS[post.org] : null;
    const official = post.official || (p ? p.official : 'https://www.india.gov.in/');
    const apply = post.apply || (p ? p.apply : official);
    return { official: safeUrl(official), apply: safeUrl(apply), orgName: p ? p.name : '' };
  }

  const SECTION_SELECTORS = {
    latest: ['[data-list="latest"]', '#latestJobsList', '#list-latest', '#latest'],
    result: ['[data-list="result"]', '#resultList', '#list-result', '#result'],
    admit: ['[data-list="admit"]', '#admitCardList', '#list-admit', '#admit'],
    jobs10: ['[data-list="jobs10"]', '#itiJobsList', '#list-jobs10', '#jobs10'],
    outsource: ['[data-list="outsource"]', '#outsourcingList', '#list-outsource', '#outsource'],
    syllabus: ['[data-list="syllabus"]', '#syllabusList', '#list-syllabus', '#syllabus'],
    answerkey: ['[data-list="answerkey"]', '#answerKeyList', '#list-answerkey', '#answerkey'],
    admission: ['[data-list="admission"]', '#admissionList', '#list-admission', '#admission']
  };

  // ट्रैक करने के लिए कि किस सेक्शन का "View All" क्लिक हुआ है
  const expandedSections = {};

  function getListElement(key) {
    const sels = SECTION_SELECTORS[key] || [];
    for (let i = 0; i < sels.length; i++) {
      const el = document.querySelector(sels[i]);
      if (el) return el.tagName === 'UL' ? el : (el.querySelector('ul') || el);
    }
    return null;
  }

  function renderLists(query) {
    const q = (query || '').trim().toLowerCase();
    Object.keys(SECTION_SELECTORS).forEach(function (key) {
      const ul = getListElement(key);
      if (!ul) return;
      while (ul.firstChild) ul.removeChild(ul.firstChild);

      const items = (DATA[key] || []).filter(function (item) {
        if (!q) return true;
        const hay = ((item.title || '') + ' ' + (item.short || '') + ' ' + (item.line || '')).toLowerCase();
        return hay.indexOf(q) !== -1;
      });

      const emptyMsg = document.querySelector(`[data-empty="${key}"]`);

      if (items.length === 0) {
        if (emptyMsg) emptyMsg.hidden = false;
        const viewAllBtn = document.querySelector(`[data-more="${key}"]`);
        if (viewAllBtn) viewAllBtn.hidden = true;
        return;
      }

      if (emptyMsg) emptyMsg.hidden = true;

      // अगर "View All" पर क्लिक किया है तो सारे दिखाएँ, वरना सिर्फ़ पहले 6
      const limit = expandedSections[key] ? items.length : 6;
      const displayItems = items.slice(0, limit);

      displayItems.forEach(function (post) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + post.id;
        a.className = 'post-link';
        a.setAttribute('data-post-id', post.id);
        a.textContent = '• ' + post.title;
        li.appendChild(a);

        if (post.tag || post.extended) {
          const tagSpan = document.createElement('span');
          tagSpan.className = 'tag tag-new';
          tagSpan.textContent = ' [' + (post.tag || 'Extended') + ']';
          li.appendChild(tagSpan);
        }

        if (post.line) {
          const meta = document.createElement('span');
          meta.className = 'post-date';
          meta.textContent = post.line;
          li.appendChild(meta);
        }

        ul.appendChild(li);
      });

      // View All बटन की स्थिति और टेक्स्ट मैनेज करना
      const viewAllBtn = document.querySelector(`[data-more="${key}"]`);
      if (viewAllBtn) {
        if (items.length <= 6) {
          viewAllBtn.hidden = true;
        } else {
          viewAllBtn.hidden = false;
          viewAllBtn.textContent = expandedSections[key] ? '« Show Less' : `View All ${key.charAt(0).toUpperCase() + key.slice(1)} »`;
        }
      }
    });
  }

  function renderTickerAndHighlights() {
    const topItems = (DATA.latest || []).slice(0, 4).concat((DATA.result || []).slice(0, 4));

    const tickerContainer = document.querySelector('#ticker');
    const ticker = document.querySelector('#ticker-track');
    if (tickerContainer && topItems.length) {
      tickerContainer.hidden = false;
    }
    if (ticker && topItems.length) {
      while (ticker.firstChild) ticker.removeChild(ticker.firstChild);
      topItems.slice(0, 6).forEach(function (item, idx) {
        if (idx > 0) ticker.appendChild(document.createTextNode(' || '));
        const a = document.createElement('button');
        a.className = 'ticker-item';
        a.setAttribute('data-post-id', item.id);
        a.textContent = item.title;
        ticker.appendChild(a);
      });
    }

    const grid = document.querySelector('#hot-grid');
    if (grid && topItems.length) {
      grid.hidden = false;
      while (grid.firstChild) grid.removeChild(grid.firstChild);
      topItems.slice(0, 8).forEach(function (item, idx) {
        const card = document.createElement('button');
        card.className = 'hot-tile c' + ((idx % 8) + 1);
        card.setAttribute('data-post-id', item.id);
        card.textContent = item.title;
        grid.appendChild(card);
      });
    }
  }

  function renderTools() {}

  function fillListDirect(ulElement, arr) {
    if (!ulElement) return;
    while (ulElement.firstChild) ulElement.removeChild(ulElement.firstChild);
    (arr || []).forEach(function (row) {
      const li = document.createElement('li');
      li.textContent = Array.isArray(row) ? (row[0] + ' : ' + row[1]) : String(row);
      ulElement.appendChild(li);
    });
  }

  function openPostModal(postId) {
    const found = findPost(postId);
    if (!found) return;
    const post = found.post;
    const links = resolveLinks(post);

    const modal = document.getElementById('post-modal');
    if (modal) {
      const dateEl = document.getElementById('m-date');
      if (dateEl) dateEl.textContent = post.line || post.date || 'Latest Update';

      const shortEl = document.getElementById('m-short');
      if (shortEl) shortEl.textContent = post.short || post.title;

      const headEl = document.getElementById('m-title');
      if (headEl) headEl.textContent = post.title;

      const vacEl = document.getElementById('m-vacancy');
      if (vacEl) vacEl.textContent = post.posts ? (post.posts + ' Posts') : (found.section === 'result' ? 'Result Available' : 'Check Notification');

      fillListDirect(document.getElementById('m-dates'), post.dates);
      fillListDirect(document.getElementById('m-fee'), post.fee);
      fillListDirect(document.getElementById('m-eligibility'), post.eligibility);

      const btnApply = document.getElementById('m-apply');
      if (btnApply) btnApply.href = links.apply;

      const btnOfficial = document.getElementById('m-official');
      if (btnOfficial) btnOfficial.href = links.official;

      modal.hidden = false;
      document.body.classList.add('modal-open');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderTickerAndHighlights();
    renderLists('');
    renderTools();

    // नेविगेशन टैब एक्टिव क्लास स्विच करना
    const navTabs = document.querySelectorAll('.nav-tabs a');
    navTabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        navTabs.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
      });
    });

    // ग्लोबल क्लिक हैंडलर (View All बटन और पोस्ट मोडल के लिए)
    document.body.addEventListener('click', function (e) {
      const moreBtn = e.target.closest('[data-more]');
      if (moreBtn) {
        e.preventDefault();
        const sectionKey = moreBtn.getAttribute('data-more');
        expandedSections[sectionKey] = !expandedSections[sectionKey];
        renderLists(document.querySelector('#search-input') ? document.querySelector('#search-input').value : '');
        return;
      }

      const trigger = e.target.closest('[data-post-id]');
      if (trigger) {
        e.preventDefault();
        openPostModal(trigger.getAttribute('data-post-id'));
        return;
      }

      if (e.target.id === 'm-close' || e.target.getAttribute('data-close') === '1') {
        const m = document.getElementById('post-modal');
        if (m) {
          m.hidden = true;
          document.body.classList.remove('modal-open');
        }
      }
    });

    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        renderLists(e.target.value);
      });
    }
  });
})();