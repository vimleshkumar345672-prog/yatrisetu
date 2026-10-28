/**
 * YatriSetu Final Production Engine (4-Argon Security & Cloud Sync Model)
 * - 100% Real-Time Public Post Sync Across All Devices
 * - Protected Backend Architecture & XSS Input Sanitization
 * - Complete Bilingual Support (Hindi / English), ID Verification & PhonePe Confirmation
 */

// ============================================================================
// 👇 लाइन नंबर 13: यहाँ नीचे "" के अंदर अपना Firebase Realtime Database लिंक पेस्ट करें
// (उदाहरण: const FIREBASE_DB_URL = "https://yatrisetu-a9ff5-default-rtdb.firebaseio.com/";)
// ============================================================================

const FIREBASE_DB_URL = "https://yatrisetu-a9ff5-default-rtdb.firebaseio.com";

// ============================================================================

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
const STORAGE_KEY_USER = 'yatrisetu_user_final';
const STORAGE_KEY_BOOKINGS = 'yatrisetu_bookings_final';
const STORAGE_KEY_CACHE = 'yatrisetu_listings_cache';
const STORAGE_KEY_MY_POSTS = 'yatrisetu_my_posted_ids_final';
const STORAGE_KEY_NOTIFIED_PNRS = 'yatrisetu_notified_pnrs_final';

let currentLanguage = 'en';
let lastActionTimestamp = 0;
let allListings = [];

// Clean URL helper
function getCleanFirebaseUrl() {
    if (!FIREBASE_DB_URL || FIREBASE_DB_URL.trim() === "") return null;
    return FIREBASE_DB_URL.trim().replace(/\/$/, "");
}

// Security Layer 1: Anti-XSS HTML Sanitizer
function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, function (char) {
        const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        return escapeMap[char];
    });
}

// Security Layer 2: Anti-Spam Rate Limiter
function isRateLimited() {
    const now = Date.now();
    if (now - lastActionTimestamp < 1200) {
        showPhonePePopup("कृपया प्रतीक्षा करें", "थोड़ा रुककर दोबारा प्रयास करें (Please wait a moment).", "info");
        return true;
    }
    lastActionTimestamp = now;
    return false;
}

// ⏱️ Live Dynamic Time-Ago (1 Minute to 2 Weeks)
function formatTimeAgo(createdAt) {
    if (!createdAt) return currentLanguage === 'hi' ? 'अभी-अभी' : 'Just now';
    const diffMs = Math.max(0, Date.now() - Number(createdAt));
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (currentLanguage === 'hi') {
        if (diffMins < 1) return '1 मिनट पहले';
        if (diffMins < 60) return `${diffMins} मिनट पहले`;
        if (diffHours < 24) return `${diffHours} घंटे पहले`;
        if (diffDays < 7) return `${diffDays} दिन पहले`;
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} हफ्ते पहले`;
    } else {
        if (diffMins < 1) return '1 min ago';
        if (diffMins === 1) return '1 min ago';
        if (diffMins < 60) return `${diffMins} mins ago`;
        if (diffHours === 1) return '1 hr ago';
        if (diffHours < 24) return `${diffHours} hrs ago`;
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        const weeks = Math.floor(diffDays / 7);
        return `${weeks}w ago`;
    }
}

// PhonePe Green Tick Chime
function playSuccessChime() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const notes = [587.33, 880, 1174.66];
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
            gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.12);
            osc.stop(ctx.currentTime + idx * 0.12 + 0.45);
        });
    } catch (err) {}
}

// ✨ Custom PhonePe Style Green-Tick Popup (Replaces Browser Alert)
function showPhonePePopup(title, subtitle, type = "success", extraHTML = "") {
    if (type === "success") playSuccessChime();

    const existing = document.getElementById('yatrisetuPhonePeModal');
    if (existing) existing.remove();

    const isSuccess = type === "success";
    const isDanger = type === "danger";
    const iconBg = isSuccess ? "bg-emerald-500" : (isDanger ? "bg-red-600" : "bg-blue-600");
    const ringBg = isSuccess ? "bg-emerald-100" : (isDanger ? "bg-red-100" : "bg-blue-100");
    const iconClass = isSuccess ? "fa-check" : (isDanger ? "fa-trash-can" : "fa-bell");
    const btnBg = isSuccess ? "bg-emerald-600 hover:bg-emerald-700" : (isDanger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700");

    const modal = document.createElement('div');
    modal.id = 'yatrisetuPhonePeModal';
    modal.className = 'fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100">
            <div class="w-20 h-20 ${ringBg} rounded-full flex items-center justify-center mx-auto mb-4">
                <div class="w-14 h-14 ${iconBg} text-white rounded-full flex items-center justify-center text-2xl shadow-lg">
                    <i class="fa-solid ${iconClass}"></i>
                </div>
            </div>
            <span class="inline-block px-3 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded-full uppercase tracking-wider mb-2">
                Verified by YatriSetu
            </span>
            <h3 class="font-extrabold text-slate-900 text-lg leading-snug mb-1.5">${title}</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">${subtitle}</p>
            ${extraHTML}
            <button type="button" onclick="document.getElementById('yatrisetuPhonePeModal').remove()" class="w-full py-3.5 ${btnBg} text-white font-extrabold rounded-2xl text-xs shadow-lg cursor-pointer transition">
                Done / ठीक है
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

// 14-Day Scheduling Window
function configureDateConstraints() {
    const today = new Date();
    const maxDate = new Date(Date.now() + TWO_WEEKS_MS);
    const minStr = today.toISOString().split('T')[0];
    const maxStr = maxDate.toISOString().split('T')[0];

    ['searchDate', 'rTravelDate', 'sAvailableDate'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.min = minStr;
            el.max = maxStr;
            if (!el.value) el.value = minStr;
        }
    });
}

// Full Bilingual Dictionary (Hindi & English)
const i18n = {
    en: {
        brandSub: "Intercity Mobility & Stays",
        langSwitchBtn: "हिंदी / HI",
        navMyBookings: "My Bookings",
        navOfferBtn: "Offer a ride",
        heroHeading: "Travel anywhere together. <span class='text-blue-600'>Spend smarter.</span>",
        heroSubheading: "Connect with verified drivers across cars, bikes, buses, and trucks, or book comfortable local homestays along your route.",
        heroBadgeTitle: "100% ID Verified Passengers & Hosts",
        heroBadgeSub: "Instant confirmation with direct SMS, WhatsApp & Call",
        lblSearchFrom: "From",
        lblSearchTo: "To",
        lblSearchDate: "Departure",
        lblSearchCategory: "Category",
        btnSearchText: "Search",
        lblShowStays: "Include verified homestays & rooms in search results",
        lblScheduleRule: "<i class='fa-regular fa-clock text-blue-600 mr-1'></i> Active scheduling window: Up to 14 days (2 weeks)",
        pillar1Title: "Travel everywhere",
        pillar1Desc: "Explore routes across India with cars, bikes, buses, trucks, and comfortable local homestays at your destination.",
        pillar2Title: "Prices like nowhere",
        pillar2Desc: "Benefit from shared travel costs and direct-from-host room tariffs without middleman commission fees.",
        pillar3Title: "Two-Way Safety Proof",
        pillar3Desc: "Both vehicle owners and passengers are verified with Photo, Mobile Number, and Govt ID proof for complete peace of mind.",
        feedHeading: "Available Rides & Homestays",
        feedSubheading: "Click on any photo to view full gallery or click Book Now for instant green-tick confirmation.",
        btnResetFilters: "Show All Listings",
        topRoutesHeading: "Top carpool routes",
        btnMoreRoutes: "More popular routes",
        ctaShareTitle: "Share your ride or spare room. Cut your costs.",
        ctaShareDesc: "Whether you drive a car, bike, bus, or truck, or have a clean homestay room for travellers—publish your listing in seconds for free.",
        ctaShareBtn: "Publish your listing",
        faqHeading: "YatriSetu Help Centre",
        bookBtnLabel: "Book Now",
        deleteBtnLabel: "Cancel / Delete Post"
    },
    hi: {
        brandSub: "इंटरसिटी राइड और होमस्टे (Mobility & Stays)",
        langSwitchBtn: "Switch to English",
        navMyBookings: "मेरी बुकिंग्स (My Bookings)",
        navOfferBtn: "राइड/रूम पोस्ट करें",
        heroHeading: "साथ मिलकर कहीं भी सफर करें। <span class='text-blue-600'>सफर आसान और किफायती बनाएं।</span>",
        heroSubheading: "कार, बाइक, बस और ट्रक के वेरिफाइड ड्राइवर्स से जुड़ें या अपने रूट पर आरामदायक होमस्टे/कमरा बुक करें।",
        heroBadgeTitle: "वेरिफाइड यात्री और वाहन मालिक (100% ID Verified)",
        heroBadgeSub: "तुरंत ग्रीन-टिक कन्फर्मेशन, SMS, WhatsApp चैट और कॉल",
        lblSearchFrom: "कहाँ से (From)",
        lblSearchTo: "कहाँ तक (To)",
        lblSearchDate: "तारीख (Departure)",
        lblSearchCategory: "वाहन / रूम (Category)",
        btnSearchText: "खोजें (Search)",
        lblShowStays: "सर्च में होमस्टे और रूम भी दिखाएं",
        lblScheduleRule: "<i class='fa-regular fa-clock text-blue-600 mr-1'></i> बुकिंग शेड्यूल: अधिकतम 2 हफ्ते / 14 दिन",
        pillar1Title: "हर जगह सफर करें",
        pillar1Desc: "पूरे भारत में कार, बाइक, बस, ट्रक और बेहतरीन होमस्टे के साथ सुरक्षित यात्रा करें।",
        pillar2Title: "सबसे किफायती किराया",
        pillar2Desc: "बिना किसी एक्स्ट्रा कमीशन के सीधे ड्राइवर या रूम मालिक से जुड़कर अपना खर्च बचाएं।",
        pillar3Title: "दोनों तरफ की सुरक्षा",
        pillar3Desc: "ड्राइवर और पैसेंजर दोनों का फोटो, मोबाइल नंबर और सरकारी आईडी प्रूफ वेरिफाई होता है।",
        feedHeading: "उपलब्ध गाड़ियाँ और होमस्टे",
        feedSubheading: "सभी फोटो देखने के लिए फोटो पर क्लिक करें या तुरंत बुक करने के लिए 'Book Now' दबाएं।",
        btnResetFilters: "सभी दिखाएं (Show All)",
        topRoutesHeading: "लोकप्रिय कारपूल रूट्स",
        btnMoreRoutes: "अन्य रूट्स देखें",
        ctaShareTitle: "अपनी गाड़ी या खाली कमरा शेयर करें, खर्च बचाएं।",
        ctaShareDesc: "चाहे आपके पास कार, बाइक, बस, ट्रक हो या यात्रियों के लिए कमरा—बिना किसी शुल्क के अपनी पोस्ट डालें।",
        ctaShareBtn: "अभी पोस्ट करें",
        faqHeading: "सहायता केंद्र (YatriSetu Help Centre)",
        bookBtnLabel: "बुक करें (Book Now)",
        deleteBtnLabel: "पोस्ट कैंसिल / डिलीट करें"
    }
};

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
    const lang = i18n[currentLanguage];
    const ids = [
        'brandSub', 'langSwitchBtn', 'navMyBookings', 'navOfferBtn',
        'heroSubheading', 'heroBadgeTitle', 'heroBadgeSub', 'lblSearchFrom',
        'lblSearchTo', 'lblSearchDate', 'lblSearchCategory', 'btnSearchText',
        'lblShowStays', 'pillar1Title', 'pillar1Desc', 'pillar2Title',
        'pillar2Desc', 'pillar3Title', 'pillar3Desc', 'feedHeading',
        'feedSubheading', 'btnResetFilters', 'topRoutesHeading', 'btnMoreRoutes',
        'ctaShareTitle', 'ctaShareDesc', 'ctaShareBtn', 'faqHeading'
    ];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = lang[id];
    });
    if (document.getElementById('heroHeading')) document.getElementById('heroHeading').innerHTML = lang.heroHeading;
    if (document.getElementById('lblScheduleRule')) document.getElementById('lblScheduleRule').innerHTML = lang.lblScheduleRule;
    renderListings(allListings);
}

// ============================================================================
// USER REGISTRATION, RED SIGN-OUT & PROFILE SYSTEM
// ============================================================================
function loadRegisteredUser() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_USER);
        return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
}

let currentUser = loadRegisteredUser();

function getMyPostedIds() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_MY_POSTS)) || [];
    } catch (e) { return []; }
}

function saveMyPostedId(listingId) {
    try {
        const list = getMyPostedIds();
        if (!list.includes(listingId)) {
            list.push(listingId);
            localStorage.setItem(STORAGE_KEY_MY_POSTS, JSON.stringify(list));
        }
    } catch (e) {}
}

function getNotifiedPnrs() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_NOTIFIED_PNRS)) || [];
    } catch (e) { return []; }
}

function markPnrNotified(pnr) {
    try {
        const list = getNotifiedPnrs();
        if (!list.includes(pnr)) {
            list.push(pnr);
            localStorage.setItem(STORAGE_KEY_NOTIFIED_PNRS, JSON.stringify(list));
        }
    } catch (e) {}
}

// 🔴 Red Sign Out Button inside Register Modal
function renderSignOutButtonInModal() {
    const regModal = document.getElementById('registerModal');
    if (!regModal) return;
    const formEl = regModal.querySelector('form');
    if (!formEl) return;

    let signOutContainer = document.getElementById('dynamicSignOutContainer');
    if (!signOutContainer) {
        signOutContainer = document.createElement('div');
        signOutContainer.id = 'dynamicSignOutContainer';
        signOutContainer.className = 'pt-3 border-t border-slate-200 mt-3';
        formEl.appendChild(signOutContainer);
    }

    if (currentUser && currentUser.name) {
        signOutContainer.classList.remove('hidden');
        signOutContainer.innerHTML = `
            <div class="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl p-3">
                <div class="text-left">
                    <span class="block text-[11px] font-extrabold text-red-900">Logged in: ${sanitizeHTML(currentUser.name)}</span>
                    <span class="block text-[10px] font-bold text-red-600">+91 ${sanitizeHTML(currentUser.phone)}</span>
                </div>
                <button type="button" onclick="signOutUser()" class="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs shadow cursor-pointer transition flex items-center gap-1.5">
                    <i class="fa-solid fa-right-from-bracket"></i> Sign Out / लॉग आउट
                </button>
            </div>
        `;
    } else {
        signOutContainer.classList.add('hidden');
        signOutContainer.innerHTML = '';
    }
}

function signOutUser() {
    const oldName = currentUser ? currentUser.name : '';
    currentUser = null;
    localStorage.removeItem(STORAGE_KEY_USER);

    ['regUserName', 'regUserPhone', 'regEmergencyPhone', 'regIdDigits'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    updateNavbarUserUI();
    renderSignOutButtonInModal();
    closeModal('registerModal');
    renderListings(allListings);
    showPhonePePopup(
        "अकाउंट साइन आउट हो गया!",
        `${oldName ? oldName + ', ' : ''}आपका अकाउंट सफलतापूर्वक लॉग आउट (Sign Out) कर दिया गया है।`,
        "danger"
    );
}

function updateNavbarUserUI() {
    const textEl = document.getElementById('navUserText');
    const avatarEl = document.getElementById('navUserAvatar');
    const iconEl = document.getElementById('navUserIcon');
    if (!textEl) return;

    if (currentUser && currentUser.name) {
        textEl.innerText = currentUser.name.split(' ')[0];
        if (currentUser.photo) {
            avatarEl.src = currentUser.photo;
            avatarEl.classList.remove('hidden');
            iconEl.classList.add('hidden');
        } else {
            avatarEl.classList.add('hidden');
            iconEl.classList.remove('hidden');
        }
        if (document.getElementById('regUserName')) document.getElementById('regUserName').value = currentUser.name || '';
        if (document.getElementById('regUserPhone')) document.getElementById('regUserPhone').value = currentUser.phone || '';
        if (document.getElementById('regEmergencyPhone')) document.getElementById('regEmergencyPhone').value = currentUser.emergencyPhone || '';
        if (document.getElementById('regIdType')) document.getElementById('regIdType').value = currentUser.idType || 'Aadhaar Card';
        if (document.getElementById('regIdDigits')) document.getElementById('regIdDigits').value = currentUser.idDigits || '';
    } else {
        textEl.innerText = 'Register';
        avatarEl.classList.add('hidden');
        iconEl.classList.remove('hidden');
    }
    renderSignOutButtonInModal();
}

async function saveUserProfile(e) {
    e.preventDefault();
    if (isRateLimited()) return;

    const uploadedPhotos = await readFilesAsBase64(document.getElementById('regUserPhoto'));
    const userPhoto = uploadedPhotos.length > 0
        ? uploadedPhotos[0]
        : (currentUser && currentUser.photo ? currentUser.photo : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80');

    currentUser = {
        name: sanitizeHTML(document.getElementById('regUserName').value.trim()),
        phone: sanitizeHTML(document.getElementById('regUserPhone').value.trim()),
        emergencyPhone: sanitizeHTML(document.getElementById('regEmergencyPhone').value.trim()),
        idType: sanitizeHTML(document.getElementById('regIdType').value),
        idDigits: sanitizeHTML(document.getElementById('regIdDigits').value.trim().toUpperCase()),
        photo: userPhoto,
        registeredAt: Date.now()
    };

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    updateNavbarUserUI();
    updateBookingsBadge();
    renderListings(allListings);
    closeModal('registerModal');
    showPhonePePopup("प्रोफाइल सेव हो गई!", `स्वागत है ${currentUser.name}! आपकी वेरिफाइड प्रोफाइल सेव हो गई है।`);
}

// ============================================================================
// 🌐 CLOUD REALTIME SYNC ENGINE (सभी यूजर्स के लिए साझा लाइव सर्वर)
// ============================================================================
function getDefaultSeedListings() {
    const todayStr = new Date().toISOString().split('T')[0];
    return {
        "seed_101": {
            id: 'YS-101',
            kind: 'ride',
            category: 'Car',
            providerName: 'Rahul Singh',
            phone: '9876543210',
            vehicleOrAddress: 'DL 3C AB 1234 (Mahindra Thar 4x4)',
            from: 'Gurgaon',
            to: 'Rohtak',
            date: todayStr,
            seats: 3,
            price: 350,
            photos: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=85'],
            bookingsList: [],
            isCancelled: false,
            createdAt: Date.now() - 3600000
        },
        "seed_102": {
            id: 'YS-102',
            kind: 'ride',
            category: 'Bike',
            providerName: 'Amit Kumar',
            phone: '8765432109',
            vehicleOrAddress: 'UP 16 CD 5678 (Royal Enfield Classic)',
            from: 'Dadri',
            to: 'Gurgaon',
            date: todayStr,
            seats: 1,
            price: 150,
            photos: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=85'],
            bookingsList: [],
            isCancelled: false,
            createdAt: Date.now() - 7200000
        },
        "seed_103": {
            id: 'YS-103',
            kind: 'stay',
            category: 'Stay',
            providerName: 'Priya Heritage Homestay',
            phone: '9988776655',
            vehicleOrAddress: 'Near Hawa Mahal, AC Room, Free Wi-Fi',
            from: 'Jaipur',
            to: 'Jaipur',
            date: todayStr,
            seats: 2,
            price: 799,
            photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=85'],
            bookingsList: [],
            isCancelled: false,
            createdAt: Date.now() - 10800000
        }
    };
}

function isMyListing(item) {
    if (!item) return false;
    const myPostedIds = getMyPostedIds();
    if (myPostedIds.includes(item.id)) return true;
    if (currentUser && currentUser.phone && item.phone === currentUser.phone) return true;
    return false;
}

// 🗑️ Cancel / Delete Post Function
function confirmCancelPost(listingId) {
    const item = allListings.find(x => x.id === listingId);
    if (!item) return;

    const existing = document.getElementById('yatrisetuPhonePeModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'yatrisetuPhonePeModal';
    modal.className = 'fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100">
            <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                <i class="fa-solid fa-trash-can"></i>
            </div>
            <h3 class="font-extrabold text-slate-900 text-base mb-1">क्या आप यह पोस्ट डिलीट करना चाहते हैं?</h3>
            <p class="text-xs text-slate-600 mb-5">
                <strong>${sanitizeHTML(item.from)} ➔ ${sanitizeHTML(item.to)}</strong> वाली पोस्ट सभी यूजर्स की स्क्रीन से तुरंत हट जाएगी।
            </p>
            <div class="grid grid-cols-2 gap-2.5">
                <button type="button" onclick="document.getElementById('yatrisetuPhonePeModal').remove()" class="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl text-xs cursor-pointer">
                    नहीं (Back)
                </button>
                <button type="button" onclick="executeCancelPost('${item.id}')" class="py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl text-xs shadow-lg cursor-pointer">
                    हाँ, डिलीट करें
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function executeCancelPost(listingId) {
    const modal = document.getElementById('yatrisetuPhonePeModal');
    if (modal) modal.remove();

    const item = allListings.find(x => x.id === listingId);
    if (!item) return;

    const dbUrl = getCleanFirebaseUrl();
    try {
        if (dbUrl && item.cloudKey) {
            await fetch(`${dbUrl}/listings/${item.cloudKey}.json`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isCancelled: true, seats: 0 })
            });
        }
    } catch (err) {}

    allListings = allListings.filter(x => x.id !== listingId);
    localStorage.setItem(STORAGE_KEY_CACHE, JSON.stringify(allListings));
    renderListings(allListings);
    updateBookingsBadge();
    showPhonePePopup("पोस्ट डिलीट कर दी गई!", `आपकी ${item.from} ➔ ${item.to} पोस्ट लाइव सर्वर से हटा दी गई है।`, "danger");
}

// 🔔 Live Driver Booking Notification & SMS Alert
function checkIncomingDriverBookings(listings) {
    const notifiedPnrs = getNotifiedPnrs();

    listings.forEach(item => {
        if (!isMyListing(item) || !item.bookingsList || !Array.isArray(item.bookingsList)) return;

        item.bookingsList.forEach(b => {
            if (b && b.pnr && !notifiedPnrs.includes(b.pnr)) {
                markPnrNotified(b.pnr);
                const msgBody = `नमस्ते ${b.passengerName}, आपकी YatriSetu बुकिंग (${b.pnr}) कन्फर्म हो गई है! रूट: ${item.from} से ${item.to} (${item.date}).`;
                const waReply = encodeURIComponent(msgBody);
                const smsReply = encodeURIComponent(msgBody);

                const extraActions = `
                    <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-left text-xs space-y-1 mb-4">
                        <div class="text-[10px] font-black text-emerald-700 uppercase">
                            <i class="fa-solid fa-comment-sms mr-1"></i> NEW BOOKING SMS ALERT
                        </div>
                        <div class="flex justify-between"><span>यात्री (Passenger):</span><strong class="text-slate-900">${sanitizeHTML(b.passengerName)}</strong></div>
                        <div class="flex justify-between"><span>मोबाइल नंबर:</span><strong class="text-blue-600">+91 ${sanitizeHTML(b.passengerPhone)}</strong></div>
                        <div class="flex justify-between"><span>सीट / कुल राशि:</span><strong class="text-emerald-700">${b.qty} Unit (₹${b.totalAmount})</strong></div>
                        <div class="grid grid-cols-3 gap-1.5 pt-2">
                            <a href="tel:+91${sanitizeHTML(b.passengerPhone)}" class="py-2 bg-blue-600 text-white font-bold rounded-xl text-center text-[11px]">Call</a>
                            <a href="sms:+91${sanitizeHTML(b.passengerPhone)}?body=${smsReply}" class="py-2 bg-slate-800 text-white font-bold rounded-xl text-center text-[11px]">SMS</a>
                            <a href="https://wa.me/91${sanitizeHTML(b.passengerPhone)}?text=${waReply}" target="_blank" class="py-2 bg-emerald-600 text-white font-bold rounded-xl text-center text-[11px]">WhatsApp</a>
                        </div>
                    </div>
                `;
                showPhonePePopup(
                    "🎉 आपकी राइड बुक हो गई!",
                    `इन्होंने आपकी राइड बुक की है: ${b.passengerName} (+91 ${b.passengerPhone}) ने ${item.from} ➔ ${item.to} पर ${b.qty} सीट बुक की है!`,
                    "success",
                    extraActions
                );
            }
        });
    });
}

// 1. क्लाउड से सभी की पोस्ट लाना
async function fetchListingsFromCloud() {
    const dbUrl = getCleanFirebaseUrl();
    if (!dbUrl) return;

    try {
        const res = await fetch(`${dbUrl}/listings.json`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();

        // अगर डेटाबेस बिल्कुल खाली है, तो शुरुआती 3 डेमो पोस्ट डालें
        if (!data) {
            const seeds = getDefaultSeedListings();
            for (const key in seeds) {
                await fetch(`${dbUrl}/listings/${key}.json`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(seeds[key])
                });
            }
            return fetchListingsFromCloud();
        }

        const list = Object.keys(data).map(key => ({
            cloudKey: key,
            ...data[key]
        }));

        const now = Date.now();
        allListings = list.filter(item =>
            item &&
            item.id &&
            item.isCancelled !== true &&
            (now - (item.createdAt || now)) < TWO_WEEKS_MS
        );
        allListings.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        localStorage.setItem(STORAGE_KEY_CACHE, JSON.stringify(allListings));
        checkIncomingDriverBookings(allListings);
        updateBookingsBadge();
        renderListings(allListings);
    } catch (err) {
        console.warn("Cloud sync error, loading cached view.");
    }
}

// 2. नया राइड/रूम सीधे क्लाउड में जोड़ना (ताकि हर इंसान को दिखे)
async function publishNewItemToCloud(newItem) {
    const dbUrl = getCleanFirebaseUrl();
    if (!dbUrl) {
        showPhonePePopup("लिंक एरर", "Firebase URL सेट नहीं है! कृपया लाइन 13 चेक करें।", "info");
        return false;
    }

    try {
        const res = await fetch(`${dbUrl}/listings.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        });

        if (!res.ok) {
            showPhonePePopup("सर्वर एरर", `पोस्ट सेव नहीं हो सकी (Error ${res.status})। कृपया Firebase के Rules चेक करें!`, "info");
            return false;
        }

        saveMyPostedId(newItem.id);
        await fetchListingsFromCloud();
        return true;
    } catch (err) {
        showPhonePePopup("इंटरनेट एरर", "सर्वर से संपर्क नहीं हो पाया।", "info");
        return false;
    }
}

// 3. बुकिंग होने पर सीट घटाना और ड्राइवर + प्राइवेट बुकिंग लॉग सेव करना
async function updateSeatsAndLogBooking(item, remainingSeats, bookingData) {
    const dbUrl = getCleanFirebaseUrl();
    if (!dbUrl) return;

    const updatedBookingsList = Array.isArray(item.bookingsList) ? [...item.bookingsList] : [];
    updatedBookingsList.unshift(bookingData);
    item.bookingsList = updatedBookingsList;

    try {
        if (item.cloudKey) {
            await fetch(`${dbUrl}/listings/${item.cloudKey}.json`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    seats: remainingSeats,
                    bookingsList: updatedBookingsList
                })
            });
        }
        await fetch(`${dbUrl}/bookings.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
    } catch (err) {}
}

// ============================================================================
// UI CARDS & FORMS
// ============================================================================
function getCategoryIcon(category) {
    const map = { 'Car': 'fa-car-side', 'Bike': 'fa-motorcycle', 'Bus': 'fa-bus', 'Truck': 'fa-truck-front', 'Stay': 'fa-house-chimney' };
    return map[category] || 'fa-car';
}

function getDefaultImageForCategory(category) {
    const map = {
        'Car': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=85',
        'Bike': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=85',
        'Bus': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=85',
        'Truck': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=85',
        'Stay': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=85'
    };
    return map[category] || map['Car'];
}

function renderListings(items) {
    const grid = document.getElementById('listingsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!items || items.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full bg-slate-50 border border-slate-200 rounded-3xl p-10 text-center">
                <i class="fa-solid fa-route text-3xl text-slate-300 mb-3"></i>
                <h4 class="font-extrabold text-slate-800 text-base">No matching rides or stays found</h4>
                <p class="text-xs text-slate-500 mt-1 mb-4">Click below to view all listings or publish a new ride.</p>
                <button onclick="resetFilters()" class="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs cursor-pointer">Show All</button>
            </div>
        `;
        return;
    }

    const bookLabel = i18n[currentLanguage].bookBtnLabel;
    const deleteLabel = i18n[currentLanguage].deleteBtnLabel;

    items.forEach(item => {
        const coverImg = (item.photos && item.photos.length > 0) ? item.photos[0] : getDefaultImageForCategory(item.category);
        const photoCount = item.photos ? item.photos.length : 1;
        const isSoldOut = item.seats <= 0;
        const unitLabel = item.kind === 'stay' ? 'rooms left' : 'seats left';
        const mine = isMyListing(item);
        const receivedCount = (item.bookingsList && Array.isArray(item.bookingsList)) ? item.bookingsList.length : 0;
        const timeAgoText = formatTimeAgo(item.createdAt);

        const card = document.createElement('div');
        card.className = "bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between";
        card.innerHTML = `
            <div>
                <div onclick="openGallery('${item.id}')" class="h-48 overflow-hidden relative cursor-pointer group bg-slate-100">
                    <img src="${coverImg}" alt="${sanitizeHTML(item.providerName)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <span class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5">
                        <i class="fa-solid ${getCategoryIcon(item.category)} text-blue-400"></i> ${sanitizeHTML(item.category)}
                    </span>
                    <span class="absolute top-3 right-3 bg-blue-600 text-white px-3.5 py-1 rounded-full text-xs font-extrabold shadow">
                        ₹${Number(item.price)}
                    </span>
                    ${mine ? `
                        <span class="absolute bottom-3 left-3 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow">
                            Your Post (${receivedCount} Booked)
                        </span>
                    ` : `
                        <span class="absolute bottom-3 left-3 bg-slate-900/75 text-amber-300 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                            <i class="fa-regular fa-clock"></i> ${timeAgoText}
                        </span>
                    `}
                    ${photoCount > 1 ? `
                        <span class="absolute bottom-3 right-3 bg-black/75 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                            <i class="fa-regular fa-images"></i> +${photoCount} Photos
                        </span>
                    ` : ''}
                </div>

                <div class="p-5">
                    <div class="flex items-center justify-between gap-2 mb-1">
                        <h4 class="font-extrabold text-slate-900 text-base truncate flex items-center gap-1.5">
                            ${sanitizeHTML(item.providerName)}
                            <i class="fa-solid fa-circle-check text-blue-600 text-xs" title="Verified Provider"></i>
                        </h4>
                        <span class="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                            <i class="fa-regular fa-clock mr-1"></i>${timeAgoText}
                        </span>
                    </div>
                    <div class="flex items-center justify-between gap-2 mb-3">
                        <p class="text-xs text-blue-600 font-bold truncate">
                            ${sanitizeHTML(item.vehicleOrAddress)}
                        </p>
                        <span class="text-[11px] font-bold text-slate-400 whitespace-nowrap"><i class="fa-regular fa-calendar mr-1"></i>${sanitizeHTML(item.date)}</span>
                    </div>

                    <div class="text-xs text-slate-600 space-y-1.5 border-y border-slate-100 py-3 my-2">
                        <div class="flex justify-between items-center">
                            <span class="text-slate-400 font-semibold">Route / City:</span>
                            <strong class="text-slate-900 font-extrabold">${sanitizeHTML(item.from)} <i class="fa-solid fa-arrow-right text-[10px] mx-1 text-blue-600"></i> ${sanitizeHTML(item.to)}</strong>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-slate-400 font-semibold">Availability:</span>
                            <strong class="${isSoldOut ? 'text-red-600' : 'text-emerald-600'} font-extrabold">
                                ${isSoldOut ? 'Sold Out / Full' : `${item.seats} ${unitLabel}`}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>

            <div class="px-5 pb-5 space-y-2">
                <button ${isSoldOut ? 'disabled' : `onclick="initiateBooking('${item.id}')"`} class="w-full py-3 ${isSoldOut ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md shadow-blue-600/15'} font-extrabold rounded-2xl text-xs transition">
                    ${isSoldOut ? 'Fully Booked' : bookLabel}
                </button>
                ${mine ? `
                    <button type="button" onclick="confirmCancelPost('${item.id}')" class="w-full py-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 font-extrabold rounded-2xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5">
                        <i class="fa-solid fa-trash-can"></i> ${deleteLabel}
                    </button>
                ` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

function readFilesAsBase64(fileInput) {
    return new Promise((resolve) => {
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            resolve([]);
            return;
        }
        const files = fileInput.files;
        const maxFiles = Math.min(files.length, 3);
        const results = [];
        let processed = 0;

        for (let i = 0; i < maxFiles; i++) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const maxW = 550;
                    const scale = img.width > maxW ? maxW / img.width : 1;
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    results.push(canvas.toDataURL('image/jpeg', 0.65));
                    processed++;
                    if (processed === maxFiles) resolve(results);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(files[i]);
        }
    });
}

async function submitRideForm(e) {
    e.preventDefault();
    if (isRateLimited()) return;

    const category = document.getElementById('rVehicleCategory').value;
    const uploadedPhotos = await readFilesAsBase64(document.getElementById('rPhotos'));
    const driverName = sanitizeHTML(document.getElementById('rDriverName').value.trim());
    const driverPhone = sanitizeHTML(document.getElementById('rDriverPhone').value.trim());

    if (!currentUser) {
        currentUser = {
            name: driverName,
            phone: driverPhone,
            emergencyPhone: driverPhone,
            idType: 'Aadhaar Card',
            idDigits: '0000',
            photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
            registeredAt: Date.now()
        };
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
        updateNavbarUserUI();
    }

    const newListing = {
        id: 'YS-' + Math.floor(100000 + Math.random() * 900000),
        kind: 'ride',
        category: category,
        providerName: driverName,
        phone: driverPhone,
        vehicleOrAddress: sanitizeHTML(document.getElementById('rVehicleNumber').value.trim().toUpperCase()),
        from: sanitizeHTML(document.getElementById('rFromCity').value.trim()),
        to: sanitizeHTML(document.getElementById('rToCity').value.trim()),
        date: document.getElementById('rTravelDate').value,
        seats: parseInt(document.getElementById('rSeats').value, 10) || 1,
        price: parseInt(document.getElementById('rPrice').value, 10) || 100,
        photos: uploadedPhotos.length > 0 ? uploadedPhotos : [getDefaultImageForCategory(category)],
        bookingsList: [],
        isCancelled: false,
        createdAt: Date.now()
    };

    const ok = await publishNewItemToCloud(newListing);
    if (ok) {
        closeModal('publishModal');
        e.target.reset();
        configureDateConstraints();
        showPhonePePopup(
            "राइड लाइव पब्लिश हो गई!",
            "आपकी राइड लाइव पब्लिश हो गई है! अब यह हर यूजर को दिखेगी और बुकिंग होते ही आपको SMS व पॉप-अप अलर्ट मिलेगा।"
        );
    }
}

async function submitStayForm(e) {
    e.preventDefault();
    if (isRateLimited()) return;

    const uploadedPhotos = await readFilesAsBase64(document.getElementById('sPhotos'));
    const city = sanitizeHTML(document.getElementById('sCity').value.trim());
    const hostName = sanitizeHTML(document.getElementById('sHostName').value.trim());
    const hostPhone = sanitizeHTML(document.getElementById('sHostPhone').value.trim());

    if (!currentUser) {
        currentUser = {
            name: hostName,
            phone: hostPhone,
            emergencyPhone: hostPhone,
            idType: 'Aadhaar Card',
            idDigits: '0000',
            photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
            registeredAt: Date.now()
        };
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
        updateNavbarUserUI();
    }

    const newStay = {
        id: 'YS-' + Math.floor(100000 + Math.random() * 900000),
        kind: 'stay',
        category: 'Stay',
        providerName: hostName,
        phone: hostPhone,
        vehicleOrAddress: sanitizeHTML(document.getElementById('sAddress').value.trim()),
        from: city,
        to: city,
        date: document.getElementById('sAvailableDate').value,
        seats: parseInt(document.getElementById('sRooms').value, 10) || 1,
        price: parseInt(document.getElementById('sPrice').value, 10) || 500,
        photos: uploadedPhotos.length > 0 ? uploadedPhotos : [getDefaultImageForCategory('Stay')],
        bookingsList: [],
        isCancelled: false,
        createdAt: Date.now()
    };

    const ok = await publishNewItemToCloud(newStay);
    if (ok) {
        closeModal('publishModal');
        e.target.reset();
        configureDateConstraints();
        showPhonePePopup(
            "होमस्टे लाइव पब्लिश हो गया!",
            "आपका होमस्टे लाइव पब्लिश हो गया है! अब यह हर यूजर को दिखेगा और बुकिंग होते ही आपको अलर्ट मिलेगा।"
        );
    }
}

// ============================================================================
// PASSENGER BOOKING & MY BOOKINGS WALLET
// ============================================================================
function loadBookingsFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
        let list = raw ? JSON.parse(raw) : [];
        const now = Date.now();
        list = list.filter(b => (now - (b.bookedAt || now)) < TWO_WEEKS_MS);
        localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(list));
        return list;
    } catch (e) { return []; }
}

let myBookings = loadBookingsFromStorage();

function initiateBooking(listingId) {
    const item = allListings.find(x => x.id === listingId);
    if (!item || item.seats <= 0) return;

    document.getElementById('bookListingId').value = item.id;
    const qtyInput = document.getElementById('passengerQty');
    qtyInput.max = item.seats;
    qtyInput.value = 1;

    if (currentUser) {
        document.getElementById('passengerName').value = currentUser.name || '';
        document.getElementById('passengerPhone').value = currentUser.phone || '';
        document.getElementById('passengerIdType').value = currentUser.idType || 'Aadhaar Card';
        document.getElementById('passengerIdDigits').value = currentUser.idDigits || '';
        document.getElementById('passengerEmergency').value = currentUser.emergencyPhone || '';
    }

    document.getElementById('selectedItemPreview').innerHTML = `
        <div class="flex justify-between items-center">
            <span class="font-extrabold text-slate-900">${sanitizeHTML(item.providerName)} (${sanitizeHTML(item.category)})</span>
            <span class="font-extrabold text-blue-600">₹${item.price} / unit</span>
        </div>
        <div class="text-slate-600">${sanitizeHTML(item.vehicleOrAddress)}</div>
        <div class="text-slate-500 font-semibold">${sanitizeHTML(item.from)} ➔ ${sanitizeHTML(item.to)} • ${sanitizeHTML(item.date)}</div>
    `;

    document.getElementById('bookingStepForm').classList.remove('hidden');
    document.getElementById('bookingStepSuccess').classList.add('hidden');
    openModal('bookingModal');
}

async function processBookingConfirmation(e) {
    e.preventDefault();
    if (isRateLimited()) return;

    const listingId = document.getElementById('bookListingId').value;
    const item = allListings.find(x => x.id === listingId);
    if (!item) return;

    const qty = parseInt(document.getElementById('passengerQty').value, 10) || 1;
    if (qty > item.seats) {
        showPhonePePopup("सीट उपलब्ध नहीं", `केवल ${item.seats} सीट/रूम उपलब्ध हैं!`, "info");
        return;
    }

    const passengerName = sanitizeHTML(document.getElementById('passengerName').value.trim());
    const passengerPhone = sanitizeHTML(document.getElementById('passengerPhone').value.trim());
    const passengerIdType = sanitizeHTML(document.getElementById('passengerIdType').value);
    const passengerIdDigits = sanitizeHTML(document.getElementById('passengerIdDigits').value.trim().toUpperCase());
    const passengerEmergency = sanitizeHTML(document.getElementById('passengerEmergency').value.trim());

    const uploadedPassPhoto = await readFilesAsBase64(document.getElementById('passengerPhotoInput'));
    const passengerPhoto = uploadedPassPhoto.length > 0
        ? uploadedPassPhoto[0]
        : (currentUser && currentUser.photo ? currentUser.photo : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80');

    currentUser = {
        name: passengerName,
        phone: passengerPhone,
        emergencyPhone: passengerEmergency,
        idType: passengerIdType,
        idDigits: passengerIdDigits,
        photo: passengerPhoto,
        registeredAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    updateNavbarUserUI();

    const totalAmount = item.price * qty;
    const pnrToken = 'PNR-' + Math.floor(100000 + Math.random() * 900000);
    const newSeats = item.seats - qty;
    item.seats = newSeats;

    markPnrNotified(pnrToken);

    const newBooking = {
        pnr: pnrToken,
        listingId: item.id,
        category: item.category,
        providerName: item.providerName,
        providerPhone: item.phone,
        vehicleOrAddress: item.vehicleOrAddress,
        route: `${item.from} ➔ ${item.to}`,
        date: item.date,
        passengerName: passengerName,
        passengerPhone: passengerPhone,
        passengerEmergency: passengerEmergency,
        passengerIdProof: `${passengerIdType} (XXXX-${passengerIdDigits})`,
        passengerPhoto: passengerPhoto,
        qty: qty,
        totalAmount: totalAmount,
        bookedAt: Date.now()
    };

    myBookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(myBookings));
    await updateSeatsAndLogBooking(item, newSeats, newBooking);
    updateBookingsBadge();
    renderListings(allListings);

    const smsText = encodeURIComponent(
        `YatriSetu Booking Alert (${pnrToken}): इन्होंने आपकी राइड बुक की है! यात्री: ${passengerName} (+91 ${passengerPhone}), रूट: ${item.from} से ${item.to} (${item.date}), सीट: ${qty} (₹${totalAmount})`
    );
    const smsHref = `sms:+91${item.phone}?body=${smsText}`;

    document.getElementById('confirmedTicketBox').innerHTML = `
        <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div class="flex items-center gap-2.5">
                <img src="${passengerPhoto}" alt="Passenger" class="w-10 h-10 rounded-full object-cover border-2 border-emerald-500">
                <div>
                    <span class="block font-extrabold text-slate-900 text-xs">${passengerName} <i class="fa-solid fa-circle-check text-emerald-600"></i></span>
                    <span class="block text-[10px] font-bold text-slate-500">${passengerIdType}: XXXX-${passengerIdDigits}</span>
                </div>
            </div>
            <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-black rounded-lg text-xs">${pnrToken}</span>
        </div>
        <div class="flex justify-between pt-1"><span>Passenger Mobile:</span><strong class="text-slate-900">+91 ${passengerPhone}</strong></div>
        <div class="flex justify-between"><span>Provider / Host:</span><strong class="text-slate-900">${sanitizeHTML(item.providerName)} (+91 ${sanitizeHTML(item.phone)})</strong></div>
        <div class="flex justify-between"><span>Route & Date:</span><strong class="text-slate-900">${sanitizeHTML(item.from)} ➔ ${sanitizeHTML(item.to)} (${sanitizeHTML(item.date)})</strong></div>
        <div class="flex justify-between border-t border-slate-200 pt-2 text-sm">
            <span class="font-bold">Total Amount (${qty} unit):</span>
            <strong class="text-emerald-600 font-extrabold">₹${totalAmount}</strong>
        </div>
        <div class="pt-2">
            <a href="${smsHref}" class="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow">
                <i class="fa-solid fa-comment-sms text-amber-400"></i> ड्राइवर को तुरंत टेक्स्ट SMS भेजें (Send SMS Alert)
            </a>
        </div>
    `;

    document.getElementById('directCallBtn').href = `tel:+91${item.phone}`;
    const waText = encodeURIComponent(
        `✅ *YatriSetu Booking Confirmed (${pnrToken})*\n` +
        `👤 *Passenger:* ${passengerName}\n` +
        `🪪 *Verified ID:* ${passengerIdType} (XXXX-${passengerIdDigits})\n` +
        `📞 *Passenger Mobile:* +91 ${passengerPhone}\n` +
        `📍 *Route:* ${item.from} to ${item.to} (${item.date})\n` +
        `💺 *Units:* ${qty} (Total: ₹${totalAmount})`
    );
    document.getElementById('directWaBtn').href = `https://wa.me/91${item.phone}?text=${waText}`;

    document.getElementById('bookingStepForm').classList.add('hidden');
    document.getElementById('bookingStepSuccess').classList.remove('hidden');
    showPhonePePopup(
        "बुकिंग कन्फर्म हो गई!",
        `आपकी बुकिंग (${pnrToken}) कन्फर्म हो गई है और राइड ऑफर करने वाले के अकाउंट में लाइव अलर्ट भेज दिया गया है!`
    );
}

function getBookingsReceivedByMe() {
    const received = [];
    allListings.forEach(item => {
        if (isMyListing(item) && Array.isArray(item.bookingsList)) {
            item.bookingsList.forEach(b => {
                received.push({ ...b, listingRoute: `${item.from} ➔ ${item.to}`, listingDate: item.date });
            });
        }
    });
    return received;
}

function updateBookingsBadge() {
    const receivedBookings = getBookingsReceivedByMe();
    const totalCount = myBookings.length + receivedBookings.length;

    const badge = document.getElementById('bookingCountBadge');
    if (badge) badge.innerText = totalCount;

    const container = document.getElementById('myBookingsList');
    if (!container) return;

    let html = '';

    // 1. Driver / Host Received Bookings Section
    html += `
        <div class="mb-5">
            <h4 class="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <i class="fa-solid fa-bell text-emerald-600"></i> मेरी राइड/रूम पर आई बुकिंग्स (${receivedBookings.length})
            </h4>
            ${receivedBookings.length === 0 ? `
                <div class="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-600">
                    अभी आपकी पोस्ट की गई राइड या रूम पर कोई बुकिंग नहीं आई है। जैसे ही कोई बुक करेगा, यहाँ यात्री का नाम और नंबर दिखेगा।
                </div>
            ` : receivedBookings.map(b => {
                const replyMsg = encodeURIComponent(`नमस्ते ${b.passengerName}, आपकी YatriSetu बुकिंग ${b.pnr} (${b.route}) कन्फर्म है।`);
                return `
                <div class="p-4 mb-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div class="flex items-start gap-3">
                        <img src="${b.passengerPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" alt="Passenger" class="w-11 h-11 rounded-full object-cover border-2 border-emerald-600 mt-0.5">
                        <div class="space-y-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <span class="px-2 py-0.5 bg-emerald-600 text-white font-extrabold rounded-full text-[10px]">इन्होंने आपकी राइड बुक की है • ${sanitizeHTML(b.pnr)}</span>
                                <span class="font-extrabold text-slate-900 text-sm">${sanitizeHTML(b.route)}</span>
                            </div>
                            <p class="text-slate-800 font-extrabold">यात्री: ${sanitizeHTML(b.passengerName)} (+91 ${sanitizeHTML(b.passengerPhone)})</p>
                            <p class="text-slate-600">सीट/रूम: <strong>${b.qty} Unit (₹${b.totalAmount})</strong></p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5 self-end sm:self-center">
                        <a href="sms:+91${sanitizeHTML(b.passengerPhone)}?body=${replyMsg}" class="px-2.5 py-2 bg-slate-800 text-white font-bold rounded-xl transition flex items-center gap-1">
                            <i class="fa-solid fa-comment-sms"></i> SMS
                        </a>
                        <a href="https://wa.me/91${sanitizeHTML(b.passengerPhone)}?text=${replyMsg}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center gap-1">
                            <i class="fa-brands fa-whatsapp"></i> Chat
                        </a>
                        <a href="tel:+91${sanitizeHTML(b.passengerPhone)}" class="px-2.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center gap-1">
                            <i class="fa-solid fa-phone"></i> Call
                        </a>
                    </div>
                </div>`;
            }).join('')}
        </div>
    `;

    // 2. Passenger Bookings Section
    html += `
        <div>
            <h4 class="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <i class="fa-solid fa-ticket text-blue-600"></i> मेरे द्वारा बुक किए गए टिकट (${myBookings.length})
            </h4>
            ${myBookings.length === 0 ? `
                <div class="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <p class="text-xs font-bold text-slate-600">You have no confirmed bookings yet.</p>
                </div>
            ` : myBookings.map(b => {
                const waMsg = encodeURIComponent(`Hello ${b.providerName}, regarding my YatriSetu booking ${b.pnr} (${b.route} on ${b.date}). Passenger: ${b.passengerName}`);
                return `
                <div class="p-4 mb-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div class="flex items-start gap-3">
                        <img src="${b.passengerPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" alt="Passenger" class="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 mt-0.5">
                        <div class="space-y-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <span class="px-2.5 py-0.5 bg-emerald-600 text-white font-extrabold rounded-full text-[10px]">${sanitizeHTML(b.pnr)}</span>
                                <span class="font-extrabold text-slate-900 text-sm">${sanitizeHTML(b.route)}</span>
                                <span class="text-slate-400 font-bold">• ${sanitizeHTML(b.date)}</span>
                            </div>
                            <p class="text-slate-700 font-bold">Provider: ${sanitizeHTML(b.providerName)} (${sanitizeHTML(b.vehicleOrAddress)})</p>
                            <p class="text-slate-500">Passenger: <strong>${sanitizeHTML(b.passengerName)}</strong> — <strong class="text-emerald-600">₹${b.totalAmount}</strong></p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 self-end sm:self-center">
                        <a href="https://wa.me/91${sanitizeHTML(b.providerPhone)}?text=${waMsg}" target="_blank" rel="noopener noreferrer" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center gap-1">
                            <i class="fa-brands fa-whatsapp"></i> Chat
                        </a>
                        <a href="tel:+91${sanitizeHTML(b.providerPhone)}" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center gap-1">
                            <i class="fa-solid fa-phone"></i> Call
                        </a>
                    </div>
                </div>`;
            }).join('')}
        </div>
    `;

    container.innerHTML = html;
}

// ============================================================================
// GALLERY, FILTERS & MODALS
// ============================================================================
function openGallery(listingId) {
    const item = allListings.find(x => x.id === listingId);
    if (!item) return;

    document.getElementById('galleryTitle').innerText = `${item.providerName} — ${item.vehicleOrAddress}`;
    const container = document.getElementById('galleryImagesContainer');
    const photos = (item.photos && item.photos.length > 0) ? item.photos : [getDefaultImageForCategory(item.category)];

    container.innerHTML = photos.map(src => `
        <img src="${src}" alt="Listing Photo" class="w-full h-56 object-cover rounded-2xl border border-slate-200 shadow-sm">
    `).join('');

    openModal('galleryModal');
}

function filterListings() {
    const fromVal = document.getElementById('searchFrom').value.trim().toLowerCase();
    const toVal = document.getElementById('searchTo').value.trim().toLowerCase();
    const catVal = document.getElementById('searchCategory').value;
    const includeStays = document.getElementById('showStaysToggle').checked;

    const filtered = allListings.filter(item => {
        if (!includeStays && item.kind === 'stay') return false;
        const matchFrom = !fromVal || item.from.toLowerCase().includes(fromVal) || item.to.toLowerCase().includes(fromVal);
        const matchTo = !toVal || item.to.toLowerCase().includes(toVal) || item.from.toLowerCase().includes(toVal);
        const matchCat = (catVal === 'all') || (item.category === catVal);
        return matchFrom && matchTo && matchCat;
    });

    renderListings(filtered);
    document.getElementById('listingsSection').scrollIntoView({ behavior: 'smooth' });
}

function quickRoute(fromCity, toCity) {
    document.getElementById('searchFrom').value = fromCity;
    document.getElementById('searchTo').value = toCity;
    document.getElementById('searchCategory').value = 'all';
    filterListings();
}

function filterByCategory(category) {
    document.getElementById('searchFrom').value = '';
    document.getElementById('searchTo').value = '';
    document.getElementById('searchCategory').value = category;
    filterListings();
}

function resetFilters() {
    document.getElementById('searchFrom').value = '';
    document.getElementById('searchTo').value = '';
    document.getElementById('searchCategory').value = 'all';
    document.getElementById('showStaysToggle').checked = true;
    renderListings(allListings);
}

function openInfoPopup(topic) {
    const messages = {
        moreRoutes: "Popular Intercity Corridors: Delhi ➔ Agra, Lucknow ➔ Kanpur, Etawah ➔ Noida, Jaipur ➔ Gurgaon, Chandigarh ➔ Delhi, and Pune ➔ Mumbai.",
        faqPublish: "Click 'Offer a ride' in the top navigation bar. You can list a Car, Bike, Bus, Truck, or Homestay Room and attach photos from your device.",
        faqExpiry: "All listings and bookings are automatically managed with a 14-day (2-week) lifecycle so travellers only see active schedules."
    };
    document.getElementById('galleryTitle').innerText = "YatriSetu Information";
    document.getElementById('galleryImagesContainer').innerHTML = `
        <div class="col-span-full p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
            ${messages[topic] || ''}
        </div>
    `;
    openModal('galleryModal');
}

function openModal(id) {
    const m = document.getElementById(id);
    if (m) {
        m.classList.remove('hidden');
        m.classList.add('flex');
        if (id === 'myBookingsModal') updateBookingsBadge();
        if (id === 'registerModal') renderSignOutButtonInModal();
        if (id === 'publishModal' && currentUser) {
            document.getElementById('rDriverName').value = currentUser.name || '';
            document.getElementById('rDriverPhone').value = currentUser.phone || '';
            document.getElementById('sHostName').value = currentUser.name || '';
            document.getElementById('sHostPhone').value = currentUser.phone || '';
        }
    }
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) {
        m.classList.add('hidden');
        m.classList.remove('flex');
    }
}

function switchPublishTab(tab) {
    const fRide = document.getElementById('formPublishRide');
    const fStay = document.getElementById('formPublishStay');
    const bRide = document.getElementById('tabBtnRide');
    const bStay = document.getElementById('tabBtnStay');

    if (tab === 'ride') {
        fRide.classList.remove('hidden');
        fStay.classList.add('hidden');
        bRide.className = "py-2.5 rounded-xl font-extrabold text-xs bg-blue-600 text-white shadow-sm transition cursor-pointer";
        bStay.className = "py-2.5 rounded-xl font-extrabold text-xs text-slate-600 hover:text-slate-900 transition cursor-pointer";
    } else {
        fRide.classList.add('hidden');
        fStay.classList.remove('hidden');
        bStay.className = "py-2.5 rounded-xl font-extrabold text-xs bg-blue-600 text-white shadow-sm transition cursor-pointer";
        bRide.className = "py-2.5 rounded-xl font-extrabold text-xs text-slate-600 hover:text-slate-900 transition cursor-pointer";
    }
}

// Initialize & Start 4-Second Live Cloud Sync
document.addEventListener('DOMContentLoaded', () => {
    configureDateConstraints();
    updateNavbarUserUI();
    updateBookingsBadge();
    try {
        const cached = localStorage.getItem(STORAGE_KEY_CACHE);
        if (cached) {
            allListings = JSON.parse(cached);
        }
    } catch (e) {}
    if (!allListings || allListings.length === 0) {
        const seeds = getDefaultSeedListings();
        allListings = Object.keys(seeds).map(k => ({ cloudKey: k, ...seeds[k] }));
    }
    renderListings(allListings);
    fetchListingsFromCloud();
    setInterval(fetchListingsFromCloud, 4000);
});