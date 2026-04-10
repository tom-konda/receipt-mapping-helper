<script lang="ts">
  import ArrowIcon from './icons/ArrowIcon.svelte'
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
  <button type="button" onclick="{decreaseStep}"><ArrowIcon direction="left" /> 前へ</button>
  {/if}
  {#if step != 3}
  <button type="button" onclick="{increaseStep}" disabled={!canAdvance} class="btn-secondary">次へ <ArrowIcon direction="right" /></button>
  {/if}
</div>

<style>
.step-button-list {
  margin-bottom: 1.5rem;

  .btn-secondary {
    color: inherit;

    &:disabled {
      color: rgba(255, 255, 255, 0.15);

      @media (prefers-color-scheme: light) {
        color: rgba(0, 0, 0, 0.15);
      }
    }
  }
}
</style>
