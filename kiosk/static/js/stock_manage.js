"use strict";

// 카테고리 btn 클릭
const categories = document.querySelector(".categories_btn");
const category = document.querySelector(".category");
const menu_container = document.querySelector(".menu_container");
const menus = document.querySelectorAll(".menu");

function categorySelect(){
    categories.addEventListener("click", (event)=>{
        const filter = event.target.dataset.filter;
        if (filter == null) {
            return;
        }

        if (document.querySelector(".category.selected") !==null){
            document.querySelector(".category.selected").classList.remove("selected");
        }
        event.target.classList.add("selected");
        
        menus.forEach((menu)=>{
            if (filter === menu.dataset.type ){
                menu.classList.add("visible");
            } else{
                menu.classList.remove("visible");
            }
        })
    })
}


categorySelect();

