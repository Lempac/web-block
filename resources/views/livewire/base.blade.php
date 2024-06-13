<div
    x-data="{
        rot_timeout: null,
        blockMove(event) {
            event.preventDefault();
            let deltaX = event.screenX - window.preX;
            let deltaY = event.screenY - window.preY;
            $wire.x += deltaX;
            $wire.y += deltaY;
            $el.style.rotate = Math.min(Math.max(deltaX * 1.2, -10), 10) + 'deg';
            if (this.rot_timeout) clearTimeout(this.rot_timeout);
            this.rot_timeout = setTimeout(() => {
                $el.style.rotate = '';
            }, 200)
        }
    }"
    x-init="$watch('$wire.pin', pin => {
        if (pin){
            let rect = $el.getBoundingClientRect();
            console.log([rect.left, rect.top, $el.style.left, $el.style.top])
        }
        else{
            let rect = $el.getBoundingClientRect();
            let rectParent = $wire.$parent.el.getBoundingClientRect();
            console.log([rect.left, rect.top, $el.style.left, $el.style.top])
            console.log([parseInt($el.style.left) + rect.left - rectParent.left, parseInt($el.style.top) + rect.top - rectParent.top])
        }
    })"
    :style="{ top:$wire.y+'px', left:$wire.x+'px' }" :class="$wire.pin ? 'fixed' : 'absolute'" class="active:z-10 hover:p-3 z-auto p-2 max-w-max max-h-max min-w-max min-h-max bg-gray-600 rounded-lg -translate-x-1/2 -translate-y-1/2 origin-top-left has-[:hover]:p-2 transition-[padding,_rotate] active:cursor-grabbing cursor-grab" @mousedown.self="$event.button === 0 ? document.addEventListener('mousemove', blockMove):''" @mouseup.window="document.removeEventListener('mousemove', blockMove)">
    <template x-if="$wire.hasPin">
        <div class="absolute -top-3.5 -right-3.5 rotate-45 rounded-t-lg bg-gray-600" >
            <input :class="$wire.pin ? '-rotate-45' : '-rotate-90'" class=" transition-transform delay-200" type="image" width="24" height="24" src="{{ Vite::asset('resources/images/pin.svg') }}" x-on:click="$wire.$toggle('pin')" alt="Pin">
        </div>
    </template>
    <livewire:is :component="$blockType" />
</div>
