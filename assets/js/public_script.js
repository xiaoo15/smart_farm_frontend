/* =================================================================== */
<<<<<<< HEAD
/* SMARTFARM PUBLIC CONSOLIDATED SCRIPT - ALL PUBLIC PAGES */
/* =================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    window.addEventListener("load", function () {
      preloader.classList.add("loaded");
      // Hapus elemen dari DOM setelah transisi selesai
      preloader.addEventListener("transitionend", function () {
        preloader.remove();
      });
    });
  }
  // =================================================================== */
  // NAVBAR LOADING */
  // =================================================================== */

  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    fetch("/components/_navbar_public.html")
      .then((response) =>
        response.ok
          ? response.text()
          : Promise.reject("Navbar public not found")
      )
      .then((data) => {
        headerPlaceholder.innerHTML = data;
        // Initialize navbar functionality after loading
        initializeNavbar();
      })
      .catch((error) => console.error("Error loading navbar public:", error));
  }

  // =================================================================== */
  // FOOTER LOADING */
  // =================================================================== */

  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    fetch("/components/_footer_public.html")
      .then((response) => response.text())
      .then((html) => {
        footerPlaceholder.innerHTML = html;
      })
      .catch((error) => console.error("Error loading footer:", error));
  }

  // =================================================================== */
  // NAVBAR FUNCTIONALITY */
  // =================================================================== */

  function initializeNavbar() {
    // Definisi elemen-elemen penting
    const mobileMenuToggle = document.querySelector(".navbar-toggler");
    const mobileMenu = document.querySelector(".navbar-collapse");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    // ===================================================================
    // [1] LOGIKA BUKA/TUTUP MENU DARI TOMBOL HAMBURGER
    // ===================================================================
    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener("click", function (event) {
        // Hentikan event agar tidak langsung ditangkap oleh listener dokumen
        event.stopPropagation();
        mobileMenu.classList.toggle("show");
      });
    }

    // ===================================================================
    // [2] LOGIKA MENUTUP MENU SAAT LINK DI DALAMNYA DI-KLIK
    // ===================================================================
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (mobileMenu.classList.contains("show")) {
          mobileMenu.classList.remove("show");
        }
      });
    });

    // ===================================================================
    // [3] LOGIKA MENUTUP MENU SAAT KLIK DI LUAR AREA NAVBAR
    // ===================================================================
    document.addEventListener("click", function (event) {
      if (mobileMenu && mobileMenu.classList.contains("show")) {
        const isClickInsideNavbar = mobileMenu.contains(event.target);
        const isClickOnToggler = mobileMenuToggle.contains(event.target);

        if (!isClickInsideNavbar && !isClickOnToggler) {
          mobileMenu.classList.remove("show");
        }
      }
    });

    // ===================================================================
    // [4] LOGIKA UNTUK MENANDAI LINK NAVBAR YANG AKTIF (YANG HILANG TADI)
    // ===================================================================
    const currentPage = window.location.pathname.split("/").pop(); // Mengambil nama file, misal: "products.html"

    navLinks.forEach((link) => {
      const linkPage = link.getAttribute("href").split("/").pop();

      // Hapus dulu semua class active yang mungkin ada
      link.classList.remove("active");

      // Jika nama file di link sama dengan nama file halaman saat ini, tambahkan class active
      // Pengecualian untuk halaman utama (index.html atau "")
      if (
        linkPage === currentPage ||
        (currentPage === "" && linkPage === "index.html")
      ) {
        link.classList.add("active");
      }
    });

    // ===================================================================
    // KODE LAINNYA (SEARCH & CART BADGE) - BIARKAN SEPERTI INI
    // ===================================================================

    // Handle mobile search overlay
    const mobileSearchIcon = document.getElementById("mobile-search-icon");
    const searchOverlay = document.getElementById("search-overlay");
    const closeSearchBtn = document.getElementById("close-search-btn");
    const searchOverlayInput = document.getElementById("search-overlay-input");

    if (mobileSearchIcon && searchOverlay && closeSearchBtn) {
      mobileSearchIcon.addEventListener("click", function (e) {
        e.preventDefault();
        searchOverlay.classList.add("active");
        setTimeout(() => searchOverlayInput.focus(), 300);
      });

      closeSearchBtn.addEventListener("click", function () {
        searchOverlay.classList.remove("active");
      });

      searchOverlay.addEventListener("click", function (e) {
        if (e.target === searchOverlay) {
          searchOverlay.classList.remove("active");
        }
      });
    }

    // Handle search form submission
    function handleSearch(event) {
      event.preventDefault();
      const searchInput = event.target.querySelector('input[type="search"]');
      if (searchInput && searchInput.value.trim()) {
        const query = searchInput.value.trim();
        window.location.href = `products.html?search=${encodeURIComponent(
          query
        )}`;
      }
    }

    const desktopSearchForm = document.querySelector(".search-form");
    const overlaySearchForm = document.querySelector(".search-form-overlay");

    if (desktopSearchForm) {
      desktopSearchForm.addEventListener("submit", handleSearch);
    }
    if (overlaySearchForm) {
      overlaySearchForm.addEventListener("submit", handleSearch);
    }

    // Update cart badge
    updateCartBadge();
  }
  // =================================================================== */
  // CART FUNCTIONALITY */
  // =================================================================== */

  function updateCartBadge() {
    const cartBadge = document.querySelector(".cart-badge");
    if (cartBadge) {
      // Get cart count from localStorage or API
      const cartCount = getCartCount();
      cartBadge.textContent = cartCount;
      cartBadge.style.display = cartCount > 0 ? "flex" : "none";
    }
  }

  function getCartCount() {
    try {
      const cart = JSON.parse(localStorage.getItem("smartfarm_cart") || "[]");
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      return 0;
    }
  }

  function addToCart(productId, productName, price, image) {
    try {
      let cart = JSON.parse(localStorage.getItem("smartfarm_cart") || "[]");
      const existingItem = cart.find((item) => item.id === productId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: productId,
          name: productName,
          price: price,
          image: image,
          quantity: 1,
        });
      }

      localStorage.setItem("smartfarm_cart", JSON.stringify(cart));
      updateCartBadge();
      showNotification(`${productName} ditambahkan ke keranjang!`, "success");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotification("Gagal menambahkan ke keranjang", "error");
    }
  }

  // Make addToCart globally available
  window.addToCart = addToCart;

  /* =================================================================== */
  /* CHAT FUNCTIONALITY (VERSI GEMINI API) */
  /* =================================================================== */

  const chatButton = document.querySelector(".chat-button");
  const chatBox = document.querySelector(".chat-box");
  const chatClose = document.querySelector(".chat-close");
  const chatInput = document.querySelector(".chat-input");
  const chatSend = document.querySelector(".chat-send");
  const chatMessages = document.querySelector(".chat-messages");
  const notification = document.querySelector(".notification");

  if (chatButton && chatBox) {
    // Toggle chat box
    chatButton.addEventListener("click", function () {
      chatBox.classList.toggle("active");
      if (notification) {
        notification.style.display = "none";
      }
    });

    // Close chat box
    if (chatClose) {
      chatClose.addEventListener("click", function () {
        chatBox.classList.remove("active");
      });
    }

    // --- FUNGSI UTAMA PENGIRIMAN PESAN (SUDAH DIUBAH) ---
    async function sendMessage() {
      const message = chatInput.value.trim();
      if (message === "") return;

      addMessage(message, "user");
      chatInput.value = "";

      // Tampilkan loading...
      addMessage("AI sedang mikir...", "ai-loading");

      try {
        // Kirim pesan ke backend kita
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: message }),
        });

        // Hapus pesan "loading..."
        const loadingMessage = chatMessages.querySelector(
          ".ai-loading-message"
        );
        if (loadingMessage) {
          loadingMessage.remove();
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Server error");
        }

        const data = await response.json();
        addMessage(data.reply, "ai"); // Tampilkan balasan dari Gemini
      } catch (error) {
        console.error("Error:", error);
        addMessage(
          "Waduh, koneksi ke AI gagal. Coba cek server atau koneksimu ya.",
          "ai"
        );
      }
    }

    if (chatSend) chatSend.addEventListener("click", sendMessage);
    if (chatInput)
      chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          sendMessage();
        }
      });

    // --- FUNGSI UNTUK MENAMBAHKAN PESAN KE LAYAR ---
    function addMessage(text, type) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      // Ganti nama kelas 'ai-message' jadi 'ai' biar konsisten
      if (type === "ai" || type === "user") {
        messageElement.classList.add(`${type}-message`);
      } else if (type === "ai-loading") {
        messageElement.classList.add("ai-message", "ai-loading-message");
        text = `<i class="fas fa-spinner fa-pulse"></i> ${text}`; // Tambahkan ikon loading
      }

      messageElement.innerHTML = text;

      if (chatMessages) {
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }

    if (notification) {
      setTimeout(() => {
        notification.style.display = "flex";
      }, 3000);
    }
  }

  // =================================================================== */
  // PRODUCT INTERACTIONS */
  // =================================================================== */

  // Handle product card interactions
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    // Add hover effects
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });

    // Handle add to cart buttons
    const addToCartBtn = card.querySelector(".add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const productId = this.getAttribute("data-product-id");
        const productName = this.getAttribute("data-product-name");
        const productPrice = this.getAttribute("data-product-price");
        const productImage = this.getAttribute("data-product-image");

        if (productId && productName && productPrice) {
          addToCart(productId, productName, productPrice, productImage);
        }
      });
    }
  });

  // =================================================================== */
  // SEARCH FUNCTIONALITY */
  // =================================================================== */

  // Handle search on products page
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search");

  if (searchQuery) {
    // Highlight search results
    const productTitles = document.querySelectorAll(".product-title");
    productTitles.forEach((title) => {
      const text = title.textContent.toLowerCase();
      if (text.includes(searchQuery.toLowerCase())) {
        title.parentElement.style.border = "2px solid var(--primary)";
        title.parentElement.style.borderRadius = "8px";
      }
    });
  }

  // =================================================================== */
  // MODAL FUNCTIONALITY */
  // =================================================================== */

  // Handle product detail modals
  const productDetailBtns = document.querySelectorAll(".product-detail-btn");
  productDetailBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      const productId = this.getAttribute("data-product-id");
      if (productId) {
        showProductModal(productId);
      }
    });
  });

  function showProductModal(productId) {
    // This would typically fetch product details from an API
    // For now, we'll show a placeholder modal
    const modal = document.createElement("div");
    modal.className = "modal fade show";
    modal.style.display = "block";
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Product Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Loading product details for ID: ${productId}</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // =================================================================== */
  // NOTIFICATION SYSTEM */
  // =================================================================== */

  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText =
      "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  // Make notification function globally available
  window.showNotification = showNotification;

  // =================================================================== */
  // SMOOTH SCROLLING */
  // =================================================================== */

  // Handle smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // =================================================================== */
  // LAZY LOADING IMAGES */
  // =================================================================== */

  // Simple lazy loading for product images
  const productImages = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    productImages.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    productImages.forEach((img) => {
      img.src = img.dataset.src;
    });
  }

  // =================================================================== */
  // FORM VALIDATION */
  // =================================================================== */

  // Handle contact forms
  const contactForms = document.querySelectorAll("form[data-contact]");
  contactForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const name = formData.get("name");
      const email = formData.get("email");
      const message = formData.get("message");

      if (!name || !email || !message) {
        showNotification("Mohon lengkapi semua field", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showNotification("Format email tidak valid", "error");
        return;
      }

      // Simulate form submission
      showNotification("Pesan berhasil dikirim!", "success");
      this.reset();
    });
  });

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // =================================================================== */
  // INITIALIZATION */
  // =================================================================== */

  // Initialize cart badge on page load
  updateCartBadge();

  // Add loading animation to page
  document.body.classList.add("loaded");
});

document.addEventListener("DOMContentLoaded", function () {
  // --- BAGIAN KERANJANG BELANJA (cart.html) ---
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function (e) {
      // Ambil semua item di keranjang
      const cartItems = [];
      document.querySelectorAll(".cart-item").forEach((item) => {
        const name = item.querySelector(".cart-item-name").innerText;
        const price = item.querySelector(".cart-item-price p").innerText;
        const quantity = item.querySelector(".cart-item-quantity input").value;
        cartItems.push({ name, price, quantity });
      });

      // Ambil total harga
      const total = document.querySelector(
        ".summary-total span:last-child"
      ).innerText;

      // Simpan di localStorage biar bisa diakses halaman lain
      localStorage.setItem("cartData", JSON.stringify(cartItems));
      localStorage.setItem("cartTotal", total);
    });
  }

  // --- BAGIAN HALAMAN PEMBAYARAN (pembayaran.html) ---
  const summaryContainer = document.getElementById("summary-items");
  const totalPayment = document.getElementById("total-payment");
  if (summaryContainer) {
    const cartData = JSON.parse(localStorage.getItem("cartData"));
    const cartTotal = localStorage.getItem("cartTotal");

    if (cartData && cartTotal) {
      cartData.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("summary-item");
        itemElement.innerHTML = `<span>${item.name} (x${item.quantity})</span> <span>${item.price}</span>`;
        summaryContainer.appendChild(itemElement);
      });
      totalPayment.innerText = cartTotal;
    }
  }

  // --- BAGIAN HALAMAN STRUK (struk.html) ---
  const receiptItemsContainer = document.getElementById("receipt-items");
  if (receiptItemsContainer) {
    const cartData = JSON.parse(localStorage.getItem("cartData"));
    const cartTotal = localStorage.getItem("cartTotal");

    if (cartData && cartTotal) {
      document.getElementById("order-number").innerText =
        "SF-" + new Date().getTime();
      document.getElementById("order-date").innerText =
        new Date().toLocaleDateString("id-ID");
      document.getElementById("receipt-total").innerText = cartTotal;

      cartData.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("summary-item");
        itemElement.innerHTML = `<span>${item.name} (x${item.quantity})</span> <span>${item.price}</span>`;
        receiptItemsContainer.appendChild(itemElement);
      });

      // Hapus data dari localStorage setelah struk ditampilkan
      localStorage.removeItem("cartData");
      localStorage.removeItem("cartTotal");
    }
  }
});

// Ganti event listener yang lama dengan ini biar lebih fleksibel
document.addEventListener("click", function (e) {
  // Cari tombol "add to cart" yang mungkin di-klik
  const addToCartBtn = e.target.closest(
    ".action-btn[data-product-id], .btn-add-cart-icon[data-product-id]"
  );

  if (addToCartBtn) {
    e.preventDefault();
    e.stopPropagation();

    const productId = addToCartBtn.dataset.productId;
    const productName = addToCartBtn.dataset.productName;
    const productPrice = addToCartBtn.dataset.productPrice;
    const productImage = addToCartBtn.dataset.productImage;

    if (productId && productName && productPrice) {
      // Kirim elemen tombolnya juga ke fungsi addToCart
      addToCart(
        productId,
        productName,
        productPrice,
        productImage,
        addToCartBtn
      );
    }
  }
});

// Modifikasi fungsi addToCart untuk menerima elemen tombol
function addToCart(productId, productName, price, image, buttonElement) {
  try {
    let cart = JSON.parse(localStorage.getItem("smartfarm_cart") || "[]");
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: price,
        image: image,
        quantity: 1,
      });
    }

    localStorage.setItem("smartfarm_cart", JSON.stringify(cart));
    updateCartBadge();
    showNotification(`${productName} ditambahkan!`, "success");

    // --- BAGIAN BARU UNTUK ANIMASI TOMBOL ---
    if (buttonElement) {
      // Simpan ikon asli
      const originalIcon = buttonElement.innerHTML;
      // Tambahkan kelas 'added'
      buttonElement.classList.add("added");
      // Nonaktifkan tombol sementara
      buttonElement.disabled = true;

      // Setelah 1.5 detik, kembalikan seperti semula
      setTimeout(() => {
        buttonElement.classList.remove("added");
        buttonElement.innerHTML = originalIcon; // Kembalikan ikon asli
        buttonElement.disabled = false;
      }, 1500);
    }
    // --- AKHIR BAGIAN BARU ---
  } catch (error) {
    console.error("Error adding to cart:", error);
    showNotification("Gagal menambahkan ke keranjang", "error");
  }
}

/* =================================================================== */
/* PRODUCT CARD INTERACTIONS (ADD TO CART & WISHLIST) - VERSI UPGRADE */
/* =================================================================== */

// FUNGSI BARU UNTUK TOGGLE WISHLIST (TAMBAH/HAPUS)
// Buka file: assets/js/public_script.js

// GANTI FUNGSI LAMA DENGAN VERSI BARU INI
function toggleWishlist(productId, productName, buttonElement) {
  // Ambil data wishlist dari localStorage, atau buat array kosong jika belum ada
  let wishlist = JSON.parse(localStorage.getItem("smartfarm_wishlist")) || [];
  const icon = buttonElement.querySelector("i");

  // Cek apakah produk SUDAH ada di wishlist
  const productIndex = wishlist.indexOf(productId);

  if (productIndex > -1) {
    // --- LOGIKA HAPUS DARI WISHLIST ---
    wishlist.splice(productIndex, 1); // Hapus ID produk dari array

    if (icon) {
      icon.classList.remove("fas"); // Hapus ikon hati penuh
      icon.classList.add("far"); // Tambah ikon hati kosong
      buttonElement.style.color = ""; // Kembalikan warna default
    }
    showNotification(`${productName} dihapus dari wishlist`, "success");
  } else {
    // --- LOGIKA TAMBAH KE WISHLIST ---
    wishlist.push(productId); // Tambahkan ID produk ke array

    if (icon) {
      icon.classList.remove("far"); // Hapus ikon hati kosong
      icon.classList.add("fas"); // Tambah ikon hati penuh
      buttonElement.style.color = "#dc3545"; // Warna jadi merah
    }
    showNotification(`${productName} masuk ke wishlist!`, "success");
  }

  // Simpan kembali array wishlist yang sudah diperbarui ke localStorage
  localStorage.setItem("smartfarm_wishlist", JSON.stringify(wishlist));
}
// FUNGSI LAMA UNTUK KERANJANG (tetap sama)
function addToCart(productId, productName, price, image, buttonElement) {
=======
/* SMARTFARM PUBLIC SCRIPT V3.0 - FINAL & CLEANED VERSION */
/* =================================================================== */

/**
 * Listener utama yang akan berjalan setelah seluruh struktur HTML halaman dimuat.
 */
document.addEventListener("DOMContentLoaded", function () {
  // Aturan utama: Cek apakah ini halaman login.
  if (document.body.classList.contains("login-body")) {
    // Jika ya, langsung hajar preloader & jalankan skrip login.
    forceRemovePreloader();
    initializeLoginPage();
  } else {
    // Untuk SEMUA halaman lain, jalankan alur inisialisasi yang aman.
    initializeApp();
  }
});

/**
 * [FUNGSI UTAMA] Menginisialisasi seluruh halaman (selain login).
 * Menunggu semua komponen (header, footer) selesai dimuat
 * baru menghilangkan preloader.
 */
function initializeApp() {
  Promise.all([loadHeader(), loadFooter()])
    .then(() => {
      // SUKSES! Header & Footer SIAP!
      forceRemovePreloader();
      // Jalankan semua skrip lain yang butuh elemen dari header/footer.
      initializeNavbar();
      initializePageSpecificLogic(); // <== SEMUA LOGIKA HALAMAN ADA DI SINI
      initializeChatFunctionality();
    })
    .catch((error) => {
      // GAGAL!
      console.error("Gagal memuat komponen halaman:", error);
      forceRemovePreloader();
      const placeholder = document.getElementById("header-placeholder");
      if (placeholder)
        placeholder.innerHTML =
          "<h3 class='text-center text-danger my-5'>Waduh, gagal memuat halaman. Coba refresh lagi.</h3>";
    });
}

/**
 * ===================================================================
 * FUNGSI-FUNGSI PEMUAT KOMPONEN (Header, Footer, Preloader)
 * ===================================================================
 */

function loadHeader() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (!headerPlaceholder) return Promise.resolve();
  const isLoggedIn = isAuthenticated();
  const navbarFile = isLoggedIn
    ? "/components/_navbar_user.html"
    : "/components/_navbar_public.html";
  return fetch(navbarFile)
    .then((response) => {
      if (!response.ok)
        throw new Error(`File navbar tidak ditemukan: ${navbarFile}`);
      return response.text();
    })
    .then((data) => {
      headerPlaceholder.innerHTML = data;
    });
}

function loadFooter() {
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (!footerPlaceholder) return Promise.resolve();
  return fetch("/components/_footer_public.html")
    .then((response) => {
      if (!response.ok) throw new Error("File footer tidak ditemukan");
      return response.text();
    })
    .then((html) => {
      footerPlaceholder.innerHTML = html;
    });
}

function forceRemovePreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.add("loaded");
    setTimeout(() => {
      preloader.remove();
    }, 500);
  }
}

/**
 * ===================================================================
 * INISIALISASI & FUNGSI INTI
 * ===================================================================
 */

function initializeNavbar() {
  if (isAuthenticated()) {
    const userGreeting = document.getElementById("user-greeting");
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (userGreeting && currentUser) {
        const spanNama = userGreeting.querySelector("span");
        if (spanNama) {
          const firstName = currentUser.name.split(" ")[0];
          spanNama.textContent = `Halo ${firstName}!`;
        }
      }
    } catch (e) {
      console.error("Gagal memuat data pengguna:", e);
    }
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // [FIX] Hapus hanya item yang diperlukan, bukan semuanya
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");

        showNotification("Kamu berhasil keluar.", "success");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      });
    }
  }

  // Logika untuk menu mobile (hamburger menu)
  const mobileMenuToggle = document.querySelector(".navbar-toggler");
  const mobileMenu = document.querySelector(".navbar-collapse");
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle("show");
    });
    document.addEventListener("click", (e) => {
      if (
        mobileMenu.classList.contains("show") &&
        !e.target.closest(".navbar")
      ) {
        mobileMenu.classList.remove("show");
      }
    });
  }

  // Logika untuk menandai link navbar yang aktif
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach((link) => {
    if (link.getAttribute("href").endsWith(currentPage)) {
      link.classList.add("active");
    }
  });

  // Update badge keranjang belanja
  updateCartBadge();
}

/**
 * Mengatur fungsionalitas halaman login dan registrasi.
 */
function initializeLoginPage() {
  const getUsers = () =>
    JSON.parse(localStorage.getItem("smartfarm_users")) || [];
  const saveUsers = (users) =>
    localStorage.setItem("smartfarm_users", JSON.stringify(users));

  // Form Login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      const errorDiv = document.getElementById("login-error");
      const users = getUsers();
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );
      if (foundUser) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        window.location.href = "index.html";
      } else {
        errorDiv.textContent = "Email atau password salah!";
      }
    });
  }

  // [KODE BARU] Logika untuk Form Lupa Password
  const forgotForm = document.getElementById("forgot-password-form");
  if (forgotForm) {
    forgotForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("forgot-email").value;
      const errorDiv = document.getElementById("forgot-error");
      const successDiv = document.getElementById("forgot-success");

      const users = getUsers();
      const foundUser = users.find((user) => user.email === email);

      if (foundUser) {
        // Simulasi berhasil
        errorDiv.textContent = "";
        successDiv.textContent =
          "Link reset password telah dikirim ke email Anda!";

        // PENTING: Ini hanya untuk demo, karena kita tidak bisa kirim email sungguhan.
        // Kita tampilkan password user via alert. Di aplikasi nyata, ini SANGAT TIDAK AMAN.
        setTimeout(() => {
          alert(
            `(Hanya untuk Demo) Password Anda adalah: ${foundUser.password}\n\nDi aplikasi sungguhan, Anda akan menerima email.`
          );
        }, 1000);
      } else {
        // Jika email tidak ditemukan
        successDiv.textContent = "";
        errorDiv.textContent = "Email tidak ditemukan di database kami.";
      }
    });
  }

  // Form Registrasi
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("register-name").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;
      const errorDiv = document.getElementById("register-error");

      if (!name || !email || !password) {
        errorDiv.textContent = "Semua kolom wajib diisi!";
        return;
      }
      let users = getUsers();
      if (users.find((u) => u.email === email)) {
        errorDiv.textContent = "Email ini sudah terdaftar.";
        return;
      }
      const newUser = { name, email, password };
      users.push(newUser);
      saveUsers(users);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      window.location.href = "index.html";
    });
  }
}

/**
 * ===================================================================
 * FUNGSI-FUNGSI INTI
 * (Fungsi yang menjalankan logika utama seperti keranjang, notifikasi, dll)
 * ===================================================================
 */

/**
 * Menambahkan item ke keranjang belanja, dengan pengecekan login.
 */
function addToCart(productId, productName, price, image, buttonElement) {
  if (!isAuthenticated()) {
    showNotification("Masuk dulu yuk untuk mulai belanja!", "warning");
    setTimeout(() => (window.location.href = "login.html"), 1500);
    return;
  }
>>>>>>> parent of c1f175a (UPDATED PATH STRUCTURE)
  try {
    let cart = JSON.parse(localStorage.getItem("smartfarm_cart") || "[]");
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
<<<<<<< HEAD
        price: price,
        image: image,
=======
        price,
        image,
>>>>>>> parent of c1f175a (UPDATED PATH STRUCTURE)
        quantity: 1,
      });
    }
    localStorage.setItem("smartfarm_cart", JSON.stringify(cart));
    updateCartBadge();
    showNotification(`${productName} ditambahkan!`, "success");
<<<<<<< HEAD

    if (buttonElement) {
=======
    if (buttonElement) {
      // Animasi tombol
>>>>>>> parent of c1f175a (UPDATED PATH STRUCTURE)
      const originalIcon = buttonElement.innerHTML;
      buttonElement.classList.add("added");
      buttonElement.disabled = true;
      setTimeout(() => {
        buttonElement.classList.remove("added");
        buttonElement.innerHTML = originalIcon;
        buttonElement.disabled = false;
      }, 1500);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    showNotification("Gagal menambahkan ke keranjang", "error");
  }
}

<<<<<<< HEAD
// EVENT LISTENER BARU YANG LEBIH PINTAR
document.addEventListener("click", function (e) {
  const cartButton = e.target.closest(".btn-add-cart-icon");
  if (cartButton) {
    e.preventDefault();
    e.stopPropagation();
    const { productId, productName, productPrice, productImage } =
      cartButton.dataset;
    if (productId && productName) {
      addToCart(productId, productName, productPrice, productImage, cartButton);
    }
    return;
  }

  const wishlistButton = e.target.closest(".action-btn");
  if (wishlistButton && wishlistButton.querySelector(".fa-heart")) {
    e.preventDefault();
    e.stopPropagation();
    const { productId, productName } = wishlistButton.dataset;
    if (productId && productName) {
      toggleWishlist(productId, productName, wishlistButton);
    }
    return;
  }
});
=======
/**
 * Menambah/menghapus item dari wishlist, dengan pengecekan login.
 */
function toggleWishlist(productId, productName, buttonElement) {
  if (!isAuthenticated()) {
    showNotification("Kamu harus masuk untuk menambahkan wishlist.", "warning");
    setTimeout(() => (window.location.href = "login.html"), 1500);
    return;
  }
  let wishlist = JSON.parse(localStorage.getItem("smartfarm_wishlist")) || [];
  const icon = buttonElement.querySelector("i");
  const productIndex = wishlist.indexOf(productId);
  if (productIndex > -1) {
    wishlist.splice(productIndex, 1);
    if (icon) {
      icon.classList.remove("fas");
      icon.classList.add("far");
      buttonElement.style.color = "";
    }
    showNotification(`${productName} dihapus dari wishlist`, "info");
  } else {
    wishlist.push(productId);
    if (icon) {
      icon.classList.remove("far");
      icon.classList.add("fas");
      buttonElement.style.color = "#dc3545";
    }
    showNotification(`${productName} masuk ke wishlist!`, "success");
  }
  localStorage.setItem("smartfarm_wishlist", JSON.stringify(wishlist));
}

/**
 * Menampilkan notifikasi sementara di pojok layar.
 */
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  notification.style.cssText = "top: 20px; right: 20px; z-index: 9999;";
  notification.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 4000);
}

/**
 * Memperbarui angka pada ikon keranjang belanja.
 */
function updateCartBadge() {
  const cartBadge = document.querySelector(".cart-badge");
  if (!cartBadge) return;
  try {
    const cart = JSON.parse(localStorage.getItem("smartfarm_cart") || "[]");
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? "flex" : "none";
  } catch {
    cartBadge.textContent = 0;
    cartBadge.style.display = "none";
  }
}

/**
 * ===================================================================
 * HELPER & EVENT LISTENER GLOBAL
 * ===================================================================
 */

/**
 * Fungsi bantuan untuk mengecek status login.
 * @returns {boolean} - True jika login, false jika tidak.
 */
function isAuthenticated() {
  return localStorage.getItem("isLoggedIn") === "true";
}

/**
 * Event listener global yang menangani klik pada tombol 'add to cart' dan 'wishlist'.
 */
document.addEventListener("click", function (e) {
  // Cek apakah yang diklik adalah tombol 'add to cart'
  const cartButton = e.target.closest(".btn-add-cart-icon");
  if (cartButton) {
    e.preventDefault();
    const { productId, productName, productPrice, productImage } =
      cartButton.dataset;
    addToCart(productId, productName, productPrice, productImage, cartButton);
    return;
  }

  // Cek apakah yang diklik adalah tombol 'wishlist'
  const wishlistButton = e.target.closest(".action-btn");
  if (wishlistButton && wishlistButton.querySelector(".fa-heart")) {
    e.preventDefault();
    const { productId, productName } = wishlistButton.dataset;
    toggleWishlist(productId, productName, wishlistButton);
  }
});

/**
 * ===================================================================
 * FITUR-FITUR LAINNYA (CHAT, CHECKOUT, DLL)
 * ===================================================================
 */

/**
 * Mengatur fungsionalitas chat box.
 */
function initializeChatFunctionality() {
  const chatButton = document.querySelector(".chat-button");
  const chatBox = document.querySelector(".chat-box");
  const chatClose = document.querySelector(".chat-close");

  if (chatButton && chatBox) {
    chatButton.addEventListener("click", () =>
      chatBox.classList.toggle("active")
    );
    if (chatClose) {
      chatClose.addEventListener("click", () =>
        chatBox.classList.remove("active")
      );
    }
  }
  // Catatan: Logika pengiriman pesan (sendMessage, fetch API) tetap sama seperti kodemu sebelumnya.
  // Pastikan backend API di server.js sudah berjalan.
}

/**
 * Menjalankan skrip yang hanya dibutuhkan di halaman tertentu seperti keranjang dan pembayaran.
 */
/**
 * Menjalankan skrip yang hanya dibutuhkan di halaman tertentu.
 */
/**
 * Menjalankan skrip yang hanya dibutuhkan di halaman tertentu.
 */
function initializePageSpecificLogic() {
  const pagePath = window.location.pathname;

  // --- Keamanan untuk Halaman Akun ---
  const isAccountPage =
    pagePath.endsWith("profile.html") ||
    pagePath.endsWith("settings.html") ||
    pagePath.endsWith("orders.html");
  if (isAccountPage && !isAuthenticated()) {
    window.location.href = "login.html";
    return; // Hentikan fungsi jika user belum login di halaman akun.
  }

  // --- Logika untuk Halaman Profil ---
  if (pagePath.endsWith("profile.html")) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      document.getElementById("profile-name").value = currentUser.name;
      document.getElementById("profile-email").value = currentUser.email;
    }
    const profileForm = document.getElementById("profile-form");
    if (profileForm) {
      profileForm.addEventListener("submit", function (e) {
        e.preventDefault();
        showNotification("Profil berhasil diperbarui!", "success");
      });
    }
  }

  if (pagePath.endsWith("orders.html")) {
    const reviewModal = new bootstrap.Modal(
      document.getElementById("reviewModal")
    );
    const reviewButtons = document.querySelectorAll(".review-btn");
    const reviewOrderId = document.getElementById("review-order-id");
    const stars = document.querySelectorAll(".rating-stars i");
    const ratingValue = document.getElementById("rating-value");
    const submitReviewBtn = document.getElementById("submit-review-btn");
    let currentRating = 0;

    // Saat tombol "Beri Ulasan" di-klik
    reviewButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const orderId = this.dataset.orderId;
        reviewOrderId.textContent = orderId;
      });
    });

    // Logika untuk hover dan klik bintang
    stars.forEach((star) => {
      star.addEventListener("mouseover", function () {
        const rating = parseInt(this.dataset.rating);
        stars.forEach((s) => {
          s.classList.toggle("active", s.dataset.rating <= rating);
        });
      });

      star.addEventListener("mouseout", function () {
        stars.forEach((s) => {
          s.classList.toggle("active", s.dataset.rating <= currentRating);
        });
      });

      star.addEventListener("click", function () {
        currentRating = parseInt(this.dataset.rating);
        ratingValue.value = currentRating;
      });
    });

    // Saat tombol "Kirim Ulasan" di dalam modal di-klik
    if (submitReviewBtn) {
      submitReviewBtn.addEventListener("click", function () {
        if (currentRating === 0) {
          showNotification("Pilih bintang rating dulu ya!", "warning");
          return;
        }
        // Di sini nanti bisa ditambahkan logika untuk mengirim data ke server
        console.log(
          `Rating: ${currentRating}, Komentar: ${
            document.getElementById("review-comment").value
          }`
        );

        showNotification("Terima kasih atas ulasanmu!", "success");
        reviewModal.hide();

        // (Opsional) Ganti tombol setelah memberi ulasan
        const reviewedButton = document.querySelector(
          `.review-btn[data-order-id="${reviewOrderId.textContent}"]`
        );
        if (reviewedButton) {
          reviewedButton.textContent = "Lihat Ulasan";
          reviewedButton.classList.remove("btn-warning");
          reviewedButton.classList.add("btn-outline-success");
          reviewedButton.disabled = true;
        }
      });
    }
  }

  // --- Logika untuk Halaman Pengaturan ---
  if (pagePath.endsWith("settings.html")) {
    const changePasswordForm = document.getElementById("change-password-form");
    if (changePasswordForm) {
      changePasswordForm.addEventListener("submit", function (e) {
        e.preventDefault();
        showNotification("Password berhasil diubah!", "success");
        this.reset();
      });
    }
  }

  // --- Logika untuk Halaman Lacak Pesanan (YANG BARU) ---
  if (pagePath.endsWith("lacak.html")) {
    const trackingForm = document.getElementById("tracking-form");
    const formSection = document.getElementById("tracking-form-section");
    const resultSection = document.getElementById("tracking-result-section");
    const trackNewBtn = document.getElementById("track-new-btn");
    const resultOrderId = document.getElementById("result-order-id");
    const orderIdInput = document.getElementById("order-id-input");

    if (trackingForm) {
      trackingForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const orderId = orderIdInput.value;
        if (!orderId) return;

        showNotification("Mencari pesanan...", "info");

        setTimeout(() => {
          resultOrderId.textContent = orderId;
          formSection.classList.add("d-none");
          resultSection.classList.remove("d-none");
        }, 1500);
      });
    }

    if (trackNewBtn) {
      trackNewBtn.addEventListener("click", function () {
        resultSection.classList.add("d-none");
        formSection.classList.remove("d-none");
        orderIdInput.value = "";
      });
    }

    const copyIcon = document.querySelector(".copy-icon");
    if (copyIcon) {
      copyIcon.addEventListener("click", function () {
        const resi = document.getElementById("result-resi").textContent;
        navigator.clipboard.writeText(resi).then(() => {
          showNotification("No. Resi disalin!", "success");
        });
      });
    }
  }

  // --- Logika untuk Halaman Keranjang (cart.html) ---
  if (pagePath.endsWith("cart.html")) {
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", function () {
        const cartItems = [];
        document.querySelectorAll(".cart-item").forEach((item) => {
          const name = item.querySelector(".cart-item-name").innerText;
          const price = item.querySelector(".cart-item-price p").innerText;
          const quantity = item.querySelector(
            ".cart-item-quantity input"
          ).value;
          cartItems.push({ name, price, quantity });
        });
        const total = document.querySelector(
          ".summary-total span:last-child"
        ).innerText;
        localStorage.setItem("cartDataForCheckout", JSON.stringify(cartItems));
        localStorage.setItem("cartTotalForCheckout", total);
      });
    }
  }

  // --- Logika untuk Halaman Pembayaran (pembayaran.html) ---
  if (pagePath.endsWith("pembayaran.html")) {
    const summaryContainer = document.getElementById("summary-items");
    const totalPayment = document.getElementById("total-payment");
    const cartData = JSON.parse(localStorage.getItem("cartDataForCheckout"));
    const cartTotal = localStorage.getItem("cartTotalForCheckout");

    if (summaryContainer && cartData && cartTotal) {
      cartData.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("summary-item");
        itemElement.innerHTML = `<span>${item.name} (x${item.quantity})</span> <span>${item.price}</span>`;
        summaryContainer.appendChild(itemElement);
      });
      totalPayment.innerText = cartTotal;
    }
  }
}
>>>>>>> parent of c1f175a (UPDATED PATH STRUCTURE)
