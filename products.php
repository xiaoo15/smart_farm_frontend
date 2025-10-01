<?php
// products.php
require 'koneksi.php'; // Panggil file koneksi kita

// Ambil semua data produk dari database, urutkan dari yang terbaru
$query = "SELECT * FROM products ORDER BY id DESC";
$result = mysqli_query($koneksi, $query);
?>
<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF--8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin - My Products</title>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet" />
  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    rel="stylesheet" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
    rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-..." crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="assets/css/admin_style.css" />

  <style>
    .admin-wrapper {
      display: flex;
      min-height: 100vh;
      background: var(--background);
    }

    .main-content {
      flex: 1;
      padding: 36px 24px 36px 24px;
      transition: var(--transition);
      min-width: 0;
      background: var(--background);
    }

    @media (max-width: 991px) {
      .main-content {
        padding: 24px 8px 24px 8px;
      }
    }

    .content-header {
      margin-bottom: 30px;
    }

    .content-header h2 {
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--text-primary);
      font-size: 1.8rem;
    }

    .content-header p {
      color: var(--text-secondary);
      margin-bottom: 0;
      font-size: 1rem;
    }

    .dashboard-section {
      background: var(--card-bg);
      border-radius: var(--border-radius);
      padding: 32px 20px;
      box-shadow: var(--shadow-md);
      margin-bottom: 24px;
      border: none;
      max-width: 100vw;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .filter-container {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .form-control,
    .form-select {
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      padding: 10px 14px;
      box-shadow: var(--shadow-sm);
      transition: var(--transition);
      font-size: 0.9rem;
    }

    .form-control:focus,
    .form-select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
    }

    .btn-primary-custom {
      background: var(--primary);
      border: none;
      color: #fff;
      border-radius: 8px;
      padding: 10px 22px;
      font-weight: 600;
      font-size: 1rem;
      transition: var(--transition);
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: var(--shadow-sm);
      letter-spacing: 0.02em;
    }

    .btn-primary-custom:hover {
      background: #3651d3;
      color: #fff;
      transform: translateY(-2px) scale(1.03);
      box-shadow: var(--shadow-md);
    }

    .table-responsive {
      border-radius: var(--border-radius);
      overflow: auto;
      border: 1px solid #e2e8f0;
      background: var(--card-bg);
      box-shadow: var(--shadow-sm);
    }

    table {
      margin-bottom: 0;
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    thead {
      background-color: var(--primary-light);
    }

    thead th {
      border-bottom: none;
      padding: 16px 14px;
      font-weight: 600;
      color: var(--text-primary);
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 0.5px;
      border-top: 1px solid #e2e8f0;
    }

    thead th:first-child {
      border-left: 1px solid #e2e8f0;
      border-top-left-radius: var(--border-radius);
    }

    thead th:last-child {
      border-right: 1px solid #e2e8f0;
      border-top-right-radius: var(--border-radius);
    }

    tbody tr {
      transition: var(--transition);
      border-bottom: 1px solid #e2e8f0;
    }

    tbody tr:last-child {
      border-bottom: none;
    }

    tbody tr:hover {
      background-color: #f8f9fa;
    }

    tbody td {
      padding: 16px 14px;
      vertical-align: middle;
      border: none;
    }

    .product-img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 8px;
      transition: var(--transition);
    }

    .product-img:hover {
      transform: scale(1.8);
      box-shadow: var(--shadow-md);
      z-index: 10;
      position: relative;
    }

    .btn-primary-custom:hover {
      background-color: #297864;
      border-color: #297864;
      color: white;
    }

    .product-name {
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .btn-outline-secondary,
    .btn-outline-danger {
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 0.9rem;
      transition: var(--transition);
      border: 1px solid #e2e8f0;
      background: #fff;
      color: var(--text-secondary);
      box-shadow: none;
    }

    .btn-outline-secondary:hover {
      background: var(--primary-light);
      color: var(--primary);
      border-color: var(--primary);
    }

    .btn-outline-danger {
      color: var(--danger);
      border-color: var(--danger);
    }

    .btn-outline-danger:hover {
      background: #fff0f0;
      color: #fff;
      border-color: var(--danger);
    }

    #noResult {
      padding: 40px 20px;
      font-style: italic;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
    }

    .category-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: 500;
    }

    .category-plant {
      background-color: rgba(40, 167, 69, 0.1);
      color: var(--success);
    }

    .category-seed {
      background-color: rgba(23, 162, 184, 0.1);
      color: var(--info);
    }

    .category-vegetables {
      background-color: rgba(255, 193, 7, 0.1);
      color: var(--warning);
    }

    .product-img {
      width: 56px;
      height: 56px;
      object-fit: cover;
      border-radius: 10px;
      transition: var(--transition);
      box-shadow: 0 1px 4px rgba(67, 97, 238, 0.07);
    }

    .product-img:hover {
      transform: scale(1.12);
      box-shadow: var(--shadow-md);
      z-index: 10;
      position: relative;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 12px 2vw;
      }

      .dashboard-section {
        padding: 10px 2vw;
      }

      .section-header {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
      }

      .filter-container {
        width: 100%;
        justify-content: stretch;
      }

      #searchInput,
      #categoryFilter {
        width: 100% !important;
      }

      .btn-primary-custom {
        width: 100%;
        justify-content: center;
      }

      .table-responsive {
        border: none;
        box-shadow: none;
      }

      thead {
        display: none;
      }

      table {
        width: 100%;
      }

      #productTableBody {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      #productTableBody tr {
        display: flex;
        flex-direction: column;
        background: var(--card-bg);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-sm);
        border: 1px solid #e2e8f0;
        padding: 18px 14px 14px 14px;
        margin-bottom: 0;
      }

      #productTableBody td {
        display: block;
        border: none;
        padding: 0;
        position: static;
        min-height: unset;
      }

      #productTableBody td[data-label="Gambar"] {
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
      }

      #productTableBody .product-img {
        width: 64px;
        height: 64px;
        margin: 0 auto;
      }

      #productTableBody td[data-label="Kode"],
      #productTableBody td[data-label="Nama Produk"],
      #productTableBody td[data-label="Satuan"],
      #productTableBody td[data-label="Harga"] {
        margin-bottom: 6px;
        font-size: 1rem;
      }

      #productTableBody td[data-label="Nama Produk"] {
        font-weight: 600;
        font-size: 1.08rem;
      }

      #productTableBody td[data-label="Action"] {
        margin-top: 10px;
        display: flex;
        justify-content: center;
      }

      #productTableBody td:before {
        display: none !important;
      }
    }

    @media (max-width: 576px) {
      .main-content {
        padding: 16px 4vw;
      }

      .dashboard-section {
        padding: 16px;
      }

      .content-header h2 {
        font-size: 1.5rem;
      }

      td {
        padding: 10px 10px 10px 45%;
      }

      td:before {
        font-size: 0.8rem;
      }
    }

    .delete-btn {
      background-color: #6c757d14;
      transition: background-color 0.2s ease-in-out;
    }

    .delete-btn i {
      transition: color 0.2s ease-in-out;
    }

    .delete-btn:hover {
      background-color: #6c757d14;
    }

    .delete-btn:hover i {
      color: #dc3545;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .product-row,
    .dashboard-section,
    .content-header {
      opacity: 0;
      /* Mulai dari transparan */
    }

    .fade-in {
      animation: fadeInUp 0.6s ease-out forwards;
    }
  </style>
</head>

<body>
  <div id="preloader">
    <div class="spinner"></div>
  </div>
  <div class="admin-wrapper">
    <div id="sidebar-container"></div>
    <div id="overlay"></div>
    <div class="main-content">
      <header class="content-header">
        <div>
          <h2>Master Products</h2>
          <p>Manage your smart farm products here.</p>
        </div>
      </header>
      <div class="dashboard-section">
        <div class="section-header">
          <div class="filter-container">
            <input
              type="text"
              id="searchInput"
              class="form-control"
              placeholder="Cari nama produk..."
              style="width: 250px" />
            <select
              id="categoryFilter"
              class="form-select"
              style="width: 150px">
              <option value="all" selected>All Category</option>
              <option value="plant">Plant</option>
              <option value="seed">Seed</option>
              <option value="vegetables">Vegetables</option>
            </select>
          </div>
          <a href="product_add.html" class="btn btn-primary-custom">
            <i class="fas fa-plus me-2"></i>Add New Product
          </a>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th>Gambar</th>
                <th>Kode</th>
                <th>Nama Produk</th>
                <th>jumblah</th>
                <th>Satuan</th>
                <th>Harga</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody id="productTableBody">
              <?php
              // Looping untuk nampilin data produk
              if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                  // Tentukan path gambar, kalau kosong pakai placeholder
                  $gambar = (!empty($row['gambar'])) ? 'uploads/' . $row['gambar'] : 'https://via.placeholder.com/56';

                  // Mapping kategori untuk warna badge
                  $category_class = strtolower($row['kategori']);
              ?>
                  <tr data-category="<?php echo $row['kategori']; ?>" class="product-row">
                    <td data-label="Gambar">
                      <img src="<?php echo $gambar; ?>" alt="<?php echo $row['nama_produk']; ?>" class="product-img" />
                    </td>
                    <td data-label="Kode"><?php echo $row['kode_produk']; ?></td>
                    <td data-label="Nama Produk">
                      <div class="product-name"><?php echo $row['nama_produk']; ?></div>
                      <div class="category-badge category-<?php echo $category_class; ?>"><?php echo $row['kategori']; ?></div>
                    </td>
                    <td data-label="jumlah"><?php echo $row['stok'] . ' ' . $row['satuan']; ?></td>
                    <td data-label="Harga" class="product-price"><?php echo formatRupiah($row['harga']); ?></td>
                    <td data-label="Action" class="text-center">
                      <div class="action-buttons">
                        <a href="update_product.php?id=<?php echo $row['id']; ?>" class="btn btn-icon btn-sm btn-edit"><i class="fas fa-pencil-alt"></i></a>
                        <a href="hapus_produk.php?id=<?php echo $row['id']; ?>" class="btn btn-icon btn-sm delete-btn" onclick="return confirm('Yakin mau hapus produk ini?');"><i class="fas fa-trash-alt"></i></a>
                      </div>
                    </td>
                  </tr>
              <?php
                }
              } else {
                echo '<tr><td colspan="6" class="text-center" id="noResult">Belum ada produk. Tambahin dulu, yuk!</td></tr>';
              }
              ?>
            </tbody>
          </table>
          <p
            id="noResult"
            class="text-center text-muted"
            style="display: none">
            Produk tidak ditemukan :(
          </p>
        </div>
      </div>
      <footer class="footer footer-animated">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 text-center">
              <script>
                document.write(new Date().getFullYear());
              </script>
              © Smart Farm.
              <span class="d-none d-sm-inline-block">- Design & Develop by Smart Farm.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="assets/js/admin_script.js"></script>

  <script>
    $(document).ready(function() {
      // --- FUNGSI BARU UNTUK MENAMPILKAN PRODUK DARI LOCALSTORAGE ---
      function loadAndRenderProducts() {
        const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
        const tableBody = $("#productTableBody");

        storedProducts.forEach(product => {
          // Buat baris tabel baru dari data yang disimpen
          const newRowHtml = `
            <tr data-category="${product.category}" class="product-row" style="display: table-row;">
              <td data-label="Gambar">
                <img src="${product.imgSrc}" alt="${product.name}" class="product-img"/>
              </td>
              <td data-label="Kode">${product.code}</td>
              <td data-label="Nama Produk">
                <div class="product-name">${product.name}</div>
                <div class="category-badge category-${product.category}">${product.categoryDisplay}</div>
              </td>
              <td data-label="jumblah">${product.jumblah}</td>
              <td data-label="Satuan">${product.satuan}</td>
              <td data-label="Harga" class="product-price">${product.price}</td>
              <td data-label="Action" class="text-center">
                <div class="action-buttons">
                  <a href="#" class="btn btn-icon btn-sm" onclick="alert('Halaman detail untuk produk dinamis belum dibuat.')"><i class="fas fa-eye"></i></a>
                  <a href="update_product.html" class="btn btn-icon btn-sm btn-edit"><i class="fas fa-pencil-alt"></i></a>
                  <button class="btn btn-icon btn-sm delete-btn"><i class="fas fa-trash-alt"></i></button>
                </div>
              </td>
            </tr>
        `;
          // Masukin baris baru ke paling atas tabel
          tableBody.prepend(newRowHtml);
        });
      }

      // Panggil fungsinya pas halaman dimuat
      loadAndRenderProducts();


      // --- LOGIKA EDIT PRODUK (Ini kode lama kamu, tidak diubah) ---
      $("#productTableBody").on("click", ".btn-edit", function(event) {
        event.preventDefault();
        const productRow = $(this).closest("tr");
        const stockText = (productRow.find('[data-label="jumblah"]').text() || productRow.find('[data-label="Jumlah"]').text()).trim();
        const stockParts = stockText.split(" ");
        const stockQuantity = parseInt(stockParts[0], 10) || 0;
        const unitType = stockParts.length > 1 ? stockParts[1] : "Pcs";
        const categoryMap = {
          plant: "Tanaman",
          seed: "Bibit",
          vegetables: "Alat", // Disesuaikan
        };
        const rawCategory = productRow.data("category");
        const mappedCategory = categoryMap[rawCategory] || "Tanaman";
        const productData = {
          code: productRow.find('[data-label="Kode"]').text().trim(),
          name: productRow.find(".product-name").text().trim(),
          stock: stockQuantity,
          unitValue: productRow.find('[data-label="Satuan"]').text().trim(),
          unitType: unitType,
          price: productRow.find(".product-price").text().replace(/[^0-9]/g, ""),
          category: mappedCategory,
          imgSrc: productRow.find(".product-img").attr("src"),
          description: "Deskripsi placeholder.",
          status: stockQuantity > 0 ? "Aktif" : "Nonaktif",
        };
        try {
          localStorage.setItem("productToEdit", JSON.stringify(productData));
          window.location.href = $(this).attr("href");
        } catch (e) {
          console.error("GAGAL menyimpan data:", e);
          alert("Gagal menyimpan data produk!");
        }
      });

      // --- Fungsi Filter Produk (Ini kode lama kamu, tidak diubah) ---
      function filterProducts() {
        var searchText = $("#searchInput").val().toLowerCase();
        var category = $("#categoryFilter").val();
        var found = 0;
        $("#productTableBody tr").each(function() {
          var productName = $(this).find(".product-name").text().toLowerCase();
          var productCategory = $(this).data("category");
          var searchMatch = productName.includes(searchText);
          var categoryMatch = category === "all" || productCategory === category;
          if (searchMatch && categoryMatch) {
            $(this).show();
            found++;
          } else {
            $(this).hide();
          }
        });
        if (found === 0) {
          $("#noResult").show();
        } else {
          $("#noResult").hide();
        }
      }
      $("#searchInput").on("keyup", filterProducts);
      $("#categoryFilter").on("change", filterProducts);

      // --- Logika Tombol Hapus (Ini di-update biar bisa hapus dari localStorage) ---
      $("#productTableBody").on("click", ".delete-btn", function() {
        const productRowToDelete = $(this).closest("tr");
        const productName = productRowToDelete.find(".product-name").text();
        const productCode = productRowToDelete.find('[data-label="Kode"]').text().trim(); // Kita pake KODE sebagai ID unik

        Swal.fire({
          title: "Anda yakin?",
          html: `Yakin mau hapus produk <strong>${productName}</strong>?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Ya, Hapus",
          cancelButtonText: "Batal",
        }).then((result) => {
          if (result.isConfirmed) {
            // Hapus juga dari localStorage
            let products = JSON.parse(localStorage.getItem('products')) || [];
            products = products.filter(p => p.code !== productCode);
            localStorage.setItem('products', JSON.stringify(products));

            productRowToDelete.fadeOut(500, function() {
              $(this).remove();
              filterProducts();
            });
            Swal.fire({
              title: "Dihapus!",
              text: `Produk ${productName} berhasil dihapus.`,
              icon: "success",
            });
          }
        });
      });

      // --- Animasi Halaman (Ini kode lama kamu, tidak diubah) ---
      $(".content-header, .dashboard-section").addClass("fade-in");
      $(".product-row").each(function(index) {
        setTimeout(() => {
          $(this).addClass("fade-in");
        }, 150 + 50 * index);
      });
    });
  </script>
</body>

</html>