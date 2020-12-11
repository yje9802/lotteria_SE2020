"use strict";

// 카테고리 btn 클릭
const categories = document.querySelector(".categories_btn");
const category = document.querySelector(".category");
const menu_container = document.querySelector(".menu_container");
const menus = document.querySelectorAll(".menu");

const container = document.querySelector(".container");
const stock_path = container.getAttribute('data-stock-path');
const soldout_path = container.getAttribute('data-soldout-path');

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
    
    menus.forEach((menu)=>{
        menu.addEventListener("click", function(event){
            container.classList.add("ingredients");
            const menu_id = menu.dataset.id;
			const name = menu.innerHTML;
			container.innerHTML=`
            <div class="ingredients_menu_container">
                <div class="menu_name">${name}</div>
                <button class="menu_btn" data-menu_id="${menu_id}">품절 상태로 변경</button>
            </div>
			<div class="ingredients_table_container">
				<table border="1" id="stock_table">
							<th>재고명</th>
							<th>수량</th>
							<th>단위</th>
				</table>
			</div>
            <div class="ingredients_discribe">*수량이 5 이하인 경우 빨간색으로 표시됩니다.</div>
            `;
			$.ajax({
                type: 'POST',
                url: stock_path,
                data: JSON.stringify(menu_id),
                dataType : 'JSON',
                contentType: "application/json",
                success: function(data){
					// console.log(data.ingredients);
					if(!data.ingredients.length){
							alert('재료 사용 정보가 db에 없습니다.');
							//window.history.back();
							return;
					}
					// document.getElementsByClassName("ingredients_table_container").innerHTML = `
						// <table border="1" id="stock_table">
						// <th>재고명</th>
						// <th>수량</th>
						// <th>단위</th>
						// </table>`;
					// document.getElementsByClassName("ingredients_describe").innerHTML = `*수량이 5 이하인 경우 빨간색으로 표시됩니다.`;
                    $.each(data.ingredients, function(key,value){
                         // alert(key + " : " + value.NAME + " " +value.STOCK+ " " + value.UNIT)
                        // $('#div2').append('<div>'+ value.id + " " + value.password + " " + value.email  +'</div>')
						let table = document.getElementById('stock_table');
						let row = table.insertRow(-1);
						$.each(value, function(key,value){
							// alert(key + ":" + value);
							let cell = row.insertCell(-1);
							cell.innerHTML = value;
							if(value <= 5){
								cell.classList.add("need");
							}
						})
						
                    })
                },
                error: function(request, status, error){
                    alert('ajax 통신 실패')
                    alert(error);
                }
            })
            

            turnMenuSoldout(menu);
        })

        
    })
}

//품절 상태 변경 btn 클릭시 메뉴명 빨간색으로
function turnMenuSoldout(menu){
    const soldout_btn = document.querySelector(".menu_btn");
    const menu_name = document.querySelector(".menu_name");
	const menu_id = soldout_btn.getAttribute("data-menu_id");
    const soldout_class = "soldout";
    soldout_btn.addEventListener("click",()=>{
		let postdata = {'id': menu_id, 'is_soldout':1}
		$.ajax({
                type: 'POST',
                url: soldout_path,
                data: JSON.stringify(postdata),
                dataType : 'JSON',
                contentType: "application/json",
                success: function(data){
                    alert(data.result)
					// $('#div2').append('<div>'+ value.id + " " + value.password + " " + value.email  +'</div>')
					soldout_btn.classList.add(soldout_class);
					soldout_btn.innerHTML = `판매 가능으로 변경`;
					menu_name.classList.add("need");
					menu.classList.add("need");
					soldout_btn.addEventListener("click", ()=>{
						hasClicked(menu,soldout_btn, menu_name, soldout_class);

					})
                   
                    
                },
                error: function(request, status, error){
                    alert('ajax 통신 실패')
                    alert(error);
                }
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


