"use strict";

const categories = document.querySelector(".container_left");

//카테고리 버튼 클릭
function categorySelect(){
    categories.addEventListener("click",(event)=>{
        const filter = event.target.dataset.filter;
        if(filter==null){
            return;
        }

        if (document.querySelector(".category_btn.selected") !==null){
            document.querySelector(".category_btn.selected").classList.remove("selected");
        }

        event.target.classList.add("selected");
    })
}

categorySelect();