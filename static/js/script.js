document.addEventListener("DOMContentLoaded", function () {
    // إدارة نافذة التسجيل المنبثقة
    let registerModal = document.getElementById("registerModal");
    let openRegisterLink = document.getElementById("openRegisterLink");
    let closeBtn = document.querySelector(".close");

    // فتح نافذة التسجيل عند الضغط على "حساب جديد"
    openRegisterLink.addEventListener("click", function (event) {
        event.preventDefault();
        registerModal.style.display = "flex";
    });

    // إغلاق النافذة عند الضغط على زر الإغلاق
    closeBtn.addEventListener("click", function () {
        registerModal.style.display = "none";
    });

    // إغلاق النافذة عند الضغط خارج محتواها
    window.addEventListener("click", function (event) {
        if (event.target === registerModal) {
            registerModal.style.display = "none";
        }
    });
});

// وظائف آلة حاسبة الزكاة
function toggleCalculator() {
    let modal = document.getElementById("modall");
    let calculator = document.getElementById("calculator");

    modal.style.display = "flex";  // إظهار الخلفية المعتمة
    calculator.style.display = "block";  // إظهار الآلة الحاسبة
}

function closeCalculator(event) {
    let modal = document.getElementById("modall");
    let calculator = document.getElementById("calculator");

    if (!event || event.target === modal || event.target.classList.contains("close")) {
        modal.style.display = "none";  // إخفاء الخلفية المعتمة
        calculator.style.display = "none";  // إخفاء الآلة الحاسبة أيضًا
    }
}

function calculateZakat() {
    let money = parseFloat(document.getElementById("money").value);
    let nisab = 263500; // نصاب الزكاة

    if (money && money > 0) {
        if (money >= nisab) {
            let zakat = money * 0.025;
            document.getElementById("result").innerText = "الزكاة المستحقة: " + zakat.toFixed(2) + " جنيه";
        } else {
            document.getElementById("result").innerText = "ليس عليك زكاة، المبلغ أقل من النصاب";
        }
    } else {
        document.getElementById("result").innerText = "يرجى إدخال مبلغ صالح";
    }
}
