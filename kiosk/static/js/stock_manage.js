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
			const is_soldout = menu.classList.contains("need");
			container.innerHTML=`
            <div class="ingredients_menu_container">
                <div class="menu_name" id="menu_name_${menu_id}">${name}</div>
                <button class="soldout_btn" id="soldout_btn_${menu_id}" data-menu_id="${menu_id}">품절 상태로 변경</button>
            </div>
			<div class="ingredients_table_container">
				<table border="1" id="stock_table">
				</table>
			</div>
            <div class="ingredients_discribe"></div>
            `;
			let soldout_btn = document.getElementById(`soldout_btn_${menu_id}`);
			let menu_name = document.getElementById(`menu_name_${menu_id}`);
			
			if(is_soldout){
				menu_name.classList.add('need');
				soldout_btn.innerHTML=`판매 가능으로 변경`;
			}

			soldout_btn.addEventListener("click", ()=>{
						hasClicked(soldout_btn, menu_name);
				})
				
			$.ajax({
                type: 'POST',
                url: stock_path,
                data: JSON.stringify(menu_id),
                dataType : 'JSON',
                contentType: "application/json",
                success: function(data){
					if(!data.ingredients.length){
							alert('재료 사용 정보가 db에 없습니다.');
							return;
					}
					document.getElementById('stock_table').innerHTML = `
						<th>재고명</th>
						<th>수량</th>
						<th>단위</th>
						`;
					document.getElementsByClassName("ingredients_discribe")[0].innerHTML = `*수량이 5 이하인 경우 빨간색으로 표시됩니다.`;
                    $.each(data.ingredients, function(key,value){
						let table = document.getElementById('stock_table');
						let row = table.insertRow(-1);
						$.each(value, function(key,value){
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
        }) 
    })
}

//품절 상태 변경 btn 클릭시 메뉴명 빨간색으로
function turnMenuSoldout(soldout_btn, menu_name){
	const menu_id = soldout_btn.getAttribute("data-menu_id");
		let postdata = {'id': menu_id, 'is_soldout':1}
		$.ajax({
                type: 'POST',
                url: soldout_path,
                data: JSON.stringify(postdata),
                dataType : 'JSON',
                contentType: "application/json",
                success: function(data){
                    alert(data.result)
					soldout_btn.innerHTML = `판매 가능으로 변경`;
					menu_name.classList.add("need");
                },
                error: function(request, status, error){
                    alert('ajax 통신 실패')
                    alert(error);
                }
       })
}


//판매 가능 버튼이 클릭되었는지 확인 
function hasClicked(soldout_btn, menu_name){
	const is_soldout = menu_name.classList.contains("need");
    if(is_soldout){
		turnMenuCanorder(soldout_btn, menu_name)
    } else{
		turnMenuSoldout(soldout_btn, menu_name)
    }
    
}



//판매 가능으로 변경
function turnMenuCanorder(soldout_btn, menu_name){
	const menu_id = soldout_btn.getAttribute("data-menu_id");
	let postdata = {'id': menu_id, 'is_soldout':0};
	$.ajax({
                type: 'POST',
                url: soldout_path,
                data: JSON.stringify(postdata),
                dataType : 'JSON',
                contentType: "application/json",
                success: function(data){
                    alert(data.result)
					soldout_btn.innerHTML = `품절 상태로 변경`;
					menu_name.classList.remove("need");
                },
                error: function(request, status, error){
                    alert('ajax 통신 실패')
                    alert(error);
                }
    })
}

categorySelect();
selectMenu();


