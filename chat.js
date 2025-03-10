// Firebase configuration (Ensure it's already initialized)
var firebaseConfig = {
  apiKey: "AIzaSyDUYnN3bOTPNHvKHdWwrlACOAnLCAgxiJI",
  authDomain: "manuu-59b30.firebaseapp.com",
  projectId: "manuu-59b30",
  storageBucket: "manuu-59b30.appspot.com",
  messagingSenderId: "872309397811",
  appId: "1:872309397811:web:86430ccca5022f63954646",
  measurementId: "G-CBC53KCBW7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Reference to the messages collection
const messagesRef = db.collection("messages");

// Load messages and listen for updates
messagesRef.orderBy("timestamp").onSnapshot(snapshot => {
  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = ""; // Clear messages before reloading

  snapshot.forEach(doc => {
    const messageData = doc.data();
    const messageId = doc.id;
    const messageElement = document.createElement("div");
    
    messageElement.classList.add("message");
    messageElement.innerHTML = `
      <span>${messageData.text}</span>
      <button class="delete-btn" data-id="${messageId}">Delete</button>
    `;
    
    messagesDiv.appendChild(messageElement);
  });

  // Attach delete event listeners
  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", event => {
      const id = event.target.getAttribute("data-id");
      deleteMessage(id);
    });
  });
});

// Send message
document.getElementById("chat-form").addEventListener("submit", event => {
  event.preventDefault();
  const messageInput = document.getElementById("message-input");
  const messageText = messageInput.value.trim();

  if (messageText) {
    messagesRef.add({
      text: messageText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    messageInput.value = ""; // Clear input after sending
  }
});

// Function to delete a message
function deleteMessage(id) {
  messagesRef.doc(id).delete().then(() => {
    console.log("Message deleted!");
  }).catch(error => {
    console.error("Error deleting message:", error);
  });
}
