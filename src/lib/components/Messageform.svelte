<script>
    import { fade } from 'svelte/transition';
    
    // Props
    export let visible = false;
    
    // Events
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    // Formular-Handler
    function handleSubmit(e) {
        e.preventDefault();
        // Hier könntest du einen API-Call zum Senden der E-Mail implementieren
        // oder einen mailto-Link öffnen
        dispatch('close');
        alert('Thank you for your message!');
    }
    
    // Schließen-Funktion
    function close() {
        dispatch('close');
    }
</script>

{#if visible}
<div class="contact-overlay" role="dialog" aria-modal="true" transition:fade={{ duration: 200 }}>
    <button class="modal-backdrop" on:click={close} aria-label="Close contact form"></button>
    <div class="contact-form-container" role="document">
        <button class="close-button" on:click={close} aria-label="Close contact form">×</button>
        <h2>Contact</h2>
        <form on:submit={handleSubmit}>
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" required>
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" rows="5" required></textarea>
            </div>
            <button type="submit" class="send-button">Send</button>
        </form>
        <div class="direct-email">
            Or write me directly: <a href="mailto:franzanhaeupl@web.de">franzanhaeupl@web.de</a>
        </div>
    </div>
</div>
{/if}

<style>
    /* Kontaktformular Overlay */
    .contact-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6); /* Weniger deckend */
        backdrop-filter: blur(8px);
        border: none;
        cursor: pointer;
        padding: 0;
        margin: 0;
    }

    /* Kontaktformular mit Glaseffekt */
    .contact-form-container {
        background: rgba(18, 18, 18, 0.7); /* Hintergrund teilweise transparent */
        border-radius: 12px; /* Etwas stärkere Rundung */
        padding: 2rem;
        width: 90%;
        max-width: 500px;
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px); /* Glaseffekt */
        -webkit-backdrop-filter: blur(10px); /* Für Safari */
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3); /* Subtiler Schatten */
        z-index: 1;
    }
    
    h2 {
        color: white;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        text-align: left;
    }
    
    .close-button {
        position: absolute;
        top: 15px;
        right: 15px;
        background: transparent;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
    }
    
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: rgba(255, 255, 255, 0.7);
        font-family: 'IBM Plex Mono', monospace;
        font-size: 0.9rem;
        text-align: left;
    }
    
    .form-group input, .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 6px;
        color: white;
        font-family: 'IBM Plex Mono', monospace;
        text-align: left;
        backdrop-filter: blur(3px);
    }
    
    .form-group input:focus, .form-group textarea:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.5);
    }
    
    .send-button {
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        font-family: 'IBM Plex Mono', monospace;
        cursor: pointer;
        transition: all 0.3s ease;
        display: block;
        backdrop-filter: blur(3px);
    }
    
    .send-button:hover {
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
    }
    
    .direct-email {
        margin-top: 1.5rem;
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        text-align: left;
    }
    
    .direct-email a {
        color: white;
        text-decoration: none;
        border-bottom: 1px dotted rgba(255, 255, 255, 0.5);
    }
</style>