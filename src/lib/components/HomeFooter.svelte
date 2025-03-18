<script>
    // Aktuelle Jahreszahl für Copyright
    const getCurrentYear = () => new Date().getFullYear();
</script>

<footer class="custom-footer">
    <div class="footer-content">
        <div class="footer-left">
            <a href="/imprint">Imprint</a>
            <a href="/privacy">Privacy Policy</a>
        </div>
        <div class="footer-center"></div>
        <div class="footer-right">
            <a href="https://www.linkedin.com/in/franzanhaeupl/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/Litorian113" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.instagram.com/fxma_photography_videography/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
    </div>
</footer>

<style>
    /* Custom Footer Styles */
    .custom-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 1rem 0;
        /* Hintergrundfarbe entfernt */
        /* backdrop-filter entfernt */
        /* border-top: 1px solid rgba(255, 255, 255, 0.1); */
        z-index: 100;
    }
    
    .footer-content {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        max-width: 100%; /* Statt 1200px - nimmt die volle Breite */
        margin: 0 auto;
        padding: 0 1rem; /* Mehr seitlichen Abstand für besseres Aussehen */
    }
    
    .footer-center {
        display: flex;
        justify-content: center;
        gap: 2rem;
    }
    
    .footer-right {
        display: flex;
        justify-content: flex-end;
        gap: 1.5rem;
        margin-right: 2rem; /* Rechts mehr Abstand zum Rand */
    }
    
    .footer-content a {
        color: rgba(255, 255, 255, 0.6);
        text-decoration: none;
        font-size: 0.9rem;
        font-family: 'IBM Plex Mono', monospace;
        transition: all 0.3s ease;
    }
    
    .footer-content a:hover {
        color: white;
        transform: translateY(-2px);
    }

    /* Mehr Abstand zwischen Imprint und Privacy Policy */
    .footer-left {
        display: flex;
        gap: 2.5rem; /* Erhöhter Abstand zwischen den Links */
        margin-left: 2rem; /* Links mehr Abstand zum Rand */
    }

    @media (max-width: 768px) {
        .custom-footer {
            display: none;
        }
    }
</style>