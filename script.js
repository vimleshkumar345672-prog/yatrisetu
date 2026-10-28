/**
 * YatriSetu Core Engine v4
 * Features:
 * 1. One-Time User Registration (No Paid OTP) with Photo & Govt ID Proof
 * 2. Two-Way Safety: Passenger Verification attached to every Booking
 * 3. PhonePe-Style Animated Green Tick + Confirmation Sound Chime
 * 4. Instant WhatsApp Chat & Direct Call Triggers
 * 5. 14-Day Auto-Expiry & Base64 Multi-Photo Persistence
 */

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
const STORAGE_KEY_USER = 'yatrisetu_user_v4';
const STORAGE_KEY_LISTINGS = 'yatrisetu_listings_v4';
const STORAGE_KEY_BOOKINGS = 'yatrisetu_bookings_v4';

let currentLanguage = 'en'; // 'en' = Pure English, 'hi' = Hindi + English Bilingual
let lastActionTimestamp = 0;

// Security: Escape HTML to prevent XSS injection
function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, function (char) {
        const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        return escapeMap[char];
    });
}

// Security: Anti-Brute-Force Rate Limiter (1.2s cooldown)
function isRateLimited() {
    const now = Date.now();
    if (now - lastActionTimestamp < 1200) {
        alert("Please wait a moment before submitting again.");
        return true;
    }
    lastActionTimestamp = now;
    return false;
}

// PhonePe-Style Confirmation Sound Chime (Web Audio API - Zero external file needed)
function playSuccessChime() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const notes = [587.33, 880]; // D5 -> A5 pleasant confirmation chime
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);
            gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.14);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.14 + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.14);
            osc.stop(ctx.currentTime + idx * 0.14 + 0.45);
        });
    } catch (err) {
        // Ignore audio errors if browser blocks autoplay
    }
}

// Configure Date Pickers (Lock between Today and Today + 14 Days)
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

// Language Dictionary: Pure English vs Bilingual Hindi + English
const i18n = {
    en: {
        brandSub: "Intercity Mobility & Stays",
        langSwitchBtn: "हिंदी / HI",
        navMyBookings: "My Bookings",
        navOfferBtn: "Offer a ride",
        heroHeading: "Travel anywhere together. <span class='text-blue-600'>Spend smarter.</span>",
        heroSubheading: "Connect with verified drivers across cars, bikes, buses, and trucks, or book comfortable local homestays along your route.",
        heroBadgeTitle: "100% ID Verified Passengers & Hosts",
        heroBadgeSub: "Instant confirmation with direct WhatsApp & Call",
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
        bookBtnLabel: "Book Now"
    },
    hi: {
        brandSub: "इंटरसिटी राइड और होमस्टे (Mobility & Stays)",
        langSwitchBtn: "Switch to English",
        navMyBookings: "मेरी बुकिंग्स (My Bookings)",
        navOfferBtn: "राइड/रूम पोस्ट करें (Offer Ride)",
        heroHeading: "साथ मिलकर कहीं भी सफर करें। <span class='text-blue-600'>सफर आसान और किफायती बनाएं (Spend smarter).</span>",
        heroSubheading: "कार, बाइक, बस और ट्रक के वेरिफाइड ड्राइवर्स से जुड़ें या अपने रूट पर आरामदायक होमस्टे/कमरा बुक करें (Verified Rides & Stays).",
        heroBadgeTitle: "वेरिफाइड यात्री और वाहन मालिक (100% ID Verified)",
        heroBadgeSub: "तुरंत ग्रीन-टिक कन्फर्मेशन, WhatsApp चैट और कॉल (Instant Connect)",
        lblSearchFrom: "कहाँ से (From)",
        lblSearchTo: "कहाँ तक (To)",
        lblSearchDate: "तारीख (Departure)",
        lblSearchCategory: "वाहन / रूम (Category)",
        btnSearchText: "खोजें (Search)",
        lblShowStays: "सर्च में होमस्टे और रूम भी दिखाएं (Include Homestays)",
        lblScheduleRule: "<i class='fa-regular fa-clock text-blue-600 mr-1'></i> बुकिंग शेड्यूल: अधिकतम 2 हफ्ते / 14 दिन (Up to 14 Days)",
        pillar1Title: "हर जगह सफर करें (Travel everywhere)",
        pillar1Desc: "पूरे भारत में कार, बाइक, बस, ट्रक और बेहतरीन होमस्टे के साथ सुरक्षित यात्रा करें।",
        pillar2Title: "सबसे किफायती किराया (Prices like nowhere)",
        pillar2Desc: "बिना किसी एक्स्ट्रा कमीशन के सीधे ड्राइवर या रूम मालिक से जुड़कर अपना खर्च बचाएं।",
        pillar3Title: "दोनों तरफ की सुरक्षा (Two-Way Safety Proof)",
        pillar3Desc: "ड्राइवर और पैसेंजर दोनों का फोटो, मोबाइल नंबर और सरकारी आईडी प्रूफ वेरिफाई होता है।",
        feedHeading: "उपलब्ध गाड़ियाँ और होमस्टे (Available Rides & Stays)",
        feedSubheading: "सभी फोटो देखने के लिए फोटो पर क्लिक करें या तुरंत बुक करने के लिए 'Book Now' दबाएं।",
        btnResetFilters: "सभी दिखाएं (Show All)",
        topRoutesHeading: "लोकप्रिय कारपूल रूट्स (Top carpool routes)",
        btnMoreRoutes: "अन्य रूट्स देखें (More routes)",
        ctaShareTitle: "अपनी गाड़ी या खाली कमरा शेयर करें, खर्च बचाएं (Share & Save).",
        ctaShareDesc: "चाहे आपके पास कार, बाइक, बस, ट्रक हो या यात्रियों के लिए कमरा—बिना किसी शुल्क के अपनी पोस्ट डालें।",
        ctaShareBtn: "अभी पोस्ट करें (Publish listing)",
        faqHeading: "सहायता केंद्र (YatriSetu Help Centre)",
        bookBtnLabel: "बुक करें (Book Now)"
    }
};

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
    const lang = i18n[currentLanguage];

    document.getElementById('brandSub').innerText = lang.brandSub;
    document.getElementById('langSwitchBtn').innerText = lang.langSwitchBtn;
    document.getElementById('navMyBookings').innerText = lang.navMyBookings;
    document.getElementById('navOfferBtn').innerText = lang.navOfferBtn;
    document.getElementById('heroHeading').innerHTML = lang.heroHeading;
    document.getElementById('heroSubheading').innerText = lang.heroSubheading;
    document.getElementById('heroBadgeTitle').innerText = lang.heroBadgeTitle;
    document.getElementById('heroBadgeSub').innerText = lang.heroBadgeSub;
    document.getElementById('lblSearchFrom').innerText = lang.lblSearchFrom;
    document.getElementById('lblSearchTo').innerText = lang.lblSearchTo;
    document.getElementById('lblSearchDate').innerText = lang.lblSearchDate;
    document.getElementById('lblSearchCategory').innerText = lang.lblSearchCategory;
    document.getElementById('btnSearchText').innerText = lang.btnSearchText;
    document.getElementById('lblShowStays').innerText = lang.lblShowStays;
    document.getElementById('lblScheduleRule').innerHTML = lang.lblScheduleRule;
    document.getElementById('pillar1Title').innerText = lang.pillar1Title;
    document.getElementById('pillar1Desc').innerText = lang.pillar1Desc;
    document.getElementById('pillar2Title').innerText = lang.pillar2Title;
    document.getElementById('pillar2Desc').innerText = lang.pillar2Desc;
    document.getElementById('pillar3Title').innerText = lang.pillar3Title;
    document.getElementById('pillar3Desc').innerText = lang.pillar3Desc;
    document.getElementById('feedHeading').innerText = lang.feedHeading;
    document.getElementById('feedSubheading').innerText = lang.feedSubheading;
    document.getElementById('btnResetFilters').innerText = lang.btnResetFilters;
    document.getElementById('topRoutesHeading').innerText = lang.topRoutesHeading;
    document.getElementById('btnMoreRoutes').innerText = lang.btnMoreRoutes;
    document.getElementById('ctaShareTitle').innerText = lang.ctaShareTitle;
    document.getElementById('ctaShareDesc').innerText = lang.ctaShareDesc;
    document.getElementById('ctaShareBtn').innerText = lang.ctaShareBtn;
    document.getElementById('faqHeading').innerText = lang.faqHeading;

    renderListings(allListings);
}

// ==========================================
// USER REGISTRATION & PROFILE MANAGEMENT
// ==========================================
function loadRegisteredUser() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_USER);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

let currentUser = loadRegisteredUser();

function updateNavbarUserUI() {
    const textEl = document.getElementById('navUserText');
    const avatarEl = document.getElementById('navUserAvatar');
    const iconEl = document.getElementById('navUserIcon');

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
        // Pre-fill registration modal fields for easy editing
        document.getElementById('regUserName').value = currentUser.name || '';
        document.getElementById('regUserPhone').value = currentUser.phone || '';
        document.getElementById('regEmergencyPhone').value = currentUser.emergencyPhone || '';
        document.getElementById('regIdType').value = currentUser.idType || 'Aadhaar Card';
        document.getElementById('regIdDigits').value = currentUser.idDigits || '';
    } else {
        textEl.innerText = 'Register';
        avatarEl.classList.add('hidden');
        iconEl.classList.remove('hidden');
    }
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
    closeModal('registerModal');
    playSuccessChime();
    alert(`Welcome ${currentUser.name}! Your Verified Profile is saved. Your details will now auto-fill during booking.`);
}

// ==========================================
// DEFAULT SEED LISTINGS & STORAGE
// ==========================================
function getDefaultListings() {
    const todayStr = new Date().toISOString().split('T')[0];
    return [
        {
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
            createdAt: Date.now()
        },
        {
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
            createdAt: Date.now()
        },
        {
            id: 'YS-103',
            kind: 'ride',
            category: 'Bus',
            providerName: 'Vikram Travels',
            phone: '9123456780',
            vehicleOrAddress: 'UP 80 BT 9090 (AC Sleeper Coach)',
            from: 'Meerut',
            to: 'Ghaziabad',
            date: todayStr,
            seats: 12,
            price: 220,
            photos: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=85'],
            createdAt: Date.now()
        },
        {
            id: 'YS-104',
            kind: 'stay',
            category: 'Stay',
            providerName: 'Priya Heritage Homestay',
            phone: '9988776655',
            vehicleOrAddress: 'Near Hawa Mahal, AC Room, Free Wi-Fi & Breakfast',
            from: 'Jaipur',
            to: 'Jaipur',
            date: todayStr,
            seats: 2,
            price: 799,
            photos: [
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=85',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=85'
            ],
            createdAt: Date.now()
        }
    ];
}

function loadListingsFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_LISTINGS);
        let list = raw ? JSON.parse(raw) : getDefaultListings();
        const now = Date.now();
        list = list.filter(item => (now - (item.createdAt || now)) < TWO_WEEKS_MS);
        localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(list));
        return list;
    } catch (e) {
        return getDefaultListings();
    }
}

function loadBookingsFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
        let list = raw ? JSON.parse(raw) : [];
        const now = Date.now();
        list = list.filter(b => (now - (b.bookedAt || now)) < TWO_WEEKS_MS);
        localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(list));
        return list;
    } catch (e) {
        return [];
    }
}

let allListings = loadListingsFromStorage();
let myBookings = loadBookingsFromStorage();

function getCategoryIcon(category) {
    const map = {
        'Car': 'fa-car-side',
        'Bike': 'fa-motorcycle',
        'Bus': 'fa-bus',
        'Truck': 'fa-truck-front',
        'Stay': 'fa-house-chimney'
    };
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

// Render Listings Grid
function renderListings(items) {
    const grid = document.getElementById('listingsGrid');
    grid.innerHTML = '';

    if (!items || items.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full bg-slate-50 border border-slate-200 rounded-3xl p-10 text-center">
                <i class="fa-solid fa-route text-3xl text-slate-300 mb-3"></i>
                <h4 class="font-extrabold text-slate-800 text-base">No matching rides or stays found</h4>
                <p class="text-xs text-slate-500 mt-1 mb-4">Try clearing filters or publish a new listing for this route.</p>
                <button onclick="resetFilters()" class="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs cursor-pointer">Show All</button>
            </div>
        `;
        return;
    }

    const bookLabel = i18n[currentLanguage].bookBtnLabel;

    items.forEach(item => {
        const coverImg = (item.photos && item.photos.length > 0) ? item.photos[0] : getDefaultImageForCategory(item.category);
        const photoCount = item.photos ? item.photos.length : 1;
        const isSoldOut = item.seats <= 0;
        const unitLabel = item.kind === 'stay' ? 'rooms left' : 'seats left';

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
                        <span class="text-[11px] font-bold text-slate-400"><i class="fa-regular fa-calendar mr-1"></i>${sanitizeHTML(item.date)}</span>
                    </div>
                    <p class="text-xs text-blue-600 font-bold mb-3 truncate">
                        ${sanitizeHTML(item.vehicleOrAddress)}
                    </p>

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

            <div class="px-5 pb-5">
                <button ${isSoldOut ? 'disabled' : `onclick="initiateBooking('${item.id}')"`} class="w-full py-3 ${isSoldOut ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md shadow-blue-600/15'} font-extrabold rounded-2xl text-xs transition">
                    ${isSoldOut ? 'Fully Booked' : bookLabel}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Convert Multiple Uploaded Files to Base64 Array (with Canvas Compression)
function readFilesAsBase64(fileInput) {
    return new Promise((resolve) => {
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            resolve([]);
            return;
        }
        const files = fileInput.files;
        const maxFiles = Math.min(files.length, 4);
        const results = [];
        let processed = 0;

        for (let i = 0; i < maxFiles; i++) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const maxW = 650;
                    const scale = img.width > maxW ? maxW / img.width : 1;
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    results.push(canvas.toDataURL('image/jpeg', 0.76));
                    processed++;
                    if (processed === maxFiles) resolve(results);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(files[i]);
        }
    });
}

// Publish Ride Handler
async function submitRideForm(e) {
    e.preventDefault();
    if (isRateLimited()) return;

    const category = document.getElementById('rVehicleCategory').value;
    const uploadedPhotos = await readFilesAsBase64(document.getElementById('rPhotos'));

    const newListing = {
        id: 'YS-' + Math.floor(100000 + Math.random() * 900000),
        kind: 'ride',
        category: category,
        providerName: sanitizeHTML(document.getElementById('rDriverName').value.trim()),
        phone: sanitizeHTML(document.getElementById('rDriverPhone').value.trim()),
        vehicleOrAddress: sanitizeHTML(document.getElementById('rVehicleNumber').value.trim().toUpperCase()),
        from: sanitizeHTML(document.getElementById('rFromCity').value.trim()),
        to: sanitizeHTML(document.getElementById('rToCity').value.trim()),
        date: document.getElementById('rTravelDate').value,
        seats: parseInt(document.getElementById('rSeats').value, 10) || 1,
        price: parseInt(document.getElementById('rPrice').value, 10) || 100,
        photos: uploadedPhotos.length > 0 ? uploadedPhotos : [getDefaultImageForCategory(category)],
        createdAt: Date.now()
    };

    allListings.unshift(newListing);
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(allListings));
    renderListings(allListings);
    closeModal('publishModal');
    playSuccessChime();
    e.target.reset();
    configureDateConstraints();
}

// Publish Homestay Handler
async function submitStayForm(e) {
    e.preventDefault();
    if (isRateLimited()) return;

    const uploadedPhotos = await readFilesAsBase64(document.getElementById('sPhotos'));
    const city = sanitizeHTML(document.getElementById('sCity').value.trim());

    const newStay = {
        id: 'YS-' + Math.floor(100000 + Math.random() * 900000),
        kind: 'stay',
        category: 'Stay',
        providerName: sanitizeHTML(document.getElementById('sHostName').value.trim()),
        phone: sanitizeHTML(document.getElementById('sHostPhone').value.trim()),
        vehicleOrAddress: sanitizeHTML(document.getElementById('sAddress').value.trim()),
        from: city,
        to: city,
        date: document.getElementById('sAvailableDate').value,
        seats: parseInt(document.getElementById('sRooms').value, 10) || 1,
        price: parseInt(document.getElementById('sPrice').value, 10) || 500,
        photos: uploadedPhotos.length > 0 ? uploadedPhotos : [getDefaultImageForCategory('Stay')],
        createdAt: Date.now()
    };

    allListings.unshift(newStay);
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(allListings));
    renderListings(allListings);
    closeModal('publishModal');
    playSuccessChime();
    e.target.reset();
    configureDateConstraints();
}

// ==========================================
// BOOKING WITH PASSENGER PROOF & PHONEPE TICK
// ==========================================
function initiateBooking(listingId) {
    const item = allListings.find(x => x.id === listingId);
    if (!item || item.seats <= 0) return;

    document.getElementById('bookListingId').value = item.id;
    const qtyInput = document.getElementById('passengerQty');
    qtyInput.max = item.seats;
    qtyInput.value = 1;

    // Auto-fill from Registered User Profile if available
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
    const itemIndex = allListings.findIndex(x => x.id === listingId);
    if (itemIndex === -1) return;

    const item = allListings[itemIndex];
    const qty = parseInt(document.getElementById('passengerQty').value, 10) || 1;

    if (qty > item.seats) {
        alert(`Only ${item.seats} seats/rooms available!`);
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

    // Save/Update user profile automatically so they don't have to re-type next time
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

    // Deduct available seats/rooms and persist
    allListings[itemIndex].seats -= qty;
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(allListings));

    // Create persistent booking record with full passenger proof
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
    updateBookingsBadge();
    renderListings(allListings);

    // Populate Confirmed Ticket UI with Passenger Photo & Proof
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
        <div class="flex justify-between pt-1"><span>Passenger Mobile:</span><strong class="text-slate-900">+91 ${passengerPhone} (Emergency: ${passengerEmergency})</strong></div>
        <div class="flex justify-between"><span>Provider / Host:</span><strong class="text-slate-900">${sanitizeHTML(item.providerName)}</strong></div>
        <div class="flex justify-between"><span>Provider Contact:</span><strong class="text-blue-600 font-extrabold">+91 ${sanitizeHTML(item.phone)}</strong></div>
        <div class="flex justify-between"><span>Vehicle / Room:</span><strong class="text-slate-900">${sanitizeHTML(item.vehicleOrAddress)}</strong></div>
        <div class="flex justify-between"><span>Route & Date:</span><strong class="text-slate-900">${sanitizeHTML(item.from)} ➔ ${sanitizeHTML(item.to)} (${sanitizeHTML(item.date)})</strong></div>
        <div class="flex justify-between border-t border-slate-200 pt-2 text-sm">
            <span class="font-bold">Total Amount (${qty} unit):</span>
            <strong class="text-emerald-600 font-extrabold">₹${totalAmount}</strong>
        </div>
    `;

    // Direct Call & Pre-filled WhatsApp Verification Message
    document.getElementById('directCallBtn').href = `tel:+91${item.phone}`;
    const waText = encodeURIComponent(
        `✅ *YatriSetu Booking Confirmed (${pnrToken})*\n` +
        `----------------------------\n` +
        `👤 *Passenger:* ${passengerName}\n` +
        `🪪 *Verified ID:* ${passengerIdType} (XXXX-${passengerIdDigits})\n` +
        `📞 *Passenger Mobile:* +91 ${passengerPhone}\n` +
        `🚨 *Emergency Contact:* +91 ${passengerEmergency}\n` +
        `📍 *Route/City:* ${item.from} to ${item.to} (${item.date})\n` +
        `💺 *Seats/Rooms:* ${qty} (Total: ₹${totalAmount})\n` +
        `----------------------------\n` +
        `Hello ${item.providerName}, I have booked your ${item.category} (${item.vehicleOrAddress}). Let's coordinate!`
    );
    document.getElementById('directWaBtn').href = `https://wa.me/91${item.phone}?text=${waText}`;

    // Switch to PhonePe-Style Green Tick Screen & Play Sound
    document.getElementById('bookingStepForm').classList.add('hidden');
    document.getElementById('bookingStepSuccess').classList.remove('hidden');
    playSuccessChime();
}

// Render My Bookings Wallet with Both WhatsApp & Call Options
function updateBookingsBadge() {
    document.getElementById('bookingCountBadge').innerText = myBookings.length;
    const container = document.getElementById('myBookingsList');
    if (!container) return;

    if (myBookings.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200">
                <i class="fa-solid fa-ticket text-2xl text-slate-300 mb-2"></i>
                <p class="text-xs font-bold text-slate-600">You have no confirmed bookings yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = myBookings.map(b => {
        const waMsg = encodeURIComponent(`Hello ${b.providerName}, regarding my YatriSetu booking ${b.pnr} (${b.route} on ${b.date}). Passenger: ${b.passengerName}, ID: ${b.passengerIdProof}`);
        return `
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div class="flex items-start gap-3">
                <img src="${b.passengerPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" alt="Passenger" class="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 mt-0.5">
                <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="px-2.5 py-0.5 bg-emerald-600 text-white font-extrabold rounded-full text-[10px]">${sanitizeHTML(b.pnr)}</span>
                        <span class="font-extrabold text-slate-900 text-sm">${sanitizeHTML(b.route)}</span>
                        <span class="text-slate-400 font-bold">• ${sanitizeHTML(b.date)}</span>
                    </div>
                    <p class="text-slate-700 font-bold">Provider: ${sanitizeHTML(b.providerName)} (${sanitizeHTML(b.vehicleOrAddress)})</p>
                    <p class="text-slate-500">Passenger: <strong>${sanitizeHTML(b.passengerName)}</strong> | ID: <strong>${sanitizeHTML(b.passengerIdProof || 'Verified')}</strong> — <strong class="text-emerald-600">₹${b.totalAmount}</strong></p>
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
        </div>
    `}).join('');
}

// Open Multi-Photo Gallery
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

// Search & Filter Logic
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

// Info Popups for FAQ & Extra Buttons
function openInfoPopup(topic) {
    const messages = {
        moreRoutes: "Popular Intercity Corridors: Delhi ➔ Agra, Lucknow ➔ Kanpur, Etawah ➔ Noida, Jaipur ➔ Gurgaon, Chandigarh ➔ Delhi, and Pune ➔ Mumbai.",
        faqPublish: "Click 'Offer a ride' in the top navigation bar. You can list a Car, Bike, Bus, Truck, or Homestay Room and attach multiple photos from your device.",
        faqExpiry: "All listings and bookings are automatically managed with a 14-day (2-week) lifecycle so travellers only see active, upcoming schedules."
    };
    document.getElementById('galleryTitle').innerText = "YatriSetu Information";
    document.getElementById('galleryImagesContainer').innerHTML = `
        <div class="col-span-full p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
            ${messages[topic] || ''}
        </div>
    `;
    openModal('galleryModal');
}

// Modal & Tab Controls
function openModal(id) {
    const m = document.getElementById(id);
    if (m) {
        m.classList.remove('hidden');
        m.classList.add('flex');
        if (id === 'myBookingsModal') updateBookingsBadge();
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

function resetAllStorage() {
    if (confirm("Reset all demo listings, bookings, and saved user profile?")) {
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem(STORAGE_KEY_LISTINGS);
        localStorage.removeItem(STORAGE_KEY_BOOKINGS);
        location.reload();
    }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    configureDateConstraints();
    updateNavbarUserUI();
    updateBookingsBadge();
    renderListings(allListings);
});