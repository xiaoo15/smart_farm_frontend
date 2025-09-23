/* =================================================================== */
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
  try {
    let cart = JSON.parse(localStorage.getItem("smartfarm_cart") || "[]");
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price,
        image,
        quantity: 1,
      });
    }
    localStorage.setItem("smartfarm_cart", JSON.stringify(cart));
    updateCartBadge();
    showNotification(`${productName} ditambahkan!`, "success");
    if (buttonElement) {
      // Animasi tombol
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
