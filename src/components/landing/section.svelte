<script lang="ts">

</script>
<div>
    <slot></slot>
</div>

<style>
    div {
        align-items: center;
        background-color: var(--color-bg);
        color: var(--color-on-bg);
        border-radius: 10px;
        display: flex;
        flex-shrink: 0;
        width: var(--item-size);
        height: var(--item-size);
        justify-content: center;
        position: relative;
        scroll-snap-align: start;
        transform: scale(1);
        transform-origin: center center;
        transition: transform 0.5s;
    }
</style>
