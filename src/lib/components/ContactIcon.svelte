<script>
    import { createEventDispatcher } from 'svelte';
    
    // Event-Dispatcher, um Events nach oben zu senden
    const dispatch = createEventDispatcher();
    
    // Funktion, die beim Klick auf das Icon aufgerufen wird
    function handleClick() {
        dispatch('open');
    }
</script>

<button class="contact-icon" on:click={handleClick} aria-label="Open contact form">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
</button>

<style>
    .contact-icon {
        position: fixed;
        top: 18px;
        right: 70px;
        z-index: 9999;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .contact-icon:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-3px);
    }
    
    .contact-icon svg {
        color: white;
    }
    
    /* Mobile Anpassungen */
    @media (max-width: 768px) {
        .contact-icon {
            top: 18px;
            right: 70px;
            padding: 6px;
        }
    }
</style>