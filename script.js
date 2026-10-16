// انتخاب عناصر سایت
const langBtn = document.getElementById("langBtn");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

let currentLanguage = "fa";

// تغییر زبان فارسی و انگلیسی
function changeLanguage(language) {
    currentLanguage = language;

    const isEnglish = language === "en";

    // تغییر جهت صفحه
    document.documentElement.lang = language;
    document.documentElement.dir = isEnglish ? "ltr" : "rtl";

    document.body.classList.toggle("en", isEnglish);

    // تغییر نوشته‌های دو زبانه
    document.querySelectorAll("[data-fa][data-en]").forEach(element => {
        element.innerHTML = isEnglish
            ? element.dataset.en
            : element.dataset.fa;
    });

    // تغییر متن راهنمای ورودی‌های فرم
    document.querySelectorAll(
        "[data-placeholder-fa][data-placeholder-en]"
    ).forEach(element => {
        element.placeholder = isEnglish
            ? element.dataset.placeholderEn
            : element.dataset.placeholderFa;
    });

    // تغییر متن دکمه زبان
    langBtn.textContent = isEnglish ? "FA" : "EN";

    // تغییر عنوان مرورگر
    document.title = isEnglish
        ? "FitZone | Fitness Club"
        : "FitZone | باشگاه تناسب اندام";

    // بستن منوی موبایل
    nav.classList.remove("open");
}

// رویداد تغییر زبان
langBtn.addEventListener("click", function () {
    const newLanguage = currentLanguage === "fa" ? "en" : "fa";
    changeLanguage(newLanguage);
});

// باز و بسته کردن منوی موبایل
menuBtn.addEventListener("click", function () {
    nav.classList.toggle("open");

    const isOpen = nav.classList.contains("open");

    menuBtn.setAttribute("aria-expanded", isOpen);
});

// بستن منو پس از انتخاب هر لینک
nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function () {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
    });
});

// نمایش سال جاری در فوتر
document.getElementById("year").textContent =
    new Date().getFullYear();

// مدیریت فرم تماس
contactForm.addEventListener("submit", function (event) {
    // جلوگیری از بارگذاری مجدد صفحه
    event.preventDefault();

    // بررسی اطلاعات ضروری
    const name = document.getElementById("name").value.trim();
    const contact = document.getElementById("email").value.trim();

    if (!name || !contact) {
        formMessage.textContent = currentLanguage === "fa"
            ? "لطفاً نام و راه ارتباطی خود را وارد کنید."
            : "Please enter your name and contact details.";

        return;
    }

    // نمایش پیام آزمایشی
    formMessage.textContent = currentLanguage === "fa"
        ? "اطلاعات وارد شد؛ برای دریافت واقعی درخواست‌ها باید فرم به سرور یا سرویس ایمیل متصل شود."
        : "Details entered. Connect this form to a server or email service to receive submissions.";

    formMessage.style.color = "#5d812a";
});

// انتخاب زبان پیش‌فرض
changeLanguage("fa");
