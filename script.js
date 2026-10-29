// ============================================================================
// SARKARIRESULTUPALL.COM - FINAL STABLE MASTER SCRIPT (FIXED TOOL URLS + RIGHT AI CHAT)
// ============================================================================

(function () {
    "use strict";

    // ---------------- 1. SECURITY MODULE (Anti-Hack & Frame Protection) ----------------
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    function escapeHTML(str) {
        if (typeof str !== "string") return "";
        return str.replace(/[&<>"'`=\/]/g, function (s) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
                "/": "&#x2F;",
                "`": "&#x60;",
                "=": "&#x3D;"
            }[s];
        });
    }

    function sanitizeUrl(url) {
        if (typeof url !== "string") return "#";
        const trimmed = url.trim();
        if (/^https?:\/\//i.test(trimmed)) {
            return trimmed;
        }
        return "#";
    }

    document.addEventListener("contextmenu", function (e) {
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
            e.preventDefault();
        }
    });

    document.addEventListener("keydown", function (e) {
        if (
            e.key === "F12" ||
            (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
            (e.ctrlKey && (e.key === "u" || e.key === "U"))
        ) {
            e.preventDefault();
        }
    });

    // ---------------- 2. WEEKLY UPDATABLE DATA ARRAYS ----------------

    const LIVE_TICKER_ITEMS = Object.freeze([
        { id: "up-board-10th", text: "UP Board Class 10th & 12th Result / Time Table 2026-27 [Declared]" },
        { id: "up-police-constable", text: "UP Police Constable 32,679 Posts Online Form 2026 [Apply Online]" },
        { id: "anganwadi-2026", text: "UP Anganwadi Supervisor, Teacher & Worker Online Form 2026 [Active]" },
        { id: "ssc-gd-2026", text: "SSC GD Constable Final Merit List & Online Form 2026-27 [Out]" },
        { id: "ecce-educator", text: "UP ECCE Educator Online Form 2026 (All Districts) [Apply Now]" }
    ]);

    const TOP_HIGHLIGHTS = Object.freeze([
        { id: "up-police-constable", title: "UP Police Constable 32,679 Posts Online Form 2026", colorClass: "bg-c1" },
        { id: "ssc-gd-2026", title: "SSC GD Constable Online Form 2026-27", colorClass: "bg-c2" },
        { id: "up-scholarship-2026", title: "UP Scholarship 2026-27 Online Form (Class 9 to 12, UG/PG)", colorClass: "bg-c3" },
        { id: "nta-neet-ug", title: "NTA NEET UG 2026 Online Form & Information Bulletin", colorClass: "bg-c4" },
        { id: "up-board-10th", title: "UP Board 10th & 12th Result / Time Table 2026-27", colorClass: "bg-c5" },
        { id: "anganwadi-2026", title: "UP Anganwadi Supervisor & Worker Online Form 2026", colorClass: "bg-c6" },
        { id: "rrb-ntpc-ug", title: "RRB NTPC 10+2 & Graduate Level Online Form 2026", colorClass: "bg-c7" },
        { id: "ecce-educator", title: "UP ECCE Educator All District Online Form 2026", colorClass: "bg-c8" }
    ]);

    const FEATURED_SCHEMES = Object.freeze([
        {
            postId: "anganwadi-2026",
            hindiTitle: "आंगनबाड़ी भर्ती 2026",
            englishTitle: "UP Anganwadi Supervisor & Worker 2026",
            description: "Registration started for combined Anganwadi Recruitment & Training Program 2026 on SarkariResultUpAll.com. Click here to view official notification & apply online.",
            buttonText: "Apply Online »",
            headers: ["प्रशिक्षण / पद का नाम", "अवधि / चयन", "योग्यता"],
            rows: [
                ["आंगनबाड़ी सुपरवाइज़र", "सीधी भर्ती / 3 माह", "स्नातक पास (Graduate)"],
                ["आंगनबाड़ी टीचर", "6 माह", "12वीं पास (10+2)"],
                ["आंगनबाड़ी वर्कर / सहायिका", "3 माह", "10वीं पास (High School)"]
            ]
        }
    ]);

    const PORTAL_POSTS = Object.freeze([
        // RESULTS
        {
            id: "up-board-10th",
            category: "result",
            title: "UP Board Class 10th High School Result 2026",
            tag: "[Declared]",
            date: "20 April 2026",
            time: "02:00 PM",
            shortInfo: "Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP) High School Class 10th Exam Result 2026. Check Roll Number Wise Result on Official NIC Server.",
            officialUrl: "https://upresults.nic.in/"
        },
        {
            id: "up-board-12th",
            category: "result",
            title: "UP Board Class 12th Intermediate Result 2026",
            tag: "[Server Active]",
            date: "20 April 2026",
            time: "02:00 PM",
            shortInfo: "Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP) Intermediate Class 12th Science, Arts & Commerce Result 2026.",
            officialUrl: "https://upresults.nic.in/"
        },
        {
            id: "up-police-result",
            category: "result",
            title: "UP Police Constable Written Exam Final Result 2026",
            tag: "[New]",
            date: "28 Oct 2026",
            time: "06:30 PM",
            shortInfo: "Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB) Civil Police Constable Written Exam Result & Cutoff Marks 2026.",
            officialUrl: "https://uppbpb.gov.in/"
        },
        {
            id: "ssc-gd-result",
            category: "result",
            title: "SSC GD Constable Final Merit List 2026",
            tag: "[Out]",
            date: "27 Oct 2026",
            time: "08:15 PM",
            shortInfo: "Staff Selection Commission (SSC) Constable GD in CAPFs, SSF, Rifleman (GD) in Assam Rifles Final Merit List Download.",
            officialUrl: "https://ssc.gov.in/"
        },
        {
            id: "upsssc-pet-score",
            category: "result",
            title: "UPSSSC PET 2026 Score Card Download",
            tag: "[Active]",
            date: "25 Oct 2026",
            time: "04:45 PM",
            shortInfo: "Uttar Pradesh Subordinate Services Selection Commission (UPSSSC) Preliminary Eligibility Test (PET) 2026 Official Score Card.",
            officialUrl: "https://upsssc.gov.in/"
        },
        {
            id: "army-agniveer-result",
            category: "result",
            title: "Indian Army Agniveer CEE Exam Result 2026",
            tag: "[Declared]",
            date: "24 Oct 2026",
            time: "01:20 PM",
            shortInfo: "Join Indian Army Agniveer Common Entrance Exam (CEE) Roll Number Wise Merit List 2026 for all AROs.",
            officialUrl: "https://joinindianarmy.nic.in/"
        },
        {
            id: "rrb-alp-result",
            category: "result",
            title: "Railway RRB ALP CBT-1 Score Card & Result 2026",
            tag: "[2026]",
            date: "22 Oct 2026",
            time: "05:00 PM",
            shortInfo: "Railway Recruitment Board (RRB) Assistant Loco Pilot (ALP) CBT-1 Result, Cut Off & Score Card Link.",
            officialUrl: "https://indianrailways.gov.in/"
        },
        {
            id: "bihar-board-10th-result",
            category: "result",
            title: "Bihar Board BSEB Class 10th & 12th Result 2026",
            tag: "[Declared]",
            date: "20 Oct 2026",
            time: "03:15 PM",
            shortInfo: "Bihar School Examination Board (BSEB) Matric & Inter Annual Exam Result 2026 Direct Link.",
            officialUrl: "https://results.biharboardonline.com/"
        },

        // ADMIT CARDS
        {
            id: "up-police-admit",
            category: "admit-card",
            title: "UP Police Constable Admit Card & Exam City 2026",
            tag: "[Link Active]",
            date: "29 Oct 2026",
            time: "10:15 AM",
            shortInfo: "UPPRPB Constable Recruitment Exam City Intimation Slip and Hall Ticket Download 2026.",
            officialUrl: "https://uppbpb.gov.in/"
        },
        {
            id: "ssc-cgl-admit",
            category: "admit-card",
            title: "SSC CGL Tier-1 / Tier-2 Admit Card 2026",
            tag: "[Download]",
            date: "28 Oct 2026",
            time: "11:40 AM",
            shortInfo: "Staff Selection Commission Combined Graduate Level (CGL) 2026 Region Wise Application Status & Admit Card.",
            officialUrl: "https://ssc.gov.in/"
        },
        {
            id: "bsf-hc-admit",
            category: "admit-card",
            title: "BSF HC RO / RM CBT Exam Admit Card 2026",
            tag: "[New]",
            date: "27 Oct 2026",
            time: "01:00 PM",
            shortInfo: "Border Security Force (BSF) Head Constable (Radio Operator & Radio Mechanic) Admit Card 2026.",
            officialUrl: "https://rectt.bsf.gov.in/"
        },
        {
            id: "rrb-ntpc-admit",
            category: "admit-card",
            title: "Railway RRB NTPC Graduate & 10+2 CBTST Admit Card 2026",
            tag: "[Live]",
            date: "26 Oct 2026",
            time: "04:00 PM",
            shortInfo: "Railway Recruitment Board (RRB) Non-Technical Popular Categories (NTPC) Graduate & UG Level Admit Card 2026.",
            officialUrl: "https://indianrailways.gov.in/"
        },
        {
            id: "upsssc-lekhpal-admit",
            category: "admit-card",
            title: "UPSSSC Rajasva Lekhpal Mains Admit Card 2026",
            tag: "[Active]",
            date: "24 Oct 2026",
            time: "02:30 PM",
            shortInfo: "UPSSSC Rajasva Lekhpal Mains Examination Hall Ticket & Exam Center Notice 2026.",
            officialUrl: "https://upsssc.gov.in/"
        },
        {
            id: "uppsc-pcs-admit",
            category: "admit-card",
            title: "UPPSC PCS Pre Exam Admit Card & 2025 Interview Letter",
            tag: "[Out]",
            date: "21 Oct 2026",
            time: "05:20 PM",
            shortInfo: "Uttar Pradesh Public Service Commission (UPPSC) Combined State / Upper Subordinate Services Admit Card & Interview Letter.",
            officialUrl: "https://uppsc.up.nic.in/"
        },
        {
            id: "airforce-agniveer-admit",
            category: "admit-card",
            title: "Indian Airforce Agniveer Vayu Musician Intake 01/2027 Admit Card",
            tag: "[Download]",
            date: "19 Oct 2026",
            time: "12:10 PM",
            shortInfo: "Indian Air Force Agniveer Vayu Intake 01/2027 Exam Date, City Intimation & Admit Card.",
            officialUrl: "https://agnipathvayu.cdac.in/"
        },
        {
            id: "isro-icrb-admit",
            category: "admit-card",
            title: "ISRO ICRB Scientist / Engineer & SDSC Admit Card 2026",
            tag: "[New]",
            date: "29 Oct 2026",
            time: "09:30 AM",
            shortInfo: "Indian Space Research Organisation (ISRO) Scientist/Engineer, ISTRAC & SDSC Various Post Admit Card 2026.",
            officialUrl: "https://www.isro.gov.in/"
        },
        {
            id: "ntpc-ao-admit",
            category: "admit-card",
            title: "NTPC Assistant Officer Admit Card 2026",
            tag: "[Out]",
            date: "28 Oct 2026",
            time: "03:40 PM",
            shortInfo: "NTPC Limited Assistant Officer Recruitment Exam Admit Card 2026 Direct Download.",
            officialUrl: "https://careers.ntpc.co.in/"
        },
        {
            id: "delhi-hc-spa-admit",
            category: "admit-card",
            title: "Delhi High Court SPA Typing Test & JJA / HJS Mains Admit Card 2026",
            tag: "[Active]",
            date: "28 Oct 2026",
            time: "01:15 PM",
            shortInfo: "High Court of Delhi Senior Personal Assistant (SPA) Typing Test Date, JJA Mains & HJS Mains Admit Card 2026.",
            officialUrl: "https://delhihighcourt.nic.in/"
        },
        {
            id: "ssc-je-city",
            category: "admit-card",
            title: "SSC Junior Engineer JE Exam City Details & CPO SI Revised Date 2026",
            tag: "[Link Active]",
            date: "27 Oct 2026",
            time: "06:00 PM",
            shortInfo: "SSC Junior Engineer (Civil, Mechanical, Electrical) Exam City Slip and SSC CPO SI CAPF Revised Exam Schedule 2026.",
            officialUrl: "https://ssc.gov.in/"
        },
        {
            id: "cisf-constable-admit",
            category: "admit-card",
            title: "CISF Constable Tradesmen, Fire, Driver & ASI Exam Date 2026",
            tag: "[New]",
            date: "27 Oct 2026",
            time: "02:10 PM",
            shortInfo: "Central Industrial Security Force (CISF) Constable Tradesmen, Fire, Driver & ASI Paramedical Staff PST/Exam Admit Card 2026.",
            officialUrl: "https://cisfrectt.cisf.gov.in/"
        },
        {
            id: "up-special-tet",
            category: "admit-card",
            title: "UP Special TET Exam City Details & CTET September Exam Date 2026",
            tag: "[Live]",
            date: "26 Oct 2026",
            time: "11:20 AM",
            shortInfo: "Uttar Pradesh Special Teacher Eligibility Test (UP TET) Exam City Intimation & CBSE CTET Exam Schedule 2026.",
            officialUrl: "https://updeled.gov.in/"
        },
        {
            id: "rrb-alp-cbat",
            category: "admit-card",
            title: "Railway RRB ALP Exam City Details, CBAT & Paramedical Exam Date 2026",
            tag: "[Out]",
            date: "25 Oct 2026",
            time: "04:50 PM",
            shortInfo: "Railway RRB ALP Exam City Slip, CBAT Psycho Test Admit Card and RRB Paramedical Staff Exam Schedule 2026.",
            officialUrl: "https://indianrailways.gov.in/"
        },
        {
            id: "ibps-sbi-bank-admit",
            category: "admit-card",
            title: "SBI Clerk Pre/Mains, IBPS PO/Clerk/SO & Bank of Baroda LBO Admit Card 2026",
            tag: "[Out]",
            date: "25 Oct 2026",
            time: "10:30 AM",
            shortInfo: "Download SBI Junior Associates Clerk Admit Card, IBPS CRP PO/MT XVI Mains, IBPS Clerk 16th Pre, PNB LBO, IOB LBO & Union Bank SO Admit Card 2026.",
            officialUrl: "https://www.ibps.in/"
        },
        {
            id: "uppsc-gic-lecturer",
            category: "admit-card",
            title: "UPPSC GIC Lecturer Mains, Technical Education & Assistant Professor Admit Card 2026",
            tag: "[New]",
            date: "24 Oct 2026",
            time: "03:00 PM",
            shortInfo: "UPPSC Government Inter College (GIC) Lecturer Mains, Lecturer Technical Education, ATP Mains & UPESSC Assistant Professor Admit Card 2026.",
            officialUrl: "https://uppsc.up.nic.in/"
        },
        {
            id: "ssc-delhi-police-admit",
            category: "admit-card",
            title: "SSC Delhi Police Constable Executive, HC Ministerial & Driver PE/MT Admit Card 2026",
            tag: "[Active]",
            date: "23 Oct 2026",
            time: "05:15 PM",
            shortInfo: "Staff Selection Commission & Delhi Police Constable (Executive), Head Constable (Ministerial) & Driver Physical Endurance & Measurement Test Admit Card 2026.",
            officialUrl: "https://delhipolice.gov.in/"
        },
        {
            id: "upsssc-ja-anm-admit",
            category: "admit-card",
            title: "UPSSSC Junior Assistant Typing Test, Stenographer Skill Test & ANM DV Letter 2026",
            tag: "[Download]",
            date: "22 Oct 2026",
            time: "01:40 PM",
            shortInfo: "UPSSSC Junior Assistant Typing Test New Exam Date, Stenographer Skill Test Admit Card, Female Health Worker (ANM) DV Upload & UPSSSC Exam Calendar 2026.",
            officialUrl: "https://upsssc.gov.in/"
        },
        {
            id: "allahabad-hc-bhu-admit",
            category: "admit-card",
            title: "Allahabad High Court Research Associates & BHU School Teacher TGT/PGT Exam Date 2026",
            tag: "[New]",
            date: "21 Oct 2026",
            time: "04:10 PM",
            shortInfo: "High Court of Judicature at Allahabad Research Associates Admit Card & Banaras Hindu University (BHU) School Teacher TGT, PGT, PRT Exam Date 2026.",
            officialUrl: "https://www.allahabadhighcourt.in/"
        },
        {
            id: "ssb-navy-kvs-admit",
            category: "admit-card",
            title: "SSB Constable/HC/SI PET/PST, Indian Navy SSR/MR Stage-II & KVS NVS Interview Letter 2026",
            tag: "[Live]",
            date: "20 Oct 2026",
            time: "11:00 AM",
            shortInfo: "Sashastra Seema Bal (SSB) Tradesman, HC & SI PET/PST Admit Card, Indian Navy Agniveer Stage-II & KVS/NVS Teaching & Non-Teaching Interview Letter 2026.",
            officialUrl: "https://ssbrectt.gov.in/"
        },

        // LATEST JOBS
        {
            id: "up-police-constable",
            category: "latest-job",
            title: "UP Police Constable 32,679 Posts Online Form 2026",
            tag: "[Apply Online]",
            date: "29 Oct 2026",
            time: "09:30 AM",
            shortInfo: "Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB) has invited online applications for 32,679 Civil Police & PAC Constable Posts.",
            officialUrl: "https://uppbpb.gov.in/"
        },
        {
            id: "anganwadi-2026",
            category: "latest-job",
            title: "UP Anganwadi Supervisor, Teacher & Worker Recruitment Online Form 2026",
            tag: "[New]",
            date: "29 Oct 2026",
            time: "08:45 AM",
            shortInfo: "Bal Vikas Seva Evam Pushtahar Vibhag UP Anganwadi Supervisor (Graduate), Anganwadi Teacher (12th Pass) & Worker (10th Pass) Online Registration 2026.",
            officialUrl: "https://upanganwadibharti.in/"
        },
        {
            id: "ssc-gd-2026",
            category: "latest-job",
            title: "SSC GD Constable Online Form 2026-27",
            tag: "[Last Date Extended]",
            date: "28 Oct 2026",
            time: "10:00 AM",
            shortInfo: "Staff Selection Commission (SSC) GD Constable in BSF, CISF, CRPF, SSB, ITBP, AR & SSF Online Application Form 2026-27.",
            officialUrl: "https://ssc.gov.in/"
        },
        {
            id: "rrb-group-d",
            category: "latest-job",
            title: "Railway RRB Group D 50,000+ Posts Online Form 2026",
            tag: "[New]",
            date: "27 Oct 2026",
            time: "02:45 PM",
            shortInfo: "Railway Recruitment Cell (RRC) Level-1 Group D Track Maintainer, Pointsman & Helper 50,000+ Vacancies Online Form 2026.",
            officialUrl: "https://indianrailways.gov.in/"
        },
        {
            id: "up-police-si",
            category: "latest-job",
            title: "UP Police SI Daroga 4,543 Posts Online Form 2026",
            tag: "[Apply]",
            date: "26 Oct 2026",
            time: "01:15 PM",
            shortInfo: "UP Police Sub Inspector (SI Civil Police), Platoon Commander & Fire Service Second Officer Recruitment 2026.",
            officialUrl: "https://uppbpb.gov.in/"
        },
        {
            id: "upsssc-vdo-2026",
            category: "latest-job",
            title: "UPSSSC Gram Panchayat Adhikari (VDO) Online Form 2026",
            tag: "[UPSSSC]",
            date: "25 Oct 2026",
            time: "04:20 PM",
            shortInfo: "Uttar Pradesh Subordinate Services Selection Commission (UPSSSC) Gram Panchayat Adhikari & Gram Vikas Adhikari Mains Form 2026.",
            officialUrl: "https://upsssc.gov.in/"
        },
        {
            id: "army-agniveer-rally",
            category: "latest-job",
            title: "Indian Army Agniveer Rally Recruitment 2026 Online Form",
            tag: "[Rally 2026]",
            date: "24 Oct 2026",
            time: "11:30 AM",
            shortInfo: "Indian Army Agniveer General Duty (GD), Technical, Clerk, Store Keeper & Tradesman All Zone Rally Notification 2026.",
            officialUrl: "https://joinindianarmy.nic.in/"
        },
        {
            id: "up-home-guard",
            category: "latest-job",
            title: "UP Home Guard 42,000 Posts Bharti Online Form 2026",
            tag: "[UP Bharti]",
            date: "23 Oct 2026",
            time: "03:10 PM",
            shortInfo: "Uttar Pradesh Home Guards Department 42,000 Volunteer Home Guard Recruitment 2026 (10th & 12th Pass).",
            officialUrl: "https://homeguards.up.nic.in/"
        },

        // 10th / ITI JOBS
        {
            id: "rrb-ntpc-ug",
            category: "iti-job",
            title: "RRB NTPC 10+2 UG Online Form 2026 (1688 Posts)",
            tag: "[Apply Online]",
            date: "29 Oct 2026",
            time: "11:00 AM",
            shortInfo: "Railway Recruitment Board (RRB) Non-Technical Popular Categories (Undergraduate Level 10+2) 1,688 Posts Online Form 2026.",
            officialUrl: "https://indianrailways.gov.in/"
        },
        {
            id: "raj-safai-karmchari",
            category: "iti-job",
            title: "Rajasthan Safai Karmchari Online Form 2026 (24,752 Posts)",
            tag: "[Last Date Today]",
            date: "29 Oct 2026",
            time: "09:15 AM",
            shortInfo: "Local Self Government Department Rajasthan Safai Karmchari 24,752 Posts Online Form 2026.",
            officialUrl: "https://lsg.urban.rajasthan.gov.in/"
        },
        {
            id: "upsssc-inter-level",
            category: "iti-job",
            title: "UPSSSC Inter (12th) Level & Junior Engineer JE Online Form 2026",
            tag: "[New]",
            date: "28 Oct 2026",
            time: "02:00 PM",
            shortInfo: "UPSSSC 10+2 Intermediate Level Clerical Cadre and Junior Engineer (Civil/Mechanical) Recruitment 2026.",
            officialUrl: "https://upsssc.gov.in/"
        },
        {
            id: "mpesb-sub-eng",
            category: "iti-job",
            title: "MPESB Group 3 Sub Engineer & MP Police Constable Driver Online Form 2026",
            tag: "[Active]",
            date: "27 Oct 2026",
            time: "04:30 PM",
            shortInfo: "Madhya Pradesh Employees Selection Board (MPESB) Group-3 Sub Engineer & Police Constable Driver Online Form 2026.",
            officialUrl: "https://esb.mp.gov.in/"
        },
        {
            id: "itbp-hc-mm",
            category: "iti-job",
            title: "ITBP HC (Motor Mechanic) & UKSSSC Group C Scaler Online Form 2026",
            tag: "[10th/ITI]",
            date: "26 Oct 2026",
            time: "01:45 PM",
            shortInfo: "ITBP Head Constable Motor Mechanic Recruitment & UKSSSC Group C Scaler Online Application 2026.",
            officialUrl: "https://recruitment.itbpolice.nic.in/"
        },
        {
            id: "railway-nwr-lic-apprentice",
            category: "iti-job",
            title: "Railway RRC NWR Apprentice & LIC HFL Apprentice Online Form 2026",
            tag: "[Apprentice]",
            date: "25 Oct 2026",
            time: "12:20 PM",
            shortInfo: "North Western Railway (RRC NWR) ITI Apprentice & LIC Housing Finance Ltd Apprentice Online Form 2026.",
            officialUrl: "https://rrcjaipur.in/"
        },

        // OUTSOURCING JOBS
        {
            id: "ecce-educator",
            category: "outsourcing",
            title: "UP Hamirpur & Budaun ECCE Educator Online Form 2026",
            tag: "[Sevayojan]",
            date: "29 Oct 2026",
            time: "10:00 AM",
            shortInfo: "Uttar Pradesh Samagra Shiksha Abhiyan Early Childhood Care and Education (ECCE) Educator Recruitment 2026 via UP Sevayojan Portal.",
            officialUrl: "https://sewayojan.up.nic.in/"
        },
        {
            id: "ecce-shahjahanpur-fatehpur",
            category: "outsourcing",
            title: "UP Shahjahanpur & Fatehpur ECCE Educator Online Form 2026",
            tag: "[Apply Now]",
            date: "28 Oct 2026",
            time: "03:20 PM",
            shortInfo: "Apply online for UP Shahjahanpur and Fatehpur District ECCE Educator Bharti 2026 on Sevayojan.",
            officialUrl: "https://sewayojan.up.nic.in/"
        },
        {
            id: "ecce-kanpur-rampur",
            category: "outsourcing",
            title: "UP Kanpur, Etawah & Rampur ECCE Educator Online Form 2026",
            tag: "[Active]",
            date: "27 Oct 2026",
            time: "01:10 PM",
            shortInfo: "UP Kanpur Nagar, Kanpur Dehat, Etawah, and Rampur ECCE Educator Contract Basis Recruitment 2026.",
            officialUrl: "https://sewayojan.up.nic.in/"
        },
        {
            id: "ecce-mathura-hapur-jhansi",
            category: "outsourcing",
            title: "UP Mathura, Hapur & Jhansi ECCE Educator Online Form 2026",
            tag: "[New]",
            date: "26 Oct 2026",
            time: "05:00 PM",
            shortInfo: "District Basic Education Department Mathura, Hapur & Jhansi ECCE Educator Online Form 2026.",
            officialUrl: "https://sewayojan.up.nic.in/"
        },

        // SYLLABUS
        {
            id: "upessc-prt-syllabus",
            category: "syllabus",
            title: "UPESSC PRT Assistant Teacher 2026 (12,405 Posts) — Syllabus & Date Extend",
            tag: "[Syllabus]",
            date: "29 Oct 2026",
            time: "09:50 AM",
            shortInfo: "Uttar Pradesh Education Service Selection Commission (UPESSC) Primary Assistant Teacher (PRT) 12,405 Posts Official Syllabus.",
            officialUrl: "https://updeled.gov.in/"
        },
        {
            id: "rrb-ntpc-je-syllabus",
            category: "syllabus",
            title: "RRB NTPC Graduate / 10+2 UG (5236 Posts) & RRB JE Revised Exam Syllabus 2026",
            tag: "[Download]",
            date: "28 Oct 2026",
            time: "02:15 PM",
            shortInfo: "Download Official Exam Pattern and CBT-1/CBT-2 Syllabus for RRB NTPC Graduate (3548 Posts), UG (1688 Posts) & RRB JE.",
            officialUrl: "https://indianrailways.gov.in/"
        },
        {
            id: "bpsc-tre4-syllabus",
            category: "syllabus",
            title: "BPSC School Teacher TRE 4.0 (33,320 Posts) & Bihar STET Syllabus 2026",
            tag: "[New]",
            date: "27 Oct 2026",
            time: "11:45 AM",
            shortInfo: "Bihar Public Service Commission (BPSC) School Teacher TRE 4.0 PRT, TGT, PGT (33,320 Posts) & Bihar STET Official Syllabus.",
            officialUrl: "https://www.bpsc.bih.nic.in/"
        },
        {
            id: "ssc-chsl-aai-syllabus",
            category: "syllabus",
            title: "SSC CHSL 10+2 Exam Syllabus & AAI Junior Executive Syllabus 2026",
            tag: "[Official]",
            date: "25 Oct 2026",
            time: "04:05 PM",
            shortInfo: "Staff Selection Commission CHSL 10+2 Tier-1 & Tier-2 Syllabus and Airport Authority of India (AAI) Junior Executive Syllabus.",
            officialUrl: "https://ssc.gov.in/"
        },

        // ANSWER KEY
        {
            id: "up-police-answer-key",
            category: "answer-key",
            title: "UP Police Constable & SI Written Exam All Shift Answer Key 2026",
            tag: "[Out]",
            date: "28 Oct 2026",
            time: "05:30 PM",
            shortInfo: "Download UPPRPB Police Constable and Sub Inspector Official Master Question Paper and Shift-Wise Answer Key.",
            officialUrl: "https://uppbpb.gov.in/"
        },
        {
            id: "ssc-cgl-mts-answer-key",
            category: "answer-key",
            title: "SSC CGL Tier-1 & SSC MTS Havildar Response Sheet / Answer Key 2026",
            tag: "[Link Active]",
            date: "26 Oct 2026",
            time: "06:10 PM",
            shortInfo: "Staff Selection Commission CGL & MTS Candidate Response Sheet and Tentative Answer Key Challenge Link.",
            officialUrl: "https://ssc.gov.in/"
        },

        // ADMISSION & SCHOLARSHIP
        {
            id: "up-scholarship-2026",
            category: "admission",
            title: "UP Scholarship Online Form 2026-27 (Pre & Post Matric Class 9-12, UG/PG)",
            tag: "[Apply Online]",
            date: "29 Oct 2026",
            time: "10:30 AM",
            shortInfo: "Social Welfare Department Uttar Pradesh Pre-Matric (Class 9-10) & Post-Matric (Class 11-12, B.A, B.Sc, B.Tech, ITI, Diploma) Scholarship Form & Status 2026-27.",
            officialUrl: "https://scholarship.up.gov.in/"
        },
        {
            id: "nta-neet-ug",
            category: "admission",
            title: "NTA NEET UG 2026-27 Online Form, Syllabus & Information Bulletin",
            tag: "[Medical]",
            date: "27 Oct 2026",
            time: "01:00 PM",
            shortInfo: "National Testing Agency (NTA) National Eligibility Cum Entrance Test (NEET UG) for MBBS/BDS Admission in AIIMS & Govt Medical Colleges.",
            officialUrl: "https://neet.nta.nic.in/"
        },
        {
            id: "up-board-timetable-2027",
            category: "admission",
            title: "UP Board Class 10th & 12th Exam Time Table 2027 & Model Papers",
            tag: "[UPMSP]",
            date: "25 Oct 2026",
            time: "03:45 PM",
            shortInfo: "Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP), Prayagraj High School & Intermediate Exam Date Sheet 2027.",
            officialUrl: "https://upmsp.edu.in/"
        }
    ]);

    // ---------------- 3. 100% WORKING GOVT TOOLS ARRAY (DIRECT STABLE LINKS) ----------------
    const PORTAL_TOOLS = Object.freeze([
        {
            name: "Image Resizer",
            desc: "Resize any photo or signature to exact 20KB, 50KB or custom pixel dimensions without quality loss.",
            targetEngineUrl: "https://www.sarkariresult.com/tools/image-resizer.php",
            graphicHTML: `
                <div class="gfx-resizer-outer">
                    <div class="gfx-resizer-inner">20KB - 50KB</div>
                </div>
            `
        },
        {
            name: "Shadi / Marriage Bio Data Maker",
            desc: "Create attractive Hindi & English Marriage Bio-Data in 2 minutes.",
            targetEngineUrl: "https://sarkariresulttools.net/shadi-marriage-biodata-maker/",
            graphicHTML: `
                <div class="gfx-biodata-box">
                    <span class="ylw">MARITAL</span>
                    <span class="wht">BIO-DATA</span>
                    <span class="ylw">MAKER</span>
                    <span class="hin">शादी का बायोडाटा</span>
                </div>
            `
        },
        {
            name: "Resume/CV Maker",
            desc: "Build a clean, print-ready Resume/CV for fresher and experienced jobs.",
            targetEngineUrl: "https://sarkariresulttools.net/resume-cv-maker/",
            graphicHTML: `
                <div class="gfx-cv-circle">
                    <div class="gfx-cv-doc">
                        <span>CV</span>
                        <div class="gfx-cv-line"></div>
                        <div class="gfx-cv-line"></div>
                        <div class="gfx-cv-line" style="width:70%;"></div>
                    </div>
                </div>
            `
        },
        {
            name: "JPG to PDF Converter",
            desc: "Convert multiple marksheet or certificate JPG photos into a single file.",
            targetEngineUrl: "https://www.sarkariresult.com/tools/jpg-to-pdf.php",
            graphicHTML: `
                <div class="gfx-jpg-pdf-wrap">
                    <div class="gfx-file-box">JPG</div>
                    <div class="gfx-red-arrow">&rarr;</div>
                    <div class="gfx-file-box pdf-style">PDF</div>
                </div>
            `
        },
        {
            name: "Typing Test",
            desc: "Check your WPM speed and accuracy for UPSSSC, SSC & High Court typing exams.",
            targetEngineUrl: "https://sarkariresulttools.net/typing-test/",
            graphicHTML: `
                <div class="gfx-typing-box">
                    <div class="gfx-wpm-meter">35+ WPM TEST</div>
                    <div class="gfx-key-row">
                        <span class="gfx-key">HINDI</span>
                        <span class="gfx-key">ENGLISH</span>
                    </div>
                </div>
            `
        },
        {
            name: "Age Calculator",
            desc: "Calculate your exact age in Years, Months & Days as on notification cutoff date.",
            targetEngineUrl: "https://www.sarkariresult.com/tools/age-calculator.php",
            graphicHTML: `
                <div class="gfx-age-box">
                    <div class="gfx-age-top">Age Calculator</div>
                    <div class="gfx-age-grid">
                        <div class="gfx-age-cell">YY</div>
                        <div class="gfx-age-cell">MM</div>
                        <div class="gfx-age-cell">DD</div>
                    </div>
                </div>
            `
        },
        {
            name: "Name & Date on Photo Maker",
            desc: "Automatically add your Name and Date of Photo at the bottom of your passport photo.",
            targetEngineUrl: "https://www.sarkariresult.com/tools/name-date-photo.php",
            graphicHTML: `
                <div class="gfx-photo-pair">
                    <div class="gfx-passport-frame">
                        <div class="gfx-avatar-head"></div>
                        <div class="gfx-avatar-body"></div>
                    </div>
                    <div class="gfx-passport-frame">
                        <div class="gfx-avatar-head"></div>
                        <div class="gfx-avatar-body"></div>
                        <div class="gfx-photo-stamp">Photo Name<br>29-10-2026</div>
                    </div>
                </div>
            `
        },
        {
            name: "Photo Signature Joiner",
            desc: "Combine your passport photo and signature into one single image for form upload.",
            targetEngineUrl: "https://www.sarkariresult.com/tools/photo-sign-joiner.php",
            graphicHTML: `
                <div class="gfx-merge-banner">
                    <div class="gfx-merge-top">Photo & Signature</div>
                    <div class="gfx-merge-mid">
                        <div class="gfx-sign-box">Sign</div>
                        <div class="gfx-merge-txt">Merge &rarr;</div>
                    </div>
                </div>
            `
        },
        {
            name: "MPPEB Template",
            desc: "Generate official MPPEB/MPESB photo, signature & declaration template.",
            targetEngineUrl: "https://sarkariresulttools.net/mppeb-template/",
            graphicHTML: `
                <div class="gfx-mppeb-sheet">
                    <div class="gfx-mppeb-top">
                        <div class="gfx-mini-photo"></div>
                        <div class="gfx-mini-lines">
                            <div></div><div></div><div></div>
                        </div>
                    </div>
                    <div class="gfx-mppeb-Label">MPPEB Form</div>
                </div>
            `
        }
    ]);

    // ---------------- 4. REMOVE PDF ROW FROM MODAL ----------------
    function removeDownloadPdfRowFromModal() {
        const pdfBtn = document.getElementById("modalPdfBtn");
        if (pdfBtn) {
            const parentRow = pdfBtn.closest("tr");
            if (parentRow) parentRow.remove();
        }
    }

    // ---------------- 5. RENDER FUNCTIONS ----------------

    function renderLiveTicker() {
        const ticker = document.getElementById("liveTickerContainer");
        if (!ticker) return;
        ticker.innerHTML = `<span class="live-tag">LIVE</span> ` + LIVE_TICKER_ITEMS.map(item =>
            `<a href="#" data-post-id="${escapeHTML(item.id)}">${escapeHTML(item.text)}</a>`
        ).join(" || ");
    }

    function renderTopHighlights() {
        const grid = document.getElementById("topHighlightGrid");
        if (!grid) return;
        grid.innerHTML = TOP_HIGHLIGHTS.map(item => `
            <div class="highlight-card ${escapeHTML(item.colorClass)}" data-post-id="${escapeHTML(item.id)}">
                ${escapeHTML(item.title)}
            </div>
        `).join("");
    }

    function renderFeaturedSchemes() {
        const container = document.getElementById("featuredSchemesContainer");
        if (!container) return;
        container.innerHTML = FEATURED_SCHEMES.map(scheme => `
            <div class="anganwadi-banner" data-post-id="${escapeHTML(scheme.postId)}">
                <div class="anganwadi-left">
                    <h2>${escapeHTML(scheme.hindiTitle)}</h2>
                    <table class="anganwadi-table">
                        <thead>
                            <tr>
                                ${scheme.headers.map(h => `<th>${escapeHTML(h)}</th>`).join("")}
                            </tr>
                        </thead>
                        <tbody>
                            ${scheme.rows.map(row => `
                                <tr>
                                    ${row.map(cell => `<td>${escapeHTML(cell)}</td>`).join("")}
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
                <div class="anganwadi-right">
                    <h3>${escapeHTML(scheme.englishTitle)}</h3>
                    <p>${escapeHTML(scheme.description)}</p>
                    <span class="anganwadi-btn">${escapeHTML(scheme.buttonText)}</span>
                </div>
            </div>
        `).join("");
    }

    function createPostListItemHTML(post) {
        return `
            <li>
                <span class="post-link" data-post-id="${escapeHTML(post.id)}">${escapeHTML(post.title)}</span>
                <span class="post-tag">${escapeHTML(post.tag)}</span>
                <span class="post-datetime">Date: ${escapeHTML(post.date)} | Time: ${escapeHTML(post.time)}</span>
            </li>
        `;
    }

    function renderAllColumns(filterQuery = "") {
        const q = filterQuery.trim().toLowerCase();

        const filterFn = (cat) => PORTAL_POSTS.filter(p =>
            p.category === cat &&
            (q === "" || p.title.toLowerCase().includes(q) || p.shortInfo.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q))
        );

        const populate = (elementId, items) => {
            const el = document.getElementById(elementId);
            if (!el) return;
            el.innerHTML = items.length
                ? items.map(createPostListItemHTML).join("")
                : `<li><span class="post-datetime">No matching updates found.</span></li>`;
        };

        populate("resultList", filterFn("result"));
        populate("admitCardList", filterFn("admit-card"));
        populate("latestJobsList", filterFn("latest-job"));
        populate("itiJobsList", filterFn("iti-job"));
        populate("outsourcingList", filterFn("outsourcing"));
        populate("syllabusList", filterFn("syllabus"));
        populate("answerKeyList", filterFn("answer-key"));
        populate("admissionList", filterFn("admission"));
    }

    function renderToolsSection() {
        const dropdown = document.getElementById("toolsDropdownMenu");
        if (dropdown) {
            dropdown.innerHTML = PORTAL_TOOLS.map(t =>
                `<a href="#tools-section" data-tool-name="${escapeHTML(t.name)}">${escapeHTML(t.name)}</a>`
            ).join("");
        }

        const container = document.getElementById("toolsGridContainer");
        if (!container) return;
        container.innerHTML = PORTAL_TOOLS.map(t => `
            <div class="tool-card" data-tool-name="${escapeHTML(t.name)}">
                <div class="tool-graphic-stage">
                    ${t.graphicHTML}
                </div>
                <div class="tool-card-title">${escapeHTML(t.name)}</div>
            </div>
        `).join("");
    }

    // ---------------- 6. MODAL & TOOLS CONTROLLER ----------------

    function openPostById(postId) {
        const post = PORTAL_POSTS.find(p => p.id === postId) || PORTAL_POSTS[0];
        if (!post) return;

        removeDownloadPdfRowFromModal();

        document.getElementById("modalPostDate").innerHTML = `${escapeHTML(post.date)} | <strong>${escapeHTML(post.time)}</strong>`;
        document.getElementById("modalShortInfo").textContent = post.shortInfo;
        document.getElementById("modalMainHeading").textContent = post.title;
        document.getElementById("modalDateOnly").textContent = post.date;
        document.getElementById("modalTimeOnly").textContent = post.time;

        const actionLabel = post.category === "result"
            ? "Download Result / Score Card"
            : post.category === "admit-card"
            ? "Download Admit Card / Exam City"
            : "Apply Online / Official Registration";

        document.getElementById("modalActionLabel").textContent = actionLabel;
        document.getElementById("modalPrimaryBtn").href = sanitizeUrl(post.officialUrl);
        document.getElementById("modalOfficialSiteBtn").href = sanitizeUrl(post.officialUrl);

        document.getElementById("postModal").style.display = "flex";
    }

    function closePostModal() {
        document.getElementById("postModal").style.display = "none";
    }

    function openToolModal(toolName) {
        const tool = PORTAL_TOOLS.find(t => t.name === toolName) || PORTAL_TOOLS[0];
        document.getElementById("toolModalTitle").textContent = `SarkariResultUpAll.com — ${tool.name}`;

        const body = document.getElementById("toolModalBody");

        if (tool.name === "Age Calculator") {
            body.innerHTML = `
                <h3 style="color:#1e3a8a; margin-bottom:8px;">Exam Age Calculator</h3>
                <p style="margin-bottom:12px; font-size:0.92rem; color:#475569;">Enter your Date of Birth to calculate your exact age as on 01 July 2026:</p>
                <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:15px;">
                    <input type="date" id="dobInput" value="2005-07-15" style="padding:8px 12px; border:1px solid #64748b; border-radius:3px; font-size:0.95rem;">
                    <button type="button" id="calcAgeBtn" class="server-btn">Calculate Age Now</button>
                </div>
                <div id="ageResultOutput" style="font-weight:bold; color:#15803d; font-size:1.1rem; padding:8px 0;"></div>
            `;

            const calcBtn = document.getElementById("calcAgeBtn");
            if (calcBtn) {
                calcBtn.addEventListener("click", function () {
                    const dobVal = document.getElementById("dobInput").value;
                    if (!dobVal) return;
                    const dob = new Date(dobVal);
                    const target = new Date("2026-07-01");
                    let years = target.getFullYear() - dob.getFullYear();
                    let months = target.getMonth() - dob.getMonth();
                    let days = target.getDate() - dob.getDate();
                    if (days < 0) { months--; days += 30; }
                    if (months < 0) { years--; months += 12; }
                    document.getElementById("ageResultOutput").textContent =
                        `Your Exact Age: ${years} Years, ${months} Months, ${days} Days`;
                });
            }
        } else {
            body.innerHTML = `
                <h3 style="color:#1e3a8a; margin-bottom:8px;">${escapeHTML(tool.name)}</h3>
                <p style="margin-bottom:14px; font-size:0.93rem; color:#475569;">${escapeHTML(tool.desc)}</p>
                
                <div style="padding:22px; background:#f8fafc; border:2px dashed #0284c7; text-align:center; border-radius:6px; margin-bottom:14px;">
                    <p style="font-weight:700; color:#1e293b; margin-bottom:10px;">Select File from Device (Photo / Marksheet / Sign):</p>
                    <input type="file" id="userToolFileInput" style="margin-bottom:14px; max-width:100%;">
                    <br>
                    <button type="button" id="processToolBtn" class="server-btn" style="padding:9px 24px; font-size:0.95rem;">Process & Launch Tool</button>
                    <p id="processStatusMsg" style="font-size:0.85rem; color:#b91c1c; font-weight:700; margin-top:8px; display:none;"></p>
                </div>
                
                <p style="font-size:0.82rem; color:#64748b; text-align:center;">
                    Fast & Secure Student Utility Powered by <strong>SarkariResultUpAll.com</strong>.
                </p>
            `;

            const procBtn = document.getElementById("processToolBtn");
            const statusMsg = document.getElementById("processStatusMsg");

            if (procBtn) {
                procBtn.addEventListener("click", function () {
                    procBtn.textContent = "Connecting to Secure Engine...";
                    procBtn.style.background = "#d97706";
                    procBtn.disabled = true;

                    if (statusMsg) {
                        statusMsg.style.display = "block";
                        statusMsg.textContent = "Launching official working engine...";
                    }

                    setTimeout(function () {
                        closeToolModal();
                        window.open(tool.targetEngineUrl, "_blank");
                    }, 500);
                });
            }
        }

        document.getElementById("toolModal").style.display = "flex";
    }

    function closeToolModal() {
        document.getElementById("toolModal").style.display = "none";
    }

    function switchCategory(cat, targetEl) {
        document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
        if (targetEl && targetEl.classList.contains("nav-item")) {
            targetEl.classList.add("active");
        }

        const heading = document.getElementById("categoryHeading");
        const descEn = document.getElementById("categoryDescEn");
        const descHi = document.getElementById("categoryDescHi");

        if (cat === "admit-card") {
            heading.textContent = "Admit Card — SarkariResultUpAll.com";
            descEn.innerHTML = "Welcome to <strong>SarkariResultUpAll.com</strong>. Stay informed about the Admit Card of various competitive exams conducted by government bodies across India, whether you are waiting for the Admit Card of any recruitment exam, entrance exam or any other government exam then we update the Admit Card from time to time to keep you informed.";
            descHi.innerHTML = "<strong>SarkariResultUpAll.com</strong> में आपका स्वागत है। भारत भर में सरकारी निकायों द्वारा आयोजित विभिन्न प्रतियोगी परीक्षाओं के एडमिट कार्ड के बारे में सूचित रहें, चाहे आप किसी भी भर्ती परीक्षा, प्रवेश परीक्षा या किसी अन्य सरकारी परीक्षा के एडमिट कार्ड का इंतजार कर रहे हों तो हम आपको सूचित रखने के लिए समय-समय पर एडमिट कार्ड अपडेट करते हैं।";
        } else if (cat === "latest-job") {
            heading.textContent = "Latest Job — SarkariResultUpAll.com";
            descEn.innerHTML = "Welcome to official <strong>SarkariResultUpAll.com</strong>. Stay informed about the Latest Jobs of various competitive exams conducted by government bodies across Uttar Pradesh and India, whether you are waiting for the Job Notification of any recruitment exam, entrance exam or any other government exam.";
            descHi.innerHTML = "<strong>SarkariResultUpAll.com</strong> में आपका स्वागत है। भारत और उत्तर प्रदेश भर में सरकारी निकायों द्वारा आयोजित विभिन्न प्रतियोगी परीक्षाओं की नवीनतम नौकरियों के बारे में सूचित रहें। आप किसी भी भर्ती परीक्षा, प्रवेश परीक्षा या किसी अन्य सरकारी परीक्षा की नौकरी अधिसूचना की प्रतीक्षा कर रहे हों, तो हम समय पर नवीनतम नौकरी अपडेट करते हैं।";
        } else if (cat === "result") {
            heading.textContent = "Exam Results 2026 — SarkariResultUpAll.com";
            descEn.innerHTML = "Welcome to <strong>SarkariResultUpAll.com</strong> Result Portal. Check UP Board Class 10th & 12th Result, UP Police, SSC GD, UPSSSC PET, and Railway Exam Results with direct server links.";
            descHi.innerHTML = "<strong>SarkariResultUpAll.com</strong> रिजल्ट पोर्टल में आपका स्वागत है। यूपी बोर्ड 10वीं-12वीं, यूपी पुलिस, एसएससी और रेलवे सहित सभी परीक्षाओं के परिणाम सबसे तेज़ सर्वर लिंक के साथ यहाँ देखें।";
        } else {
            heading.textContent = "Welcome to SarkariResultUpAll.com";
        }
    }

    // ---------------- 7. RIGHT-SIDE SMART HUMAN-LIKE "AI FREE CHAT" WIDGET ----------------
    function initRightAiFreeChatWidget() {
        const styleEl = document.createElement("style");
        styleEl.textContent = `
            .sru-ai-right-wrap {
                position: fixed;
                bottom: 18px;
                right: 16px;
                z-index: 2500;
                font-family: Arial, Helvetica, sans-serif;
            }
            .sru-ai-toggle-btn {
                background: #0284c7;
                color: #ffffff;
                border: 2px solid #ffffff;
                padding: 9px 16px;
                border-radius: 20px;
                font-size: 0.88rem;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background 0.2s, transform 0.15s;
            }
            .sru-ai-toggle-btn:hover {
                background: #0369a1;
                transform: scale(1.03);
            }
            .sru-ai-online-dot {
                width: 9px;
                height: 9px;
                background: #22c55e;
                border-radius: 50%;
                display: inline-block;
                box-shadow: 0 0 6px #22c55e;
            }
            .sru-ai-chat-panel {
                display: none;
                width: 320px;
                background: #ffffff;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                margin-bottom: 10px;
                overflow: hidden;
                flex-direction: column;
            }
            .sru-ai-chat-header {
                background: #0284c7;
                color: #ffffff;
                padding: 10px 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.9rem;
                font-weight: 700;
            }
            .sru-ai-close-btn {
                background: transparent;
                color: #fff;
                border: none;
                font-size: 1rem;
                font-weight: 700;
                cursor: pointer;
            }
            .sru-ai-messages {
                height: 240px;
                overflow-y: auto;
                padding: 12px;
                background: #f8fafc;
                display: flex;
                flex-direction: column;
                gap: 9px;
                font-size: 0.85rem;
            }
            .sru-msg-bot {
                background: #e2e8f0;
                color: #0f172a;
                padding: 8px 12px;
                border-radius: 8px 8px 8px 2px;
                align-self: flex-start;
                max-width: 90%;
                line-height: 1.45;
            }
            .sru-msg-user {
                background: #0284c7;
                color: #ffffff;
                padding: 8px 12px;
                border-radius: 8px 8px 2px 8px;
                align-self: flex-end;
                max-width: 85%;
                line-height: 1.45;
            }
            .sru-ai-chips {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                padding: 6px 10px;
                background: #f1f5f9;
                border-top: 1px solid #e2e8f0;
            }
            .sru-ai-chip {
                background: #ffffff;
                color: #0369a1;
                border: 1px solid #bae6fd;
                border-radius: 12px;
                padding: 3px 9px;
                font-size: 0.74rem;
                font-weight: 700;
                cursor: pointer;
            }
            .sru-ai-chip:hover {
                background: #e0f2fe;
            }
            .sru-ai-input-row {
                display: flex;
                border-top: 1px solid #cbd5e1;
                background: #ffffff;
            }
            .sru-ai-input-row input {
                flex: 1;
                border: none;
                padding: 9px 12px;
                font-size: 0.85rem;
                outline: none;
            }
            .sru-ai-input-row button {
                background: #0284c7;
                color: #ffffff;
                border: none;
                padding: 0 14px;
                font-weight: 700;
                font-size: 0.85rem;
                cursor: pointer;
            }
            .sru-ai-input-row button:hover {
                background: #0369a1;
            }
        `;
        document.head.appendChild(styleEl);

        const widgetWrap = document.createElement("div");
        widgetWrap.className = "sru-ai-right-wrap";
        widgetWrap.innerHTML = `
            <div class="sru-ai-chat-panel" id="sruAiChatPanel">
                <div class="sru-ai-chat-header">
                    <span>AI Assistant — SarkariResultUpAll</span>
                    <button type="button" class="sru-ai-close-btn" id="sruAiCloseBtn">&times;</button>
                </div>
                <div class="sru-ai-messages" id="sruAiMessages">
                    <div class="sru-msg-bot">
                        नमस्ते! मैं आपका AI सहायक हूँ। आप मुझसे किसी भी सरकारी फॉर्म, रिजल्ट, एडमिट कार्ड या फोटो रिसाइज़र के बारे में पूछ सकते हैं। मैं आपकी क्या मदद कर सकता हूँ?
                    </div>
                </div>
                <div class="sru-ai-chips">
                    <button type="button" class="sru-ai-chip" data-ai-q="UP Board Result">UP Board Result</button>
                    <button type="button" class="sru-ai-chip" data-ai-q="UP Police Bharti">UP Police</button>
                    <button type="button" class="sru-ai-chip" data-ai-q="Image Resizer">Photo Resizer</button>
                    <button type="button" class="sru-ai-chip" data-ai-q="Age Calculator">Age Calculator</button>
                </div>
                <div class="sru-ai-input-row">
                    <input type="text" id="sruAiInput" placeholder="अपना सवाल यहाँ टाइप करें..." maxlength="120">
                    <button type="button" id="sruAiSendBtn">Send</button>
                </div>
            </div>
            <button type="button" class="sru-ai-toggle-btn" id="sruAiToggleBtn">
                <span class="sru-ai-online-dot"></span>
                <span>AI Free Chat</span>
            </button>
        `;
        document.body.appendChild(widgetWrap);

        const panel = document.getElementById("sruAiChatPanel");
        const toggleBtn = document.getElementById("sruAiToggleBtn");
        const closeBtn = document.getElementById("sruAiCloseBtn");
        const messagesBox = document.getElementById("sruAiMessages");
        const inputEl = document.getElementById("sruAiInput");
        const sendBtn = document.getElementById("sruAiSendBtn");

        function appendChatMessage(htmlOrText, isUser) {
            const div = document.createElement("div");
            div.className = isUser ? "sru-msg-user" : "sru-msg-bot";
            if (isUser) {
                div.textContent = htmlOrText;
            } else {
                div.innerHTML = htmlOrText;
            }
            messagesBox.appendChild(div);
            messagesBox.scrollTop = messagesBox.scrollHeight;
        }

        function handleAiQuery(rawText) {
            const query = rawText.trim();
            if (!query) return;
            appendChatMessage(query, true);
            inputEl.value = "";

            const qLower = query.toLowerCase();

            // Typing indicator simulation for thinking capacity
            const typingId = "typing_" + Date.now();
            const typingDiv = document.createElement("div");
            typingDiv.className = "sru-msg-bot";
            typingDiv.id = typingId;
            typingDiv.innerHTML = "<em>AI सोच रहा है... / Thinking...</em>";
            messagesBox.appendChild(typingDiv);
            messagesBox.scrollTop = messagesBox.scrollHeight;

            setTimeout(function () {
                const typingElem = document.getElementById(typingId);
                if (typingElem) typingElem.remove();

                // Conversational Greetings like ChatGPT/Gemini
                if (qLower.includes("hi") || qLower.includes("hello") || qLower.includes("hey") || qLower.includes("नमस्ते") || qLower.includes("سلام")) {
                    appendChatMessage("नमस्ते! मैं बिल्कुल ठीक हूँ। बताइए, आज आपको किस सरकारी नौकरी, एडमिट कार्ड या डॉक्यूमेंट टूल के बारे में जानकारी चाहिए?", false);
                    return;
                }
                if (qLower.includes("kaise ho") || qLower.includes("how are you")) {
                    appendChatMessage("मैं एकदम बढ़िया हूँ! आपकी सेवा के लिए तैयार हूँ। आप कोई भी सवाल पूछ सकते हैं।", false);
                    return;
                }
                if (qLower.includes("creator") || qLower.includes("who made you") || qLower.includes("owner")) {
                    appendChatMessage("इस बेहतरीन पोर्टल <strong>SarkariResultUpAll.com</strong> के डेवलपर और ओनर आप स्वयं हैं!", false);
                    return;
                }

                // Check tools match
                const matchedTool = PORTAL_TOOLS.find(t =>
                    t.name.toLowerCase().includes(qLower) ||
                    (qLower.includes("photo") && t.name === "Image Resizer") ||
                    (qLower.includes("age") && t.name === "Age Calculator") ||
                    (qLower.includes("pdf") && t.name === "JPG to PDF Converter") ||
                    (qLower.includes("typing") && t.name === "Typing Test")
                );

                if (matchedTool) {
                    appendChatMessage(
                        `<strong>${escapeHTML(matchedTool.name)}:</strong> ${escapeHTML(matchedTool.desc)}<br>` +
                        `<a href="#tools-section" data-tool-name="${escapeHTML(matchedTool.name)}" style="color:#0284c7; font-weight:700; text-decoration:underline; display:inline-block; margin-top:5px;">Click to Open ${escapeHTML(matchedTool.name)} &raquo;</a>`,
                        false
                    );
                    return;
                }

                // Search matching posts
                const matchedPosts = PORTAL_POSTS.filter(p =>
                    p.title.toLowerCase().includes(qLower) ||
                    p.shortInfo.toLowerCase().includes(qLower) ||
                    p.category.toLowerCase().includes(qLower)
                ).slice(0, 3);

                if (matchedPosts.length > 0) {
                    const linksHtml = matchedPosts.map(p =>
                        `&bull; <a href="#" data-post-id="${escapeHTML(p.id)}" style="color:#0284c7; font-weight:700; text-decoration:underline;">${escapeHTML(p.title)}</a>`
                    ).join("<br>");
                    appendChatMessage(`मैंने आपके सवाल से मिलते-जुلते ये अपडेट्स ढूँढ निकाले हैं:<br>${linksHtml}`, false);
                } else {
                    appendChatMessage(
                        `मैंने इसके बारे में गहराई से सोचा, लेकिन मुझे इससे जुड़ा कोई सटीक रिजल्ट नहीं मिला। आप ऊपर दिए गए <strong>Result</strong> या <strong>Admit Card</strong> बॉक्स में देख सकते हैं, या "UP Police", "UP Board", "Anganwadi" लिखकर सर्च कर सकते हैं।`,
                        false
                    );
                }
            }, 700); // 0.7 second thinking delay like real AI
        }

        toggleBtn.addEventListener("click", function () {
            const isHidden = panel.style.display === "none" || panel.style.display === "";
            panel.style.display = isHidden ? "flex" : "none";
        });

        closeBtn.addEventListener("click", function () {
            panel.style.display = "none";
        });

        sendBtn.addEventListener("click", function () {
            handleAiQuery(inputEl.value);
        });

        inputEl.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                handleAiQuery(inputEl.value);
            }
        });

        widgetWrap.addEventListener("click", function (e) {
            const chip = e.target.closest("[data-ai-q]");
            if (chip) {
                handleAiQuery(chip.getAttribute("data-ai-q"));
            }
        });
    }

    // ---------------- 8. EVENT DELEGATION & INITIALIZATION ----------------

    document.addEventListener("DOMContentLoaded", function () {
        removeDownloadPdfRowFromModal();
        renderLiveTicker();
        renderTopHighlights();
        renderFeaturedSchemes();
        renderAllColumns();
        renderToolsSection();
        initRightAiFreeChatWidget();

        document.body.addEventListener("click", function (e) {
            const postTrigger = e.target.closest("[data-post-id]");
            if (postTrigger) {
                e.preventDefault();
                openPostById(postTrigger.getAttribute("data-post-id"));
                return;
            }

            const toolTrigger = e.target.closest("[data-tool-name]");
            if (toolTrigger) {
                e.preventDefault();
                openToolModal(toolTrigger.getAttribute("data-tool-name"));
                return;
            }

            const catTrigger = e.target.closest("[data-cat]");
            if (catTrigger) {
                switchCategory(catTrigger.getAttribute("data-cat"), catTrigger);
                return;
            }

            const expandTrigger = e.target.closest("[data-expand]");
            if (expandTrigger) {
                switchCategory(expandTrigger.getAttribute("data-expand"), null);
                return;
            }

            if (e.target.id === "postModal" || e.target.id === "closePostModalBtn") {
                closePostModal();
            }
            if (e.target.id === "toolModal" || e.target.id === "closeToolModalBtn") {
                closeToolModal();
            }
        });

        const searchInput = document.getElementById("globalSearch");
        const searchBtn = document.getElementById("searchBtn");

        if (searchInput) {
            searchInput.addEventListener("input", function (e) {
                renderAllColumns(escapeHTML(e.target.value));
            });
        }
        if (searchBtn && searchInput) {
            searchBtn.addEventListener("click", function () {
                renderAllColumns(escapeHTML(searchInput.value));
            });
        }
    });
})();