"use strict";

// Handle when category btn clicked
const category = document.querySelector(".category");
const menu_container = document.querySelector(".menu_container");
const menus = document.querySelectorAll(".menu");

// 선택한 메뉴 정보를 담아 놓는 리스트
let itemsSelected = [];

// Select the category and the default value
function categorySelect() {
	//카테고리 선택 안했을때 -> hamburger
	menus.forEach((menu) => {
		if (menu.dataset.type !== "hamburger") {
			menu.classList.add("invisible");
		}
	});

	//카테고리 선택시
	category.addEventListener("click", (event) => {
		const filter = event.target.dataset.filter;
		if (filter == null) {
			return;
		}

		//선택 카테고리 색상 변경
		const active = document.querySelector(".category_btn.selected");
		active.classList.remove("selected");
		event.target.classList.add("selected");

		//메뉴 선별
		menus.forEach((menu) => {
			if (filter === menu.dataset.type) {
				menu.classList.remove("invisible");
			} else {
				menu.classList.add("invisible");
			}
		});
	});
}

// 로컬 스토리지에 선택한 메뉴 정보 업로드
function saveItems(name) {
	// key값은 메뉴 이름
	localStorage.setItem(name, JSON.stringify(itemsSelected));
	itemsSelected = [];
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 메뉴가 선택됨에 따른 장바구니에 담긴 총 수량과 총 주문금액의 업데이트
function updateCheck(price) {
	const footer = document.querySelector(".list");
	const check_div = footer.querySelector(".check");
	const total_amount_h1 = check_div.querySelector(".check_num"),
		total_amount_text = total_amount_h1.innerHTML;
	let total_amount = parseInt(total_amount_text[0]);
	total_amount = total_amount + 1;
	total_amount_h1.innerHTML = `${total_amount}개`;
	const total_price_h1 = check_div.querySelector(".check_price"),
		total_price_text = total_price_h1.innerHTML;
	let total_price = parseInt(total_price_text);
	total_price = total_price + parseInt(price);
	total_price = numberWithCommas(total_price);
	total_price_h1.innerHTML = `${total_price} 원`;
}

//똑같은 메뉴를 이미 선택한 적 있는지 체크
function findSameItem(name) {
	const lsItems = localStorage.getItem(name);
	let curr_amount = 1;
	// 로컬 스토리지에 이미 이 메뉴가 있다면 (=고른 메뉴 또 고름)
	if (lsItems !== null) {
		const parsedLS = JSON.parse(lsItems);
		// 원래 amount + 1
		curr_amount = parsedLS[0].amount + 1;
		// 로컬 스토리지의 amount값 업데이트
		parsedLS[0].amount = curr_amount;
	}
	return curr_amount;
}

function addToCart(name, price) {
	const footer = document.querySelector(".list");
	const div = footer.querySelector(".basket");
	const ul = div.querySelector(".basket_items");
	// 버튼 클릭하면(메뉴 선택하면) li 태그 및 하위 여러 요소들 생성
	const li = document.createElement("li"),
		li_wrapper = document.createElement("div"),
		item_name = document.createElement("h3"),
		item_amount = document.createElement("div"),
		amount_h3 = document.createElement("h3"),
		amount_div = document.createElement("div"),
		amount_up = document.createElement("button"),
		amount_down = document.createElement("button"),
		item_price = document.createElement("div"),
		price_h3 = document.createElement("h3"),
		del_btn = document.createElement("button");
	//선택한 메뉴 삭제시 필요
	const newId = itemsSelected.length + 1;

	// 중복검사 -> 똑같은거 또 고르면 수량 +1
	const curr_amount = findSameItem(name);
	// 이번이 처음 선택하는 메뉴
	if (curr_amount === 1) {
		li_wrapper.classList.add("li_wrapper");
		item_name.classList.add("item_name");
		item_amount.classList.add("item_amount");
		item_price.classList.add("item_price");
		amount_up.classList.add("item_numup");
		amount_down.classList.add("item_numdown");

		item_name.innerHTML = `${name}`;
		amount_h3.innerText = `${curr_amount}`;
		price_h3.innerHTML = `${price}`;
		del_btn.innerHTML = "삭제";
		// 삭제 버튼 누르면 아이템 삭제
		// del_btn.addEventListener("click", deleteItem);

		amount_div.appendChild(amount_up);
		amount_div.appendChild(amount_down);
		item_amount.appendChild(amount_h3);
		item_amount.appendChild(amount_div);
		item_price.appendChild(price_h3);
		item_price.appendChild(del_btn);
		li_wrapper.appendChild(item_name);
		li_wrapper.appendChild(item_amount);
		li_wrapper.appendChild(item_price);
		li.appendChild(li_wrapper);

		li.id = newId;
		ul.appendChild(li);
	}
	// 이미 한 번 이상 선택한 적이 있는 메뉴
	else {
		const lists = ul.querySelectorAll("li");
		for (const list of lists) {
			const amount_container = list.querySelector(".item_amount");
			const its_name = list.querySelector(".item_name").innerHTML;
			const old_amount = amount_container.querySelector("h3");
			// 내가 수량을 바꿔야 할 li 태그가 맞는지 이름을 비교해서 확인
			if (its_name === name) {
				old_amount.innerHTML = `${curr_amount}`;
			}
		}
	}
	//메뉴를 선택하면 총 주문 내역 - 수량&결제예상금액 변경됨
	updateCheck(price);

	const itemObj = {
		amount: curr_amount,
		price: price,
		id: newId,
	};
	itemsSelected.push(itemObj);
	saveItems(name);
}

// 디저트/음료 선택 모달 디테일
function chooseModalCategory(name, price) {
	const modal_category = document.querySelector(".modal_category");
	const modal_menus = document.querySelectorAll(".menu_set");
	const modal_set_btn_no = document.querySelector(".modal_set_btn.no");
	const modal_question_set = document.querySelector(".modal_question.set");

	modal_set_btn_no.onclick = function () {
		modal_set.style.display = "none";
	};
	modal_menus.forEach((menu) => {
		if (menu.dataset.type !== "set_dessert") {
			menu.classList.add("invisible");
		}
	});
	modal_category.addEventListener("click", (event) => {
		const filter = event.target.dataset.filter;
		if (filter == null) {
			return;
		}
		const active = document.querySelector(".modal_category_btn.selected");
		active.classList.remove("selected");
		event.target.classList.add("selected");

		if (event.target.dataset.filter === "set_drink") {
			modal_question_set.innerHTML = `
				세트드링크 1개를 선택해 주세요
			`;
		} else {
			modal_question_set.innerHTML = `
			세트디저트 1개를 선택해 주세요
		`;
		}

		modal_menus.forEach((menu) => {
			if (filter === menu.dataset.type) {
				menu.classList.remove("invisible");
			} else {
				menu.classList.add("invisible");
			}
		});
	});
}

// 세트 메뉴 선택시, 디저트/음료 선택 모달
function getSetModal(name, price) {
	var modal_set = document.getElementById("modal_set");
	var close_set_btn = document.getElementsByClassName("modal_close_set")[0];

	modal_set.style.display = "block";
	chooseModalCategory(name, price);

	close_set_btn.onclick = function () {
		modal_set.style.display = "none";
	};

	window.onclick = function (event) {
		if (event.target == modal_set) {
			modal_set.style.display = "none";
		}
	};
}

// 모달
function getModal(name, price) {
	// Get the modal
	var modal = document.getElementById("myModal");
	// Get the <span> element that closes the modal
	var close_btn = document.getElementsByClassName("modal_close")[0];

	var modal_bottom = modal.querySelector(".modal_bottom");
	// 단품버튼, 세트버튼
	const only_btn = modal_bottom.querySelector(".burger_btn.only");
	const set_btn = modal_bottom.querySelector(".burger_btn.set");

	//this is the 'burger-price only' & 'burger-price set' div in the modal
	const modal_price_only = modal.querySelector(".burger_price.only");
	const modal_price_set = modal.querySelector(".burger_price.set");
	//세트 가격은 임의로 단품 가격 + 2000으로 했습니다...
	const set_price = parseInt(price) + 2000;

	// When the user clicks on the button, open the modal
	modal.style.display = "block";
	// the value of 'burger-price only' and 'burger-price set' will be changed upon clicked-button's price value
	modal_price_only.innerHTML = `${price}`;
	modal_price_set.innerHTML = `${set_price}`;

	// 단품/세트 버튼 클릭 시
	only_btn.onclick = function () {
		modal.style.display = "none";
		addToCart(name, price);
	};
	set_btn.onclick = function () {
		name = name + "(세트)";
		modal.style.display = "none";
		getSetModal(name, set_price);
	};

	// When the user clicks on <span> (x), close the modal
	close_btn.onclick = function () {
		modal.style.display = "none";
		// 닫음 버튼을 누르면 아무 것도 선택하지 않고 메뉴만 보여줌.
		// 함수명 예시
		// showDetails()
	};

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
			// 모달을 닫으면 아무 것도 선택하지 않고 메뉴만 보여줌.
			// 함수명 예시
			// showDetails()
		}
	};
}

function getValueFromBtn(menu) {
	menu.addEventListener("click", function (event) {
		// get the price value from menu button
		const div_inside_menu = menu.querySelector("div");
		const price = div_inside_menu.querySelector(".menu_price").innerHTML;
		// get the name value from menu button
		const name = div_inside_menu.querySelector(".menu_name").innerHTML;
        // 추가. 버튼을 누르면 해당 사진 가져옴. 
        const img = menu.querySelector("img");

		// 햄버거 메뉴만 선택 시 모달 창이 뜨도록
		if (menu.dataset.type === "hamburger") {
			getModal(name, price);
            //추가. 모달이 뜨면서 메뉴 정보도 같이 뜸. 
            menuShowdata(name,img);
		} else {
			addToCart(name, price);
            menuShowdata(name,img);
		}
	});
}

// **추가. 햄버거 선택시 관련 정보 보여줌
function menuShowdata(name,img){
    const ad_container = document.querySelector('.ad');
    ad_container.innerHTML = `
	<div class="menu_data_container">
		<div class="menu_data_nav">
			<div class="select_lan">
				<span>한국어</span>
				<span>English</span>
				<span>中國語</span>
				<span>日本語</span>
			</div>
		</div>
        <div class="menu_data">
            <div class="menu_data_left">
                <img src="${img.src}" class="menu_data_img">
            </div>
            <div class="menu_data_right">
                <div class="menu_data_top">
                    <div class="menu_data_name">${name}</div>
                    <button class="menu_data_btn">영양성분</button>
                </div>
                <div class="menu_data_bottom">
                    <div class="menu_data_specific">메뉴 정보 추가할 곳</div>
                    <div class="menu_data_ingredient">재료 이미지 추가할 곳</div>
                </div>
            </div>
        </div>
    </div>
	`
	const menu_data_bottom = document.querySelector('.menu_data_bottom');
	const menu_data_btn = document.querySelector('.menu_data_btn');
	console.log(menu_data_btn);
	menu_data_btn.onclick = function () {
		menu_data_bottom.innerHTML = `
		<STYLE TYPE="text/css">table {font-size: 10pt;}</STYLE>
		<table border="1" bordercolor="black" width ="410" height="75" align = "center" >
    <tr align = "center">
		<td>원산지</td>
		<td colspan="5">명태연육-미국산, 새우-베트남산</td>
    </tr>
    <tr>
		<td  align = "center">알러지</td>
		<td colspan="5" align = "center">밀,대두,난류,우유,토마토,새우</td>

    </tr>
    <tr align = "center">
		<td>총중량g</td>
		<td>열량Kcal</td>
		<td>단백질g(%)</td>
		<td>나트륨mg(%)</td>
		<td>당류g</td>
		<td>포화지방g(%)</td>
    </tr>
    <tr align = "center">
		<td>179</td>
		<td>492</td>
		<td>15 (27)</td>
		<td>810 (40)</td>
		<td>7</td>
		<td>4.7 (31)</td>
	</tr>
</table>
		`;
	};
}




function init() {
	categorySelect();
	for (const menu of menus) {
		menu.addEventListener("click", getValueFromBtn(menu));
	}
}
init();
