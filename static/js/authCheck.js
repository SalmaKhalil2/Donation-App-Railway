document.addEventListener("DOMContentLoaded", function () {
    // التقاط زر "إنشاء الحملة" الذي يجب أن يكون له id="generateCampaignButton"
    const generateButton = document.getElementById("generateCampaignButton");

    if (generateButton) {
        generateButton.addEventListener("click", function (event) {
            // إذا كان المستخدم غير مسجل دخول (isLoggedIn === "false")
            if (isLoggedIn === "false") {
                event.preventDefault(); // منع إرسال النموذج
                showLoginModal();
            }
        });
    }
});

function showLoginModal() {
    // إنشاء طبقة خلفية معتمة
    const overlay = document.createElement("div");
    overlay.id = "modalOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "999";

    // إنشاء النافذة المنبثقة (Modal)
    const modal = document.createElement("div");
    modal.id = "loginModal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.width = "300px";
    modal.style.padding = "20px";
    modal.style.backgroundColor = "#fff";
    modal.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.3)";
    modal.style.textAlign = "center";
    modal.style.borderRadius = "8px";
    modal.style.zIndex = "1000";

    // نص الرسالة
    const message = document.createElement("p");
    message.textContent = "يجب عليك تسجيل الدخول أولاً قبل إنشاء حملة!";
    modal.appendChild(message);

    // زر الإغلاق
    const closeButton = document.createElement("button");
    closeButton.textContent = "حسنًا";
    closeButton.style.marginTop = "10px";
    closeButton.style.padding = "8px 15px";
    closeButton.style.border = "none";
    closeButton.style.backgroundColor = "#4CAF50";
    closeButton.style.color = "#fff";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";

    closeButton.addEventListener("click", function () {
        // إزالة النافذة المنبثقة والطبقة الخلفية
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    });

    modal.appendChild(closeButton);

    // إضافة الطبقة والنافذة للـ DOM
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}
