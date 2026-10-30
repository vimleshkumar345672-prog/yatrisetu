// ============================================================================
// SARKARIRESULTUPALL.COM - MASTER SCRIPT (WIDE 2-COLUMN TABLE + DIRECT REGISTRATION LINK)
// ============================================================================

(function () {
    "use strict";

    // ---------------- 1. SECURITY MODULE ----------------
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
        { id: "rrb-station-master", text: "Railway RRB Station Master 1,265 Posts Online Form 2026 [Apply Now]" },
        { id: "up-board-10th", text: "UP Board Class 10th & 12th Result / Time Table 2026-27 [Declared]" },
        { id: "up-police-constable", text: "UP Police Constable 32,679 Posts Online Form 2026 [Apply Online]" },
        { id: "anganwadi-2026", text: "UP Anganwadi Supervisor, Teacher & Worker Online Form 2026 [Active]" },
        { id: "ssc-gd-2026", text: "SSC GD Constable Final Merit List & Online Form 2026-27 [Out]" },
        { id: "ecce-educator", text: "UP ECCE Educator Online Form 2026 (All Districts) [Apply Now]" }
    ]);

    const TOP_HIGHLIGHTS = Object.freeze([
        { id: "rrb-station-master", title: "Railway RRB Station Master 1,265 Posts Online Form 2026", colorClass: "bg-c1" },
        { id: "up-police-constable", title: "UP Police Constable 32,679 Posts Online Form 2026", colorClass: "bg-c2" },
        { id: "ssc-gd-2026", title: "SSC GD Constable Online Form 2026-27", colorClass: "bg-c3" },
        { id: "up-scholarship-2026", title: "UP Scholarship 2026-27 Online Form (Class 9 to 12, UG/PG)", colorClass: "bg-c4" },
        { id: "nta-neet-ug", title: "NTA NEET UG 2026 Online Form & Information Bulletin", colorClass: "bg-c5" },
        { id: "up-board-10th", title: "UP Board 10th & 12th Result / Time Table 2026-27", colorClass: "bg-c6" },
        { id: "anganwadi-2026", title: "UP Anganwadi Supervisor & Worker Online Form 2026", colorClass: "bg-c7" },
        { id: "rrb-ntpc-ug", title: "RRB NTPC 10+2 & Graduate Level Online Form 2026", colorClass: "bg-c8" }
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

    // नोट: registrationUrl में सीधा फॉर्म/रजिस्ट्रेशन पेज का लिंक डालें, और officialUrl में मेन वेबसाइट का लिंक डालें।
    const PORTAL_POSTS = Object.freeze([
        // LATEST JOBS
        {
            id: "rrb-station-master",
            category: "latest-job",
            title: "Railway RRB Station Master 1,265 Posts Online Form 2026",
            tag: "Apply Online",
            date: "27 Oct 2026",
            time: "10:00 AM",
            shortInfo: "Railway Recruitment Board (RRB) has released a notification for 1,265 Railway Station Master Posts (Advt No. CEN 08/2026). Apply online from 27 Oct to 25 November 2026.",
            registrationUrl: "https://www.rrbapply.gov.in/#/auth/home",
            officialUrl: "https://indianrailways.gov.in/",
            detailsTable: {
                dates: [
                    "Apply Online Start Date : 27 October 2026",
                    "Apply Online Last Date : 25 November 2026",
                    "Fee Payment Last Date : 27 November 2026",
                    "Correction Date : 28 Nov – 07 Dec 2026",
                    "Exam Date : Notify Later",
                    "Admit Card : Before Exam"
                ],
                fees: [
                    "General / OBC / EWS : ₹ 500/-",
                    "SC / ST / EBC : ₹ 250/-",
                    "All Category Female : ₹ 250/-",
                    "Fee Refund (After Stage-I) : ₹ 400 (Gen) / ₹ 250 (Others)",
                    "Payment Mode : Online (Debit/Credit Card, Net Banking, UPI)"
                ],
                ageLimit: [
                    "Minimum Age : 20 Years (As on 01 Jan 2027)",
                    "Maximum Age : 33 Years",
                    "Age Relaxation Extra as per Railway RRBCEN 08/2026 Rules."
                ],
                totalPosts: "1,265 Posts"
            }
        },
        {
            id: "up-police-constable",
            category: "latest-job",
            title: "UP Police Constable 32,679 Posts Online Form 2026",
            tag: "Apply Online",
            date: "29 Oct 2026",
            time: "09:30 AM",
            shortInfo: "Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB) has invited online applications for 32,679 Civil Police & PAC Constable Posts.",
            registrationUrl: "https://uppbpb.gov.in/",
            officialUrl: "https://uppbpb.gov.in/",
            detailsTable: {
                dates: [
                    "Application Start : 29 October 2026",
                    "Last Date for Apply : 28 November 2026",
                    "Fee Payment Last Date : 30 November 2026",
                    "Exam Date : As per Schedule"
                ],
                fees: [
                    "General / OBC / EWS : ₹ 400/-",
                    "SC / ST : ₹ 400/-",
                    "Payment Mode : Online via Debit Card, Credit Card, Net Banking"
                ],
                ageLimit: [
                    "Minimum Age : 18 Years",
                    "Maximum Age : 25 Years (Male) / 28 Years (Female)",
                    "Age Relaxation Extra as per UPPRPB Govt Rules."
                ],
                totalPosts: "32,679 Posts"
            }
        },
        {
            id: "anganwadi-2026",
            category: "latest-job",
            title: "UP Anganwadi Supervisor, Teacher & Worker Recruitment Online Form 2026",
            tag: "New",
            date: "29 Oct 2026",
            time: "08:45 AM",
            shortInfo: "Bal Vikas Seva Evam Pushtahar Vibhag UP Anganwadi Supervisor (Graduate), Anganwadi Teacher (12th Pass) & Worker (10th Pass) Online Registration 2026.",
            registrationUrl: "https://upanganwadibharti.in/",
            officialUrl: "https://upanganwadibharti.in/",
            detailsTable: {
                dates: [
                    "Application Begin : October 2026",
                    "Last Date for Registration : District Wise Active",
                    "Merit List / Selection : Notify Soon"
                ],
                fees: [
                    "General / OBC / EWS : ₹ 0/- (No Fee)",
                    "SC / ST / PH : ₹ 0/-",
                    "All Category Female : ₹ 0/- (Free Application)"
                ],
                ageLimit: [
                    "Minimum Age : 18 Years",
                    "Maximum Age : 35 Years",
                    "Age Relaxation as per UP ICDS Anganwadi Bharti Rules."
                ],
                totalPosts: "53,000+ Posts (District Wise)"
            }
        },
        {
            id: "ssc-gd-2026",
            category: "latest-job",
            title: "SSC GD Constable Online Form 2026-27",
            tag: "[Last Date Extended]",
            date: "28 Oct 2026",
            time: "10:00 AM",
            shortInfo: "Staff Selection Commission (SSC) GD Constable in BSF, CISF, CRPF, SSB, ITBP, AR & SSF Online Application Form 2026-27.",
            registrationUrl: "https://ssc.gov.in/login",
            officialUrl: "https://ssc.gov.in/",
            detailsTable: {
                dates: [
                    "Application Begin : 05 September 2026",
                    "Last Date to Apply : 14 November 2026",
                    "Online Fee Payment Last Date : 15 November 2026",
                    "CBT Exam Date : Jan – Feb 2027"
                ],
                fees: [
                    "General / OBC / EWS : ₹ 100/-",
                    "SC / ST / Ex-Servicemen : ₹ 0/-",
                    "All Category Female : ₹ 0/-",
                    "Payment Mode : BHIM UPI, Net Banking, Debit/Credit Cards"
                ],
                ageLimit: [
                    "Minimum Age : 18 Years",
                    "Maximum Age : 23 Years",
                    "Age Relaxation Extra as per SSC GD Recruitment Rules."
                ],
                totalPosts: "39,481 Posts"
            }
        },
        {
            id: "rrb-group-d",
            category: "latest-job",
            title: "Railway RRB Group D 50,000+ Posts Online Form 2026",
            tag: "[New]",
            date: "27 Oct 2026",
            time: "02:45 PM",
            shortInfo: "Railway Recruitment Cell (RRC) Level-1 Group D Track Maintainer, Pointsman & Helper 50,000+ Vacancies Online Form 2026.",
            registrationUrl: "https://www.rrbapply.gov.in/",
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
            registrationUrl: "https://uppbpb.gov.in/",
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
            registrationUrl: "https://upsssc.gov.in/",
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
            registrationUrl: "https://joinindianarmy.nic.in/",
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
            registrationUrl: "https://homeguards.up.nic.in/",
            officialUrl: "https://homeguards.up.nic.in/"
        },

        // RESULTS
        {
            id: "up-board-10th",
            category: "result",
            title: "UP Board Class 10th High School Result 2026",
            tag: "[Declared]",
            date: "20 April 2026",
            time: "02:00 PM",
            shortInfo: "Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP) High School Class 10th Exam Result 2026. Check Roll Number Wise Result on Official NIC Server.",
            registrationUrl: "https://upresults.nic.in/",
            officialUrl: "https://upmsp.edu.in/"
        },
        {
            id: "up-board-12th",
            category: "result",
            title: "UP Board Class 12th Intermediate Result 2026",
            tag: "[Server Active]",
            date: "20 April 2026",
            time: "02:00 PM",
            shortInfo: "Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP) Intermediate Class 12th Science, Arts & Commerce Result 2026.",
            registrationUrl: "https://upresults.nic.in/",
            officialUrl: "https://upmsp.edu.in/"
        },
        {
            id: "up-police-result",
            category: "result",
            title: "UP Police Constable Written Exam Final Result 2026",
            tag: "[New]",
            date: "28 Oct 2026",
            time: "06:30 PM",
            shortInfo: "Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB) Civil Police Constable Written Exam Result & Cutoff Marks 2026.",
            registrationUrl: "https://uppbpb.gov.in/",
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
            registrationUrl: "https://ssc.gov.in/",
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
            registrationUrl: "https://upsssc.gov.in/",
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
            registrationUrl: "https://joinindianarmy.nic.in/",
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
            registrationUrl: "https://indianrailways.gov.in/",
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
            registrationUrl: "https://results.biharboardonline.com/",
            officialUrl: "https://biharboardonline.bihar.gov.in/"
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
            registrationUrl: "https://uppbpb.gov.in/",
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
            registrationUrl: "https://ssc.gov.in/",
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
            registrationUrl: "https://rectt.bsf.gov.in/",
            officialUrl: "https://bsf.gov.in/"
        },
        {
            id: "rrb-ntpc-admit",
            category: "admit-card",
            title: "Railway RRB NTPC Graduate & 10+2 CBTST Admit Card 2026",
            tag: "[Live]",
            date: "26 Oct 2026",
            time: "04:00 PM",
            shortInfo: "Railway Recruitment Board (RRB) Non-Technical Popular Categories (NTPC) Graduate & UG Level Admit Card 2026.",
            registrationUrl: "https://www.rrbapply.gov.in/",
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
            registrationUrl: "https://upsssc.gov.in/",
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
            registrationUrl: "https://uppsc.up.nic.in/",
            officialUrl: "https://uppsc.up.nic.in/"
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
            registrationUrl: "https://www.rrbapply.gov.in/",
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
            registrationUrl: "https://lsg.urban.rajasthan.gov.in/",
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
            registrationUrl: "https://upsssc.gov.in/",
            officialUrl: "https://upsssc.gov.in/"
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
            registrationUrl: "https://sewayojan.up.nic.in/",
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
            registrationUrl: "https://sewayojan.up.nic.in/",
            officialUrl: "https://sewayojan.up.nic.in/"
        },

        // SYLLABUS
        {
            id: "upessc-prt-syllabus",
            category: "syllabus",
            title: "UPESSC PRT Assistant Teacher 2026 (12,405 Posts) — Syllabus",
            tag: "[Syllabus]",
            date: "29 Oct 2026",
            time: "09:50 AM",
            shortInfo: "Uttar Pradesh Education Service Selection Commission (UPESSC) Primary Assistant Teacher (PRT) 12,405 Posts Official Syllabus.",
            registrationUrl: "https://updeled.gov.in/",
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
            registrationUrl: "https://indianrailways.gov.in/",
            officialUrl: "https://indianrailways.gov.in/"
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
            registrationUrl: "https://uppbpb.gov.in/",
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
            registrationUrl: "https://ssc.gov.in/",
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
            registrationUrl: "https://scholarship.up.gov.in/RegistrationNew.aspx",
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
            registrationUrl: "https://neet.nta.nic.in/",
            officialUrl: "https://neet.nta.nic.in/"
        }
    ]);

    // ---------------- 3. 100% WORKING GOVT TOOLS ARRAY ----------------
    const PORTAL_TOOLS = Object.freeze([
        {
            name: "Image Resizer",
            desc: "Resize any photo or signature to exact 20KB, 50KB or custom pixel dimensions without quality loss.",
            targetEngineUrl: "https://www.sarkariresult.com/tools/image-resizer.php",
            graphicHTML: `<div class="gfx-resizer-outer"><div class="gfx-resizer-inner">20KB - 50KB</div></div>`
        },
        {
            name: "Shadi / Marriage Bio Data Maker",
            desc: "Create attractive Hindi & English Marriage Bio-Data in 2 minutes.",
            targetEngineUrl: "https://sarkariresulttools.net/shadi-marriage-biodata-maker/",
            graphicHTML: `<div class="gfx-biodata-box"><span class="ylw">MARITAL</span><span class="wht">BIO-DATA</span><span class="ylw">MAKER</span><span class="hin">शादी का बायोडाटा</span></div>`
        },
        {
            name: "Resume/CV Maker",
            desc: "Build a clean, print-ready Resume/CV for fresher and experienced jobs.",
            targetEngineUrl: "https://sarkariresulttools.net/resume-cv-maker/",
            graphicHTML: `<div class="gfx-cv-circle"><div class="gfx-cv-doc"><span>CV</span><div class="gfx-cv-line"></div><div class="gfx-cv-line"></div></div></div>`
        },
        {
            name: "JPG to PDF Converter",
            desc: "Convert multiple marksheet or certificate JPG photos into a single file.",
            targetEngineUrl: "https://www.sarkariresult.com/tools/jpg-to-pdf.php",
            graphicHTML: `<div class="gfx-jpg-pdf-wrap"><div class="gfx-file-box">JPG</div><div class="gfx-red-arrow">&rarr;</div><div class="gfx-file-box pdf-style">PDF</div></div>`
        },
        {
            name: "Typing Test",
            desc: "Check your WPM speed and accuracy for UPSSSC, SSC & High Court typing exams.",
            targetEngineUrl: "https://sarkariresulttools.net/typing-test/",
            graphicHTML: `<div class="gfx-typing-box"><div class="gfx-wpm-meter">35+ WPM TEST</div><div class="gfx-key-row"><span class="gfx-key">HINDI</span><span class="gfx-key">ENGLISH</span></div></div>`
        },
        {
            name: "Age Calculator",
            desc: "Calculate your exact age in Years, Months & Days as on notification cutoff date.",
            targetEngineUrl: "https://www.sarkariresult.com/tools/age-calculator.php",
            graphicHTML: `<div class="gfx-age-box"><div class="gfx-age-top">Age Calculator</div><div class="gfx-age-grid"><div class="gfx-age-cell">YY</div><div class="gfx-age-cell">MM</div><div class="gfx-age-cell">DD</div></div></div>`
        },
        {
            name: "Name & Date on Photo Maker",
            desc: "Automatically add your Name and Date of Photo at the bottom of your passport photo.",
            targetEngineUrl: "https://www.sarkariresult.com/tools/name-date-photo.php",
            graphicHTML: `<div class="gfx-photo-pair"><div class="gfx-passport-frame"><div class="gfx-avatar-head"></div><div class="gfx-avatar-body"></div></div><div class="gfx-passport-frame"><div class="gfx-avatar-head"></div><div class="gfx-avatar-body"></div><div class="gfx-photo-stamp">Photo Name<br>29-10-2026</div></div></div>`
        },
        {
            name: "Photo Signature Joiner",
            desc: "Combine your passport photo and signature into one single image for form upload.",
            targetEngineUrl: "https://www.sarkariresult.com/tools/photo-sign-joiner.php",
            graphicHTML: `<div class="gfx-merge-banner"><div class="gfx-merge-top">Photo & Signature</div><div class="gfx-merge-mid"><div class="gfx-sign-box">Sign</div><div class="gfx-merge-txt">Merge &rarr;</div></div></div>`
        },
        {
            name: "MPPEB Template",
            desc: "Generate official MPPEB/MPESB photo, signature & declaration template.",
            targetEngineUrl: "https://sarkariresulttools.net/mppeb-template/",
            graphicHTML: `<div class="gfx-mppeb-sheet"><div class="gfx-mppeb-top"><div class="gfx-mini-photo"></div><div class="gfx-mini-lines"><div></div><div></div></div></div><div class="gfx-mppeb-Label">MPPEB Form</div></div>`
        }
    ]);

    // ---------------- 4. WIDE 2-COLUMN MODAL CONTROLLER ----------------
    function removeDownloadPdfRowFromModal() {
        const pdfBtn = document.getElementById("modalPdfBtn");
        if (pdfBtn) {
            const parentRow = pdfBtn.closest("tr");
            if (parentRow) parentRow.remove();
        }
        // पुराना संकरा बॉक्स अगर कहीं बचा हो तो उसे भी हटा दें
        const oldNarrowBox = document.getElementById("dynamicDetailsTableBox");
        if (oldNarrowBox) oldNarrowBox.remove();
    }

    // मुख्य चौड़े टेबल की पंक्तियों (Rows) को पहचान कर तैयार करना
    function ensureWideModalTableStructure() {
        const primaryBtn = document.getElementById("modalPrimaryBtn");
        if (!primaryBtn) return null;
        const table = primaryBtn.closest("table");
        if (!table) return null;

        // एक बार पहचान चिह्न (IDs) लगा दें ताकि हर पोस्ट पर चौड़ा 2-कॉलम बॉक्स अपडेट हो सके
        if (!table.hasAttribute("data-sru-wide-ready")) {
            const dateOnlyEl = document.getElementById("modalDateOnly");
            if (dateOnlyEl) {
                const contentRow = dateOnlyEl.closest("tr");
                if (contentRow && contentRow.cells.length >= 2) {
                    contentRow.id = "sruWideDatesFeesRow";
                    contentRow.cells[0].id = "sruDatesCell";
                    contentRow.cells[1].id = "sruFeesCell";

                    const headerRow = contentRow.previousElementSibling;
                    if (headerRow && headerRow.cells.length >= 2) {
                        headerRow.id = "sruWideHeaderRow";
                        headerRow.cells[0].id = "sruLeftColTitle";
                        headerRow.cells[1].id = "sruRightColTitle";
                    }

                    // Age Limit और Total Post के लिए उसी चौड़े टेबल में एक नई 2-कॉलम पंक्ति (Row) जोड़ें
                    const agePostHeaderRow = document.createElement("tr");
                    agePostHeaderRow.id = "sruWideAgePostHeaderRow";
                    agePostHeaderRow.innerHTML = `
                        <th style="background:#14532d; color:#ffffff; padding:7px 12px; text-align:left; font-size:0.92rem; border:1px solid #cbd5e1; width:55%;">
                            Age Limit &amp; Eligibility Details
                        </th>
                        <th style="background:#c2410c; color:#ffffff; padding:7px 12px; text-align:center; font-size:0.92rem; border:1px solid #cbd5e1; width:45%;">
                            Vacancy / Total Post
                        </th>
                    `;

                    const agePostBodyRow = document.createElement("tr");
                    agePostBodyRow.id = "sruWideAgePostBodyRow";
                    agePostBodyRow.innerHTML = `
                        <td id="sruAgeLimitCell" style="padding:9px 12px; vertical-align:top; background:#ffffff; border:1px solid #cbd5e1; font-size:0.88rem; line-height:1.55;"></td>
                        <td id="sruTotalPostCell" style="padding:9px 12px; vertical-align:middle; text-align:center; background:#fff7ed; border:1px solid #cbd5e1; font-size:1.15rem; font-weight:800; color:#9a3412;"></td>
                    `;

                    contentRow.parentNode.insertBefore(agePostHeaderRow, contentRow.nextSibling);
                    contentRow.parentNode.insertBefore(agePostBodyRow, agePostHeaderRow.nextSibling);
                }
            }
            table.setAttribute("data-sru-wide-ready", "true");
        }

        return table;
    }

    function openPostById(postId) {
        const post = PORTAL_POSTS.find(p => p.id === postId) || PORTAL_POSTS[0];
        if (!post) return;

        removeDownloadPdfRowFromModal();
        ensureWideModalTableStructure();

        const postDateEl = document.getElementById("modalPostDate");
        if (postDateEl) postDateEl.innerHTML = `${escapeHTML(post.date)} | <strong>${escapeHTML(post.time)}</strong>`;

        const shortInfoEl = document.getElementById("modalShortInfo");
        if (shortInfoEl) shortInfoEl.textContent = post.shortInfo;

        const mainHeadingEl = document.getElementById("modalMainHeading");
        if (mainHeadingEl) mainHeadingEl.textContent = post.title;

        // चौड़े 2-कॉलम टेबल में बाईं तरफ Important Dates और दाईं तरफ Application Fee भरना
        const leftColTitle = document.getElementById("sruLeftColTitle");
        const rightColTitle = document.getElementById("sruRightColTitle");
        const datesCell = document.getElementById("sruDatesCell");
        const feesCell = document.getElementById("sruFeesCell");
        const ageCell = document.getElementById("sruAgeLimitCell");
        const totalPostCell = document.getElementById("sruTotalPostCell");

        if (leftColTitle) leftColTitle.textContent = "Important Dates";
        if (rightColTitle) rightColTitle.textContent = "Application Fee";

        const details = post.detailsTable || {
            dates: [
                `Notification / Update Date : ${post.date}`,
                `Update Timing : ${post.time}`,
                `Status : ${post.tag.replace(/[\[\]]/g, "")}`
            ],
            fees: [
                "As per Official Department Notification.",
                "No Extra Charge to Check Result / Download Admit Card."
            ],
            ageLimit: [
                "Minimum / Maximum Age : As per official notification rules.",
                "Candidates are advised to verify details on the official portal."
            ],
            totalPosts: post.category === "result" ? "Result Declared" : post.category === "admit-card" ? "Admit Card Active" : "Check Notification"
        };

        if (datesCell) {
            datesCell.innerHTML = `<ul style="margin:0; padding-left:18px; line-height:1.6; font-size:0.88rem; color:#0f172a;">` +
                details.dates.map(d => `<li>${escapeHTML(d)}</li>`).join("") +
                `</ul>`;
        }

        if (feesCell) {
            feesCell.innerHTML = `<ul style="margin:0; padding-left:18px; line-height:1.6; font-size:0.88rem; color:#0f172a;">` +
                details.fees.map(f => `<li>${escapeHTML(f)}</li>`).join("") +
                `</ul>`;
        }

        if (ageCell) {
            const ageArr = Array.isArray(details.ageLimit) ? details.ageLimit : [details.ageLimit];
            ageCell.innerHTML = `<ul style="margin:0; padding-left:18px; line-height:1.55; color:#0f172a;">` +
                ageArr.map(a => `<li>${escapeHTML(a)}</li>`).join("") +
                `</ul>`;
        }

        if (totalPostCell) {
            totalPostCell.innerHTML = `<span style="display:inline-block; background:#ea580c; color:#ffffff; padding:5px 14px; border-radius:4px; font-size:1rem;">${escapeHTML(details.totalPosts)}</span>`;
        }

        // लिंक्स और बटन टेक्स्ट अपडेट करना
        const actionLabel = post.category === "result"
            ? "Download Result / Score Card"
            : post.category === "admit-card"
            ? "Download Admit Card / Exam City"
            : "Apply Online / Official Registration";

        const actionLabelEl = document.getElementById("modalActionLabel");
        if (actionLabelEl) actionLabelEl.textContent = actionLabel;

        const primaryBtn = document.getElementById("modalPrimaryBtn");
        if (primaryBtn) {
            primaryBtn.textContent = "Click Here Official Website";
            primaryBtn.href = sanitizeUrl(post.registrationUrl || post.officialUrl);
        }

        const officialSiteBtn = document.getElementById("modalOfficialSiteBtn");
        if (officialSiteBtn) {
            officialSiteBtn.textContent = "Official Website";
            officialSiteBtn.href = sanitizeUrl(post.officialUrl);
        }

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
                    <input type="date" id="dobInput" value="2005-07-15" style="padding:8px 12px; border:1px solid #64748b; border-radius:3px;">
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
                </div>
            `;
            const procBtn = document.getElementById("processToolBtn");
            if (procBtn) {
                procBtn.addEventListener("click", function () {
                    procBtn.textContent = "Connecting to Secure Engine...";
                    procBtn.style.background = "#d97706";
                    procBtn.disabled = true;
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
                            <tr>${scheme.headers.map(h => `<th>${escapeHTML(h)}</th>`).join("")}</tr>
                        </thead>
                        <tbody>
                            ${scheme.rows.map(row => `<tr>${row.map(cell => `<td>${escapeHTML(cell)}</td>`).join("")}</tr>`).join("")}
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
                <div class="tool-graphic-stage">${t.graphicHTML}</div>
                <div class="tool-card-title">${escapeHTML(t.name)}</div>
            </div>
        `).join("");
    }

    // ---------------- 6. RIGHT-SIDE SMART AI CHAT WIDGET ----------------
    function initRightAiFreeChatWidget() {
        if (document.getElementById("sruAiChatPanel")) return;

        const styleEl = document.createElement("style");
        styleEl.textContent = `
            .sru-ai-right-wrap { position: fixed; bottom: 18px; right: 16px; z-index: 2500; font-family: Arial, sans-serif; }
            .sru-ai-toggle-btn { background: #0284c7; color: #fff; border: 2px solid #fff; padding: 9px 16px; border-radius: 20px; font-size: 0.88rem; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.25); display: flex; align-items: center; gap: 8px; }
            .sru-ai-online-dot { width: 9px; height: 9px; background: #22c55e; border-radius: 50%; display: inline-block; box-shadow: 0 0 6px #22c55e; }
            .sru-ai-chat-panel { display: none; width: 320px; background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); margin-bottom: 10px; overflow: hidden; flex-direction: column; }
            .sru-ai-chat-header { background: #0284c7; color: #fff; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; font-weight: 700; }
            .sru-ai-close-btn { background: transparent; color: #fff; border: none; font-size: 1rem; font-weight: 700; cursor: pointer; }
            .sru-ai-messages { height: 240px; overflow-y: auto; padding: 12px; background: #f8fafc; display: flex; flex-direction: column; gap: 9px; font-size: 0.85rem; }
            .sru-msg-bot { background: #e2e8f0; color: #0f172a; padding: 8px 12px; border-radius: 8px 8px 8px 2px; align-self: flex-start; max-width: 90%; line-height: 1.45; }
            .sru-msg-user { background: #0284c7; color: #fff; padding: 8px 12px; border-radius: 8px 8px 2px 8px; align-self: flex-end; max-width: 85%; line-height: 1.45; }
            .sru-ai-chips { display: flex; flex-wrap: wrap; gap: 5px; padding: 6px 10px; background: #f1f5f9; border-top: 1px solid #e2e8f0; }
            .sru-ai-chip { background: #fff; color: #0369a1; border: 1px solid #bae6fd; border-radius: 12px; padding: 3px 9px; font-size: 0.74rem; font-weight: 700; cursor: pointer; }
            .sru-ai-input-row { display: flex; border-top: 1px solid #cbd5e1; background: #fff; }
            .sru-ai-input-row input { flex: 1; border: none; padding: 9px 12px; font-size: 0.85rem; outline: none; }
            .sru-ai-input-row button { background: #0284c7; color: #fff; border: none; padding: 0 14px; font-weight: 700; cursor: pointer; }
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
                    <div class="sru-msg-bot">नमस्ते! मैं आपका AI सहायक हूँ। आप मुझसे किसी भी सरकारी फॉर्म, रेलवे स्टेशन मास्टर या फोटो रिसाइज़र के बारे में पूछ सकते हैं।</div>
                </div>
                <div class="sru-ai-chips">
                    <button type="button" class="sru-ai-chip" data-ai-q="Station Master">Station Master</button>
                    <button type="button" class="sru-ai-chip" data-ai-q="UP Police">UP Police</button>
                    <button type="button" class="sru-ai-chip" data-ai-q="Image Resizer">Photo Resizer</button>
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

        function appendMsg(text, isUser) {
            const div = document.createElement("div");
            div.className = isUser ? "sru-msg-user" : "sru-msg-bot";
            if (isUser) {
                div.textContent = text;
            } else {
                div.innerHTML = text;
            }
            messagesBox.appendChild(div);
            messagesBox.scrollTop = messagesBox.scrollHeight;
        }

        function queryAI(text) {
            const query = text.trim();
            if (!query) return;
            appendMsg(query, true);
            inputEl.value = "";

            setTimeout(function () {
                const qLower = query.toLowerCase();
                if (qLower.includes("hi") || qLower.includes("hello") || qLower.includes("नमस्ते")) {
                    appendMsg("नमस्ते! बताइए, आज आपको किस भर्ती, रिजल्ट या टूल की डायरेक्ट लिंक चाहिए?", false);
                    return;
                }
                const matched = PORTAL_POSTS.filter(p =>
                    p.title.toLowerCase().includes(qLower) || p.shortInfo.toLowerCase().includes(qLower)
                ).slice(0, 3);

                if (matched.length > 0) {
                    const links = matched.map(p => `&bull; <a href="#" data-post-id="${escapeHTML(p.id)}" style="color:#0284c7; font-weight:700;">${escapeHTML(p.title)}</a>`).join("<br>");
                    appendMsg(`ये लीजिए आपके सवाल से जुड़े डायरेक्ट लिंक्स:<br>${links}`, false);
                } else {
                    appendMsg(`आप ऊपर दिए गए 'Latest Jobs', 'Result' या 'Admit Card' बॉक्स में देख सकते हैं, या "Station Master", "UP Police" लिखकर पूछ सकते हैं।`, false);
                }
            }, 600);
        }

        toggleBtn.addEventListener("click", () => panel.style.display = panel.style.display === "flex" ? "none" : "flex");
        closeBtn.addEventListener("click", () => panel.style.display = "none");
        sendBtn.addEventListener("click", () => queryAI(inputEl.value));
        inputEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                queryAI(inputEl.value);
            }
        });
        widgetWrap.addEventListener("click", (e) => {
            const chip = e.target.closest("[data-ai-q]");
            if (chip) queryAI(chip.getAttribute("data-ai-q"));
        });
    }

    // ---------------- 7. INITIALIZATION ----------------
    document.addEventListener("DOMContentLoaded", function () {
        removeDownloadPdfRowFromModal();
        renderLiveTicker();
        renderTopHighlights();
        renderFeaturedSchemes();
        renderAllColumns();
        renderToolsSection();
        initRightAiFreeChatWidget();

        document.body.addEventListener("click", function (e) {
            const postTrig = e.target.closest("[data-post-id]");
            if (postTrig) {
                e.preventDefault();
                openPostById(postTrig.getAttribute("data-post-id"));
                return;
            }
            const toolTrig = e.target.closest("[data-tool-name]");
            if (toolTrig) {
                e.preventDefault();
                openToolModal(toolTrig.getAttribute("data-tool-name"));
                return;
            }
            const catTrig = e.target.closest("[data-cat]");
            if (catTrig) {
                switchCategory(catTrig.getAttribute("data-cat"), catTrig);
                return;
            }
            if (e.target.id === "postModal" || e.target.id === "closePostModalBtn") closePostModal();
            if (e.target.id === "toolModal" || e.target.id === "closeToolModalBtn") closeToolModal();
        });

        const searchInput = document.getElementById("globalSearch");
        const searchBtn = document.getElementById("searchBtn");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => renderAllColumns(escapeHTML(e.target.value)));
        }
        if (searchBtn && searchInput) {
            searchBtn.addEventListener("click", () => renderAllColumns(escapeHTML(searchInput.value)));
        }
    });
})();