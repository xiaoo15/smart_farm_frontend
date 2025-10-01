<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin - Edit Product</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      integrity="sha512-..."
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <link rel="stylesheet" href="assets/css/admin_style.css" />

    <style>
      /* --- CSS UNTUK ANIMASI FADE-IN --- */
      .form-row-animated,
      .content-header {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease-out, transform 0.5s ease-out;
      }
      .form-row-animated.is-visible,
      .content-header.is-visible {
        opacity: 1;
        transform: translateY(0);
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
            <h2>Edit Product</h2>
            <p>Update the form below to edit the product.</p>
          </div>
        </header>
        <div class="dashboard-section">
          <form id="editProductForm">
            <div class="row mb-3 form-row-animated">
              <div class="col-md-6">
                <label for="productCode" class="form-label">Kode</label
                ><input
                  type="text"
                  class="form-control"
                  id="productCode"
                  readonly
                />
              </div>
              <div class="col-md-6">
                <label for="productName" class="form-label">Nama</label
                ><input
                  type="text"
                  class="form-control"
                  id="productName"
                  required
                />
              </div>
            </div>
            <div class="row mb-3 form-row-animated">
              <div class="col-md-6">
                <label for="productStock" class="form-label">Jumlah Stok</label
                ><input
                  type="number"
                  class="form-control"
                  id="productStock"
                  required
                />
              </div>
              <div class="col-md-6">
                <label for="productUnitValue" class="form-label">Satuan</label>
                <div class="input-group">
                  <input
                    type="number"
                    class="form-control"
                    id="productUnitValue"
                    required
                  /><select
                    class="form-select"
                    id="productUnitType"
                    style="max-width: 120px"
                  >
                    <option value="Pcs">Pcs</option>
                    <option value="Ikat">Ikat</option>
                    <option value="Gram">Gram</option>
                    <option value="Ml">Ml</option>
                    <option value="Kg">Kg</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row mb-3 form-row-animated">
              <div class="col-md-6">
                <label for="productPrice" class="form-label"
                  >Harga per Satuan</label
                >
                <div class="input-group">
                  <span class="input-group-text">Rp</span
                  ><input
                    type="number"
                    class="form-control"
                    id="productPrice"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label for="productCategory" class="form-label">Kategori</label
                ><select class="form-select" id="productCategory" required>
                  <option value="">Pilih Kategori...</option>
                  <option value="Tanaman">Tanaman</option>
                  <option value="Bibit">Bibit</option>
                  <option value="Pupuk">Pupuk</option>
                  <option value="Alat">Alat</option>
                </select>
              </div>
            </div>
            <div class="row mb-3 form-row-animated">
              <div class="col-md-6">
                <label class="form-label">Status</label>
                <div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="productStatus"
                      id="statusActive"
                      value="Aktif"
                      checked
                    /><label class="form-check-label" for="statusActive"
                      >Aktif</label
                    >
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="productStatus"
                      id="statusInactive"
                      value="Nonaktif"
                    /><label class="form-check-label" for="statusInactive"
                      >Nonaktif</label
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-3 form-row-animated">
              <label for="productDescription" class="form-label"
                >Deskripsi</label
              ><textarea
                class="form-control"
                id="productDescription"
                rows="4"
              ></textarea>
            </div>
            <div class="mb-4 form-row-animated">
              <label for="productImage" class="form-label">Gambar</label
              ><img
                id="imagePreview"
                src="#"
                alt="Preview Gambar"
                class="img-thumbnail mb-3"
                style="display: none; max-width: 200px"
              /><input class="form-control" type="file" id="productImage" />
            </div>
            <div class="d-flex gap-2 form-row-animated">
              <button type="submit" class="btn btn-primary-custom">
                <i class="fas fa-save me-2"></i>Update Product</button
              ><a href="products.html" class="btn btn-secondary-custom"
                >Cancel</a
              >
            </div>
          </form>
        </div>
        <footer class="footer mt-auto py-3">
          <div class="container-fluid">
            <div class="row">
              <div class="col-12 text-center">
                <script>
                  document.write(new Date().getFullYear());
                </script>
                © Smart Farm.
                <span class="d-none d-sm-inline-block"
                  >- Design & Develop by Smart Farm.</span
                >
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
    <script src="assets/js/admin_script.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="assets/js/admin_script.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
      document.addEventListener("DOMContentLoaded", function () {
        // --- BAGIAN 1: Mengisi form dengan data yang mau diedit ---
        const productDataString = localStorage.getItem("productToEdit");

        if (productDataString) {
          try {
            const productData = JSON.parse(productDataString);

            document.getElementById("productCode").value = productData.code;
            document.getElementById("productName").value = productData.name;
            document.getElementById("productStock").value = productData.stock;
            document.getElementById("productUnitValue").value =
              productData.unitValue;
            document.getElementById("productUnitType").value =
              productData.unitType;
            document.getElementById("productPrice").value = productData.price;
            document.getElementById("productCategory").value =
              productData.category;
            document.getElementById("productDescription").value =
              productData.description;

            if (productData.status === "Aktif") {
              document.getElementById("statusActive").checked = true;
            } else {
              document.getElementById("statusInactive").checked = true;
            }

            const imagePreview = document.getElementById("imagePreview");
            if (productData.imgSrc) {
              imagePreview.src = productData.imgSrc;
              imagePreview.style.display = "block";
            }

            // Hapus data sementara setelah dipakai, biar ga numpuk
            // localStorage.removeItem('productToEdit'); // Kita hapus nanti setelah disimpen
          } catch (e) {
            alert("Gagal memproses data produk. Error: " + e.message);
            window.location.href = "products.html";
          }
        } else {
          alert(
            "Tidak ada data produk yang dipilih untuk diedit. Kamu akan dikembalikan ke halaman produk."
          );
          window.location.href = "products.html";
        }

        // Animasi (biarin aja, ini buat tampilan)
        const elementsToAnimate = document.querySelectorAll(
          ".content-header, .form-row-animated"
        );
        elementsToAnimate.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add("is-visible");
          }, index * 80);
        });

        // --- BAGIAN 2: Menyimpan perubahan saat form di-submit ---
        const editForm = document.getElementById("editProductForm");
        if (editForm) {
          editForm.addEventListener("submit", function (event) {
            event.preventDefault();

            // 1. Ambil semua data BARU dari form
            const updatedCode = document.getElementById("productCode").value; // Ini jadi kunci buat nyari produknya
            const updatedName = document.getElementById("productName").value;
            const updatedStock = document.getElementById("productStock").value;
            const updatedUnitValue =
              document.getElementById("productUnitValue").value;
            const updatedUnitType =
              document.getElementById("productUnitType").value;
            const updatedPrice = document.getElementById("productPrice").value;
            const updatedCategory =
              document.getElementById("productCategory").value;
            const updatedStatus = document.querySelector(
              'input[name="productStatus"]:checked'
            ).value;
            const updatedDescription =
              document.getElementById("productDescription").value;
            const updatedImageInput = document.getElementById("productImage");

            // Fungsi untuk update data di localStorage
            const performUpdate = (newImgSrc) => {
              // 2. Ambil semua data produk dari localStorage
              let products = JSON.parse(localStorage.getItem("products")) || [];
              const productIndex = products.findIndex(
                (p) => p.code === updatedCode
              );

              // 3. Cari produk yang cocok, terus UPDATE datanya
              if (productIndex !== -1) {
                const categoryValue =
                  {
                    Tanaman: "plant",
                    Bibit: "seed",
                    Alat: "vegetables",
                  }[updatedCategory] || "plant";

                products[productIndex].name = updatedName;
                products[
                  productIndex
                ].jumblah = `${updatedStock} ${updatedUnitType}`;
                products[productIndex].satuan = updatedUnitValue;
                products[productIndex].price = `Rp ${parseInt(
                  updatedPrice
                ).toLocaleString("id-ID")}`;
                products[productIndex].category = categoryValue;
                products[productIndex].categoryDisplay = updatedCategory;
                products[productIndex].description = updatedDescription;
                products[productIndex].status = updatedStatus;

                // Kalo ada gambar baru diupload, ganti gambarnya. Kalo gaada, pake gambar lama.
                if (newImgSrc) {
                  products[productIndex].imgSrc = newImgSrc;
                }

                // 4. Simpan lagi semua data produk ke localStorage
                localStorage.setItem("products", JSON.stringify(products));
                localStorage.removeItem("productToEdit"); // Hapus data sementara

                // 5. Kasih notif sukses dan kembali ke halaman produk
                Swal.fire({
                  title: "Sipp!",
                  text: "Data produk berhasil di-update.",
                  icon: "success",
                  confirmButtonText: "OK",
                }).then(() => {
                  window.location.href = "products.html";
                });
              } else {
                // Kalo produknya ga ketemu (jarang terjadi)
                Swal.fire(
                  "Error!",
                  `Produk dengan kode ${updatedCode} tidak ditemukan!`,
                  "error"
                );
              }
            };

            // Cek kalo ada gambar baru yang diupload
            if (updatedImageInput.files && updatedImageInput.files[0]) {
              const reader = new FileReader();
              reader.onload = function (e) {
                performUpdate(e.target.result); // Panggil fungsi update dengan gambar baru
              };
              reader.readAsDataURL(updatedImageInput.files[0]);
            } else {
              performUpdate(null); // Panggil fungsi update tanpa gambar baru
            }
          });
        }
      });
    </script>
  </body>
</html>
