
/* ==========================================
   FitZone — Complete JavaScript
   Bilingual website + Trainers + Calculator
   + Progress Dashboard
========================================== */

// ------------------------------------------
// Main elements
// ------------------------------------------

const langBtn = document.getElementById("langBtn");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

let currentLanguage = "fa";


// ------------------------------------------
// Language system
// ------------------------------------------

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

    if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");
    }

    // Refresh open trainer profile
    if (activeTrainerCard && activeTrainerIndex !== -1) {
        fillTrainerProfile(activeTrainerCard, activeTrainerIndex);
    }

    // Refresh calculator placeholder
    if (
        fitnessResult &&
        fitnessResult.dataset.hasResult !== "true"
    ) {
        showCalculatorPlaceholder();
    }

    // Refresh progress history language
    renderProgressHistory();
}

if (langBtn) {
    langBtn.addEventListener("click", () => {
        changeLanguage(currentLanguage === "fa" ? "en" : "fa");
    });
}


// ------------------------------------------
// Mobile navigation
// ------------------------------------------

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


// ------------------------------------------
// Footer year
// ------------------------------------------

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}


// ==========================================
// Contact form
// ==========================================

if (contactForm) {
    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const nameInput = document.getElementById("name");
        const contactInput = document.getElementById("email");

        const name = nameInput ? nameInput.value.trim() : "";
        const contact = contactInput ? contactInput.value.trim() : "";

        if (!name || !contact) {
            if (formMessage) {
                formMessage.textContent = currentLanguage === "fa"
                    ? "لطفاً نام و راه ارتباطی خود را وارد کنید."
                    : "Please enter your name and contact details.";

                formMessage.style.color = "#c0392b";
            }

            return;
        }

        if (formMessage) {
            formMessage.textContent = currentLanguage === "fa"
                ? "اطلاعات وارد شد. برای دریافت واقعی درخواست‌ها باید فرم به سرویس ارسال اطلاعات متصل شود."
                : "Details entered. Connect this form to a submission service to receive requests.";

            formMessage.style.color = "#8fbd38";
        }

        contactForm.reset();
    });
}


// ==========================================
// Trainer profiles
// ==========================================

const trainerModal = document.getElementById("trainerModal");
const trainerModalOverlay = document.getElementById("trainerModalOverlay");
const closeTrainerModal = document.getElementById("closeTrainerModal");
const trainerContactBtn = document.getElementById("trainerContactBtn");

let activeTrainerCard = null;
let activeTrainerIndex = -1;

const trainerProfiles = [

    {
        roleFa: "مربی قدرت و عضله‌سازی",
        roleEn: "Strength & Muscle Coach",

        expFa: "۸ سال تجربه",
        expEn: "8 years of experience",

        scheduleFa: "شنبه تا چهارشنبه · نمونه",
        scheduleEn: "Sat–Wed · Sample",

        bioFa:
            "تمرکز بر تمرینات قدرتی، بهبود تکنیک حرکات و طراحی برنامه متناسب با سطح ورزشکار.",

        bioEn:
            "Focused on strength training, exercise technique, and training plans tailored to each athlete's level.",

        planFa:
            "تمرین قدرتی بالاتنه، حرکات ترکیبی و زمان کافی برای ریکاوری.",

        planEn:
            "Upper-body strength work, compound movements, and adequate recovery time.",

        nutritionFa:
            "صبحانه: تخم‌مرغ و نان سبوس‌دار. ناهار: مرغ یا ماهی همراه برنج. میان‌وعده: ماست و میوه. شام: پروتئین و سبزیجات.",

        nutritionEn:
            "Breakfast: Eggs and whole-grain bread. Lunch: Chicken or fish with rice. Snack: Yogurt and fruit. Dinner: Protein and vegetables.",

        weeklyScheduleFa:
            "شنبه: سینه و پشت بازو\nیکشنبه: زیربغل و جلو بازو\nدوشنبه: استراحت و ریکاوری\nسه‌شنبه: پا و شکم\nچهارشنبه: تمرین ترکیبی\nپنجشنبه و جمعه: استراحت",

        weeklyScheduleEn:
            "Saturday: Chest and triceps\nSunday: Back and biceps\nMonday: Rest and recovery\nTuesday: Legs and abs\nWednesday: Full-body training\nThursday and Friday: Rest"
    },

    {
        roleFa: "مربی تناسب اندام",
        roleEn: "Fitness Coach",

        expFa: "۶ سال تجربه",
        expEn: "6 years of experience",

        scheduleFa: "یکشنبه تا پنجشنبه · نمونه",
        scheduleEn: "Sun–Thu · Sample",

        bioFa:
            "تمرکز بر تناسب اندام عمومی، ایجاد عادت‌های سالم و طراحی تمرین متناسب با اهداف ورزشی.",

        bioEn:
            "Focused on general fitness, healthy habits, and exercise plans tailored to fitness goals.",

        planFa:
            "تمرین تمام‌بدن، فعالیت هوازی متعادل و روزهای استراحت برنامه‌ریزی‌شده.",

        planEn:
            "Full-body training, moderate cardio, and planned recovery days.",

        nutritionFa:
            "صبحانه: جو دوسر و میوه. ناهار: مرغ و سبزیجات. میان‌وعده: مغزها و ماست. شام: سالاد همراه منبع پروتئین.",

        nutritionEn:
            "Breakfast: Oatmeal and fruit. Lunch: Chicken and vegetables. Snack: Nuts and yogurt. Dinner: Salad with a protein source.",

        weeklyScheduleFa:
            "شنبه: پیاده‌روی و هوازی\nیکشنبه: تمرین تمام‌بدن\nدوشنبه: تمرین پایین‌تنه\nسه‌شنبه: استراحت فعال\nچهارشنبه: تمرین بالاتنه\nپنجشنبه: هوازی سبک\nجمعه: استراحت",

        weeklyScheduleEn:
            "Saturday: Walking and cardio\nSunday: Full-body training\nMonday: Lower body\nTuesday: Active recovery\nWednesday: Upper body\nThursday: Light cardio\nFriday: Rest"
    },

    {
        roleFa: "مربی تمرینات عملکردی",
        roleEn: "Functional Training Coach",

        expFa: "۱۰ سال تجربه",
        expEn: "10 years of experience",

        scheduleFa: "شنبه تا سه‌شنبه · نمونه",
        scheduleEn: "Sat–Tue · Sample",

        bioFa:
            "تمرکز بر قدرت عملکردی، تعادل، تحرک و بهبود کیفیت اجرای حرکات ورزشی.",

        bioEn:
            "Focused on functional strength, balance, mobility, and better movement quality.",

        planFa:
            "تمرین‌های تعادلی، حرکات عملکردی و تمرین کنترل‌شده با وزن بدن.",

        planEn:
            "Balance drills, functional movements, and controlled bodyweight exercises.",

        nutritionFa:
            "صبحانه: نان سبوس‌دار و پنیر. ناهار: ماهی یا مرغ همراه سبزیجات. میان‌وعده: میوه و مغزها. شام: غذای سبک و متعادل.",

        nutritionEn:
            "Breakfast: Whole-grain bread and cheese. Lunch: Fish or chicken with vegetables. Snack: Fruit and nuts. Dinner: A light, balanced meal.",

        weeklyScheduleFa:
            "شنبه: تمرین تعادل و تحرک\nیکشنبه: تمرین عملکردی\nدوشنبه: تمرین قدرتی\nسه‌شنبه: تمرین هوازی و استقامت\nچهارشنبه: ریکاوری\nپنجشنبه و جمعه: استراحت",

        weeklyScheduleEn:
            "Saturday: Balance and mobility\nSunday: Functional training\nMonday: Strength training\nTuesday: Cardio and endurance\nWednesday: Recovery\nThursday and Friday: Rest"
    }

];


// ------------------------------------------
// Fill trainer profile
// ------------------------------------------

function fillTrainerProfile(card, index) {
    const profile = trainerProfiles[index];

    if (!profile || !card) return;

    const english = currentLanguage === "en";

    const title = card.querySelector("h3");
    const image = card.querySelector("img");

    const trainerName = document.getElementById("modalTrainerName");
    const trainerRole = document.getElementById("modalTrainerRole");
    const trainerBio = document.getElementById("modalTrainerBio");

    const trainerExperience = document.getElementById(
        "modalTrainerExperience"
    );

    const trainerSchedule = document.getElementById(
        "modalTrainerSchedule"
    );

    const trainerPlan = document.getElementById("modalTrainerPlan");

    const trainerNutrition = document.getElementById(
        "modalTrainerNutritionPlan"
    );

    const trainerImage = document.getElementById("modalTrainerImage");

    if (trainerName) {
        trainerName.textContent = title
            ? title.textContent.trim()
            : "FitZone Trainer";
    }

    if (trainerRole) {
        trainerRole.textContent = english ? profile.roleEn : profile.roleFa;
    }

    if (trainerBio) {
        trainerBio.textContent = english ? profile.bioEn : profile.bioFa;
    }

    if (trainerExperience) {
        trainerExperience.textContent = english
            ? profile.expEn
            : profile.expFa;
    }

    if (trainerSchedule) {
        trainerSchedule.textContent = english
            ? profile.scheduleEn
            : profile.scheduleFa;
    }

    if (trainerPlan) {
        const weeklySchedule = english
            ? profile.weeklyScheduleEn
            : profile.weeklyScheduleFa;

        const basicPlan = english ? profile.planEn : profile.planFa;

        trainerPlan.textContent = basicPlan + "\n\n" + weeklySchedule;
    }

    if (trainerNutrition) {
        trainerNutrition.textContent = english
            ? profile.nutritionEn
            : profile.nutritionFa;
    }

    if (image && trainerImage) {
        trainerImage.src = image.src;
        trainerImage.alt = title ? title.textContent.trim() : "Trainer";
    }
}


// ------------------------------------------
// Open and close trainer modal
// ------------------------------------------

function openTrainerProfile(card, index) {
    if (!trainerModal || !trainerProfiles[index]) return;

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

function hideTrainerProfile() {
    if (!trainerModal) return;

    trainerModal.classList.remove("active");
    trainerModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    if (activeTrainerCard) {
        activeTrainerCard.focus();
    }
}


// Trainer card interactions
document.querySelectorAll(".trainer-card").forEach((card, index) => {

    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

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

if (closeTrainerModal) {
    closeTrainerModal.addEventListener("click", hideTrainerProfile);
}

if (trainerModalOverlay) {
    trainerModalOverlay.addEventListener("click", hideTrainerProfile);
}

document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        trainerModal &&
        trainerModal.classList.contains("active")
    ) {
        hideTrainerProfile();
    }
});

if (trainerContactBtn) {
    trainerContactBtn.addEventListener("click", () => {
        hideTrainerProfile();

        const contactSection = document.getElementById("contact");

        if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
        }
    });
}


// ==========================================
// Fitness calculator
// Uses the exact IDs in the HTML file
// ==========================================

const fitnessForm = document.getElementById("fitnessForm");
const fitnessResult = document.getElementById("fitnessResult");

const ageInput = document.getElementById("fitnessAge");
const genderInput = document.getElementById("fitnessGender");
const weightInput = document.getElementById("fitnessWeight");
const heightInput = document.getElementById("fitnessHeight");
const activityInput = document.getElementById("fitnessActivity");

function showCalculatorPlaceholder() {
    if (!fitnessResult) return;

    fitnessResult.dataset.hasResult = "false";

    fitnessResult.innerHTML = currentLanguage === "fa"
        ? `
            <div class="result-placeholder">
                <div>
                    <h3>نتیجه محاسبه</h3>
                    <p>اطلاعات خود را وارد کنید تا شاخص BMI و کالری تخمینی نمایش داده شود.</p>
                </div>
            </div>
        `
        : `
            <div class="result-placeholder">
                <div>
                    <h3>Calculation Result</h3>
                    <p>Enter your details to see your estimated BMI and daily calories.</p>
                </div>
            </div>
        `;
}


// Activity multiplier
function getActivityMultiplier(activity) {
    const activityLevels = {
        "1.2": 1.2,
        "1.375": 1.375,
        "1.55": 1.55,
        "1.725": 1.725,
        "1.9": 1.9
    };

    return activityLevels[activity] || 1.2;
}


// BMI category
function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return currentLanguage === "fa" ? "کمبود وزن" : "Underweight";
    }

    if (bmi < 25) {
        return currentLanguage === "fa" ? "محدوده طبیعی" : "Normal range";
    }

    if (bmi < 30) {
        return currentLanguage === "fa" ? "اضافه وزن" : "Overweight";
    }

    return currentLanguage === "fa" ? "چاقی" : "Obesity";
}


// Calculator submit
if (fitnessForm) {
    fitnessForm.addEventListener("submit", event => {
        event.preventDefault();

        if (
            !ageInput ||
            !genderInput ||
            !weightInput ||
            !heightInput ||
            !activityInput ||
            !fitnessResult
        ) {
            return;
        }

        const age = Number(ageInput.value);
        const weight = Number(weightInput.value);
        const height = Number(heightInput.value);

        const gender = genderInput.value;
        const activity = activityInput.value;

        if (
            !Number.isFinite(age) ||
            !Number.isFinite(weight) ||
            !Number.isFinite(height) ||
            age < 15 ||
            age > 100 ||
            weight < 20 ||
            weight > 300 ||
            height < 100 ||
            height > 250
        ) {
            fitnessResult.dataset.hasResult = "true";

            fitnessResult.innerHTML = currentLanguage === "fa"
                ? `
                    <h3>اطلاعات نامعتبر است</h3>
                    <p>لطفاً سن، وزن و قد را بررسی کنید.</p>
                `
                : `
                    <h3>Invalid information</h3>
                    <p>Please check your age, weight and height.</p>
                `;

            return;
        }

        // BMI
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);

        // BMR: Mifflin-St Jeor equation
        let bmr;

        if (gender === "male") {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        // Estimated daily calories
        const multiplier = getActivityMultiplier(activity);
        const calories = Math.round(bmr * multiplier);

        const bmiCategory = getBMICategory(bmi);

        const title = currentLanguage === "fa"
            ? "نتیجه محاسبه شما"
            : "Your Calculation Results";

        const bmiLabel = currentLanguage === "fa"
            ? "شاخص توده بدنی (BMI)"
            : "Body Mass Index (BMI)";

        const categoryLabel = currentLanguage === "fa"
            ? "وضعیت BMI"
            : "BMI Category";

        const calorieLabel = currentLanguage === "fa"
            ? "کالری تخمینی روزانه"
            : "Estimated Daily Calories";

        const calorieUnit = currentLanguage === "fa"
            ? "کیلوکالری"
            : "kcal";

        const note = currentLanguage === "fa"
            ? "این نتایج تخمینی و آموزشی هستند و جایگزین مشاوره پزشک یا متخصص تغذیه نیستند."
            : "These are educational estimates and are not a substitute for professional medical or nutrition advice.";

        fitnessResult.dataset.hasResult = "true";

        fitnessResult.innerHTML = `
            <h3>${title}</h3>

            <div class="result-items">

                <div class="result-item">
                    <small>${bmiLabel}</small>
                    <strong>${bmi.toFixed(1)}</strong>
                </div>

                <div class="result-item">
                    <small>${categoryLabel}</small>
                    <strong>${bmiCategory}</strong>
                </div>

                <div class="result-item">
                    <small>${calorieLabel}</small>
                    <strong>${calories.toLocaleString(
                        currentLanguage === "fa" ? "fa-IR" : "en-US"
                    )}</strong>
                    <small>${calorieUnit}</small>
                </div>

            </div>

            <p class="calculator-note">${note}</p>
        `;
    });
}

showCalculatorPlaceholder();


// ==========================================
// Progress dashboard
// Saves data in the current browser
// ==========================================

const progressForm = document.getElementById("progressForm");
const progressWeightInput = document.getElementById("progressWeight");
const progressGoalInput = document.getElementById("progressGoal");

const latestWeightElement = document.getElementById("latestWeight");
const targetWeightElement = document.getElementById("targetWeight");
const progressCountElement = document.getElementById("progressCount");

const progressHistory = document.getElementById("progressHistory");
const clearProgressButton = document.getElementById("clearProgress");

const PROGRESS_STORAGE_KEY = "fitZoneProgressData";

let progressData = [];


// Load saved progress
function loadProgressData() {
    try {
        const savedData = localStorage.getItem(PROGRESS_STORAGE_KEY);

        progressData = savedData ? JSON.parse(savedData) : [];

        if (!Array.isArray(progressData)) {
            progressData = [];
        }
    } catch (error) {
        progressData = [];
    }
}


// Save progress
function saveProgressData() {
    try {
        localStorage.setItem(
            PROGRESS_STORAGE_KEY,
            JSON.stringify(progressData)
        );

        return true;
    } catch (error) {
        return false;
    }
}


// Format weight
function formatWeight(value) {
    return Number(value).toLocaleString(
        currentLanguage === "fa" ? "fa-IR" : "en-US",
        {
            maximumFractionDigits: 1
        }
    );
}


// Render progress history
function renderProgressHistory() {
    if (!progressHistory) return;

    if (progressData.length === 0) {
        progressHistory.innerHTML = currentLanguage === "fa"
            ? "<p>هنوز اطلاعاتی ثبت نشده است.</p>"
            : "<p>No progress has been recorded yet.</p>";

        if (latestWeightElement) latestWeightElement.textContent = "—";
        if (targetWeightElement) targetWeightElement.textContent = "—";
        if (progressCountElement) progressCountElement.textContent = "0";

        return;
    }

    const latest = progressData[progressData.length - 1];

    if (latestWeightElement) {
        latestWeightElement.textContent = formatWeight(latest.weight);
    }

    if (targetWeightElement) {
        targetWeightElement.textContent = latest.goal
            ? formatWeight(latest.goal)
            : "—";
    }

    if (progressCountElement) {
        progressCountElement.textContent = formatWeight(progressData.length);
    }

    progressHistory.innerHTML = "";

    [...progressData].reverse().forEach(entry => {
        const item = document.createElement("div");
        item.className = "progress-history-item";

        const date = document.createElement("span");
        const weight = document.createElement("strong");

        date.textContent = new Date(entry.date).toLocaleDateString(
            currentLanguage === "fa" ? "fa-IR" : "en-US"
        );

        weight.textContent = currentLanguage === "fa"
            ? `${formatWeight(entry.weight)} کیلوگرم`
            : `${formatWeight(entry.weight)} kg`;

        item.appendChild(date);
        item.appendChild(weight);

        progressHistory.appendChild(item);
    });
}


// Submit progress form
if (progressForm) {
    progressForm.addEventListener("submit", event => {
        event.preventDefault();

        const weight = Number(progressWeightInput?.value);
        const goal = Number(progressGoalInput?.value);

        if (
            !Number.isFinite(weight) ||
            !Number.isFinite(goal) ||
            weight < 20 ||
            weight > 300 ||
            goal < 20 ||
            goal > 300
        ) {
            alert(
                currentLanguage === "fa"
                    ? "لطفاً وزن و وزن هدف را به‌درستی وارد کنید."
                    : "Please enter valid current and target weights."
            );

            return;
        }

        progressData.push({
            weight: weight,
            goal: goal,
            date: new Date().toISOString()
        });

        if (!saveProgressData()) {
            alert(
                currentLanguage === "fa"
                    ? "ذخیره اطلاعات در این مرورگر امکان‌پذیر نیست."
                    : "Unable to save data in this browser."
            );

            progressData.pop();
            return;
        }

        renderProgressHistory();
        progressForm.reset();
    });
}


// Clear progress
if (clearProgressButton) {
    clearProgressButton.addEventListener("click", () => {
        const confirmed = confirm(
            currentLanguage === "fa"
                ? "آیا مطمئن هستید که می‌خواهید تمام اطلاعات پیشرفت پاک شود؟"
                : "Are you sure you want to clear all progress data?"
        );

        if (!confirmed) return;

        progressData = [];
        saveProgressData();
        renderProgressHistory();
    });
}


// Load and display saved data
loadProgressData();
renderProgressHistory();


// ==========================================
// Existing progress bars
// ==========================================

document.querySelectorAll(".progress-fill").forEach(bar => {
    const progressValue = Number(bar.dataset.progress);

    if (Number.isFinite(progressValue)) {
        const value = Math.min(100, Math.max(0, progressValue));

        bar.style.setProperty("--progress", value + "%");
    }
});

document.querySelectorAll(".progress-chart-bar").forEach(bar => {
    const barValue = Number(bar.dataset.height);

    if (Number.isFinite(barValue)) {
        const value = Math.min(100, Math.max(0, barValue));

        bar.style.setProperty("--bar-height", value + "%");
    }
});


// ==========================================
// Start website in Persian
// ==========================================

changeLanguage("fa");
