// =========================================================
// ALORA RADIANCE — AUTH PAGE SCRIPT (login.html + register.html)
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    // ---------- LOGIN ----------
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            console.log("=== Login Form Submitted ===");
            console.log("Email:", email);
            console.log("Password:", password);

            // Yahan apna backend/API call daalein
            alert("Login Successful!");
            window.location.href = "./index.html";
        });
    }

    // ---------- REGISTER ----------
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            console.log("=== Register Form Submitted ===");
            console.log("Full Name:", name);
            console.log("Email:", email);
            console.log("Password:", password);

            // Yahan apna backend/API call daalein
            alert("Registration Successful!");
            window.location.href = "./login.html";
        });
    }
});

// ---------- GOOGLE SIGN-IN CALLBACK ----------
function handleCredentialResponse(response) {
    try {
        console.log("=== Google Authentication Success ===");

        const jwtToken = response.credential;
        const base64Url = jwtToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));

        const userProfile = JSON.parse(jsonPayload);
        console.log("Google Name:", userProfile.name);
        console.log("Google Email:", userProfile.email);

        localStorage.setItem("userToken", jwtToken);
        localStorage.setItem("userName", userProfile.name);

        alert(`Welcome, ${userProfile.name}!`);
        window.location.href = "./index.html";

    } catch (error) {
        console.error("Google Auth Token parsing me error aayi:", error);
    }
}