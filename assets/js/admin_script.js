/* =================================================================== */
/* SMARTFARM ADMIN CONSOLIDATED SCRIPT - ALL ADMIN PAGES */
/* (Versi Final dengan Fitur Dashboard Lengkap) */
/* =================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --- FUNGSI GLOBAL ---

  /**
   * Memuat komponen HTML dari file eksternal ke dalam elemen container.
   * @param {string} url - Path ke file komponen HTML.
   * @param {string} containerId - ID elemen container tujuan.
   * @returns {Promise<void>}
   */
  const loadComponent = async (url, containerId) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Gagal memuat ${url}: ${response.statusText}`);
      }
      const data = await response.text();
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Menampilkan notifikasi sementara di pojok kanan atas.
   * @param {string} message - Pesan yang akan ditampilkan.
   * @param {string} [type='success'] - Tipe notifikasi ('success' atau 'error').
   */
  window.showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText =
      "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  };

  // --- INISIALISASI KOMPONEN UTAMA (Sidebar & Footer) ---

  const initializeApp = async () => {
    // Muat komponen sidebar dan footer secara bersamaan
    await Promise.all([
      loadComponent("/components/_sidebar.html", "sidebar-container"),
      loadComponent("/components/_footer_admin.html", "footer-container"),
    ]);

    // Setelah komponen dimuat, jalankan fungsi inisialisasi lainnya
    initializeSidebar();
    initializeAdminChat();
    initializeDashboardFeatures(); // <--- FUNGSI INI AKAN KITA ISI LENGKAP
    initializeGeneralAdminFeatures();
  };

  // --- FUNGSI INISIALISASI SPESIFIK ---

  /**
   * Mengatur semua event listener dan logika untuk sidebar.
   */
  function initializeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const hamburgerBtn = document.querySelector(".hamburger-btn");
    const overlay = document.getElementById("overlay");
    const mainContent = document.querySelector(".main-content");

    if (!sidebar || !hamburgerBtn || !overlay) {
      return;
    }

    const toggleSidebar = (e) => {
      if (e) e.stopPropagation();
      const isMobile = window.innerWidth < 993;
      if (isMobile) {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("active");
        document.body.style.overflow = sidebar.classList.contains("open")
          ? "hidden"
          : "";
      } else {
        sidebar.classList.toggle("collapsed");
        mainContent?.classList.toggle("expanded");
      }
    };

    const closeSidebar = () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    };

    const initSidebarState = () => {
      if (window.innerWidth < 993) {
        sidebar.classList.remove("collapsed");
      } else {
        closeSidebar();
      }
    };

    const highlightActiveMenu = () => {
      const currentPage =
        window.location.pathname.split("/").pop() || "dashboard.html";
      document
        .querySelectorAll(".sidebar-nav .sidebar-item")
        .forEach((item) => {
          const link = item.querySelector(".sidebar-link");
          if (link) {
            link.classList.remove("active");
            if (item.getAttribute("data-page") === currentPage) {
              link.classList.add("active");
            }
          }
        });
    };

    hamburgerBtn.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", closeSidebar);
    document.querySelectorAll(".sidebar-link, .logout-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 993) closeSidebar();
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sidebar.classList.contains("open")) {
        closeSidebar();
      }
    });

    window.addEventListener("resize", initSidebarState);
    highlightActiveMenu();
    initSidebarState();
  }

  /**
   * Mengatur fungsionalitas chat admin.
   */
  function initializeAdminChat() {
    // (Fungsi ini tetap sama seperti sebelumnya, tidak perlu diubah)
    const chatButton = document.querySelector(".chat-button");
    const chatBox = document.querySelector(".chat-box");
    if (!chatButton || !chatBox) return;

    const chatClose = chatBox.querySelector(".chat-close");
    const chatInput = chatBox.querySelector(".chat-input");
    const chatSend = chatBox.querySelector(".chat-send");
    const chatMessages = chatBox.querySelector(".chat-messages");
    const notification = document.querySelector(".notification");

    const addMessage = (text, sender) => {
      const msgEl = document.createElement("div");
      msgEl.classList.add("message", `${sender}-message`);
      msgEl.textContent = text;
      chatMessages.appendChild(msgEl);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const getAIResponse = (message) => {
      const msg = message.toLowerCase();
      const responses = {
        halo: "Halo! Selamat datang di SmartFarm Admin Panel. Ada yang bisa saya bantu?",
        dashboard:
          "Dashboard menampilkan ringkasan penjualan, pesanan, dan statistik penting lainnya.",
        produk:
          "Kelola produk Anda di halaman Products. Anda bisa menambah, mengedit, atau menghapus produk.",
        pesanan:
          "Kelola pesanan pelanggan di halaman Orders. Anda bisa melihat detail dan mengupdate status pesanan.",
        pelanggan:
          "Kelola data pelanggan di halaman Customers. Anda bisa melihat dan mengedit informasi pelanggan.",
        laporan:
          "Laporan penjualan dan transaksi tersedia di halaman Transaksi.",
        "terima kasih": "Sama-sama! Senang bisa membantu.",
      };
      for (const key in responses) {
        if (msg.includes(key)) return responses[key];
      }
      return "Maaf, saya belum mengerti. Coba cek dokumentasi admin panel.";
    };

    const sendMessage = () => {
      const message = chatInput.value.trim();
      if (message === "") return;

      addMessage(message, "user");
      chatInput.value = "";

      setTimeout(() => {
        addMessage(getAIResponse(message), "ai");
      }, 1000);
    };

    chatButton.addEventListener("click", () => {
      chatBox.classList.toggle("active");
      if (notification) notification.style.display = "none";
    });

    chatClose?.addEventListener("click", () =>
      chatBox.classList.remove("active")
    );
    chatSend?.addEventListener("click", sendMessage);
    chatInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });

    if (notification) {
      setTimeout(() => {
        notification.style.display = "flex";
      }, 3000);
    }
  }

  /**
   * Fitur yang HANYA berjalan di halaman Dashboard.
   * KODE DARI KAMU DIMASUKKAN DI SINI!
   */
  function initializeDashboardFeatures() {
    // Cek apakah ini halaman dashboard
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) {
      return; // Jika tidak ada searchInput, anggap bukan halaman dashboard, lalu stop.
    }

    // --- [MULAI] KODE DASHBOARD ---

    // Animate stat cards on load
    document.querySelectorAll(".stat-card").forEach((card, index) => {
      setTimeout(() => card.classList.add("animate-fade-in-up"), index * 100);
    });

    // --- FUNGSI SEARCH INTERAKTIF ---
    const searchableSections = {
      "sales statistics": "sales-statistics-card",
      sales: "sales-statistics-card",
      sale: "sales-statistics-card",
      "statistik sales": "sales-statistics-card",
      "statistik penjualan": "sales-statistics-card",
      "orders statistics": "orders-statistics-card",
      "statistik order": "orders-statistics-card",
      "statistik pesanan": "orders-statistics-card",
      "product statistics": "product-statistics-card",
      product: "product-statistics-card",
      products: "product-statistics-card",
      "statistik produk": "product-statistics-card",
      "recent orders": "recent-orders-card",
      order: "recent-orders-card",
      orders: "recent-orders-card",
      pesanan: "recent-orders-card",
      "recent order": "recent-orders-card",
      "top customers": "top-customers-card",
      customer: "top-customers-card",
      customers: "top-customers-card",
      pelanggan: "top-customers-card",
      "top customer": "top-customers-card",
    };

    searchInput.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        const query = searchInput.value.trim().toLowerCase();
        const targetId = searchableSections[query]; // Perbaikan: Logika ini lebih sederhana

        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            targetElement.style.transition = "box-shadow 0.3s ease-in-out";
            targetElement.style.boxShadow = "0 0 0 3px rgba(42, 157, 143, 0.5)";
            setTimeout(() => {
              targetElement.style.boxShadow = "";
            }, 2000);
          }
        } else {
          alert(`Bagian "${searchInput.value}" tidak ditemukan di dashboard.`);
        }
      }
    });

    // --- JAVASCRIPT UNTUK MODAL CUSTOMER ---
    const customerDetailModal = document.getElementById("customerDetailModal");
    if (customerDetailModal) {
      customerDetailModal.addEventListener("show.bs.modal", function (event) {
        const triggerElement = event.relatedTarget;
        const name = triggerElement.getAttribute("data-name");
        const username = triggerElement.getAttribute("data-username");
        const orders = triggerElement.getAttribute("data-orders");
        const spending = triggerElement.getAttribute("data-spending");

        customerDetailModal.querySelector("#modalCustomerName").textContent =
          name;
        customerDetailModal.querySelector(
          "#modalCustomerUsername"
        ).textContent = username;
        customerDetailModal.querySelector("#modalTotalOrders").textContent =
          orders;
        customerDetailModal.querySelector("#modalTotalSpending").textContent =
          spending;
      });
    }

    // --- FUNGSI BARIS TABEL BISA DIKLIK ---
    document.querySelectorAll(".clickable-row").forEach((row) => {
      row.addEventListener("click", () => {
        window.location.href = row.dataset.href;
      });
    });

    // --- GRAFIK (CHARTS) DENGAN DATA DINAMIS ---
    const salesData = {
      week: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        sales: [65, 59, 80, 81, 56, 55, 40],
        revenue: [28, 48, 40, 19, 86, 27, 90],
      },
      month: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        sales: [350, 410, 380, 500],
        revenue: [180, 220, 190, 250],
      },
      year: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "ags",
          "sep",
          "oct",
          "nov",
          "des",
        ],
        sales: [500, 450, 600, 700, 550, 650, 750, 700, 800, 850, 900, 850],
        revenue: [250, 220, 300, 350, 270, 320, 370, 380, 400, 420, 460, 480],
      },
    };
    const ordersChartData = {
      week: [1200, 345, 123],
      month: [4800, 1200, 510],
      year: [15000, 3500, 1800],
    };

    let salesChart;
    let ordersChart;

    const updateCharts = (period) => {
      if (salesChart) {
        const salesPeriodData = salesData[period];
        salesChart.data.labels = salesPeriodData.labels;
        salesChart.data.datasets[0].data = salesPeriodData.sales;
        salesChart.data.datasets[1].data = salesPeriodData.revenue;
        salesChart.update();
      }
      if (ordersChart) {
        ordersChart.data.datasets[0].data = ordersChartData[period];
        ordersChart.update();
      }
    };

    const salesChartCanvasNew = document.getElementById("salesChartNew");
    if (salesChartCanvasNew) {
      const ctxSales = salesChartCanvasNew.getContext("2d");
      salesChart = new Chart(ctxSales, {
        type: "line",
        data: {
          labels: salesData.week.labels,
          datasets: [
            {
              label: "Sales",
              data: salesData.week.sales,
              fill: false,
              borderColor: "#235347",
              tension: 0.4,
              pointBackgroundColor: "#235347",
              pointRadius: 5,
            },
            {
              label: "Revenue",
              data: salesData.week.revenue,
              fill: false,
              borderColor: "#8EB69B",
              tension: 0.4,
              pointBackgroundColor: "#8EB69B",
              pointRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              align: "end",
              labels: { usePointStyle: true, boxWidth: 8, color: "#051F20" },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: "#163832" },
              grid: { color: "#DAF1DE" },
            },
            x: { ticks: { color: "#163832" } },
          },
        },
      });
    }

    const ordersChartCanvas = document.getElementById("ordersChart");
    if (ordersChartCanvas) {
      const ctxOrders = ordersChartCanvas.getContext("2d");
      ordersChart = new Chart(ctxOrders, {
        type: "doughnut",
        data: {
          labels: ["Completed", "Pending", "Canceled"],
          datasets: [
            {
              label: "Orders",
              data: ordersChartData.week,
              backgroundColor: ["#235347", "#ffc107", "#dc3545"],
              borderColor: "#FFFFFF",
              borderWidth: 4,
              hoverOffset: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "75%",
          plugins: { legend: { display: false } },
        },
      });
    }

    const salesPeriodBtn = document.getElementById("salesPeriodBtn");
    const salesPeriodOptions = document.getElementById("salesPeriodOptions");
    if (salesPeriodOptions && salesPeriodBtn) {
      salesPeriodOptions.addEventListener("click", (event) => {
        if (event.target.tagName === "A") {
          event.preventDefault();
          const period = event.target.dataset.period;
          salesPeriodBtn.textContent = event.target.textContent;
          updateCharts(period);
        }
      });
    }

    // --- [SELESAI] KODE DASHBOARD ---
  }

  /**
   * Fitur umum untuk semua halaman admin (form, tabel, modal, dll).
   */
  function initializeGeneralAdminFeatures() {
    // (Fungsi ini tetap sama seperti sebelumnya, tidak perlu diubah)
    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", function () {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Processing...';
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML =
              submitBtn.getAttribute("data-original-text") || "Submit";
          }, 3000);
        }
      });
    });

    const selectAllCheckbox = document.querySelector("input[data-select-all]");
    const rowCheckboxes = document.querySelectorAll("input[data-row-select]");
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener("change", function () {
        rowCheckboxes.forEach((cb) => {
          cb.checked = this.checked;
        });
      });
      rowCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          const checkedCount = document.querySelectorAll(
            "input[data-row-select]:checked"
          ).length;
          selectAllCheckbox.checked = checkedCount === rowCheckboxes.length;
          selectAllCheckbox.indeterminate =
            checkedCount > 0 && checkedCount < rowCheckboxes.length;
        });
      });
    }

    document.querySelectorAll("[data-delete-confirm]").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const itemName = this.getAttribute("data-delete-confirm");
        if (confirm(`Apakah Anda yakin ingin menghapus ${itemName}?`)) {
          this.closest("form")?.submit();
        }
      });
    });

    document.querySelectorAll("input[data-search]").forEach((input) => {
      input.addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        const targetTable = document.querySelector(
          this.getAttribute("data-search")
        );
        targetTable?.querySelectorAll("tbody tr").forEach((row) => {
          row.style.display = row.textContent.toLowerCase().includes(searchTerm)
            ? ""
            : "none";
        });
      });
    });
  }

  // --- MULAI APLIKASI ---
  initializeApp();
});
