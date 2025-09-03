// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000; // Anda bisa ganti port ini jika mau

// Middleware untuk menyajikan file statis
// Ini memberitahu Express bahwa folder 'pages' berisi file-file yang bisa diakses publik
app.use(express.static(path.join(__dirname, 'pages')));

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
    console.log(`Akses halaman login di: http://localhost:${port}/public/login.html`);
});