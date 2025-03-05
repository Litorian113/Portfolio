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


</style>