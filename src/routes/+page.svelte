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
    export let cx;
    export let cy;
    export let cz;
    import Stage from '$lib/Stage.svelte';
    import { fade } from 'svelte/transition';
    import HomeFooter from '$lib/components/HomeFooter.svelte';
    import Messageform from '$lib/components/Messageform.svelte';
    import HeaderHoverText from '$lib/components/HeaderHoverText.svelte';
    import Nav from '$lib/Nav.svelte';
    import BurgerMenu from '$lib/components/BurgerMenu.svelte';
    import ContactIcon from '$lib/components/ContactIcon.svelte'; // Neue Komponente importieren
    
    let stageComponent;
    let currentSection = 'intro';
    
    // Zustandsvariablen für Kontaktformular
    let contactFormVisible = false;

    // Funktion, die die exportierte Navigationsfunktion der Stage-Komponente aufruft
    function navigateTo(sectionId) {
        if (stageComponent && typeof stageComponent.navigateToSection === 'function') {
            stageComponent.navigateToSection(sectionId);
        }
    }
    
    // Aktuelle Jahreszahl für Copyright
    const getCurrentYear = () => new Date().getFullYear();
    
    // Formular-Handler
    function handleSubmit(e) {
        e.preventDefault();
        // Hier könntest du einen API-Call zum Senden der E-Mail implementieren
        // oder einen mailto-Link öffnen
        contactFormVisible = false;
        alert('Vielen Dank für deine Nachricht!');
    }
</script>

<!-- Header als Komponente -->
<HeaderHoverText />

<!-- Kontakt-Icon als Komponente -->
<ContactIcon on:open={() => contactFormVisible = true} />

<!-- Burger-Menü als Komponente -->
<BurgerMenu />

<!-- Kontaktformular als Komponente -->
<Messageform visible={contactFormVisible} on:close={() => contactFormVisible = false} />

<div class="app">
    <Stage 
        bind:this={stageComponent} 
        {cx} {cy} {cz} 
        isMainPage={true}
        bind:currentSection={currentSection}  
    />
    
    <!-- Navigation als Komponente einbinden -->
    <Nav {currentSection} {navigateTo} />
    
    <HomeFooter />
</div>

<style>
    .app {
        position: relative;
        width: 100%;
        height: 100%;
    }

</style>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
</svelte:head>
