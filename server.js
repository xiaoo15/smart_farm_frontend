// server.js
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// GANTI DENGAN API KEY KAMU!
const GEMINI_API_KEY = "AIzaSyBrhVcBblknPnjue6Z496f1wmVpcPorCn0";

// Inisialisasi model Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middleware
app.use(express.json());
// INI BAGIAN PENTING YANG DIPERBAIKI:
// Sekarang server akan menyajikan SEMUA file dari folder project-mu
app.use(express.static(__dirname)); 

// API Endpoint untuk chat
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = `Kamu adalah "SmartFarm Assistant", chatbot AI yang ramah dan membantu untuk toko online bernama SmartFarm. Toko ini menjual bibit tanaman, tanaman hias, pupuk, dan alat berkebun. Jawab pertanyaan pengguna dengan singkat, jelas, dan selalu dalam konteks pertanian atau produk yang dijual. Pertanyaan pengguna: "${userMessage}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ reply: text });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: 'Waduh, AI-nya lagi pusing. Coba lagi nanti ya.' });
  }
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
    console.log(`Buka tokomu di: http://localhost:${port}/public/index.html`); // <-- Buka link ini
});