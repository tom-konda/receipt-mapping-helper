<script lang="ts">
  // $bindable(): 親コンポーネント(Form.svelte)とstepを双方向バインドするために必要。
  // これがないとbind:step={step}で親から渡された値を子から変更できない。
  let { step = $bindable(), canAdvance = true }:  {step: number, canAdvance?: boolean} = $props();

  const increaseStep = () => {
    step += 1;
  }

  const decreaseStep = () => {
    step -= 1;
  }
</script>

<div class="step-button-list">
  {#if step != 1}
  <button type="button" onclick="{decreaseStep}" class="btn-secondary">前へ</button>
  {/if}
  {#if step != 3}
  <button type="button" onclick="{increaseStep}" disabled={!canAdvance} class="btn-secondary">次へ</button>
  {/if}
</div>

<style>
.step-button-list {
  margin-bottom: 1.5rem;
}
</style>
