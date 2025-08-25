// File: syaa16/app.js (VERSI FINAL + RESPONSIVE)
document.addEventListener("DOMContentLoaded", function () {
  const sidebarContainer = document.getElementById("sidebar-container");
  const sidebar = document.getElementById("sidebar");
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const overlay = document.getElementById("overlay");
  
  // Pastikan elemen-elemen penting ada sebelum melanjutkan
  if (!sidebarContainer) {
    console.error("Sidebar container tidak ditemukan.");
    return;
  }

  // Muat sidebar dari _sidebar.html
  fetch("_sidebar.html")
    .then((response) =>
      response.ok ? response.text() : Promise.reject("Sidebar not found")
    )
    .then((data) => {
      sidebarContainer.innerHTML = data;
      highlightActiveMenu();
      setupEventListeners();
    })
    .catch((error) => console.error("Error loading sidebar:", error));

  // Fungsi untuk menandai menu yang aktif
  function highlightActiveMenu() {
    const currentPage = window.location.pathname.split("/").pop();
    const menuItems = document.querySelectorAll(".sidebar-nav .sidebar-item");
    menuItems.forEach((item) => {
      if (item.dataset.page === currentPage) {
        item.classList.add("active");
      }
    });
  }

  // Fungsi untuk mengatur event listener
  function setupEventListeners() {
    // Pastikan tombol hamburger dan sidebar ada setelah dimuat
    const hamburger = document.querySelector(".hamburger-btn");
    const sidebarElement = document.getElementById("sidebar"); // Ambil elemen sidebar setelah konten dimuat
    
    if (hamburger && sidebarElement) {
      // Event listener untuk tombol hamburger (membuka sidebar)
      hamburger.addEventListener("click", () => {
        sidebarElement.classList.toggle("active");
        if (overlay) {
          overlay.classList.toggle("active");
        }
      });
      
      // Event listener untuk overlay (menutup sidebar)
      if (overlay) {
        overlay.addEventListener("click", () => {
          sidebarElement.classList.remove("active");
          overlay.classList.remove("active");
        });
      }
      
      // Event listener untuk menutup sidebar saat mengklik di luar
      document.addEventListener('click', function (e) {
        if (window.innerWidth < 992 && sidebarElement.classList.contains('active')) {
          if (!sidebarElement.contains(e.target) && !hamburger.contains(e.target)) {
            sidebarElement.classList.remove('active');
            if (overlay) {
              overlay.classList.remove('active');
            }
          }
        }
      });
    }
    
    // Fungsi untuk menandai menu aktif (klik)
    const links = document.querySelectorAll('.sidebar-nav a');
    links.forEach(link => {
      link.addEventListener('click', function () {
        links.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  // Fungsi untuk menangani perubahan ukuran layar
  function handleResize() {
    if (window.innerWidth > 768) {
      if (sidebar) {
        sidebar.classList.remove("active");
      }
      if (overlay) {
        overlay.classList.remove("active");
      }
    }
  }

  // Jalankan fungsi saat halaman pertama kali dimuat dan saat ukuran jendela diubah
  window.addEventListener("resize", handleResize);
  handleResize();
});