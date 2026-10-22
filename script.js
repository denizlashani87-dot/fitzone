// FitZone — bilingual interactions and trainer profiles

const langBtn = document.getElementById("langBtn");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

let currentLanguage = "fa";

function changeLanguage(language) {
    currentLanguage = language;

    const isEnglish = language === "en";

    document.documentElement.lang = language;
    document.documentElement.dir = isEnglish ? "ltr" : "rtl";
    document.body.classList.toggle("en", isEnglish);

    document.querySelectorAll("[data-fa][data-en]").forEach(element => {
        element.innerHTML = isEnglish
            ? element.dataset.en
            : element.dataset.fa;
    });

    document.querySelectorAll(
        "[data-placeholder-fa][data-placeholder-en]"
    ).forEach(element => {
        element.placeholder = isEnglish
            ? element.dataset.placeholderEn
            : element.dataset.placeholderFa;
    });

    if (langBtn) {
        langBtn.textContent = isEnglish ? "FA" : "EN";
    }

    document.title = isEnglish
        ? "FitZone | Fitness Club"
        : "FitZone | باشگاه تناسب اندام";

    if (nav) {
        nav.classList.remove("open");
    }

    if (activeTrainerCard) {
        fillTrainerProfile(activeTrainerCard, activeTrainerIndex);
    }
}

// Change language
if (langBtn) {
    langBtn.addEventListener("click", () => {
        changeLanguage(currentLanguage === "fa" ? "en" : "fa");
    });
}

// Mobile menu
if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
        nav.classList.toggle("open");

        menuBtn.setAttribute(
            "aria-expanded",
            nav.classList.contains("open") ? "true" : "false"
        );
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            menuBtn.setAttribute("aria-expanded", "false");
        });
    });
}

// Automatic footer year
const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}

// Contact form demonstration
if (contactForm) {
    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const contact = document.getElementById("email").value.trim();

        if (!name || !contact) {
            formMessage.textContent = currentLanguage === "fa"
                ? "لطفاً نام و راه ارتباطی خود را وارد کنید."
                : "Please enter your name and contact details.";

            return;
        }

        formMessage.textContent = currentLanguage === "fa"
            ? "اطلاعات وارد شد؛ برای دریافت واقعی درخواست‌ها باید فرم به سرور یا سرویس ایمیل متصل شود."
            : "Details entered. Connect this form to a server or email service to receive submissions.";

        formMessage.style.color = "#5d812a";
    });
}

// Trainer profile modal
const trainerModal = document.getElementById("trainerModal");
const trainerModalOverlay = document.getElementById("trainerModalOverlay");
const closeTrainerModal = document.getElementById("closeTrainerModal");
const trainerContactBtn = document.getElementById("trainerContactBtn");

let activeTrainerCard = null;
let activeTrainerIndex = -1;

// Sample trainer information
const trainerProfiles = [
    {
        roleFa: "مربی قدرت و عضله‌سازی",
        roleEn: "Strength & Muscle Coach",

        expFa: "۸ سال تجربه",
        expEn: "8 years of experience",

        scheduleFa: "شنبه تا چهارشنبه · نمونه",
        scheduleEn: "Sat–Wed · Sample",

        bioFa: "تمرکز بر تمرینات قدرتی، بهبود تکنیک حرکات و طراحی برنامه متناسب با سطح ورزشکار.",
        bioEn: "Focused on strength training, exercise technique, and training plans tailored to each athlete's level.",

        planFa: "تمرین قدرتی بالاتنه، حرکات ترکیبی و زمان کافی برای ریکاوری.",
        planEn: "Upper-body strength work, compound movements, and adequate recovery time."
    },

    {
        roleFa: "مربی تناسب اندام",
        roleEn: "Fitness Coach",

        expFa: "۶ سال تجربه",
        expEn: "6 years of experience",

        scheduleFa: "یکشنبه تا پنجشنبه · نمونه",
        scheduleEn: "Sun–Thu · Sample",

        bioFa: "تمرکز بر تناسب اندام عمومی، ایجاد عادت‌های سالم و طراحی تمرین متناسب با اهداف ورزشی.",
        bioEn: "Focused on general fitness, healthy habits, and exercise plans tailored to fitness goals.",

        planFa: "تمرین تمام‌بدن، فعالیت هوازی متعادل و روزهای استراحت برنامه‌ریزی‌شده.",
        planEn: "Full-body training, moderate cardio, and planned recovery days."
    },

    {
        roleFa: "مربی تمرینات عملکردی",
        roleEn: "Functional Training Coach",

        expFa: "۱۰ سال تجربه",
        expEn: "10 years of experience",

        scheduleFa: "شنبه تا سه‌شنبه · نمونه",
        scheduleEn: "Sat–Tue · Sample",

        bioFa: "تمرکز بر قدرت عملکردی، تعادل، تحرک و بهبود کیفیت اجرای حرکات ورزشی.",
        bioEn: "Focused on functional strength, balance, mobility, and better movement quality.",

        planFa: "تمرین‌های تعادلی، حرکات عملکردی و تمرین کنترل‌شده با وزن بدن.",
        planEn: "Balance drills, functional movements, and controlled bodyweight exercises."
    }
];

// Fill the selected trainer's profile
function fillTrainerProfile(card, index) {
    const profile = trainerProfiles[index];

    if (!profile || !card) {
        return;
    }

    const english = currentLanguage === "en";
    const title = card.querySelector("h3");
    const image = card.querySelector("img");

    document.getElementById("modalTrainerName").textContent =
        title ? title.textContent.trim() : "FitZone Trainer";

    document.getElementById("modalTrainerRole").textContent =
        english ? profile.roleEn : profile.roleFa;

    document.getElementById("modalTrainerBio").textContent =
        english ? profile.bioEn : profile.bioFa;

    document.getElementById("modalTrainerExperience").textContent =
        english ? profile.expEn : profile.expFa;

    document.getElementById("modalTrainerSchedule").textContent =
        english ? profile.scheduleEn : profile.scheduleFa;

    document.getElementById("modalTrainerPlan").textContent =
        english ? profile.planEn : profile.planFa;

    if (image) {
        document.getElementById("modalTrainerImage").src = image.src;

        document.getElementById("modalTrainerImage").alt =
            title ? title.textContent.trim() : "Trainer";
    }
}

// Open trainer profile
function openTrainerProfile(card, index) {
    if (!trainerModal || !trainerProfiles[index]) {
        return;
    }

    activeTrainerCard = card;
    activeTrainerIndex = index;

    fillTrainerProfile(card, index);

    trainerModal.classList.add("active");
    trainerModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (closeTrainerModal) {
        closeTrainerModal.focus();
    }
}

// Close trainer profile
function hideTrainerProfile() {
    if (!trainerModal) {
        return;
    }

    trainerModal.classList.remove("active");
    trainerModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (activeTrainerCard) {
        activeTrainerCard.focus();
    }
}

// Make trainer cards clickable
document.querySelectorAll(".trainer-card").forEach((card, index) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    card.setAttribute(
        "aria-label",
        currentLanguage === "fa"
            ? "نمایش پروفایل مربی"
            : "View trainer profile"
    );

    card.addEventListener("click", () => {
        openTrainerProfile(card, index);
    });

    card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openTrainerProfile(card, index);
        }
    });
});

// Close button
if (closeTrainerModal) {
    closeTrainerModal.addEventListener("click", hideTrainerProfile);
}

// Close when clicking the dark background
if (trainerModalOverlay) {
    trainerModalOverlay.addEventListener("click", hideTrainerProfile);
}

// Close with Escape key
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        hideTrainerProfile();
    }
});

// Consultation button
if (trainerContactBtn) {
    trainerContactBtn.addEventListener("click", hideTrainerProfile);
}

// Start the website in Persian
changeLanguage("fa");
