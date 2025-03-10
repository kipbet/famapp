// Firebase configuration (replace with your actual config)
var firebaseConfig = {
    apiKey: "AIzaSyDUYnN3bOTPNHvKHdWwrlACOAnLCAgxiJI",
    authDomain: "manuu-59b30.firebaseapp.com",
    projectId: "manuu-59b30",
    storageBucket: "manuu-59b30.firebasestorage.app",
    messagingSenderId: "872309397811",
    appId: "1:872309397811:web:86430ccca5022f63954646",
    measurementId: "G-CBC53KCBW7"
  };
  
  // Initialize Firebase if not already initialized
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  var db = firebase.firestore();
  var auth = firebase.auth();
  
  // Check for user authentication
  auth.onAuthStateChanged(function(user) {
    if (!user) {
      window.location.href = "index.html"; // redirect to login if not authenticated
    } else {
      console.log("User logged in:", user);
      // Fetch additional user data from Firestore
      db.collection("users").doc(user.uid).get()
        .then(function(doc) {
          if (doc.exists) {
            console.log("User document found:", doc.data());
            const userData = doc.data();
            document.getElementById("profile-email").value = userData.email || "";
            document.getElementById("profile-name").value = userData.name || "";
            document.getElementById("profile-role").value = userData.role || "";
          } else {
            console.log("No user document found for", user.uid);
            // Optionally initialize form fields if document doesn't exist
            document.getElementById("profile-email").value = user.email || "";
            document.getElementById("profile-name").value = "";
            document.getElementById("profile-role").value = "";
          }
        })
        .catch(function(error) {
          console.error("Error fetching user data:", error);
        });
    }
  });
  
  // Handle form submission to update profile details
  document.getElementById("profile-form").addEventListener("submit", function(e) {
    e.preventDefault();
    
    let user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found.");
      return;
    }
    
    let newName = document.getElementById("profile-name").value;
    console.log("Updating profile for user:", user.uid, "with new name:", newName);
    
    db.collection("users").doc(user.uid).set({
      name: newName,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
    .then(function() {
      document.getElementById("profile-message").innerText = "Profile updated successfully!";
      console.log("Profile updated successfully.");
    })
    .catch(function(error) {
      document.getElementById("profile-message").innerText = "Error updating profile: " + error.message;
      console.error("Error updating profile:", error);
    });
  });
  