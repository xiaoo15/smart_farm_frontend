<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin - Add Product</title>
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-..." crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="assets/css/admin_style.css" />
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
            <h2>Add New Product</h2>
            <p>Fill the form below to add a new product.</p>
          </div>
        </header>

        <div class="dashboard-section">
          <form>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="productCode" class="form-label">Kode</label>
                <input
                  type="text"
                  class="form-control"
                  id="productCode"
                  placeholder="Contoh: P004"
                />
              </div>
              <div class="col-md-6">
                <label for="productName" class="form-label">Nama</label>
                <input
                  type="text"
                  class="form-control"
                  id="productName"
                  placeholder="Masukkan nama produk"
                />
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label for="productStock" class="form-label">Jumlah Stok</label>
                <input
                  type="number"
                  class="form-control"
                  id="productStock"
                  placeholder="Masukkan jumlah stok awal"
                />
              </div>
              <div class="col-md-6">
                <label for="productUnitValue" class="form-label">Satuan</label>
                <div class="input-group">
                  <input
                    type="number"
                    class="form-control"
                    id="productUnitValue"
                    placeholder="Contoh: 100"
                    aria-label="Nilai satuan"
                  />
                  <select class="form-select" id="productUnitType" style="max-width: 120px;">
                    <option value="Pcs">Pcs</option>
                    <option value="Ikat">Ikat</option>
                    <option value="Gram">Gram</option>
                    <option value="Ml">Ml</option>
                    <option value="Kg">Kg</option>
                  </select>
                </div>
                <div class="form-text">Contoh: 1 Pcs, 100 Gram, 500 Ml</div>
              </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="productPrice" class="form-label">Harga per Satuan</label>
                    <div class="input-group">
                      <span class="input-group-text">Rp</span>
                      <input
                        type="number"
                        class="form-control"
                        id="productPrice"
                        placeholder="Contoh: 50000"
                      />
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="productCategory" class="form-label">Kategori</label>
                    <select class="form-select" id="productCategory">
                      <option selected>Pilih Kategori...</option>
                      <option value="Tanaman">Tanaman</option>
                      <option value="Bibit">Bibit</option>
                      <option value="Pupuk">Pupuk</option>
                      <option value="Alat">Alat</option>
                    </select>
                </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Status</label>
                <div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="productStatus" id="statusActive" value="Aktif" checked>
                    <label class="form-check-label" for="statusActive">Aktif</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="productStatus" id="statusInactive" value="Nonaktif">
                    <label class="form-check-label" for="statusInactive">Nonaktif</label>
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-3">
                <label for="productDescription" class="form-label">Deskripsi</label>
                <textarea class="form-control" id="productDescription" rows="4" placeholder="Masukkan deskripsi lengkap produk..."></textarea>
            </div>


            <div class="mb-4">
              <label for="productImage" class="form-label">Gambar</label>
              <input class="form-control" type="file" id="productImage" />
              <div class="form-text">Pilih gambar utama untuk produk Anda.</div>
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary-custom">
                <i class="fas fa-save me-2"></i>Save
              </button>
              <a href="products.html" class="btn btn-secondary-custom">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
<script src="assets/js/admin_script.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const addProductForm = document.querySelector('form');

        addProductForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // 1. Ambil semua data dari form
            const productCode = document.getElementById('productCode').value;
            const productName = document.getElementById('productName').value;
            const productStock = document.getElementById('productStock').value;
            const productUnitValue = document.getElementById('productUnitValue').value;
            const productUnitType = document.getElementById('productUnitType').value;
            const productPrice = document.getElementById('productPrice').value;
            const productCategory = document.getElementById('productCategory').value;
            const productStatus = document.querySelector('input[name="productStatus"]:checked').value;
            const productDescription = document.getElementById('productDescription').value;
            const productImageInput = document.getElementById('productImage');

            // 2. Validasi simpel, biar ga ada yang kosong
            if (!productCode || !productName || !productStock || !productPrice || productCategory === 'Pilih Kategori...') {
                Swal.fire('Waduh!', 'Kode, Nama, Stok, Harga, dan Kategori wajib diisi ya!', 'error');
                return;
            }

            // Fungsi buat nyimpen data (termasuk gambar)
            const saveData = (imgSrc) => {
                // Konversi kategori biar sesuai sama data-category di tabel
                const categoryValue = {
                    'Tanaman': 'plant',
                    'Bibit': 'seed',
                    'Alat': 'vegetables' // Asumsi 'Alat' pakai kategori 'vegetables'
                }[productCategory] || 'plant';

                // 3. Bikin object produk baru
                const newProduct = {
                    code: productCode,
                    name: productName,
                    jumblah: `${productStock} ${productUnitType}`,
                    satuan: productUnitValue,
                    price: `Rp ${parseInt(productPrice).toLocaleString('id-ID')}`,
                    category: categoryValue,
                    categoryDisplay: productCategory,
                    imgSrc: imgSrc,
                    description: productDescription,
                    status: productStatus
                };

                // 4. Ambil data produk lama dari localStorage, tambahin yang baru, terus simpen lagi
                let products = JSON.parse(localStorage.getItem('products')) || [];
                // Cek dulu, jangan sampe kodenya sama
                if (products.some(p => p.code === newProduct.code)) {
                    Swal.fire('Oops!', `Produk dengan kode ${newProduct.code} sudah ada!`, 'error');
                    return;
                }
                products.push(newProduct);
                localStorage.setItem('products', JSON.stringify(products));

                // 5. Kasih notif sukses dan lempar ke halaman produk
                Swal.fire({
                    title: 'Mantap!',
                    text: 'Produk baru berhasil ditambahin.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'products.html';
                });
            };

            // 6. Proses file gambar
            if (productImageInput.files && productImageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    saveData(e.target.result); // Simpen data kalo gambar berhasil dibaca
                };
                reader.readAsDataURL(productImageInput.files[0]);
            } else {
                // Kalo ga ada gambar, pake gambar placeholder
                saveData('https://via.placeholder.com/56');
            }
        });
    });
</script>
  </body>
</html>