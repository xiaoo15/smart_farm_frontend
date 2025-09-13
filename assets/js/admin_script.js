/* =================================================================== */
/* SMARTFARM ADMIN CONSOLIDATED SCRIPT - ALL ADMIN PAGES */
/* =================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const sidebarContainer = document.getElementById("sidebar-container");

  // Pastikan elemen sidebar container ada sebelum melanjutkan
  if (!sidebarContainer) {
    console.error("Sidebar container tidak ditemukan.");
    return;
  }

  // Muat sidebar dari _sidebar.html
  fetch("/components/_sidebar.html")
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
    const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";
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

  // =================================================================== */
  // ADMIN CHAT FUNCTIONALITY */
  // =================================================================== */
  
  // Initialize admin chat if elements exist
  const adminChatButton = document.querySelector('.chat-button');
  const adminChatBox = document.querySelector('.chat-box');
  const adminChatClose = document.querySelector('.chat-close');
  const adminChatInput = document.querySelector('.chat-input');
  const adminChatSend = document.querySelector('.chat-send');
  const adminChatMessages = document.querySelector('.chat-messages');
  const adminNotification = document.querySelector('.notification');

  if (adminChatButton && adminChatBox) {
    // Toggle chat box
    adminChatButton.addEventListener('click', function() {
      adminChatBox.classList.toggle('active');
      if (adminNotification) {
        adminNotification.style.display = 'none';
      }
    });
    
    // Close chat box
    if (adminChatClose) {
      adminChatClose.addEventListener('click', function() {
        adminChatBox.classList.remove('active');
      });
    }
    
    // Send message function
    function sendAdminMessage() {
      const message = adminChatInput.value.trim();
      if (message === '') return;
      
      // Add user message
      addAdminMessage(message, 'user');
      adminChatInput.value = '';
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        const response = getAdminAIResponse(message);
        addAdminMessage(response, 'ai');
      }, 1000);
    }
    
    // Send message on button click
    if (adminChatSend) {
      adminChatSend.addEventListener('click', sendAdminMessage);
    }
    
    // Send message on Enter key
    if (adminChatInput) {
      adminChatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          sendAdminMessage();
        }
      });
    }
    
    // Add message to chat
    function addAdminMessage(text, sender) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.classList.add(sender + '-message');
      messageElement.textContent = text;
      
      if (adminChatMessages) {
        adminChatMessages.appendChild(messageElement);
        adminChatMessages.scrollTop = adminChatMessages.scrollHeight;
      }
    }
    
    // Simple AI response logic for admin
    function getAdminAIResponse(message) {
      const lowerMsg = message.toLowerCase();
      
      if (lowerMsg.includes('halo') || lowerMsg.includes('hai') || lowerMsg.includes('hi')) {
        return 'Halo! Selamat datang di SmartFarm Admin Panel. Ada yang bisa saya bantu?';
      } else if (lowerMsg.includes('dashboard') || lowerMsg.includes('statistik')) {
        return 'Dashboard menampilkan ringkasan penjualan, pesanan, dan statistik penting lainnya.';
      } else if (lowerMsg.includes('produk') || lowerMsg.includes('product')) {
        return 'Kelola produk Anda di halaman Products. Anda bisa menambah, mengedit, atau menghapus produk.';
      } else if (lowerMsg.includes('pesanan') || lowerMsg.includes('order')) {
        return 'Kelola pesanan pelanggan di halaman Orders. Anda bisa melihat detail dan mengupdate status pesanan.';
      } else if (lowerMsg.includes('pelanggan') || lowerMsg.includes('customer')) {
        return 'Kelola data pelanggan di halaman Customers. Anda bisa melihat dan mengedit informasi pelanggan.';
      } else if (lowerMsg.includes('laporan') || lowerMsg.includes('report')) {
        return 'Laporan penjualan dan transaksi tersedia di halaman Transaksi.';
      } else if (lowerMsg.includes('terima kasih') || lowerMsg.includes('makasih') || lowerMsg.includes('thanks')) {
        return 'Sama-sama! Senang bisa membantu. Jika ada pertanyaan lain, jangan ragu untuk bertanya.';
      } else {
        return 'Maaf, saya belum mengerti pertanyaan Anda. Bisa diulangi dengan kata lain? Atau cek dokumentasi admin panel.';
      }
    }
    
    // Simulate initial notification
    if (adminNotification) {
      setTimeout(() => {
        adminNotification.style.display = 'flex';
      }, 3000);
    }
  }

  // =================================================================== */
  // ADMIN DASHBOARD ANIMATIONS */
  // =================================================================== */
  
  // Animate stat cards on load
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards.length > 0) {
    statCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-fade-in-up');
      }, index * 100);
    });
  }

  // =================================================================== */
  // FORM VALIDATION AND SUBMISSION */
  // =================================================================== */
  
  // Handle form submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // Add loading state to submit button
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Re-enable after 3 seconds (adjust as needed)
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Submit';
        }, 3000);
      }
    });
  });

  // =================================================================== */
  // TABLE INTERACTIONS */
  // =================================================================== */
  
  // Handle table row selections
  const selectAllCheckbox = document.querySelector('input[type="checkbox"][data-select-all]');
  const rowCheckboxes = document.querySelectorAll('input[type="checkbox"][data-row-select]');
  
  if (selectAllCheckbox && rowCheckboxes.length > 0) {
    selectAllCheckbox.addEventListener('change', function() {
      rowCheckboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
      });
    });
    
    rowCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const checkedCount = document.querySelectorAll('input[type="checkbox"][data-row-select]:checked').length;
        selectAllCheckbox.checked = checkedCount === rowCheckboxes.length;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < rowCheckboxes.length;
      });
    });
  }

  // =================================================================== */
  // MODAL HANDLING */
  // =================================================================== */
  
  // Handle modal confirmations
  const deleteButtons = document.querySelectorAll('[data-delete-confirm]');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const itemName = this.getAttribute('data-delete-confirm');
      if (confirm(`Apakah Anda yakin ingin menghapus ${itemName}?`)) {
        // Proceed with deletion
        const form = this.closest('form');
        if (form) {
          form.submit();
        }
      }
    });
  });

  // =================================================================== */
  // SEARCH AND FILTER FUNCTIONALITY */
  // =================================================================== */
  
  // Handle search inputs
  const searchInputs = document.querySelectorAll('input[data-search]');
  searchInputs.forEach(input => {
    input.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const targetTable = document.querySelector(this.getAttribute('data-search'));
      
      if (targetTable) {
        const rows = targetTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
      }
    });
  });

  // =================================================================== */
  // NOTIFICATION SYSTEM */
  // =================================================================== */
  
  // Show success/error messages
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
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
});

// Chart.js untuk Dashboard
document.addEventListener("DOMContentLoaded", () => {
    // Cek jika kita berada di halaman dashboard
    if (document.getElementById("salesChart")) {
        const salesChartCanvas = document.getElementById("salesChart");
        const ctx = salesChartCanvas.getContext("2d");

        let gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(67, 97, 238, 0.3)"); // Warna biru primer
        gradient.addColorStop(1, "rgba(67, 97, 238, 0)");

        new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{
                    label: "Sales",
                    data: [120, 190, 300, 500, 200, 350, 450],
                    borderColor: "#4361ee", // Warna biru primer
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "#fff",
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: "#e0e6ed" } },
                    x: { grid: { display: false } }
                }
            },
        });
    }
});