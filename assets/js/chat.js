 document.addEventListener('DOMContentLoaded', function() {
            const chatButton = document.querySelector('.chat-button');
            const chatBox = document.querySelector('.chat-box');
            const chatClose = document.querySelector('.chat-close');
            const chatInput = document.querySelector('.chat-input');
            const chatSend = document.querySelector('.chat-send');
            const chatMessages = document.querySelector('.chat-messages');
            const notification = document.querySelector('.notification');
            
            // Toggle chat box
            chatButton.addEventListener('click', function() {
                chatBox.classList.toggle('active');
                notification.style.display = 'none';
            });
            
            // Close chat box
            chatClose.addEventListener('click', function() {
                chatBox.classList.remove('active');
            });
            
            // Send message function
            function sendMessage() {
                const message = chatInput.value.trim();
                if (message === '') return;
                
                // Add user message
                addMessage(message, 'user');
                chatInput.value = '';
                
                // Simulate AI response after a short delay
                setTimeout(() => {
                    const response = getAIResponse(message);
                    addMessage(response, 'ai');
                }, 1000);
            }
            
            // Send message on button click
            chatSend.addEventListener('click', sendMessage);
            
            // Send message on Enter key
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            // Add message to chat
            function addMessage(text, sender) {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.classList.add(sender + '-message');
                messageElement.textContent = text;
                
                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            // Simple AI response logic
            function getAIResponse(message) {
                const lowerMsg = message.toLowerCase();
                
                if (lowerMsg.includes('halo') || lowerMsg.includes('hai') || lowerMsg.includes('hi')) {
                    return 'Halo! Selamat datang di SmartFarm. Ada yang bisa saya bantu?';
                } else if (lowerMsg.includes('harga') || lowerMsg.includes('berapa')) {
                    return 'Harga bibit dan sayuran bervariasi, silakan cek katalog kami untuk informasi detail.';
                } else if (lowerMsg.includes('cara beli') || lowerMsg.includes('beli') || lowerMsg.includes('order')) {
                    return 'Untuk membeli, pilih produk yang Anda inginkan lalu klik tombol "Beli" atau "Tambah ke Keranjang".';
                } else if (lowerMsg.includes('pengiriman') || lowerMsg.includes('kirim') || lowerMsg.includes('ongkir')) {
                    return 'Kami melakukan pengiriman ke seluruh Indonesia dengan berbagai pilihan kurir. Biaya pengiriman tergantung pada lokasi dan berat barang.';
                } else if (lowerMsg.includes('alamat') || lowerMsg.includes('lokasi')) {
                    return 'Toko kami berlokasi di Jl. Pertanian No. 123, Jakarta. Kami juga melayani pembelian online melalui website ini.';
                } else if (lowerMsg.includes('terima kasih') || lowerMsg.includes('makasih') || lowerMsg.includes('thanks')) {
                    return 'Sama-sama! Senang bisa membantu. Jika ada pertanyaan lain, jangan ragu untuk bertanya.';
                } else {
                    return 'Maaf, saya belum mengerti pertanyaan Anda. Bisa diulangi dengan kata lain? Atau hubungi customer service kami di 0800-123-4567.';
                }
            }
            
            // Simulate initial notification
            setTimeout(() => {
                notification.style.display = 'flex';
            }, 3000);
        });