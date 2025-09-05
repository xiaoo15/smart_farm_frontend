/* =================================================================== */
/* SMARTFARM PUBLIC CONSOLIDATED SCRIPT - ALL PUBLIC PAGES */
/* =================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  
  // =================================================================== */
  // NAVBAR LOADING */
  // =================================================================== */
  
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    fetch("../components/_navbar_public.html")
      .then((response) => response.ok ? response.text() : Promise.reject("Navbar public not found"))
      .then((data) => {
        headerPlaceholder.innerHTML = data;
        // Initialize navbar functionality after loading
        initializeNavbar();
      })
      .catch((error) => console.error("Error loading navbar public:", error));
  }

  // =================================================================== */
  // FOOTER LOADING */
  // =================================================================== */
  
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    fetch("../components/_footer_public.html")
      .then(response => response.text())
      .then(html => {
        footerPlaceholder.innerHTML = html;
      })
      .catch(error => console.error("Error loading footer:", error));
  }

  // =================================================================== */
  // NAVBAR FUNCTIONALITY */
  // =================================================================== */
  
  function initializeNavbar() {
    // Handle mobile menu toggle
    const mobileMenuToggle = document.querySelector('.navbar-toggler');
    const mobileMenu = document.querySelector('.navbar-collapse');
    
    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('show');
      });
    }

    // Handle search form submission
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchInput = this.querySelector('input[type="search"]');
        if (searchInput && searchInput.value.trim()) {
          // Redirect to products page with search query
          window.location.href = `products.html?search=${encodeURIComponent(searchInput.value.trim())}`;
        }
      });
    }

    // Update cart badge
    updateCartBadge();
  }

  // =================================================================== */
  // CART FUNCTIONALITY */
  // =================================================================== */
  
  function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
      // Get cart count from localStorage or API
      const cartCount = getCartCount();
      cartBadge.textContent = cartCount;
      cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    }
  }

  function getCartCount() {
    try {
      const cart = JSON.parse(localStorage.getItem('smartfarm_cart') || '[]');
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      return 0;
    }
  }

  function addToCart(productId, productName, price, image) {
    try {
      let cart = JSON.parse(localStorage.getItem('smartfarm_cart') || '[]');
      const existingItem = cart.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: productId,
          name: productName,
          price: price,
          image: image,
          quantity: 1
        });
      }
      
      localStorage.setItem('smartfarm_cart', JSON.stringify(cart));
      updateCartBadge();
      showNotification(`${productName} ditambahkan ke keranjang!`, 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Gagal menambahkan ke keranjang', 'error');
    }
  }

  // Make addToCart globally available
  window.addToCart = addToCart;

  // =================================================================== */
  // CHAT FUNCTIONALITY */
  // =================================================================== */
  
  const chatButton = document.querySelector('.chat-button');
  const chatBox = document.querySelector('.chat-box');
  const chatClose = document.querySelector('.chat-close');
  const chatInput = document.querySelector('.chat-input');
  const chatSend = document.querySelector('.chat-send');
  const chatMessages = document.querySelector('.chat-messages');
  const notification = document.querySelector('.notification');
  
  if (chatButton && chatBox) {
    // Toggle chat box
    chatButton.addEventListener('click', function() {
      chatBox.classList.toggle('active');
      if (notification) {
        notification.style.display = 'none';
      }
    });
    
    // Close chat box
    if (chatClose) {
      chatClose.addEventListener('click', function() {
        chatBox.classList.remove('active');
      });
    }
    
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
    if (chatSend) {
      chatSend.addEventListener('click', sendMessage);
    }
    
    // Send message on Enter key
    if (chatInput) {
      chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });
    }
    
    // Add message to chat
    function addMessage(text, sender) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.classList.add(sender + '-message');
      messageElement.textContent = text;
      
      if (chatMessages) {
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
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
    if (notification) {
      setTimeout(() => {
        notification.style.display = 'flex';
      }, 3000);
    }
  }

  // =================================================================== */
  // PRODUCT INTERACTIONS */
  // =================================================================== */
  
  // Handle product card interactions
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    // Add hover effects
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });

    // Handle add to cart buttons
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const productId = this.getAttribute('data-product-id');
        const productName = this.getAttribute('data-product-name');
        const productPrice = this.getAttribute('data-product-price');
        const productImage = this.getAttribute('data-product-image');
        
        if (productId && productName && productPrice) {
          addToCart(productId, productName, productPrice, productImage);
        }
      });
    }
  });

  // =================================================================== */
  // SEARCH FUNCTIONALITY */
  // =================================================================== */
  
  // Handle search on products page
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  
  if (searchQuery) {
    // Highlight search results
    const productTitles = document.querySelectorAll('.product-title');
    productTitles.forEach(title => {
      const text = title.textContent.toLowerCase();
      if (text.includes(searchQuery.toLowerCase())) {
        title.parentElement.style.border = '2px solid var(--primary)';
        title.parentElement.style.borderRadius = '8px';
      }
    });
  }

  // =================================================================== */
  // CATEGORY FILTERS */
  // =================================================================== */
  
  const categoryFilters = document.querySelectorAll('.category-filter');
  categoryFilters.forEach(filter => {
    filter.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all filters
      categoryFilters.forEach(f => f.classList.remove('active'));
      
      // Add active class to clicked filter
      this.classList.add('active');
      
      // Filter products based on category
      const category = this.getAttribute('data-category');
      filterProductsByCategory(category);
    });
  });

  function filterProductsByCategory(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      
      if (category === 'all' || cardCategory === category) {
        card.style.display = '';
        card.style.animation = 'fadeIn 0.3s ease';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // =================================================================== */
  // MODAL FUNCTIONALITY */
  // =================================================================== */
  
  // Handle product detail modals
  const productDetailBtns = document.querySelectorAll('.product-detail-btn');
  productDetailBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const productId = this.getAttribute('data-product-id');
      if (productId) {
        showProductModal(productId);
      }
    });
  });

  function showProductModal(productId) {
    // This would typically fetch product details from an API
    // For now, we'll show a placeholder modal
    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.display = 'block';
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Product Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Loading product details for ID: ${productId}</p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // =================================================================== */
  // NOTIFICATION SYSTEM */
  // =================================================================== */
  
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

  // =================================================================== */
  // SMOOTH SCROLLING */
  // =================================================================== */
  
  // Handle smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // =================================================================== */
  // LAZY LOADING IMAGES */
  // =================================================================== */
  
  // Simple lazy loading for product images
  const productImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    productImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    productImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }

  // =================================================================== */
  // FORM VALIDATION */
  // =================================================================== */
  
  // Handle contact forms
  const contactForms = document.querySelectorAll('form[data-contact]');
  contactForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');
      
      if (!name || !email || !message) {
        showNotification('Mohon lengkapi semua field', 'error');
        return;
      }
      
      if (!isValidEmail(email)) {
        showNotification('Format email tidak valid', 'error');
        return;
      }
      
      // Simulate form submission
      showNotification('Pesan berhasil dikirim!', 'success');
      this.reset();
    });
  });

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // =================================================================== */
  // INITIALIZATION */
  // =================================================================== */
  
  // Initialize cart badge on page load
  updateCartBadge();
  
  // Add loading animation to page
  document.body.classList.add('loaded');
});