<script lang="ts">
  let { step }:  {step: number} = $props();

  const increseStep = () => {
    step += 1;
  }

  const decreaseStep = () => {
    step -= 1;
  }
</script>

<div>
  {#if step != 1}
  <button onclick="{decreaseStep}">前へ</button>
  {/if}
  {#if step != 4}
  <button onclick="{increseStep}">次へ</button>
  {/if}
</div>