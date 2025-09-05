// File: public_app.js
// Memuat _navbar_public.html ke elemen dengan id 'header-placeholder' (atau id lain jika diperlukan)
document.addEventListener("DOMContentLoaded", function () {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (!headerPlaceholder) {
    console.error("header-placeholder tidak ditemukan di halaman ini.");
    return;
  }
  fetch("../../components/_navbar_public.html")
    .then((response) => response.ok ? response.text() : Promise.reject("Navbar public not found"))
    .then((data) => {
      headerPlaceholder.innerHTML = data;
    })
    .catch((error) => console.error("Error loading navbar public:", error));
});
