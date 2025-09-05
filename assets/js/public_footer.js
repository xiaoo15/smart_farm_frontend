// JS loader for public footer
// Usage: <div id="footer-placeholder"></div> + <script src="../../assets/js/public_footer.js"></script>

fetch('../../components/_footer_public.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('footer-placeholder').innerHTML = html;
  });
