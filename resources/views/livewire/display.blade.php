<div x-data="{
        displayMove(event) {
            event.preventDefault();
            let x = isNaN(parseInt($el.style.left)) ? $wire.x : parseInt($el.style.left);
            let y = isNaN(parseInt($el.style.top)) ? $wire.y : parseInt($el.style.top);
            $el.style.left = x + event.movementX + 'px';
            $el.style.top = y + event.movementY + 'px';
            document.body.style.backgroundPositionX = $el.style.left;
            document.body.style.backgroundPositionY = $el.style.top;
        }
    }"
    class="absolute" :style="{ top:$wire.y+'px', left:$wire.x+'px' }" @mousedown.window="$event.button === 1 ? document.addEventListener('mousemove', displayMove) :''" @mouseup.window="document.removeEventListener('mousemove', displayMove)">
    @auth
        <livewire:base block-type="blocks.dashboard-block" has-pin/>
    @endauth
    @guest
        <livewire:base block-type="blocks.auth-block" />
    @endguest
</div>
