<script>
  // Funktion zum automatischen Aktualisieren der Jahreszahl
  const getCurrentYear = () => new Date().getFullYear();
</script>

<footer>
  <div class="footer-container">
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
        <a href="/privacy-policy">Privacy Policy</a>
      </div>
    </div>
    
    <!-- Rechte Spalte: Social Media als Text -->
    <div class="footer-section">
      <div class="section-label">Connect</div>
      <div class="social-links">
        <a href="https://www.linkedin.com/in/franzanhaupl/" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href="https://github.com/franzos" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="https://www.instagram.com/franzanhaupl/" target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start; /* Ändere zu flex-start für korrekte vertikale Ausrichtung */
  }

  .footer-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Geändert auf linksbündig */
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
      flex-direction: column;
      gap: 2rem;
    }

    .footer-section {
      width: 100%;
    }
    
    /* Diese Zeilen können entfernt werden, da die Links bereits horizontal sind */
    /* .social-links {
      flex-direction: row;
      gap: 1.5rem;
    } */
  }
</style>