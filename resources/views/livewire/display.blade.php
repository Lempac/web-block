<div class="absolute inset-x-0 inset-y-0 mr-auto w-[100vw] h-[100vh] bg-amber-500" style="top: {{ $y }}px; left: {{ $x }}px; transform: scale({{ $scale }}, {{ $scale }});">
    @auth
        <livewire:dashboard-block>
    @endauth

    @guest
        <livewire:file-block id="1" x=500 y=300>
        <livewire:text-block id="2" x=500 y=700>

        <livewire:auth-block x=900 y=400>
    @endguest
</div>

@script
    <script>
        let main = $wire.el;
        function displayMove(event) {
            event.preventDefault();
            let y = parseInt(main.style.top === "" ? $wire.get('y') : main.style.top);
            let x = parseInt(main.style.left === "" ? $wire.get('x') : main.style.left);
            let deltaX = event.pageX - x;
            let deltaY = event.pageY - y;
            let scale = Livewire.all().find(event => event.name === "display")?.$wire.get('scale') ?? 1
            document.body.style.position = 'absolute';
            // document.body.transform = `translate(${deltaX / scale}px, ${deltaY / scale}px)`;
            // document.body.style.top = `${parseInt(parseInt(document.body.style.top) + event.movementY / scale)}px`;
            // document.body.style.left = `${parseInt(parseInt(document.body.style.left) + event.movementX / scale)}px`;
            document.body.style.backgroundPositionY = document.body.style.top;
            document.body.style.backgroundPositionX = document.body.style.left;
        }
        // document.addEventListener('mousedown', (event) => {
        //     if (event.button !== 1) return;
        //     event.preventDefault();
        //     document.addEventListener('mousemove', displayMove);
        // });
        // document.addEventListener('mouseup', () => {
        //     $wire.set('x', parseInt(main.style.left));
        //     $wire.set('y', parseInt(main.style.top));
        //     document.removeEventListener('mousemove', displayMove);
        // });
        document.addEventListener('wheel', (event) => {
            // if (event.altKey) {
            //     $wire.set('scale', $wire.get('scale') ?? 1 + Math.min(Math.max(event.deltaY, -0.5), 0.5))
            // } else {
            main.style.top = (parseInt(document.body.style.top) + event.wheelDeltaY) + "px";
            main.style.left = (parseInt(document.body.style.left) + event.wheelDeltaX) + "px";
            document.body.style.backgroundPositionY = main.style.top;
            document.body.style.backgroundPositionX = main.style.left;
            // }
        });
    </script>
@endscript
