function autoCompleteEmail(input) {
    let emailError = document.getElementById("emailError");
    // إذا البريد لا ينتهي بـ "@gmail.com"
    if (!input.value.endsWith("@gmail.com")) {
        emailError.innerText = "❌ الرجاء كتابة البريد الإلكتروني بالشكل الصحيح: example@gmail.com";
    } else {
        emailError.innerText = "";
    }
}


function validateLoginForm() {
    let emailInput = document.getElementById("email").value;
    let passwordInput = document.getElementById("password").value;
    let emailError = document.getElementById("emailError");
    let passwordError = document.getElementById("passwordError");

    emailError.innerText = "";
    passwordError.innerText = "";

    // التحقق من صحة البريد الإلكتروني لتسجيل الدخول
    if (!emailInput.endsWith("@gmail.com")) {
        emailError.innerText = "❌ يجب أن يكون البريد الإلكتروني تابعًا لـ Gmail (مثال: user@gmail.com)";
        return false;
    }

    return true;
}
