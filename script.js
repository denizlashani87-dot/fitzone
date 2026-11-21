/* =========================================================
   FitZone — Complete JavaScript
   Bilingual website, trainer profiles, calculator,
   local progress dashboard and demo contact form.
   ========================================================= */

(() => {
    "use strict";

    // -----------------------------------------------------
    // Shared elements and language state
    // -----------------------------------------------------

    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    const langBtn = $("#langBtn");
    const menuBtn = $("#menuBtn");
    const nav = $("#nav");

    const contactForm = $("#contactForm");
    const formMessage = $("#formMessage");

    const fitnessForm = $("#fitnessForm");
    const fitnessResult = $("#fitnessResult");

    const progressForm = $("#progressForm");
    const progressHistory = $("#progressHistory");
    const clearProgressButton = $("#clearProgress");

    let currentLanguage = "fa";
    let lastCalculatorResult = null;
    let contactMessageType = "";

    const isEnglish = () => currentLanguage === "en";
    const text = (fa, en) => isEnglish() ? en : fa;

    function formatNumber(value, maximumFractionDigits = 1) {
        return Number(value).toLocaleString(
            isEnglish() ? "en-US" : "fa-IR",
            { maximumFractionDigits }
        );
    }

    // -----------------------------------------------------
    // Language system
    // -----------------------------------------------------

    function changeLanguage(language) {
        currentLanguage = language === "en" ? "en" : "fa";
        const english = isEnglish();

        document.documentElement.lang = currentLanguage;
        document.documentElement.dir = english ? "ltr" : "rtl";
        document.body.classList.toggle("en", english);

        $$("[data-fa][data-en]").forEach(element => {
            element.innerHTML = english
                ? element.dataset.en
                : element.dataset.fa;
        });

        $$("[data-placeholder-fa][data-placeholder-en]").forEach(element => {
            element.placeholder = english
                ? element.dataset.placeholderEn
                : element.dataset.placeholderFa;
        });

        $$("[data-title-fa][data-title-en]").forEach(element => {
            element.title = english
                ? element.dataset.titleEn
                : element.dataset.titleFa;
        });

        if (langBtn) {
            langBtn.textContent = english ? "FA" : "EN";
            langBtn.setAttribute(
                "aria-label",
                english ? "Switch to Persian" : "تغییر زبان به انگلیسی"
            );
        }

        document.title = english
            ? "FitZone | Fitness Club"
            : "FitZone | باشگاه تناسب اندام";

        closeMobileMenu();

        // Refresh dynamic content in the selected language.
        if (activeTrainerCard && activeTrainerIndex >= 0) {
            fillTrainerProfile(activeTrainerCard, activeTrainerIndex);
        }

        if (fitnessResult) {
            if (lastCalculatorResult) {
                renderCalculatorResult(lastCalculatorResult);
            } else {
                showCalculatorPlaceholder();
            }
        }

        renderProgressHistory();
        renderContactMessage();
    }

    if (langBtn) {
        langBtn.addEventListener("click", () => {
            changeLanguage(isEnglish() ? "fa" : "en");
        });
    }

    // -----------------------------------------------------
    // Mobile navigation
    // -----------------------------------------------------

    function closeMobileMenu() {
        if (nav) nav.classList.remove("open");
        if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    }

    if (menuBtn && nav) {
        menuBtn.setAttribute("aria-expanded", "false");

        menuBtn.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");
            menuBtn.setAttribute("aria-expanded", String(isOpen));
        });

        $$("a", nav).forEach(link => {
            link.addEventListener("click", closeMobileMenu);
        });

        document.addEventListener("click", event => {
            if (
                nav.classList.contains("open") &&
                !nav.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) closeMobileMenu();
        });
    }

    // -----------------------------------------------------
    // Footer year
    // -----------------------------------------------------

    const yearElement = $("#year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // -----------------------------------------------------
    // Contact form (front-end demo only)
    // -----------------------------------------------------

    function renderContactMessage() {
        if (!formMessage || !contactMessageType) return;

        if (contactMessageType === "success") {
            formMessage.textContent = text(
                "اطلاعات شما در این نسخه نمایشی ثبت نشده است. برای دریافت واقعی درخواست‌ها باید فرم به سرویس ارسال اطلاعات متصل شود.",
                "This demo does not send or store your request. Connect the form to a submission service to receive messages."
            );
            formMessage.style.color = "#8fbd38";
        } else if (contactMessageType === "error") {
            formMessage.textContent = text(
                "لطفاً نام، ایمیل و پیام خود را بررسی کنید.",
                "Please check your name, email and message."
            );
            formMessage.style.color = "#d65b50";
        }
    }

    if (contactForm) {
        contactForm.addEventListener("submit", event => {
            event.preventDefault();

            const nameInput = $("#name");
            const emailInput = $("#email");
            const messageInput = $("#message");

            const name = nameInput?.value.trim() || "";
            const email = emailInput?.value.trim() || "";
            const message = messageInput?.value.trim() || "";

            const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!name || !emailLooksValid || !message) {
                contactMessageType = "error";
                renderContactMessage();

                if (!name) nameInput?.focus();
                else if (!emailLooksValid) emailInput?.focus();
                else messageInput?.focus();

                return;
            }

            contactMessageType = "success";
            renderContactMessage();
            contactForm.reset();
        });
    }

    // -----------------------------------------------------
    // Trainer profiles
    // -----------------------------------------------------

    const trainerModal = $("#trainerModal");
    const trainerModalOverlay = $("#trainerModalOverlay");
    const closeTrainerModalButton = $("#closeTrainerModal");
    const trainerContactBtn = $("#trainerContactBtn");

    let activeTrainerCard = null;
    let activeTrainerIndex = -1;

    const trainerProfiles = [
        {
            roleFa: "مربی قدرت و عضله‌سازی",
            roleEn: "Strength & Muscle Coach",
            expFa: "۸ سال تجربه",
            expEn: "8 years of experience",
            scheduleFa: "شنبه تا چهارشنبه · برنامه نمونه",
            scheduleEn: "Saturday–Wednesday · Sample schedule",
            bioFa: "تمرکز بر تمرینات قدرتی، بهبود تکنیک حرکات و طراحی برنامه متناسب با سطح ورزشکار.",
            bioEn: "Focused on strength training, exercise technique, and training plans tailored to each athlete's level.",
            planFa: "تمرین قدرتی بالاتنه، حرکات ترکیبی و زمان کافی برای ریکاوری.",
            planEn: "Upper-body strength work, compound movements, and adequate recovery time.",
            nutritionFa: "صبحانه: تخم‌مرغ و نان سبوس‌دار. ناهار: مرغ یا ماهی همراه برنج. میان‌وعده: ماست و میوه. شام: پروتئین و سبزیجات.",
            nutritionEn: "Breakfast: Eggs and whole-grain bread. Lunch: Chicken or fish with rice. Snack: Yogurt and fruit. Dinner: Protein and vegetables.",
            weeklyScheduleFa: "شنبه: سینه و پشت بازو\nیکشنبه: زیربغل و جلو بازو\nدوشنبه: استراحت و ریکاوری\nسه‌شنبه: پا و شکم\nچهارشنبه: تمرین ترکیبی\nپنجشنبه و جمعه: استراحت",
            weeklyScheduleEn: "Saturday: Chest and triceps\nSunday: Back and biceps\nMonday: Rest and recovery\nTuesday: Legs and abs\nWednesday: Full-body training\nThursday and Friday: Rest"
        },
        {
            roleFa: "مربی تناسب اندام",
            roleEn: "Fitness Coach",
            expFa: "۶ سال تجربه",
            expEn: "6 years of experience",
            scheduleFa: "یکشنبه تا پنجشنبه · برنامه نمونه",
            scheduleEn: "Sunday–Thursday · Sample schedule",
            bioFa: "تمرکز بر تناسب اندام عمومی، ایجاد عادت‌های سالم و طراحی تمرین متناسب با اهداف ورزشی.",
            bioEn: "Focused on general fitness, healthy habits, and exercise plans tailored to fitness goals.",
            planFa: "تمرین تمام‌بدن، فعالیت هوازی متعادل و روزهای استراحت برنامه‌ریزی‌شده.",
            planEn: "Full-body training, moderate cardio, and planned recovery days.",
            nutritionFa: "صبحانه: جو دوسر و میوه. ناهار: مرغ و سبزیجات. میان‌وعده: مغزها و ماست. شام: سالاد همراه منبع پروتئین.",
            nutritionEn: "Breakfast: Oatmeal and fruit. Lunch: Chicken and vegetables. Snack: Nuts and yogurt. Dinner: Salad with a protein source.",
            weeklyScheduleFa: "شنبه: پیاده‌روی و هوازی\nیکشنبه: تمرین تمام‌بدن\nدوشنبه: تمرین پایین‌تنه\nسه‌شنبه: استراحت فعال\nچهارشنبه: تمرین بالاتنه\nپنجشنبه: هوازی سبک\nجمعه: استراحت",
            weeklyScheduleEn: "Saturday: Walking and cardio\nSunday: Full-body training\nMonday: Lower body\nTuesday: Active recovery\nWednesday: Upper body\nThursday: Light cardio\nFriday: Rest"
        },
        {
            roleFa: "مربی تمرینات عملکردی",
            roleEn: "Functional Training Coach",
            expFa: "۱۰ سال تجربه",
            expEn: "10 years of experience",
            scheduleFa: "شنبه تا سه‌شنبه · برنامه نمونه",
            scheduleEn: "Saturday–Tuesday · Sample schedule",
            bioFa: "تمرکز بر قدرت عملکردی، تعادل، تحرک و بهبود کیفیت اجرای حرکات ورزشی.",
            bioEn: "Focused on functional strength, balance, mobility, and better movement quality.",
            planFa: "تمرین‌های تعادلی، حرکات عملکردی و تمرین کنترل‌شده با وزن بدن.",
            planEn: "Balance drills, functional movements, and controlled bodyweight exercises.",
            nutritionFa: "صبحانه: نان سبوس‌دار و پنیر. ناهار: ماهی یا مرغ همراه سبزیجات. میان‌وعده: میوه و مغزها. شام: غذای سبک و متعادل.",
            nutritionEn: "Breakfast: Whole-grain bread and cheese. Lunch: Fish or chicken with vegetables. Snack: Fruit and nuts. Dinner: A light, balanced meal.",
            weeklyScheduleFa: "شنبه: تمرین تعادل و تحرک\nیکشنبه: تمرین عملکردی\nدوشنبه: تمرین قدرتی\nسه‌شنبه: تمرین هوازی و استقامت\nچهارشنبه: ریکاوری\nپنجشنبه و جمعه: استراحت",
            weeklyScheduleEn: "Saturday: Balance and mobility\nSunday: Functional training\nMonday: Strength training\nTuesday: Cardio and endurance\nWednesday: Recovery\nThursday and Friday: Rest"
        }
    ];

    function fillTrainerProfile(card, index) {
        const profile = trainerProfiles[index];
        if (!profile || !card) return;

        const english = isEnglish();
        const trainerName = $("#modalTrainerName");
        const trainerRole = $("#modalTrainerRole");
        const trainerBio = $("#modalTrainerBio");
        const trainerExperience = $("#modalTrainerExperience");
        const trainerSchedule = $("#modalTrainerSchedule");
        const trainerPlan = $("#modalTrainerPlan");
        const trainerNutrition = $("#modalTrainerNutritionPlan");
        const trainerImage = $("#modalTrainerImage");

        const cardTitle = $("h3", card);
        const cardImage = $("img", card);
        const name = cardTitle?.textContent.trim() || "FitZone Trainer";

        if (trainerName) trainerName.textContent = name;
        if (trainerRole) trainerRole.textContent = english ? profile.roleEn : profile.roleFa;
        if (trainerBio) trainerBio.textContent = english ? profile.bioEn : profile.bioFa;
        if (trainerExperience) trainerExperience.textContent = english ? profile.expEn : profile.expFa;
        if (trainerSchedule) trainerSchedule.textContent = english ? profile.scheduleEn : profile.scheduleFa;

        if (trainerPlan) {
            trainerPlan.textContent = (english ? profile.planEn : profile.planFa) +
                "\n\n" + (english ? profile.weeklyScheduleEn : profile.weeklyScheduleFa);
            trainerPlan.style.whiteSpace = "pre-line";
        }

        if (trainerNutrition) {
            trainerNutrition.textContent = english ? profile.nutritionEn : profile.nutritionFa;
            trainerNutrition.style.whiteSpace = "pre-line";
        }

        if (trainerImage && cardImage) {
            trainerImage.src = cardImage.currentSrc || cardImage.src;
            trainerImage.alt = name;
        }
    }

    function openTrainerProfile(card, index) {
        if (!trainerModal || !trainerProfiles[index]) return;

        activeTrainerCard = card;
        activeTrainerIndex = index;
        fillTrainerProfile(card, index);

        trainerModal.classList.add("active");
        trainerModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        if (closeTrainerModalButton) closeTrainerModalButton.focus();
    }

    function hideTrainerProfile(restoreFocus = true) {
        if (!trainerModal) return;

        trainerModal.classList.remove("active");
        trainerModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        if (restoreFocus && activeTrainerCard) activeTrainerCard.focus();
    }

    $$(".trainer-card").forEach((card, index) => {
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");

        card.addEventListener("click", () => openTrainerProfile(card, index));

        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openTrainerProfile(card, index);
            }
        });
    });

    if (closeTrainerModalButton) {
        closeTrainerModalButton.addEventListener("click", () => hideTrainerProfile());
    }

    if (trainerModalOverlay) {
        trainerModalOverlay.addEventListener("click", () => hideTrainerProfile());
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && trainerModal?.getAttribute("aria-hidden") === "false") {
            hideTrainerProfile();
        }
    });

    if (trainerContactBtn) {
        trainerContactBtn.addEventListener("click", () => {
            hideTrainerProfile(false);
            const contactSection = $("#contact");
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }

    // -----------------------------------------------------
    // Fitness calculator
    // -----------------------------------------------------

    const ageInput = $("#fitnessAge");
    const genderInput = $("#fitnessGender");
    const weightInput = $("#fitnessWeight");
    const heightInput = $("#fitnessHeight");
    const activityInput = $("#fitnessActivity");

    function showCalculatorPlaceholder() {
        if (!fitnessResult) return;

        fitnessResult.dataset.hasResult = "false";
        fitnessResult.innerHTML = isEnglish()
            ? `<div class="result-placeholder"><div><h3>Calculation Result</h3><p>Enter your details to see your estimated BMI and daily calories.</p></div></div>`
            : `<div class="result-placeholder"><div><h3>نتیجه محاسبه</h3><p>اطلاعات خود را وارد کنید تا شاخص BMI و کالری تخمینی نمایش داده شود.</p></div></div>`;
    }

    function getActivityMultiplier(activity) {
        const levels = {
            "1.2": 1.2,
            "1.375": 1.375,
            "1.55": 1.55,
            "1.725": 1.725,
            "1.9": 1.9
        };
        return levels[String(activity)] || 1.2;
    }

    function getBMICategory(bmi) {
        if (bmi < 18.5) return text("کمبود وزن", "Underweight");
        if (bmi < 25) return text("محدوده طبیعی", "Normal range");
        if (bmi < 30) return text("اضافه وزن", "Overweight");
        return text("چاقی", "Obesity");
    }

    function renderCalculatorError() {
        if (!fitnessResult) return;
        fitnessResult.dataset.hasResult = "true";
        fitnessResult.innerHTML = isEnglish()
            ? "<h3>Invalid information</h3><p>Please check your age, weight, height and activity level.</p>"
            : "<h3>اطلاعات نامعتبر است</h3><p>لطفاً سن، وزن، قد و میزان فعالیت را بررسی کنید.</p>";
    }

    function renderCalculatorResult(result) {
        if (!fitnessResult) return;

        const bmiLabel = text("شاخص توده بدنی (BMI)", "Body Mass Index (BMI)");
        const categoryLabel = text("وضعیت BMI", "BMI Category");
        const calorieLabel = text("کالری تخمینی روزانه", "Estimated Daily Calories");
        const calorieUnit = text("کیلوکالری", "kcal");
        const note = text(
            "این نتایج تخمینی و آموزشی هستند و جایگزین مشاوره پزشک یا متخصص تغذیه نیستند.",
            "These are educational estimates and are not a substitute for professional medical or nutrition advice."
        );

        fitnessResult.dataset.hasResult = "true";
        fitnessResult.innerHTML = `
            <h3>${text("نتیجه محاسبه شما", "Your Calculation Results")}</h3>
            <div class="result-items">
                <div class="result-item">
                    <small>${bmiLabel}</small>
                    <strong>${formatNumber(result.bmi, 1)}</strong>
                </div>
                <div class="result-item">
                    <small>${categoryLabel}</small>
                    <strong>${getBMICategory(result.bmi)}</strong>
                </div>
                <div class="result-item">
                    <small>${calorieLabel}</small>
                    <strong>${formatNumber(result.calories, 0)}</strong>
                    <small>${calorieUnit}</small>
                </div>
            </div>
            <p class="calculator-note">${note}</p>
        `;
    }

    if (fitnessForm) {
        fitnessForm.addEventListener("submit", event => {
            event.preventDefault();

            const age = Number(ageInput?.value);
            const weight = Number(weightInput?.value);
            const height = Number(heightInput?.value);
            const gender = genderInput?.value;
            const activity = activityInput?.value;

            if (
                !ageInput || !weightInput || !heightInput ||
                !genderInput || !activityInput || !fitnessResult ||
                !Number.isFinite(age) || !Number.isFinite(weight) ||
                !Number.isFinite(height) || age < 15 || age > 100 ||
                weight < 20 || weight > 300 || height < 100 ||
                height > 250 || !gender || !activity
            ) {
                renderCalculatorError();
                return;
            }

            const heightMeters = height / 100;
            const bmi = weight / (heightMeters * heightMeters);

            // Mifflin-St Jeor estimate
            const bmr = gender === "male"
                ? (10 * weight) + (6.25 * height) - (5 * age) + 5
                : (10 * weight) + (6.25 * height) - (5 * age) - 161;

            const calories = Math.round(bmr * getActivityMultiplier(activity));

            lastCalculatorResult = { bmi, calories };
            renderCalculatorResult(lastCalculatorResult);
        });
    }

    // -----------------------------------------------------
    // Progress dashboard — saved only in this browser
    // -----------------------------------------------------

    const progressWeightInput = $("#progressWeight");
    const progressGoalInput = $("#progressGoal");
    const latestWeightElement = $("#latestWeight");
    const targetWeightElement = $("#targetWeight");
    const progressCountElement = $("#progressCount");

    const PROGRESS_STORAGE_KEY = "fitZoneProgressData";
    let progressData = [];

    function loadProgressData() {
        try {
            const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
            const parsed = stored ? JSON.parse(stored) : [];

            progressData = Array.isArray(parsed)
                ? parsed.filter(item =>
                    item &&
                    Number.isFinite(Number(item.weight)) &&
                    Number(item.weight) >= 20 &&
                    Number(item.weight) <= 300 &&
                    item.date
                ).map(item => ({
                    weight: Number(item.weight),
                    goal: Number.isFinite(Number(item.goal)) ? Number(item.goal) : null,
                    date: item.date
                }))
                : [];
        } catch (error) {
            progressData = [];
        }
    }

    function saveProgressData() {
        try {
            localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressData));
            return true;
        } catch (error) {
            return false;
        }
    }

    function renderProgressHistory() {
        if (!progressHistory) return;

        if (progressData.length === 0) {
            progressHistory.innerHTML = isEnglish()
                ? "<p>No progress has been recorded yet.</p>"
                : "<p>هنوز اطلاعاتی ثبت نشده است.</p>";

            if (latestWeightElement) latestWeightElement.textContent = "—";
            if (targetWeightElement) targetWeightElement.textContent = "—";
            if (progressCountElement) progressCountElement.textContent = "0";
            return;
        }

        const latest = progressData[progressData.length - 1];

        if (latestWeightElement) {
            latestWeightElement.textContent = formatNumber(latest.weight);
        }

        if (targetWeightElement) {
            targetWeightElement.textContent = latest.goal
                ? formatNumber(latest.goal)
                : "—";
        }

        if (progressCountElement) {
            progressCountElement.textContent = formatNumber(progressData.length, 0);
        }

        progressHistory.innerHTML = "";

        [...progressData].reverse().forEach(entry => {
            const item = document.createElement("div");
            item.className = "progress-history-item";

            const date = document.createElement("span");
            const weight = document.createElement("strong");

            const parsedDate = new Date(entry.date);
            date.textContent = Number.isNaN(parsedDate.getTime())
                ? text("تاریخ نامشخص", "Unknown date")
                : parsedDate.toLocaleDateString(isEnglish() ? "en-US" : "fa-IR");

            weight.textContent = isEnglish()
                ? `${formatNumber(entry.weight)} kg`
                : `${formatNumber(entry.weight)} کیلوگرم`;

            item.append(date, weight);
            progressHistory.appendChild(item);
        });
    }

    if (progressForm) {
        progressForm.addEventListener("submit", event => {
            event.preventDefault();

            const weight = Number(progressWeightInput?.value);
            const goalRaw = progressGoalInput?.value.trim();
            const goal = goalRaw === "" || goalRaw == null ? null : Number(goalRaw);

            if (
                !Number.isFinite(weight) || weight < 20 || weight > 300 ||
                (goal !== null && (!Number.isFinite(goal) || goal < 20 || goal > 300))
            ) {
                window.alert(text(
                    "لطفاً وزن و وزن هدف را به‌درستی وارد کنید.",
                    "Please enter valid current and target weights."
                ));
                return;
            }

            const entry = {
                weight,
                goal,
                date: new Date().toISOString()
            };

            progressData.push(entry);

            if (!saveProgressData()) {
                progressData.pop();
                window.alert(text(
                    "ذخیره اطلاعات در این مرورگر امکان‌پذیر نیست.",
                    "Unable to save data in this browser."
                ));
                return;
            }

            renderProgressHistory();
            progressForm.reset();
        });
    }

    if (clearProgressButton) {
        clearProgressButton.addEventListener("click", () => {
            const confirmed = window.confirm(text(
                "آیا مطمئن هستید که می‌خواهید تمام اطلاعات پیشرفت پاک شود؟",
                "Are you sure you want to clear all progress data?"
            ));

            if (!confirmed) return;

            progressData = [];
            saveProgressData();
            renderProgressHistory();
        });
    }

    // -----------------------------------------------------
    // Existing decorative progress bars (if present in HTML)
    // -----------------------------------------------------

    $$(".progress-fill").forEach(bar => {
        const value = Number(bar.dataset.progress);
        if (Number.isFinite(value)) {
            bar.style.setProperty("--progress", `${Math.min(100, Math.max(0, value))}%`);
        }
    });

    $$(".progress-chart-bar").forEach(bar => {
        const value = Number(bar.dataset.height);
        if (Number.isFinite(value)) {
            bar.style.setProperty("--bar-height", `${Math.min(100, Math.max(0, value))}%`);
        }
    });

    // -----------------------------------------------------
    // Initial page setup
    // -----------------------------------------------------

    loadProgressData();
    showCalculatorPlaceholder();
    renderProgressHistory();
    changeLanguage("fa");
})();
