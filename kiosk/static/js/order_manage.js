"use strict";

function clickCallbtn(){
    const call_btn = document.querySelector(".call_btn");
    const order_container_special = document.querySelector(".order_container.special");
    call_btn.onclick = function(){
        order_container_special.innerHTML = `
            <div class="container_top"></div>
            <div class="container_mid">
                <div class="order_num"></div>
                <div class="order_time"></div>
                <div></div>
            </div>
            <div class="container_menu"></div>
            <div class="container_bottom"></div>
        `;
    }
}

clickCallbtn();