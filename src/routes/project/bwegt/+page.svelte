<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
  
    $: url = $page.url;
  
    function goBackToFlur() {
      const cx = url.searchParams.get('cx') ?? 0;
      const cy = url.searchParams.get('cy') ?? 0;
      const cz = url.searchParams.get('cz') ?? 20;
      goto(`/?cx=${cx}&cy=${cy}&cz=${cz}`);
    }
  </script>
  
  <h1>Projekt: Bwegt</h1>
  <p>Hier steht dein Content zum Projekt Nass.</p>
  <button on:click={goBackToFlur}>Zurück zum Flur</button>
  





<style>
/* IBM Plex Mono Regular */
@font-face {
  font-family: 'IBM Plex Mono';
  src: url('/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* Space Grotesk Regular */
@font-face {
  font-family: 'Space Grotesk';
  src: url('/fonts/Space_Grotesk/static/SpaceGrotesk-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}


h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 96px;
    color: yellow;
}



</style>