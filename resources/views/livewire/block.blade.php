<div class="absolute p-2 max-w-max max-h-max min-w-max min-h-max bg-gray-600 rounded-lg -translate-x-1/2 -translate-y-1/2 origin-top-left has-[:hover]:p-2 {{ $selected || $resize ? 'z-10' : 'hover:p-3 z-auto' }} transition-[padding,_rotate]" style="top: {{$y}}px; left: {{$x}}px;" wire:mousedown.self.prevent="$set('resize', $event.buttons === 1)" wire:mouseup.window.prevent="$set('resize', false)">
    <div class="origin-top-left {{$selected ? 'cursor-grabbing' : 'cursor-grab' }}" wire:mousedown.self.prevent="$set('selected', $event.buttons === 1)" wire:mouseup.window.prevent="$set('selected', false)" style="{{$w != 0 ? "width: ".$w."px;" : "" }} {{$h != 0 ? "height: ".$h."px;" : "" }} {{$minW != 0 ? "min-width: ".$minW."px;" : "" }} {{$minH != 0 ? "min-height: ".$minH."px;" : "" }}">
        @yield('content')
    </div>
</div>

@script
    <script>
        let border = $wire.el;
        let main = border.firstElementChild;
        $wire.set('minW', main.offsetWidth);
        $wire.set('minH', main.offsetHeight);
        let rot_timeout, prex, prey;
        function blockMove(event) {
            event.preventDefault();
            prex ??= event.pageX;
            prey ??= event.pageY;
            let x = isNaN(parseInt(border.style.left)) ? $wire.get('x') : parseInt(border.style.left);
            let y = isNaN(parseInt(border.style.top)) ? $wire.get('y') : parseInt(border.style.top);
            // let scale = Livewire.all().find(e => e.name === "display")?.$wire.get('scale') ?? 1;
            border.style.left = x + event.movementX + "px";
            border.style.top = y + event.movementY + "px";
            border.style.rotate = Math.min(Math.max(event.movementX * 1.8, -20), 20) + 'deg';
            if (rot_timeout) clearTimeout(rot_timeout);
            rot_timeout = setTimeout(() => {
                border.style.rotate = "";
            }, 200)
        }
        function blockResize(event){
            event.preventDefault();

            let center = {
                'width' : parseInt(border.style.left),
                'height' : parseInt(border.style.top)
            }

            let left = event.pageX < center.width - main.offsetWidth / 2,
                right = event.pageX > center.width + main.offsetWidth / 2,
                top = event.pageY < center.height - main.offsetHeight / 2,
                bottom = event.pageY > center.height + main.offsetHeight / 2;

            let x = isNaN(parseInt(border.style.left)) ? $wire.get('x') : parseInt(border.style.left);
            let y = isNaN(parseInt(border.style.top)) ? $wire.get('y') : parseInt(border.style.top);

            main.style.width = Math.max(main.offsetWidth + event.movementX, parseInt(main.style.minWidth)) + "px";
            main.style.height = Math.max(main.offsetHeight + event.movementY, parseInt(main.style.minHeight)) + "px";
            if(main.style.width !== main.style.minWidth && left){
                border.style.left = x + Math.min(0, event.movementX) + "px";
            }
            if(main.style.height !== main.style.minHeight && top){
                border.style.top = y + Math.min(0, event.movementY) + "px";
            }
        }

        function resizeBorderCursor(event) {
            let center = {
                'width' : parseInt(border.style.left),
                'height' : parseInt(border.style.top)
            }

            let left = event.pageX < center.width - main.offsetWidth / 2,
                right = event.pageX > center.width + main.offsetWidth / 2,
                top = event.pageY < center.height - main.offsetHeight / 2,
                bottom = event.pageY > center.height + main.offsetHeight / 2;

            if(left || right){
                document.body.style.cursor = "w-resize";
            }
            if(top || bottom){
                document.body.style.cursor = "ns-resize";
            }
            if(left && top || right && bottom){
                document.body.style.cursor = "nwse-resize";
            }
            if(left && bottom || right && top){
                document.body.style.cursor = "nesw-resize";
            }
        }

        border.addEventListener('mouseover', () => {
            document.body.addEventListener('mousemove', resizeBorderCursor);
        })

        border.addEventListener('mouseout', () => {
            document.body.removeEventListener('mousemove', resizeBorderCursor);
            document.body.style.cursor = "";
        })

        $wire.watch('selected', selected => {
            if (selected) document.addEventListener('mousemove', blockMove);
            else {
                $wire.set('x', parseInt(border.style.left));
                $wire.set('y', parseInt(border.style.top));
                document.removeEventListener('mousemove', blockMove);
            }
        })

        $wire.watch('resize', resize => {
            console.log($wire.selected)
            if(resize) document.addEventListener('mousemove', blockResize)
            else {
                $wire.set('w', parseInt(main.offsetWidth));
                $wire.set('h', parseInt(main.offsetHeight));
                $wire.set('x', parseInt(border.style.left));
                $wire.set('y', parseInt(border.style.top));
                document.removeEventListener('mousemove', blockResize);
            }
        })
    </script>
@endscript
