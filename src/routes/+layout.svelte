<script>
    import '../app.css';
    let { children } = $props();
    
    // Global SEO settings
    const siteName = "FXMA Design";
    const siteDescription = "Portfolio of Franz - Interaction Designer focusing on creative UI/UX solutions and innovative technologies";
    const siteBaseUrl = "https://fxma.design";
</script>

<!-- Global meta tags used on all pages -->
<svelte:head>
    <!-- Basic meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, viewport-fit=cover">
    <meta name="author" content="Franz">
    
    <!-- Favicon and icons -->
    <link rel="icon" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    
    <!-- Basic SEO tags -->
    <meta name="robots" content="index, follow">
    <meta property="og:site_name" content={siteName}>
    <meta property="og:locale" content="en_US">
    <meta name="theme-color" content="#01031A">
</svelte:head>

{@render children()}
