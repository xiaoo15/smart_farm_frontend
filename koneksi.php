<?php
// koneksi.php

$host = "localhost";    // Nama host server database
$user = "root";         // Username database (default XAMPP adalah "root")
$pass = "";             // Password database (default XAMPP kosong)
$db   = "codefarm"; // Nama database yang kita buat tadi

// Membuat koneksi ke database
$koneksi = mysqli_connect($host, $user, $pass, $db);

// Cek koneksi, kalau gagal, kasih tau errornya
if (!$koneksi) {
    die("Koneksi Gagal: " . mysqli_connect_error());
}

// Fungsi simpel buat formatin angka ke Rupiah
function formatRupiah($angka) {
    return "Rp " . number_format($angka, 0, ',', '.');
}
?>