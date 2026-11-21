// ==========================================
// FitZone — Complete JavaScript
// Bilingual website, trainer profiles,
// fitness calculator and demo interactions
// ==========================================


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

    // Change bilingual text
    document.querySelectorAll("[data-fa][data-en]").forEach(element => {
        element.innerHTML = isEnglish
            ? element.dataset.en
            : element.dataset.fa;
    });

    // Change input placeholders
    document.querySelectorAll(
        "[data-placeholder-fa][data-placeholder-en]"
    ).forEach(element => {
        element.placeholder = isEnglish
            ? element.dataset.placeholderEn
            : element.dataset.placeholderFa;
    });

    // Change language button
    if (langBtn) {
        langBtn.textContent = isEnglish ? "FA" : "EN";
    }

    // Change page title
    document.title = isEnglish
        ? "FitZone | Fitness Club"
        : "FitZone | باشگاه تناسب اندام";

    // Close mobile navigation
    if (nav) {
        nav.classList.remove("open");
    }

    if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");
    }

    // Update trainer profile if modal is open
    if (activeTrainerCard && activeTrainerIndex !== -1) {
        fillTrainerProfile(activeTrainerCard, activeTrainerIndex);
    }

    // Refresh calculator placeholder if no result exists
    const fitnessResult = document.getElementById("fitnessResult");

    if (
        fitnessResult &&
        fitnessResult.dataset.hasResult !== "true"
    ) {
        showCalculatorPlaceholder();
    }
}


// Language button
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
// Automatic footer year
// ------------------------------------------

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}


// ------------------------------------------
// Contact form demonstration
// ------------------------------------------

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
                ? "اطلاعات وارد شد؛ برای دریافت واقعی درخواست‌ها باید فرم به سرور یا سرویس ایمیل متصل شود."
                : "Details entered. Connect this form to a server or email service to receive submissions.";

            formMessage.style.color = "#5d812a";
        }

        contactForm.reset();
    });
}


// ==========================================
// Trainer profiles
// ==========================================

const trainerModal = document.getElementById("trainerModal");

const trainerModalOverlay = document.getElementById(
    "trainerModalOverlay"
);

const closeTrainerModal = document.getElementById(
    "closeTrainerModal"
);

const trainerContactBtn = document.getElementById(
    "trainerContactBtn"
);

let activeTrainerCard = null;
let activeTrainerIndex = -1;


// Trainer information
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

    if (!profile || !card) {
        return;
    }

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
        trainerRole.textContent = english
            ? profile.roleEn
            : profile.roleFa;
    }

    if (trainerBio) {
        trainerBio.textContent = english
            ? profile.bioEn
            : profile.bioFa;
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
        trainerPlan.textContent = english
            ? profile.planEn
            : profile.planFa;
    }

    if (trainerNutrition) {
        trainerNutrition.textContent = english
            ? profile.nutritionEn
            : profile.nutritionFa;
    }

    if (image && trainerImage) {
        trainerImage.src = image.src;

        trainerImage.alt = title
            ? title.textContent.trim()
            : "Trainer";
    }
}


// ------------------------------------------
// Open trainer modal
// ------------------------------------------

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


// ------------------------------------------
// Close trainer modal
// ------------------------------------------

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


// ------------------------------------------
// Trainer cards interactions
// ------------------------------------------

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
    closeTrainerModal.addEventListener(
        "click",
        hideTrainerProfile
    );
}


// Close by clicking overlay
if (trainerModalOverlay) {
    trainerModalOverlay.addEventListener(
        "click",
        hideTrainerProfile
    );
}


// Close with Escape
document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        trainerModal &&
        trainerModal.classList.contains("active")
    ) {
        hideTrainerProfile();
    }

});


// Consultation button
if (trainerContactBtn) {
    trainerContactBtn.addEventListener("click", () => {

        hideTrainerProfile();

        const contactSection = document.getElementById("contact");

        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: "smooth"
            });
        }

    });
}


// ==========================================
// Fitness calculator
// BMI + BMR + Estimated daily calories
// ==========================================

const fitnessForm = document.getElementById("fitnessForm");

const fitnessResult = document.getElementById("fitnessResult");

const heightInput = document.getElementById("heightInput");

const weightInput = document.getElementById("weightInput");

const ageInput = document.getElementById("ageInput");

const genderInput = document.getElementById("genderInput");

const activityInput = document.getElementById("activityInput");

const goalInput = document.getElementById("goalInput");


// Show initial calculator message
function showCalculatorPlaceholder() {

    if (!fitnessResult) {
        return;
    }

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


// Activity multipliers
function getActivityMultiplier(activity) {

    const activityLevels = {
        low: 1.2,
        light: 1.375,
        moderate: 1.55,
        high: 1.725,
        veryHigh: 1.9
    };

    return activityLevels[activity] || 1.2;
}


// BMI category
function getBMICategory(bmi) {

    if (bmi < 18.5) {
        return currentLanguage === "fa"
            ? "کمبود وزن"
            : "Underweight";
    }

    if (bmi < 25) {
        return currentLanguage === "fa"
            ? "محدوده طبیعی"
            : "Normal range";
    }

    if (bmi < 30) {
        return currentLanguage === "fa"
            ? "اضافه وزن"
            : "Overweight";
    }

    return currentLanguage === "fa"
        ? "چاقی"
        : "Obesity";
}


// Calculate fitness results
if (fitnessForm) {

    fitnessForm.addEventListener("submit", event => {

        event.preventDefault();

        if (
            !heightInput ||
            !weightInput ||
            !ageInput ||
            !genderInput ||
            !activityInput ||
            !goalInput ||
            !fitnessResult
        ) {
            return;
        }

        const height = Number(heightInput.value);

        const weight = Number(weightInput.value);

        const age = Number(ageInput.value);

        const gender = genderInput.value;

        const activity = activityInput.value;

        const goal = goalInput.value;

        // Validate inputs
        if (
            !Number.isFinite(height) ||
            !Number.isFinite(weight) ||
            !Number.isFinite(age) ||
            height < 100 ||
            height > 250 ||
            weight < 25 ||
            weight > 300 ||
            age < 15 ||
            age > 100
        ) {

            fitnessResult.dataset.hasResult = "true";

            fitnessResult.innerHTML = currentLanguage === "fa"
                ? `
                    <h3>اطلاعات نامعتبر است</h3>
                    <p>لطفاً قد، وزن و سن را بررسی و دوباره وارد کنید.</p>
                `
                : `
                    <h3>Invalid information</h3>
                    <p>Please check your height, weight, and age.</p>
                `;

            return;
        }

        // BMI calculation
        const heightInMeters = height / 100;

        const bmi = weight / (heightInMeters * heightInMeters);

        // Mifflin-St Jeor BMR estimation
        let bmr;

        if (gender === "male") {

            bmr = (10 * weight) +
                (6.25 * height) -
                (5 * age) +
                5;

        } else {

            bmr = (10 * weight) +
                (6.25 * height) -
                (5 * age) -
                161;

        }

        // Estimated daily calories
        const multiplier = getActivityMultiplier(activity);

        let calories = bmr * multiplier;

        // Goal adjustment
        if (goal === "lose") {
            calories -= 300;
        } else if (goal === "gain") {
            calories += 250;
        }

        calories = Math.round(calories);

        const roundedBMI = bmi.toFixed(1);

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
            : "These are educational estimates and are not a substitute for medical or professional nutrition advice.";

        fitnessResult.dataset.hasResult = "true";

        fitnessResult.innerHTML = `
            <h3>${title}</h3>

            <div class="result-items">

                <div class="result-item">
                    <small>${bmiLabel}</small>
                    <strong>${roundedBMI}</strong>
                </div>

                <div class="result-item">
                    <small>${categoryLabel}</small>
                    <strong style="font-size:16px;direction:rtl">
                        ${bmiCategory}
                    </strong>
                </div>

                <div class="result-item">
                    <small>${calorieLabel}</small>
                    <strong>${calories}</strong>
                    <small>${calorieUnit}</small>
                </div>

            </div>

            <p class="calculator-note" style="color:#68705f;margin-top:18px">
                ${note}
            </p>
        `;

    });

}


// Initial calculator placeholder
showCalculatorPlaceholder();


// ==========================================
// Progress dashboard
// Demo data and progress bars
// ==========================================

// The dashboard intentionally uses sample data.
// It does not save real user activity.

const progressBars = document.querySelectorAll(".progress-fill");

progressBars.forEach(bar => {

    const progressValue = bar.dataset.progress;

    if (progressValue) {

        const value = Math.min(
            100,
            Math.max(0, Number(progressValue))
        );

        bar.style.setProperty(
            "--progress",
            value + "%"
        );

    }

});


// Progress chart bars
document.querySelectorAll(".progress-chart-bar").forEach(bar => {

    const barValue = bar.dataset.height;

    if (barValue) {

        const value = Math.min(
            100,
            Math.max(0, Number(barValue))
        );

        bar.style.setProperty(
            "--bar-height",
            value + "%"
        );

    }

});


// ==========================================
// Workout and nutrition sections
// ==========================================

// These sections contain sample information.
// Their content is provided by the HTML file.


// ==========================================
// Start website in Persian
// ==========================================

changeLanguage("fa");
