<div class="absolute" style="top: {{$y}}px; left: {{$x}}px;">
    @auth
        <livewire:dashboard-block>

        <livewire:text-block>
    @endauth
    @guest
        <livewire:auth-block>
    @endguest
</div>

@script
    <script>
        let main = $wire.el

        function displayMove(event) {
            event.preventDefault();
            let x = isNaN(parseInt(main.style.left)) ? $wire.get('x') : parseInt(main.style.left);
            let y = isNaN(parseInt(main.style.top)) ? $wire.get('y') : parseInt(main.style.top);
            // let scale = Livewire.all().find(e => e.name === "display")?.$wire.get('scale') ?? 1;
            main.style.left = x + event.movementX + "px";
            main.style.top = y + event.movementY + "px";
            document.body.style.backgroundPositionX = main.style.left;
            document.body.style.backgroundPositionY = main.style.top;

        }
        document.addEventListener('mousedown', (event) => {
            if (event.button !== 1) return;
            event.preventDefault();
            document.addEventListener('mousemove', displayMove);
        });
        document.addEventListener('mouseup', () => {
            $wire.set('x', parseInt(main.style.left));
            $wire.set('y', parseInt(main.style.top));
            document.removeEventListener('mousemove', displayMove);
        });

        document.addEventListener('wheel', (event) => {
            if($wire.selected) return;
            let x = isNaN(parseInt(main.style.left)) ? $wire.get('x') : parseInt(main.style.left);
            let y = isNaN(parseInt(main.style.top)) ? $wire.get('y') : parseInt(main.style.top);
            // if (event.altKey) {
            //     $wire.set('scale', $wire.get('scale') ?? 1 + Math.min(Math.max(event.deltaY, -0.5), 0.5))
            // } else {
            main.style.top = y + event.wheelDeltaY + "px";
            main.style.left = x + event.wheelDeltaX + "px";
            document.body.style.backgroundPositionX = main.style.left;
            document.body.style.backgroundPositionY = main.style.top;

            // }
        });
    </script>
@endscript
