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
        width: 100%;
        /*height: 50vh;*/
        justify-content: center;
        /*margin-right: 1.25rem; // TODO: Remove */
        padding: 1rem;
        position: relative;
        scroll-snap-align: start;
        transform: scale(1);
        transform-origin: center center;
        transition: transform 0.5s;
        /*width: 50vw;*/
    }
</style>
