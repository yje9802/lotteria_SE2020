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

//메뉴 클릭시 재고상태 확인 
function selectMenu(){
    const container = document.querySelector(".container");
    menus.forEach((menu)=>{
        menu.addEventListener("click", function(event){
            container.classList.add("ingredients");
            const name = menu.innerHTML;
            container.innerHTML=`
            <div class="ingredients_menu_container">
                <div class="menu_name">${name}</div>
                <button class="menu_btn">품절 상태로 변경</button>
            </div>
            <div class="ingredients_table_container">
                <table border="1">
                <th>재고명</th>
                <th>수량</th>
                <tr>
                    <td>빵</td>
                    <td>100</td>
                </tr>
                <tr>
                    <td>크리스피 치킨 패티</td>
                    <td>100</td>
                </tr>
                <tr>
                    <td>양상추 슬라이스</td>
                    <td>67</td>
                </tr>
                <tr>
                    <td class="need">토마토 슬라이스</td>
                    <td class="need">3</td>
                </tr>
                <tr>
                    <td>머스타드 크림소스</td>
                    <td>50</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                </tr>
                </table>
            </div>
            <div class="ingredients_discribe">*수량이 5 이하인 경우 빨간색으로 표시됩니다.</div>
            `;

            turnMenuSoldout(menu);
        })

        
    })
}

//품절 상태 변경 btn 클릭시 메뉴명 빨간색으로
function turnMenuSoldout(menu){
    const soldout_btn = document.querySelector(".menu_btn");
    const menu_name = document.querySelector(".menu_name");
    const soldout_class = "soldout";
    soldout_btn.addEventListener("click",()=>{
        soldout_btn.classList.add(soldout_class);
        soldout_btn.innerHTML = `판매 가능으로 변경`;
        menu_name.classList.add("need");
        menu.classList.add("need");
        soldout_btn.addEventListener("click", ()=>{
            hasClicked(menu,soldout_btn, menu_name, soldout_class);

        })
    })
}


//판매 가능 버튼이 클릭되었는지 확인 
function hasClicked(menu,soldout_btn, menu_name, soldout_class){
    const hasClass = soldout_btn.classList.contains(soldout_class);
    if(hasClass){
        soldout_btn.classList.remove(soldout_class);
        soldout_btn.innerHTML = `품절 상태로 변경`;
        menu_name.classList.remove("need");
        menu.classList.remove("need");
    } else{
        soldout_btn.classList.add(soldout_class);
        soldout_btn.innerHTML = `판매 가능으로 변경`;
        menu_name.classList.add("need");
        menu.classList.add("need");
    }
    
}



//판매 가능으로 변경
function turnMenuCanorder(){
    soldout_btn.onclick = function(){
        menu_name.classList.remove("need");
        soldout_btn.innerHTML = `품절 상태로 변경`;
        menu.classList.remove("need");
    }
}

categorySelect();
selectMenu();


