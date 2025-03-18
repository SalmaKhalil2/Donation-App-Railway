// التحقق من تنسيق البريد الإلكتروني في نموذج التسجيل
function addGmailDomain(input) {
    let emailError = document.getElementById("registerEmailError");
    // التحقق من أن البريد الإلكتروني ينتهي بـ "@gmail.com"
    if (!input.value.endsWith("@gmail.com")) {
        emailError.innerText = "❌ الرجاء كتابة البريد الإلكتروني بالشكل الصحيح: example@gmail.com";
    } else {
        emailError.innerText = "";
        checkEmailExists(input.value); // استدعاء التحقق من وجود البريد فقط عند صحة التنسيق
    }
}

// التحقق من البريد الإلكتروني أثناء الكتابة (AJAX)
function checkEmailExists(email) {
    let errorMsg = document.getElementById("registerEmailError");
    let passwordInput = document.getElementById("registerPassword");
    let confirmPasswordInput = document.getElementById("registerConfirmPassword");
    let submitButton = document.getElementById("registerSubmitButton");

    fetch("/check_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.exists) {
            errorMsg.innerText = "❌ البريد الإلكتروني مستخدم بالفعل!";
            passwordInput.disabled = true;
            confirmPasswordInput.disabled = true;
            passwordInput.value = "";
            confirmPasswordInput.value = "";
            submitButton.disabled = true;
        } else {
            errorMsg.innerText = "";
            passwordInput.disabled = false;
            confirmPasswordInput.disabled = false;
            submitButton.disabled = false;
        }
    });
}

// التحقق من صحة كلمة المرور وتأكيدها في نموذج التسجيل
function validatePasswords() {
    let password = document.getElementById("registerPassword").value;
    let confirmPassword = document.getElementById("registerConfirmPassword").value;
    let passwordError = document.getElementById("registerPasswordError");

    if (password !== confirmPassword && confirmPassword !== "") {
        passwordError.innerText = "❌ كلمتا المرور غير متطابقتين!";
        return false;
    } else {
        passwordError.innerText = "";
        return true;
    }
}

// التحقق النهائي عند إرسال نموذج التسجيل
function validateForm() {
    let emailInput = document.getElementById("registerEmail").value;
    let errorMsg = document.getElementById("registerEmailError");

    if (!emailInput.endsWith("@gmail.com")) {
        errorMsg.innerText = "❌ يجب أن يكون البريد الإلكتروني تابعًا لـ Gmail (مثال: user@gmail.com)";
        return false;
    }

    if (errorMsg.innerText !== "" || !validatePasswords()) {
        return false; // منع الإرسال إذا كان هناك خطأ
    }

    return true;
}
