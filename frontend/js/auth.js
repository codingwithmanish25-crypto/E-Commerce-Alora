import BASE_URL from "./config.js";
import { showSuccessModal, renderNavbarState } from "./app.js"; // app.js se global helpers import kiye

// ==========================================
// 1. LOGIN FORM HANDLING
// ==========================================
function setupLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // LocalStorage update
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                // Navbar immediate state update
                renderNavbarState();

                showSuccessModal(
                    "Login Successful!", 
                    `Welcome back, ${data.user.name}!`, 
                    () => {
                        window.location.href = "./index.html";
                    }
                );
            } else {
                showSuccessModal("Login Failed", data.message || "Invalid credentials.", null);
            }
        } catch (error) {
            console.error("Login Error:", error);
            showSuccessModal("Error", "Server offline ya connection issue hai.", null);
        }
    });
}

// ==========================================
// 2. REGISTER FORM HANDLING (With Phone integration)
// ==========================================
function setupRegisterForm() {
    const registerForm = document.getElementById("registerForm");
    if (!registerForm) return;

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim(); // HTML input se phone fetch kiya
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, password }) // Phone backend payload me attach ho gaya
            });

            const data = await response.json();

            if (response.ok) {
                showSuccessModal(
                    "Registration Successful!", 
                    "Your account has been created. Click OK to login.", 
                    () => {
                        window.location.href = "./login.html";
                    }
                );
            } else {
                showSuccessModal("Registration Failed", data.message || "Please fill all details correctly.", null);
            }
        } catch (error) {
            console.error("Register Error:", error);
            showSuccessModal("Error", "Server side API connection error.", null);
        }
    });
}

// DOM content load trigger
document.addEventListener("DOMContentLoaded", () => {
    setupLoginForm();
    setupRegisterForm();
});