// Firebase Configuration
var firebaseConfig = {
    apiKey: "AIzaSyDUYnN3bOTPNHvKHdWwrlACOAnLCAgxiJI",
    authDomain: "manuu-59b30.firebaseapp.com",
    projectId: "manuu-59b30",
    storageBucket: "manuu-59b30.appspot.com",
    messagingSenderId: "872309397811",
    appId: "1:872309397811:web:86430ccca5022f63954646",
    measurementId: "G-CBC53KCBW7"
};

// Initialize Firebase only if it’s not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Register Function
function register() {
    var emailField = document.getElementById("email");
    var passwordField = document.getElementById("password");
    var roleField = document.getElementById("role"); // Use a dropdown instead of prompt

    if (!emailField || !passwordField || !roleField) {
        console.error("Error: Required fields not found!");
        return;
    }

    var email = emailField.value.trim();
    var password = passwordField.value.trim();
    var role = roleField.value.toLowerCase();

    if (!email || !password || (role !== "admin" && role !== "user")) {
        alert("Invalid input! Please enter a valid email, password, and role.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;

            // Store user role in Firestore
            return db.collection("users").doc(user.uid).set({
                email: email,
                role: role
            });
        })
        .then(() => {
            alert("Account Created! You can now log in.");
            window.location.href = "login.html"; // Redirect after success
        })
        .catch((error) => {
            console.error("Firebase Error:", error);
            document.getElementById("error-message").innerText = error.message;
        });
}

// Attach event listener after DOM loads
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("registerBtn")?.addEventListener("click", register);
});
