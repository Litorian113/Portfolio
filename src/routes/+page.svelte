<!-- src/routes/+page.svelte -->
<script context="module">
    export async function load({ url }) {
      return {
        cx: Number(url.searchParams.get('cx')) || 0,
        cy: Number(url.searchParams.get('cy')) || 0,
        cz: Number(url.searchParams.get('cz')) || 20
      };
    }
</script>

<script>
    import Stage from '$lib/Stage.svelte';
    import { fade } from 'svelte/transition';
    import HomeFooter from '$lib/components/HomeFooter.svelte';
    import Messageform from '$lib/components/Messageform.svelte';
    import HeaderHoverText from '$lib/components/HeaderHoverText.svelte';
    import Nav from '$lib/Nav.svelte';
    import BurgerMenu from '$lib/components/BurgerMenu.svelte';
    import ContactIcon from '$lib/components/ContactIcon.svelte';
    import WelcomeOverlay from '$lib/components/WelcomeOverlay.svelte';
    import { onMount } from 'svelte';
    
    // SEO settings for the homepage
    const pageTitle = "FXMA Design | Franz - Interaction Designer & Creative Developer";
    const pageDescription = "Portfolio of Franz, Interaction Designer focusing on UI/UX, web design and innovative digital experiences. Explore creative projects, 3D visualizations and interactive applications.";
    
    let stageComponent;
    let currentSection = 'intro';
    let contactFormVisible = false; 
    let showOverlay = false; // Standardmäßig ausblenden, bis wir prüfen können
    
    export let cx;
    export let cy;
    export let cz;

    onMount(() => {
        // Prüfen ob das Overlay bereits angezeigt wurde
        const hasSeenOverlay = localStorage.getItem('hasSeenOverlay');
        
        // Overlay nur anzeigen, wenn es noch nicht gesehen wurde
        if (!hasSeenOverlay) {
            showOverlay = true;
        }
    });

    function handleOverlayComplete() {
        showOverlay = false;
        
        // In localStorage speichern, dass das Overlay gesehen wurde
        try {
            localStorage.setItem('hasSeenOverlay', 'true');
        } catch (e) {
            // Fallback für Fälle, in denen localStorage nicht verfügbar ist
            console.warn('LocalStorage nicht verfügbar:', e);
        }
    }

    // Function that calls the exported navigation function of the Stage component
    function navigateTo(sectionId) {
        if (stageComponent && typeof stageComponent.navigateToSection === 'function') {
            stageComponent.navigateToSection(sectionId);
        }
    }
    
    // Current year for copyright
    const getCurrentYear = () => new Date().getFullYear();
    
    // Form handler
    function handleSubmit(e) {
        e.preventDefault();
        // Here you could implement an API call to send the email
        // or open a mailto link
        contactFormVisible = false;
        alert('Thank you for your message!');
    }
</script>

<!-- Page-specific SEO tags -->
<svelte:head>
    <title>{pageTitle}</title>
    <meta name="description" content={pageDescription}>
    
    <!-- Open Graph Tags for Social Media -->
    <meta property="og:title" content={pageTitle}>
    <meta property="og:description" content={pageDescription}>
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://fxma.design">
    <meta property="og:image" content="https://fxma.design/social-preview.jpg">
    
    <!-- Structured data for Google -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://fxma.design/",
      "name": "FXMA Design",
      "description": "Portfolio of Franz, Interaction Designer and Creative Developer",
      "author": {
        "@type": "Person",
        "name": "Franz"
      }
    }
    </script>
</svelte:head>

<!-- Begrüßungs-Overlay anzeigen, wenn showOverlay true ist -->
{#if showOverlay}
    <WelcomeOverlay onComplete={handleOverlayComplete} />
{/if}

<!-- Hidden H1 for SEO -->
<h1 class="sr-only">Franz - Interaction Designer & Creative Developer Portfolio</h1>

<!-- Header component -->
<HeaderHoverText />

<!-- Contact Icon component -->
<ContactIcon on:open={() => contactFormVisible = true} />

<!-- Burger Menu component -->
<BurgerMenu />

<!-- Contact form component -->
<Messageform visible={contactFormVisible} on:close={() => contactFormVisible = false} />

<div class="app">
    <Stage 
        bind:this={stageComponent} 
        bind:currentSection={currentSection}
        {cx}
        {cy}
        {cz}  
    />
    
    <!-- Include Navigation component -->
    <Nav {currentSection} {navigateTo} />
    
    <HomeFooter />
</div>

<style>
    .app {
        position: relative;
        width: 100%;
        height: 100%;
    }

    /* Screen reader only class for hidden H1 */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
</style>
