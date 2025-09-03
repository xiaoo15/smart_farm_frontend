// Di dalam file chat.js
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

// Periksa apakah elemen ditemukan
if (!chatForm || !chatInput || !chatMessages) {
  console.error("Elemen chat tidak ditemukan.");
} else {
  // Hanya pasang event listener jika elemen ditemukan
  function addChatBubble(message, sender = "ai") {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble", sender);
    bubble.textContent = message;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getAIResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    if (msg.includes("halo") || msg.includes("hai")) {
      return "Halo! Ada yang bisa saya bantu?";
    } else if (msg.includes("harga")) {
      return "Harga bibit dan sayuran bervariasi, silakan cek katalog kami.";
    } else if (msg.includes("cara beli")) {
      return "Untuk membeli, pilih produk lalu klik tombol 'Beli'.";
    } else if (msg.includes("terima kasih") || msg.includes("makasih")) {
      return "Sama-sama! Senang bisa membantu.";
    } else {
      return "Maaf, saya belum mengerti. Bisa ulangi dengan kata lain?";
    }
  }

  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addChatBubble(userMessage, "user");
    chatInput.value = "";

    setTimeout(() => {
      const aiResponse = getAIResponse(userMessage);
      addChatBubble(aiResponse, "ai");
    }, 700);
  });
}