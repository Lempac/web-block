<div class="absolute max-w-fit max-h-fit rounded-lg border-[6px] bg-blue-200 {{ $selected ? 'z-10' : '-translate-x-1/2 -translate-y-1/2 z-auto' }} has-[:hover]:!border-[6px] hover:has-[:not(:hover)]:border-[12px] transition-[border]" style="top: {{$y}}px; left: {{$x}}px;">
    <div class="rounded-lg bg-blue-500 {{$selected ? 'cursor-grabbing' : 'cursor-grab' }}" wire:mousedown.self.prevent="$set('selected', true)" wire:mouseup.window.prevent="$set('selected', false)">
        @yield('content')
    </div>
</div>

@script
    <script>
        let main = $wire.el;
        function blockMove(event) {
            event.preventDefault();
            let y = parseInt(main.style.top === "" ? $wire.get('y') : main.style.top);
            let x = parseInt(main.style.left === "" ? $wire.get('x') : main.style.left);
            let deltaX = event.pageX - x;
            let deltaY = event.pageY - y;
            // let scale = Livewire.all().find(e => e.name === "display")?.$wire.get('scale') ?? 1;
            main.style.rotate = `${Math.min(Math.max(deltaX, -15), 15)}deg`;
            main.style.top = y + deltaY + "px";
            main.style.left = x + deltaX + "px";
        }

        $wire.watch('selected', selected => {
            if (selected) document.addEventListener('mousemove', blockMove);
            else {
                $wire.set('x', parseInt(main.style.left));
                $wire.set('y', parseInt(main.style.top));
                document.removeEventListener('mousemove', blockMove);
            }
        })
    </script>
@endscript
