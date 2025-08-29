// File: /app.js (VERSI FINAL + RESPONSIVE)
document.addEventListener("DOMContentLoaded", function () {
  const sidebarContainer = document.getElementById("sidebar-container");

  // Pastikan elemen sidebar container ada sebelum melanjutkan
  if (!sidebarContainer) {
    console.error("Sidebar container tidak ditemukan.");
    return;
  }

  // Muat sidebar dari _sidebar.html
  fetch("../../components/_sidebar.html")
    .then((response) =>
      response.ok ? response.text() : Promise.reject("Sidebar not found")
    )
    .then((data) => {
      sidebarContainer.innerHTML = data;
      // Tunggu sebentar untuk memastikan DOM sudah terupdate
      setTimeout(() => {
        initializeSidebar();
      }, 100);
    })
    .catch((error) => console.error("Error loading sidebar:", error));

  // Fungsi untuk inisialisasi sidebar setelah dimuat
  function initializeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const hamburgerBtn = document.querySelector(".hamburger-btn");
    const overlay = document.getElementById("overlay");
    const mainContent = document.querySelector(".main-content");

    if (!sidebar || !hamburgerBtn || !overlay) {
      console.error("Elemen sidebar tidak ditemukan setelah dimuat.");
      return;
    }

    // Fungsi untuk toggle sidebar
    function toggleSidebar(e) {
      if (e) e.stopPropagation();
      
      const isMobile = window.innerWidth < 993;
      
      if (isMobile) {
        sidebar.classList.toggle("open");
        sidebar.classList.toggle("active"); // Untuk kompatibilitas
        overlay.classList.toggle("active");
        document.body.style.overflow = sidebar.classList.contains("open") ? "hidden" : "";
      } else {
        sidebar.classList.toggle("collapsed");
        if (mainContent) {
          mainContent.classList.toggle("expanded");
        }
      }
    }

    // Fungsi untuk menutup sidebar
    function closeSidebar() {
      sidebar.classList.remove("open", "active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }

    // Fungsi untuk inisialisasi state sidebar
    function initSidebarState() {
      const isMobile = window.innerWidth < 993;
      
      if (isMobile) {
        sidebar.classList.remove("collapsed");
        closeSidebar();
      } else {
        sidebar.classList.remove("open", "active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    }

    // Event listeners
    hamburgerBtn.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", closeSidebar);

    // Tutup sidebar saat mengklik link (mobile)
    const sidebarLinks = document.querySelectorAll(".sidebar-link, .logout-link");
    sidebarLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth < 993) {
          closeSidebar();
        }
      });
    });

    // Tutup sidebar dengan tombol Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && (sidebar.classList.contains("open") || sidebar.classList.contains("active"))) {
        closeSidebar();
      }
    });

    // Handle resize
    window.addEventListener("resize", initSidebarState);

    // Set active menu
    highlightActiveMenu();
    
    // Initialize state
    initSidebarState();
  }

  // Fungsi untuk menandai menu yang aktif
  function highlightActiveMenu() {
    const currentPage = window.location.pathname.split("/").pop() || "admin.html";
    const menuItems = document.querySelectorAll(".sidebar-nav .sidebar-item");
    
    menuItems.forEach((item) => {
      const link = item.querySelector(".sidebar-link");
      if (link) {
        link.classList.remove("active");
        if (item.getAttribute("data-page") === currentPage) {
          link.classList.add("active");
        }
      }
    });
  }
});
