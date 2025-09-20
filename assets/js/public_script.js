/* =================================================================== */
/* SMARTFARM PUBLIC CONSOLIDATED SCRIPT - ALL PUBLIC PAGES */
/* =================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', function() {
      preloader.classList.add('loaded');
      // Hapus elemen dari DOM setelah transisi selesai
      preloader.addEventListener('transitionend', function() {
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

  /* assets/js/public_script.js */

  function initializeNavbar() {
    // Definisi elemen-elemen penting
    const mobileMenuToggle = document.querySelector(".navbar-toggler");
    const mobileMenu = document.querySelector(".navbar-collapse");

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
    // [2] [PERBAIKAN] LOGIKA MENUTUP MENU SAAT LINK DI DALAMNYA DI-KLIK
    // ===================================================================
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (mobileMenu.classList.contains("show")) {
          mobileMenu.classList.remove("show");
        }
      });
    });

    // ===================================================================
    // [3] [BARU] LOGIKA MENUTUP MENU SAAT KLIK DI LUAR AREA NAVBAR
    // ===================================================================
    document.addEventListener("click", function (event) {
      // Cek apakah menu mobile ada, sedang terbuka, dan kliknya terjadi di LUAR area menu & LUAR tombol hamburger
      if (mobileMenu && mobileMenu.classList.contains("show")) {
        const isClickInsideNavbar = mobileMenu.contains(event.target);
        const isClickOnToggler = mobileMenuToggle.contains(event.target);

        if (!isClickInsideNavbar && !isClickOnToggler) {
          mobileMenu.classList.remove("show");
        }
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
/* PRODUCT CARD INTERACTIONS (ADD TO CART & WISHLIST) */
/* =================================================================== */

// FUNGSI BARU UNTUK WISHLIST
function addToWishlist(productId, productName, buttonElement) {
    // Untuk sekarang, fungsinya cuma nampilin notif.
    // Nanti bisa dikembangin buat nyimpen data wishlist di localStorage.
    console.log(`Produk ${productName} (ID: ${productId}) ditambahkan ke wishlist.`);
    
    showNotification(`${productName} masuk ke wishlist!`, 'success');

    // Animasi tombol wishlist (opsional, tapi keren)
    if (buttonElement) {
        const icon = buttonElement.querySelector('i');
        if (icon) {
            icon.classList.remove('far'); // Ikon hati kosong
            icon.classList.add('fas');   // Ikon hati penuh
            buttonElement.style.color = '#dc3545'; // Warna jadi merah
        }
    }
}

// FUNGSI LAMA UNTUK KERANJANG (tetap sama, karena notif sudah ada)
function addToCart(productId, productName, price, image, buttonElement) {
  try {
    let cart = JSON.parse(localStorage.getItem("smartfarm_cart") || "[]");
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id: productId, name: productName, price: price, image: image, quantity: 1 });
    }
    localStorage.setItem("smartfarm_cart", JSON.stringify(cart));
    updateCartBadge();
    showNotification(`${productName} ditambahkan ke keranjang!`, "success");

    if (buttonElement) {
        const originalIcon = buttonElement.innerHTML;
        buttonElement.classList.add('added');
        buttonElement.disabled = true;
        setTimeout(() => {
            buttonElement.classList.remove('added');
            buttonElement.innerHTML = originalIcon;
            buttonElement.disabled = false;
        }, 1500);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    showNotification("Gagal menambahkan ke keranjang", "error");
  }
}


// EVENT LISTENER BARU YANG LEBIH PINTAR
document.addEventListener('click', function(e) {
    // Cek apakah yang diklik itu tombol keranjang
    const cartButton = e.target.closest('.btn-add-cart-icon');
    if (cartButton) {
        e.preventDefault();
        e.stopPropagation();
        const productId = cartButton.dataset.productId;
        const productName = cartButton.dataset.productName;
        const productPrice = cartButton.dataset.productPrice;
        const productImage = cartButton.dataset.productImage;

        if (productId && productName) {
            addToCart(productId, productName, productPrice, productImage, cartButton);
        }
        return; // Hentikan proses setelah aksi keranjang
    }

    // Cek apakah yang diklik itu tombol wishlist
    const wishlistButton = e.target.closest('.action-btn');
    if (wishlistButton && wishlistButton.querySelector('.fa-heart')) {
        e.preventDefault();
        e.stopPropagation();
        const productId = wishlistButton.dataset.productId;
        const productName = wishlistButton.dataset.productName;

        if (productId && productName) {
            addToWishlist(productId, productName, wishlistButton);
        }
        return; // Hentikan proses setelah aksi wishlist
    }
});