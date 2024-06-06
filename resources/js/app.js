import './bootstrap';
import '../css/app.css'

import.meta.glob([
    '../images/**',
    '../fonts/**',
]);
window.addEventListener("mousemove", (event) => {
    window.preX = event.screenX;
    window.preY = event.screenY;
})

document.addEventListener('mouseout', (event) =>{
    if (event.target === document.body && event.relatedTarget === null) document.body.style.cursor = "";
})
