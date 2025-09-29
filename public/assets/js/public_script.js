/* =================================================================== */
/* SMARTFARM PUBLIC SCRIPT V3.1 - FINAL & ORGANIZED VERSION */
/* =================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // Selalu muat header & footer terlebih dahulu
  Promise.all([loadHeader(), loadFooter()])
    .then(() => {
      // Setelah komponen dasar dimuat, jalankan logika spesifik halaman
      if (document.body.classList.contains("login-body")) {
        initializeLoginPage();
      } else {
        initializeApp();
      }
      // Preloader dihilangkan setelah semua siap
      forceRemovePreloader();
    })
    .catch((error) => {
      console.error("Gagal memuat komponen halaman:", error);
      forceRemovePreloader(); // Tetap hilangkan preloader jika ada error
    });
});

/**
 * [FUNGSI UTAMA] Menginisialisasi seluruh halaman (selain login).
 */
function initializeApp() {
  initializeNavbarAndSearch(); // <- CUKUP SATU FUNGSI INI UNTUK SEMUA URUSAN NAVBAR
  initializePageSpecificLogic();
  initializeChatFunctionality();
  initializeActiveNavlink();
}

function loadComponent(componentPath, placeholderId) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) {
    // Jika placeholder tidak ditemukan, langsung selesaikan promise-nya.
    console.warn(`Placeholder dengan ID "${placeholderId}" tidak ditemukan.`);
    return Promise.resolve();
  }

  // Ambil konten dari file HTML
  return fetch(componentPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Gagal memuat komponen: ${componentPath}`);
      }
      return response.text();
    })
    .then(html => {
      // Masukkan konten HTML ke dalam placeholder
      placeholder.innerHTML = html;
    })
    .catch(error => {
      console.error(`Error saat memuat ${componentPath}:`, error);
      // Jika gagal, mungkin tampilkan pesan error di placeholder
      placeholder.innerHTML = `<p class="text-danger text-center">Gagal memuat komponen.</p>`;
    });
}

function initializeNavbarEventListeners() {
  const mobileMenuToggle = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.getElementById("navbarNav");
  const mobileSearchIcon = document.getElementById("mobile-search-icon");
  const searchOverlay = document.getElementById("search-overlay");
  const closeSearchBtn = document.getElementById("close-search-btn");

  // Logika untuk menampilkan/menyembunyikan Menu Hamburger
  // Bootstrap 5 sudah menangani ini dengan atribut data-bs-toggle, jadi ini hanya untuk debugging
  if (mobileMenuToggle && navbarCollapse) {
    mobileMenuToggle.addEventListener("click", function () {
      console.log("Tombol hamburger diklik!");
    });
  }

  // Logika untuk menampilkan Search Overlay saat ikon search mobile diklik
  if (mobileSearchIcon && searchOverlay) {
    mobileSearchIcon.addEventListener("click", function (event) {
      event.preventDefault();
      searchOverlay.classList.add("active");
      console.log("Ikon search mobile diklik, overlay muncul.");
    });
  }

  // Logika untuk menutup Search Overlay
  if (closeSearchBtn && searchOverlay) {
    closeSearchBtn.addEventListener("click", function () {
      searchOverlay.classList.remove("active");
      console.log("Tombol close search diklik, overlay hilang.");
    });
  }

  // (Opsional tapi keren) Tutup juga overlay kalau klik di luar area form
  if (searchOverlay) {
    searchOverlay.addEventListener("click", function (event) {
      if (event.target === searchOverlay) {
        searchOverlay.classList.remove("active");
        console.log("Klik di luar area, overlay hilang.");
      }
    });
  }
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
 * [FINAL-FIX] Menginisialisasi semua fungsi navbar, search, dan user.
 */
function initializeNavbarAndSearch() {
  // --- Logika User Login & Logout ---
  if (isAuthenticated()) {
    // Kalau user sudah login, kita langsung cari tombol logout & sapaan nama.
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        showNotification("Kamu berhasil keluar.", "success");
        setTimeout(() => (window.location.href = "index.html"), 1500);
      });
    }

    // INI DIA KUNCI BIAR NAMANYA MUNCUL
    try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const userGreetingSpan = document.querySelector("#user-greeting span");
        
        if (userGreetingSpan && currentUser && currentUser.name) {
            const firstName = currentUser.name.split(" ")[0]; // Ambil nama depan
            userGreetingSpan.textContent = `Halo, ${firstName}!`; // Ganti tulisannya!
        }
    } catch(e) {
        console.error("Gagal memuat data user:", e);
    }
  }

  // --- Logika untuk Search Overlay (di HP) ---
  const mobileSearchIcon = document.getElementById("mobile-search-icon");
  const searchOverlay = document.getElementById("search-overlay");
  const closeSearchBtn = document.getElementById("close-search-btn");

  if (mobileSearchIcon && searchOverlay) {
    mobileSearchIcon.addEventListener("click", (e) => {
      e.preventDefault();
      searchOverlay.classList.add("active");
    });
  }
  if (closeSearchBtn) {
    closeSearchBtn.addEventListener("click", () =>
      searchOverlay.classList.remove("active")
    );
  }

  // --- INISIALISASI SEMUA FUNGSI PENCARIAN ---
  const desktopSearchInput = document.querySelector(
    ".search-form .form-control"
  );
  const desktopResultsContainer = document.querySelector(
    ".search-results-container"
  );
  const overlaySearchInput = document.getElementById("search-overlay-input");
  const overlayResultsContainer = document.querySelector(
    ".search-results-container-overlay"
  );

  if (desktopSearchInput && desktopResultsContainer) {
    initializeSearch(desktopSearchInput, desktopResultsContainer);
  }
  if (overlaySearchInput && overlayResultsContainer) {
    initializeSearch(overlaySearchInput, overlayResultsContainer);
  }

  updateCartBadge();
}
/**
 * Menginisialisasi logika pencarian untuk sebuah input field.
 */
function initializeSearch(inputElement, resultsContainer) {
    const productsData = getSampleProducts();

    inputElement.addEventListener("input", function () {
        const query = this.value.toLowerCase().trim();
        if (query.length < 2) {
            resultsContainer.innerHTML = "";
            resultsContainer.style.display = 'none'; // Sembunyikan jika query pendek
            return;
        }
        const filteredProducts = productsData.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
        displaySearchResults(filteredProducts, resultsContainer);
        resultsContainer.style.display = 'block'; // Tampilkan jika ada hasil
    });

    document.addEventListener("click", function (e) {
        if (
            !e.target.closest(".search-container") &&
            !e.target.closest(".search-overlay-content")
        ) {
            if (resultsContainer) {
                resultsContainer.innerHTML = "";
                resultsContainer.style.display = 'none';
            }
        }
    });
}

/**
 * Menampilkan hasil pencarian di kontainer yang ditentukan.
 */
function displaySearchResults(products, container) {
  if (products.length === 0) {
    container.innerHTML =
      '<div class="p-3 text-center text-muted">Produk tidak ditemukan.</div>';
    return;
  }

  const resultsHTML = products
    .slice(0, 5) // Tetap batasi 5 hasil biar nggak kepanjangan
    .map(
      (product) => `
      <a href="product_detail.html?id=${product.id}" class="search-result-item">
          <img src="${product.image}" alt="${product.name}">
          <div class="item-info">
              <p class="item-name mb-0">${product.name}</p>
              <p class="item-category mb-0 text-capitalize">${product.category}</p>
              
              <p class="item-price mb-0">Rp ${product.price.toLocaleString('id-ID')}</p> 
              
          </div>
      </a>
    `
    )
    .join("");

  container.innerHTML = resultsHTML;
}

function initializeActiveNavlink() {
  let currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}

/**
 * ===================================================================
 * INISIALISASI & FUNGSI INTI
 * ===================================================================
 */

function initializeNavbar() {
  // --- Logika User Login & Logout ---
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
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        showNotification("Kamu berhasil keluar.", "success");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      });
    }
  } // --- Logika Menu Mobile ---

  // Logika untuk menampilkan hasil pencarian di Search Overlay
  const searchOverlayInput = document.getElementById("search-overlay-input");
  const searchOverlayResultsContainer = document.querySelector(".search-results-container-overlay");
  const allProducts = getSampleProducts(); // Ambil data produk dari fungsi yang sudah ada

  if (searchOverlayInput && searchOverlayResultsContainer) {
    searchOverlayInput.addEventListener("input", function () {
      const query = this.value.toLowerCase().trim();

      if (query.length < 2) {
        searchOverlayResultsContainer.innerHTML = "";
        return;
      }

      // Filter produk berdasarkan nama atau kategori
      const filteredProducts = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
      
      // Tampilkan hasilnya menggunakan fungsi yang sudah ada! Keren kan?
      displaySearchResults(filteredProducts, searchOverlayResultsContainer);
    });
  }

   // --- [FIX] LOGIKA REKOMENDASI PENCARIAN ---

  const sampleProducts = [
    {
      id: 1,
      name: "HydroKit Mini Starter",
      category: "kit",
      url: "product_detail.html?id=1",
      img: "https://i.pinimg.com/736x/3f/bd/42/3fbd42c0b1283820276dbf7661e32ee1.jpg",
      description: "Paket lengkap untuk pemula hidroponik.",
    },
    {
      id: 7,
      name: "HydroTower Vertical Garden",
      category: "kit",
      url: "product_detail.html?id=7",
      img: "https://image.made-in-china.com/318f0j00ItwUmAoEnHki/hydro-tower-mp4.webp",
      description: "Solusi berkebun di lahan terbatas.",
    },
    {
      id: 8,
      name: "Dutch Bucket System (5 Pot)",
      category: "kit",
      url: "product_detail.html?id=8",
      img: "https://i.pinimg.com/1200x/d5/3a/77/d53a7742f48e45ed66b890a5e79a8e74.jpg",
      description: "Ideal untuk tanaman buah seperti tomat.",
    },
    {
      id: 15,
      name: "Window Farm Kit",
      category: "kit",
      url: "product_detail.html?id=15",
      img: "https://i.pinimg.com/1200x/62/01/a3/6201a3ff90d61d7db5659f92bede2f75.jpg",
      description: "Manfaatkan jendela rumahmu untuk menanam.",
    },
    {
      id: 2,
      name: "Caladium Red Star",
      category: "hias",
      url: "product_detail.html?id=2",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQpxICck1kyAHXchQT7oteq1cY-ODKGYTlQA&s",
      description: "Tanaman hias dengan warna merah eksotis.",
    },
    {
      id: 6,
      name: "Monstera Deliciosa",
      category: "hias",
      url: "product_detail.html?id=6",
      img: "https://www.studioplant.com/media/catalog/product/cache/5f475ed5c56894ef7a51968da51e8dc7/m/o/monstera_-_4.jpg",
      description: "Tanaman ikonik dengan daun terbelah unik.",
    },
    {
      id: 9,
      name: "Sansevieria Trifasciata",
      category: "hias",
      url: "product_detail.html?id=9",
      img: "https://i.pinimg.com/1200x/a1/c9/2b/a1c92bd7dc40fdf544efa989849b9cfb.jpg",
      description: "Dikenal sebagai 'Lidah Mertua', pembersih udara.",
    },
    {
      id: 10,
      name: "Alocasia Black Velvet",
      category: "hias",
      url: "product_detail.html?id=10",
      img: "https://i.pinimg.com/736x/ca/29/f4/ca29f44fd8e19ee12b87bdb7803cdc39.jpg",
      description: "Daun hitam beludru yang mewah.",
    },
    {
      id: 3,
      name: "Bibit Selada Romaine (Hydro)",
      category: "bibit",
      url: "product_detail.html?id=3",
      img: "https://i.pinimg.com/1200x/74/e7/8c/74e78cb0708839f8dbfe4ceded346702.jpg",
      description: "Bibit selada unggulan untuk hidroponik.",
    },
    {
      id: 11,
      name: "Benih Kangkung Bangkok",
      category: "bibit",
      url: "product_detail.html?id=11",
      img: "https://i.pinimg.com/736x/a3/88/be/a388bea9abc16ac0277917949f295a72.jpg",
      description: "Mudah tumbuh dan cepat panen.",
    },
    {
      id: 12,
      name: "Benih Tomat Cherry Super",
      category: "bibit",
      url: "product_detail.html?id=12",
      img: "https://i.pinimg.com/1200x/0c/cc/58/0ccc583baa2eb7979735c2574bb653ed.jpg",
      description: "Hasilkan tomat cherry yang manis dan melimpah.",
    },
    {
      id: 18,
      name: "Bibit Strawberry California",
      category: "bibit",
      url: "product_detail.html?id=18",
      img: "https://down-id.img.susercontent.com/file/8f4a387cbbb4e5af5f04b513801ee06d@resize_w900_nl.webp",
      description: "Bibit unggul yang sudah beradaptasi.",
    },
    {
      id: 4,
      name: "Nutrisi AB Mix Premium",
      category: "nutrisi",
      url: "product_detail.html?id=4",
      img: "https://i.pinimg.com/736x/d5/0d/ad/d50dadbceb8948b3afcba70f927facdf.jpg",
      description: "Nutrisi lengkap siap pakai untuk hidroponik.",
    },
    {
      id: 13,
      name: "Pupuk Organik Cair (POC)",
      category: "nutrisi",
      url: "product_detail.html?id=13",
      img: "https://i.pinimg.com/736x/20/7b/10/207b108b49d9d8410f18a2a30e29f102.jpg",
      description: "Kaya mikroorganisme untuk menyuburkan tanah.",
    },
    {
      id: 14,
      name: "Root Booster Super",
      category: "nutrisi",
      url: "product_detail.html?id=14",
      img: "https://i.pinimg.com/736x/58/cd/c3/58cdc3c5f5aabb37836ae1eba2e19ed0.jpg",
      description: "Formula khusus untuk merangsang akar.",
    },
    {
      id: 20,
      name: "Kalsium Nitrat (KNO3)",
      category: "nutrisi",
      url: "product_detail.html?id=20",
      img: "https://images.tokopedia.net/img/cache/700/product-1/2020/7/15/6477595/6477595_2292d5e9-8f04-4697-a2c9-2e202a78087a_747_747.jpg",
      description: "Mencegah kerontokan bunga dan buah.",
    },
    {
      id: 5,
      name: "Rockwool Cultilene",
      category: "media",
      url: "product_detail.html?id=5",
      img: "https://i.pinimg.com/1200x/93/d1/64/93d164ef5fe8afb9c5ded04b26eafb57.jpg",
      description: "Media tanam rockwool impor berkualitas tinggi.",
    },
    {
      id: 16,
      name: "Hydroton Jerman",
      category: "media",
      url: "product_detail.html?id=16",
      img: "https://i.pinimg.com/1200x/5a/55/83/5a5583d434516eae605ba27783c91621.jpg",
      description: "Media dari tanah liat, bisa dipakai berulang kali.",
    },
    {
      id: 17,
      name: "Cocopeat Blok Premium",
      category: "media",
      url: "product_detail.html?id=17",
      img: "https://i.pinimg.com/736x/2a/c6/5e/2ac65e07e88337e92cf7761941e444bd.jpg",
      description: "Media organik dari serabut kelapa.",
    },
    {
      id: 19,
      name: "Sekam Bakar Fermentasi",
      category: "media",
      url: "product_detail.html?id=19",
      img: "https://i.pinimg.com/736x/11/64/98/11649824eb0aa47fb4f5987b388f194c.jpg",
      description: "Bagus untuk aerasi akar dan mencegah jamur.",
    },
  ];

  const searchInput = document.querySelector(".search-form .form-control");
  const searchResultsContainer = document.querySelector(
    ".search-results-container"
  );

  if (searchInput && searchResultsContainer) {
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase().trim();
      if (query.length < 2) {
        searchResultsContainer.innerHTML = "";
        return;
      }
      const filteredProducts = sampleProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
      displaySearchResults(filteredProducts, searchResultsContainer);
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".search-container")) {
        searchResultsContainer.innerHTML = "";
      }
    });
  }

  function displaySearchResults(products, container) {
    if (products.length === 0) {
      container.innerHTML =
        '<div class="p-3 text-center text-muted">Produk tidak ditemukan.</div>';
      return;
    }
    const resultsHTML = products
      .map(
        (product) => `
          <a href="${product.url}" class="search-result-item">
              <img src="${product.img}" alt="${product.name}">
              <div class="item-info">
                  <p class="item-name mb-0">${product.name}</p>
                  <p class="item-category mb-0">${product.category}</p>
                  <p class="item-description mb-0">${product.description}</p>
              </div>
          </a>
      `
      )
      .join("");
    container.innerHTML = resultsHTML;
  } // --- Sisa Logika Navbar ---

  updateCartBadge();
}

/**
 * Mengatur fungsionalitas halaman login dan registrasi.
 */
function initializeLoginPage() {
  const getUsers = () =>
    JSON.parse(localStorage.getItem("smartfarm_users")) || [];
  const saveUsers = (users) =>
    localStorage.setItem("smartfarm_users", JSON.stringify(users)); // Form Login

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
  } // [KODE BARU] Logika untuk Form Lupa Password

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
          "Link reset password telah dikirim ke email Anda!"; // PENTING: Ini hanya untuk demo, karena kita tidak bisa kirim email sungguhan. // Kita tampilkan password user via alert. Di aplikasi nyata, ini SANGAT TIDAK AMAN.

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
  } // Form Registrasi

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
  } // Cek apakah yang diklik adalah tombol 'wishlist'

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
  } // Catatan: Logika pengiriman pesan (sendMessage, fetch API) tetap sama seperti kodemu sebelumnya. // Pastikan backend API di server.js sudah berjalan.
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
  const pagePath = window.location.pathname; // --- Keamanan untuk Halaman Akun ---

  const isAccountPage =
    pagePath.endsWith("profile.html") ||
    pagePath.endsWith("settings.html") ||
    pagePath.endsWith("orders.html");
  if (isAccountPage && !isAuthenticated()) {
    window.location.href = "login.html";
    return; // Hentikan fungsi jika user belum login di halaman akun.
  } // --- Logika untuk Halaman Profil ---

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
    let currentRating = 0; // Saat tombol "Beri Ulasan" di-klik

    reviewButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const orderId = this.dataset.orderId;
        reviewOrderId.textContent = orderId;
      });
    }); // Logika untuk hover dan klik bintang

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
    }); // Saat tombol "Kirim Ulasan" di dalam modal di-klik

    if (submitReviewBtn) {
      submitReviewBtn.addEventListener("click", function () {
        if (currentRating === 0) {
          showNotification("Pilih bintang rating dulu ya!", "warning");
          return;
        } // Di sini nanti bisa ditambahkan logika untuk mengirim data ke server
        console.log(
          `Rating: ${currentRating}, Komentar: ${
            document.getElementById("review-comment").value
          }`
        );

        showNotification("Terima kasih atas ulasanmu!", "success");
        reviewModal.hide(); // (Opsional) Ganti tombol setelah memberi ulasan

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
  } // --- Logika untuk Halaman Pengaturan ---

  if (pagePath.endsWith("settings.html")) {
    const changePasswordForm = document.getElementById("change-password-form");
    if (changePasswordForm) {
      changePasswordForm.addEventListener("submit", function (e) {
        e.preventDefault();
        showNotification("Password berhasil diubah!", "success");
        this.reset();
      });
    }
  } // --- Logika untuk Halaman Lacak Pesanan (YANG BARU) ---

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

  if (pagePath.includes("product_detail.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get("id"));
    const allProducts = getSampleProducts();
    const product = allProducts.find((p) => p.id === productId);

    if (!product) {
      const pageContent = document.querySelector(".product-detail-page");
      if (pageContent)
        pageContent.innerHTML =
          '<h2 class="text-center my-5">Waduh, produknya nggak ketemu!</h2>';
      return;
    }

    document.title = `${product.name} - SmartFarm`;
    document.getElementById("breadcrumb-product-name").textContent =
      product.name;
    document.getElementById("main-product-image").src = product.image;
    document.getElementById("product-name").textContent = product.name;
    document.getElementById(
      "product-price"
    ).textContent = `Rp ${product.price.toLocaleString("id-ID")}`;

    const originalPriceEl = document.getElementById("product-original-price");
    if (product.originalPrice) {
      originalPriceEl.textContent = `Rp ${product.originalPrice.toLocaleString(
        "id-ID"
      )}`;
    } else {
      originalPriceEl.style.display = "none";
    }

    document.getElementById("product-description").textContent =
      product.description.substring(0, 150) + "...";
    document.getElementById(
      "description-content"
    ).innerHTML = `<p>${product.description.replace(/\n/g, "</p><p>")}</p>`;

    const categoryLink = document.getElementById("product-category-link");
    categoryLink.textContent = product.category;
    categoryLink.href = `products.html?category=${product.category}`;

    const specsTableBody = document.getElementById("specs-table-body");
    if (product.specs) {
      specsTableBody.innerHTML = Object.entries(product.specs)
        .map(
          ([key, value]) => `
            <tr>
                <td><strong>${key}</strong></td>
                <td>${value}</td>
            </tr>
        `
        )
        .join("");
    }

    const qtyInput = document.getElementById("quantity-input");
    document.getElementById("decrease-qty").addEventListener("click", () => {
      if (qtyInput.value > 1) qtyInput.value--;
    });
    document.getElementById("increase-qty").addEventListener("click", () => {
      qtyInput.value++;
    });

    const addToCartBtn = document.getElementById("add-to-cart-detail");
    addToCartBtn.addEventListener("click", () => {
      addToCart(
        product.id,
        product.name,
        product.price,
        product.image,
        addToCartBtn
      );
    });

    const wishlistBtn = document.getElementById("add-to-wishlist-detail");
    wishlistBtn.addEventListener("click", () => {
      toggleWishlist(product.id, product.name, wishlistBtn);
    });
  } // --- Logika untuk Halaman Keranjang (cart.html) ---

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
  } // --- Logika untuk Halaman Pembayaran (pembayaran.html) ---

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

/**
 * [SUMBER DATA UTAMA] Menyediakan data semua produk secara terpusat.
 */
function getSampleProducts() {
  return [
    // --- KATEGORI: HIDROPONIK KIT ---
    {
      id: 1,
      name: "HydroKit Mini Starter",
      category: "kit",
      price: 185000,
      originalPrice: 225000,
      image:
        "https://i.pinimg.com/736x/3f/bd/42/3fbd42c0b1283820276dbf7661e32ee1.jpg",
      rating: 4.8,
      sold: "3.2k",
      date: "2024-08-10",
      badge: { text: "DISKON", class: "badge-sale" },
      description:
        "Paket lengkap untuk pemula yang ingin mencoba hidroponik. Mudah dirakit dan tidak memakan tempat, cocok untuk menanam sayuran daun di balkon atau halaman rumah. Semua yang Anda butuhkan untuk memulai panen pertama Anda ada di sini.",
      specs: {
        "Jumlah Lubang": "8",
        "Ukuran Pipa": "2.5 inch",
        "Kapasitas Air": "15 Liter",
        "Isi Paket":
          "Pipa, Pompa, Netpot, Rockwool, 2 Jenis Benih, Nutrisi AB Mix 250ml",
      },
    },
    {
      id: 7,
      name: "HydroTower Vertical Garden",
      category: "kit",
      price: 750000,
      originalPrice: null,
      image:
        "https://image.made-in-china.com/318f0j00ItwUmAoEnHki/hydro-tower-mp4.webp",
      rating: 5,
      sold: "890",
      date: "2024-07-22",
      badge: { text: "PRODUK BARU", class: "badge-new" },
      description:
        "Solusi berkebun di lahan terbatas. Sistem hidroponik vertikal yang efisien dan modern, mampu menampung hingga 20 tanaman. Desain elegan yang juga berfungsi sebagai dekorasi.",
      specs: {
        "Jumlah Lubang": "20",
        Sistem: "NFT (Nutrient Film Technique)",
        Tinggi: "1.5 Meter",
        "Isi Paket":
          "Tower, Pompa, Netpot, Rockwool, Nutrisi AB Mix 500ml, Timer",
      },
    },
    {
      id: 8,
      name: "Dutch Bucket System (5 Pot)",
      category: "kit",
      price: 450000,
      originalPrice: null,
      image:
        "https://i.pinimg.com/1200x/d5/3a/77/d53a7742f48e45ed66b890a5e79a8e74.jpg",
      rating: 4.5,
      sold: "1.1k",
      date: "2024-06-15",
      badge: { text: "BEST SELLER", class: "badge-bestseller" },
      description:
        "Sistem hidroponik yang ideal untuk tanaman buah seperti tomat, paprika, dan mentimun. Setiap pot memiliki sistem irigasi tetes individu untuk nutrisi yang optimal.",
      specs: {
        "Jumlah Pot": "5",
        "Kapasitas Pot": "10 Liter",
        "Media Tanam": "Perlite & Vermiculite (termasuk)",
        "Isi Paket":
          "5 Bucket, Pipa Sirkulasi, Pompa, Selang, Nutrisi Buah 500ml",
      },
    },
    {
      id: 15,
      name: "Window Farm Kit",
      category: "kit",
      price: 250000,
      originalPrice: null,
      image:
        "https://i.pinimg.com/1200x/62/01/a3/6201a3ff90d61d7db5659f92bede2f75.jpg",
      rating: 4.2,
      sold: "450",
      date: "2024-05-01",
      badge: null,
      description:
        "Manfaatkan jendela rumahmu untuk menanam sayuran segar atau herbal dengan kit hidroponik gantung yang praktis ini. Menggunakan botol daur ulang sebagai wadah tanam.",
      specs: {
        "Jumlah Lubang": "4",
        Sistem: "Wick System (Sumbu)",
        "Cocok Untuk": "Herbal (Basil, Mint), Selada",
        "Isi Paket":
          "Rangka Gantung, Pompa Mini, Sumbu, Netpot, Rockwool, Benih Herbal",
      },
    }, // --- KATEGORI: TANAMAN HIAS ---
    {
      id: 2,
      name: "Caladium Red Star",
      category: "hias",
      price: 75000,
      originalPrice: null,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQpxICck1kyAHXchQT7oteq1cY-ODKGYTlQA&s",
      rating: 4.5,
      sold: "230",
      date: "2024-08-01",
      badge: { text: "PRODUK BARU", class: "badge-new" },
      description:
        "Tanaman hias dengan warna merah menyala yang eksotis. Daunnya yang berbentuk hati memberikan sentuhan tropis yang mewah di sudut ruangan Anda. Perawatan mudah dan tidak memerlukan banyak sinar matahari langsung.",
      specs: {
        "Tinggi Tanaman": "20-30 cm",
        "Ukuran Pot": "Diameter 15 cm",
        "Media Tanam": "Sekam Bakar, Cocopeat",
        "Kebutuhan Sinar": "Rendah - Sedang",
      },
    },
    {
      id: 6,
      name: "Monstera Deliciosa",
      category: "hias",
      price: 125000,
      originalPrice: null,
      image:
        "https://www.studioplant.com/media/catalog/product/cache/5f475ed5c56894ef7a51968da51e8dc7/m/o/monstera_-_4.jpg",
      rating: 5,
      sold: "185",
      date: "2024-08-05",
      badge: null,
      description:
        "Tanaman hias ikonik dengan daun terbelah yang unik. Memberikan kesan tropis dan modern pada interior. Semakin dewasa, belahan daunnya akan semakin banyak dan indah.",
      specs: {
        "Tinggi Tanaman": "30-40 cm",
        "Ukuran Pot": "Diameter 18 cm",
        "Media Tanam": "Tanah Subur, Humus",
        "Kebutuhan Sinar": "Sedang, tidak langsung",
      },
    },
    {
      id: 9,
      name: "Sansevieria Trifasciata",
      category: "hias",
      price: 60000,
      originalPrice: 80000,
      image:
        "https://i.pinimg.com/1200x/a1/c9/2b/a1c92bd7dc40fdf544efa989849b9cfb.jpg",
      rating: 4.7,
      sold: "950",
      date: "2024-07-18",
      badge: { text: "DISKON", class: "badge-sale" },
      description:
        "Dikenal sebagai 'Lidah Mertua', tanaman ini sangat kuat dan mampu membersihkan udara dalam ruangan dari polutan. Sangat cocok untuk pemula karena perawatannya sangat minim.",
      specs: {
        "Tinggi Tanaman": "25-35 cm",
        "Ukuran Pot": "Diameter 15 cm",
        "Media Tanam": "Sekulen & Kaktus Mix",
        "Kebutuhan Sinar": "Sangat Toleran (Rendah - Terang)",
      },
    },
    {
      id: 10,
      name: "Alocasia Black Velvet",
      category: "hias",
      price: 150000,
      originalPrice: null,
      image:
        "https://i.pinimg.com/736x/ca/29/f4/ca29f44fd8e19ee12b87bdb7803cdc39.jpg",
      rating: 4.9,
      sold: "310",
      date: "2024-08-12",
      badge: { text: "STOK TERBATAS", class: "badge-limited" },
      description:
        "Tanaman premium dengan daun hitam beludru dan urat silver yang mewah. Menjadi pusat perhatian di koleksi tanaman hias Anda. Membutuhkan kelembapan yang cukup.",
      specs: {
        "Tinggi Tanaman": "15-25 cm",
        "Ukuran Pot": "Diameter 12 cm",
        "Media Tanam": "Aroid Mix (Cocochip, Perlite)",
        "Kebutuhan Sinar": "Terang, tidak langsung",
      },
    }, // --- KATEGORI: BIBIT & BENIH ---
    {
      id: 3,
      name: "Bibit Selada Romaine (Hydro)",
      category: "bibit",
      price: 25000,
      originalPrice: null,
      image:
        "https://i.pinimg.com/1200x/74/e7/8c/74e78cb0708839f8dbfe4ceded346702.jpg",
      rating: 5,
      sold: "8k+",
      date: "2024-07-25",
      badge: { text: "PILIHAN", class: "badge-limited" },
      description:
        "Bibit selada romaine unggulan yang sudah diadaptasi khusus untuk sistem hidroponik. Memiliki tingkat germinasi tinggi, cepat tumbuh, dan tekstur daun yang renyah. Panen dalam 30-40 hari setelah semai.",
      specs: {
        "Isi per Paket": "± 200 biji",
        Germinasi: "85% - 95%",
        "Rekomendasi pH": "5.5 - 6.5",
        "Rekomendasi PPM": "560 - 840",
      },
    },
    {
      id: 11,
      name: "Benih Kangkung Bangkok",
      category: "bibit",
      price: 12000,
      originalPrice: null,
      image:
        "https://i.pinimg.com/736x/a3/88/be/a388bea9abc16ac0277917949f295a72.jpg",
      rating: 4.8,
      sold: "12k+",
      date: "2024-03-10",
      badge: { text: "BEST SELLER", class: "badge-bestseller" },
      description:
        "Benih kangkung varietas Bangkok, mudah tumbuh, dan bisa dipanen dalam waktu singkat (20-30 hari). Cocok untuk ditanam di sistem hidroponik maupun konvensional.",
      specs: {
        "Isi per Paket": "± 500 biji",
        Germinasi: "> 90%",
        "Rekomendasi pH": "5.5 - 7.0",
        "Rekomendasi PPM": "700 - 1400",
      },
    },
    {
      id: 12,
      name: "Benih Tomat Cherry Super",
      category: "bibit",
      price: 30000,
      originalPrice: null,
      image:
        "https://i.pinimg.com/1200x/0c/cc/58/0ccc583baa2eb7979735c2574bb653ed.jpg",
      rating: 4.6,
      sold: "2.5k",
      date: "2024-06-20",
      badge: null,
      description:
        "Hasilkan tomat cherry yang manis dan melimpah langsung dari kebun hidroponik Anda. Tahan terhadap penyakit dan cuaca panas.",
      specs: {
        "Isi per Paket": "± 30 biji",
        Germinasi: "80% - 90%",
        "Potensi Hasil": "3-5 kg per tanaman",
        "Masa Panen": "~90 hari setelah tanam",
      },
    },
    {
      id: 18,
      name: "Bibit Strawberry California",
      category: "bibit",
      price: 45000,
      originalPrice: null,
      image:
        "https://down-id.img.susercontent.com/file/8f4a387cbbb4e5af5f04b513801ee06d@resize_w900_nl.webp",
      rating: 4.9,
      sold: "5.2k",
      date: "2024-08-08",
      badge: { text: "PRODUK BARU", class: "badge-new" },
      description:
        "Bibit unggul strawberry California yang sudah beradaptasi untuk ditanam di iklim tropis. Menghasilkan buah yang besar dan manis. Dikirim dalam bentuk bibit hidup siap tanam.",
      specs: {
        Tipe: "Bibit hidup (runner)",
        Jumlah: "1 bibit",
        "Rekomendasi Sistem": "NFT, Rak Tetes",
        "Rekomendasi PPM": "840 - 1260",
      },
    }, // --- KATEGORI: NUTRISI ---
    {
      id: 4,
      name: "Nutrisi AB Mix Premium",
      category: "nutrisi",
      price: 45000,
      originalPrice: 55000,
      image:
        "https://i.pinimg.com/736x/d5/0d/ad/d50dadbceb8948b3afcba70f927facdf.jpg",
      rating: 4.7,
      sold: "400+",
      date: "2024-06-15",
      badge: { text: "DISKON", class: "badge-sale" },
      description:
        "Nutrisi lengkap siap pakai untuk semua jenis tanaman hidroponik, mengandung unsur makro dan mikro esensial yang 100% larut dalam air. Cukup campurkan pekatan A dan B dengan air sesuai takaran.",
      specs: {
        Bentuk: "Pekatan Cair",
        Ukuran: "2 x 250ml",
        "Target PPM": "1000-1400 PPM",
        Kandungan: "Unsur Makro & Mikro Lengkap",
      },
    },
    {
      id: 13,
      name: "Pupuk Organik Cair (POC)",
      category: "nutrisi",
      price: 35000,
      originalPrice: null,
      image:
        "https://i.pinimg.com/736x/20/7b/10/207b108b49d9d8410f18a2a30e29f102.jpg",
      rating: 4.5,
      sold: "1.8k",
      date: "2024-04-25",
      badge: null,
      description:
        "Pupuk organik cair yang kaya akan mikroorganisme baik untuk menyuburkan media tanam dan menyehatkan akar. Cocok untuk tanaman konvensional dan sebagai suplemen pada hidroponik.",
      specs: {
        Bentuk: "Cair",
        Ukuran: "500ml",
        Aplikasi: "Siram ke media tanam / Semprot ke daun",
        Frekuensi: "1-2 minggu sekali",
      },
    },
    {
      id: 14,
      name: "Root Booster Super",
      category: "nutrisi",
      price: 55000,
      originalPrice: null,
      image:
        "https://i.pinimg.com/736x/58/cd/c3/58cdc3c5f5aabb37836ae1eba2e19ed0.jpg",
      rating: 4.9,
      sold: "2.2k",
      date: "2024-07-30",
      badge: { text: "BEST SELLER", class: "badge-bestseller" },
      description:
        "Formula khusus untuk merangsang pertumbuhan akar baru, membuat tanaman lebih kuat dan sehat. Sangat baik digunakan pada saat pindah tanam atau untuk perbanyakan stek.",
      specs: {
        Bentuk: "Cair",
        Ukuran: "100ml",
        "Kandungan Utama": "Hormon Auksin, Vitamin B1",
        Dosis: "2ml per liter air",
      },
    },
    {
      id: 20,
      name: "Kalsium Nitrat (KNO3)",
      category: "nutrisi",
      price: 28000,
      originalPrice: null,
      image:
        "https://images.tokopedia.net/img/cache/700/product-1/2020/7/15/6477595/6477595_2292d5e9-8f04-4697-a2c9-2e202a78087a_747_747.jpg",
      rating: 4.6,
      sold: "980",
      date: "2024-02-11",
      badge: null,
      description:
        "Pupuk makro sekunder yang penting untuk mencegah kerontokan bunga dan buah, serta memperkuat dinding sel tanaman. Wajib dimiliki untuk budidaya tanaman buah.",
      specs: {
        Bentuk: "Kristal",
        "Berat Bersih": "500 gram",
        Kelarutan: "100% larut air",
        Penggunaan: "Komponen tambahan nutrisi AB Mix",
      },
    }, // --- KATEGORI: MEDIA TANAM ---
    {
      id: 5,
      name: "Rockwool Cultilene",
      category: "media",
      price: 15000,
      originalPrice: null,
      image:
        "https://i.pinimg.com/1200x/93/d1/64/93d164ef5fe8afb9c5ded04b26eafb57.jpg",
      rating: 4.9,
      sold: "312",
      date: "2024-05-20",
      badge: { text: "BEST SELLER", class: "badge-bestseller" },
      description:
        "Media tanam rockwool impor berkualitas tinggi, mampu menyerap air dengan baik dan steril. Sangat ideal untuk tahap persemaian benih hidroponik.",
      specs: {
        Ukuran: "1 slab (100cm x 15cm x 7.5cm)",
        Kepadatan: "45 kg/m³",
        "Arah Serat": "Horizontal",
        Kelebihan: "Steril, retensi air tinggi",
      },
    },
    {
      id: 16,
      name: "Hydroton Jerman",
      category: "media",
      price: 35000,
      originalPrice: null,
      image:
        "https://i.pinimg.com/1200x/5a/55/83/5a5583d434516eae605ba27783c91621.jpg",
      rating: 4.8,
      sold: "1.5k",
      date: "2024-07-05",
      badge: null,
      description:
        "Media tanam hidroponik dari tanah liat yang dibakar, bisa dipakai berulang kali dan memiliki aerasi yang sangat baik untuk akar. Ukuran seragam dan tidak mudah hancur.",
      specs: {
        "Berat Bersih": "1 Liter",
        Ukuran: "8-16 mm",
        Bahan: "Tanah Liat Pilihan",
        Kelebihan: "Dapat digunakan kembali, pH netral",
      },
    },
    {
      id: 17,
      name: "Cocopeat Blok Premium",
      category: "media",
      price: 22000,
      originalPrice: 28000,
      image:
        "https://i.pinimg.com/736x/2a/c6/5e/2ac65e07e88337e92cf7761941e444bd.jpg",
      rating: 4.7,
      sold: "3.5k",
      date: "2024-06-01",
      badge: { text: "DISKON", class: "badge-sale" },
      description:
        "Media tanam organik dari serabut kelapa yang sudah diproses dan dicuci, bebas dari zat tanin. Cukup direndam air, blok akan mengembang hingga 5-7 kali lipat.",
      specs: {
        "Berat Kering": "± 500 gram",
        "Volume Setelah Mengembang": "5-7 Liter",
        EC: "< 0.5 mS/cm",
        Kelebihan: "Daya simpan air tinggi",
      },
    },
    {
      id: 19,
      name: "Sekam Bakar Fermentasi",
      category: "media",
      price: 18000,
      originalPrice: null,
      image:
        "https://i.pinimg.com/736x/11/64/98/11649824eb0aa47fb4f5987b388f194c.jpg",
      rating: 4.6,
      sold: "2.8k",
      date: "2024-01-30",
      badge: null,
      description:
        "Media tanam porous yang sudah difermentasi, bagus untuk aerasi akar dan mencegah jamur. Sangat cocok sebagai campuran media tanam konvensional maupun untuk lapisan dasar pot hidroponik.",
      specs: {
        "Berat Bersih": "1 kg",
        "Kadar Air": "< 15%",
        pH: "Netral (6.5 - 7.0)",
        Bahan: "Sekam padi pilihan",
      },
    },
  ];
}
