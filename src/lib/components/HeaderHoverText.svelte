<script>
    // Props für flexible Anpassungen, falls nötig
    export let firstName = "Franz";
    export let lastName = "Anhäupl";
    export let prefix = "Code by"; 
</script>

<div class="header-text">
    <div class="default-text">
        <span class="copyright">©</span>
        <span class="code-by">{prefix}</span>
        <span class="franz">{firstName}</span>
    </div>
    <div class="hover-text">
        <span class="copyright">©</span>
        <span class="franz">{firstName}</span>
        <span class="anhaupl">{lastName}</span>
    </div>
</div>

<style>
    /* Header-Text Styles */
    .header-text {
        position: fixed;
        top: 20px;
        left: 30px;
        z-index: 9999; 
        font-family: 'IBM Plex Mono', monospace;
        font-size: 16px;
        color: white;
        cursor: pointer;
        overflow: visible;
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        background: rgba(0, 0, 0, 0.3);
        padding: 8px 12px;
        border-radius: 4px;
        transform-style: flat;
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: none;
        width: auto;
    }
    
    .default-text, .hover-text {
        position: absolute;
        top: 0;
        left: 0;
        white-space: nowrap;
        transition: all 0.5s ease;
        padding: 8px 0;
        transform-style: flat;
    }
    
    .hover-text {
        opacity: 0;
        transform: translateX(20px);
    }
    
    .header-text:hover .default-text {
        opacity: 0;
        transform: translateX(-20px);
    }
    
    .header-text:hover .hover-text {
        opacity: 1;
        transform: translateX(0);
    }
    
    /* Mobile Anpassungen */
    @media (max-width: 768px) {
        .header-text {
            top: 20px;
            left: 20px;
            font-size: 14px;
            padding: 6px 10px;
            display: block;
        }
        
        .default-text, .hover-text {
            position: absolute;
            padding: 6px 0;
        }
    }
    
    /* Für sehr kleine Bildschirme */
    @media (max-width: 360px) {
        .header-text {
            top: 15px;
            left: 15px;
            font-size: 12px;
            padding: 5px 8px;
        }
    }
</style>