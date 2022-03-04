/// <reference types="svelte" />
/// DndEvent: Hack for typescript untils this issue is fixed - https://github.com/sveltejs/language-tools/issues/431
declare type DndEvent = import("svelte-dnd-action").DndEvent;
declare namespace svelte.JSX {
    interface HTMLAttributes<T> {
        onconsider?: (event: CustomEvent<DndEvent> & {target: EventTarget & T}) => void;
        onfinalize?: (event: CustomEvent<DndEvent> & {target: EventTarget & T}) => void;
    }
}
