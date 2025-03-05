<!-- src/routes/+page.svelte -->
<script context="module">
    export async function load({ url }) {
      return {
        cx: Number(url.searchParams.get('cx')) || 0,
      cy: Number(url.searchParams.get('cy')) || 0,
      cz: Number(url.searchParams.get('cz')) || 20
      };
    }
    export let cx;
    export let cy;
    export let cz;
    import Stage from '$lib/Stage.svelte';
  </script>
  
  <Stage {cx} {cy} {cz} />
  