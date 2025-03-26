<script>
    // Funktion zum automatischen Aktualisieren der Jahreszahl
    const getCurrentYear = () => new Date().getFullYear();
  </script>
  
  <footer>
    <div class="footer-container">
      <div class="footer-content">
        <!-- Linke Spalte: Copyright -->
        <div class="footer-section">
          <div class="section-label">Copyright</div>
          <div class="copyright">
            © {getCurrentYear()} Franz Anhäupl
          </div>
        </div>
        
        <!-- Mittlere Spalte: Links -->
        <div class="footer-section">
          <div class="section-label">Legal</div>
          <div class="legal-links">
            <a href="/imprint">Imprint</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
        </div>
        
        <!-- Rechte Spalte: Social Media als Text -->
        <div class="footer-section">
          <div class="section-label">Connect</div>
          <div class="social-links">
            <a href="https://www.linkedin.com/in/franzanhaeupl/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://github.com/Litorian113" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://www.instagram.com/fxma_photography_videography/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
  
  <style>
    footer {
      width: 100%;
      padding: 1.5rem 0;
      background-color: rgba(1, 3, 26, 0.8);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: 3rem;
    }
  
    .footer-container {
      width: 100%; /* Volle Breite */
    }
  
    .footer-content {
      max-width: 100%; /* Anpassung an Seitenlayout */
      /* margin: 0 auto; */
      /* padding: 0 2rem; */
      display: grid;
      grid-template-columns: repeat(6, 1fr); /* 6-spaltiges Raster */
      gap: 2rem;
    }
  
    /* Positionierung der Bereiche im 6-spaltigen Grid */
    .footer-section:nth-child(1) {
      grid-column: 1 / 3; /* Linker Bereich: Spalte 1-2 */
    }
  
    .footer-section:nth-child(2) {
      grid-column: 3 / 5; /* Mittlerer Bereich: Spalte 3-4 */
    }
  
    .footer-section:nth-child(3) {
      grid-column: 5 / 7; /* Rechter Bereich: Spalte 5-6 */
    }
  
    .footer-section {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  
    /* Labels über jeder Sektion */
    .section-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.3);
      margin-bottom: 0.75rem;
      text-align: left; /* Sicherstellung der linksbündigen Ausrichtung */
    }
  
    /* Linker Bereich: Copyright */
    .copyright {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
    }
  
    /* Mittlerer Bereich: Links */
    .legal-links {
      display: flex;
      gap: 1.5rem;
    }
  
    .legal-links a {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s ease;
    }
  
    .legal-links a:hover {
      color: rgba(255, 255, 255, 0.9);
    }
  
    /* Rechter Bereich: Social Media als Text */
    .social-links {
      display: flex;
      flex-direction: row; /* Geändert zu horizontal */
      gap: 1.5rem; /* Passender Abstand für horizontale Links */
    }
  
    .social-links a {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s ease, transform 0.2s ease;
    }
  
    .social-links a:hover {
      color: rgba(255, 255, 255, 0.9);
      transform: translateY(-2px); /* Zurück zu vertikaler Bewegung für horizontale Links */
    }
  
    /* Mobile Anpassungen */
    @media (max-width: 768px) {
      .footer-container {
        grid-template-columns: 1fr; /* Eine Spalte auf mobilen Geräten */
        gap: 2rem;
      }
  
      .footer-section:nth-child(1),
      .footer-section:nth-child(2),
      .footer-section:nth-child(3) {
        grid-column: 1; /* Alle Elemente in derselben Spalte */
      }
    }
  </style>