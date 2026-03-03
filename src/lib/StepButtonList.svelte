<script lang="ts">
  // $bindable(): 親コンポーネント(Form.svelte)とstepを双方向バインドするために必要。
  // これがないとbind:step={step}で親から渡された値を子から変更できない。
  let { step = $bindable(), canAdvance = true }:  {step: number, canAdvance?: boolean} = $props();

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
  {#if step != 3}
  <button onclick="{increseStep}" disabled={!canAdvance}>次へ</button>
  {/if}
</div>
