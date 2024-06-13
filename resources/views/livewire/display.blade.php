<div x-data="{
        displayMove(event) {
            event.preventDefault();
            $wire.x += event.movementX;
            $wire.y += event.movementY;
            document.body.style.backgroundPositionX = $el.style.left;
            document.body.style.backgroundPositionY = $el.style.top;
        }
    }"
    class="absolute" :style="{ top:$wire.y+'px', left:$wire.x+'px' }" @mousedown.window="$event.button === 1 ? document.addEventListener('mousemove', displayMove) :''" @mouseup.window="document.removeEventListener('mousemove', displayMove)">
    @auth
        @if(Auth::user()->is_admin)
            <livewire:base block-type="blocks.webinfo-block" has-pin/>
        @endif
        <livewire:base block-type="blocks.dashboard-block" has-pin/>
    @endauth
    @guest
        <livewire:base block-type="blocks.auth-block" />
    @endguest
</div>
