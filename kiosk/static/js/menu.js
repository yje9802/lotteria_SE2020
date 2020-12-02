"use strict";

// Handle when category btn clicked
const category = document.querySelector(".category");
const menu_container = document.querySelector(".menu_container");
const menus = document.querySelectorAll(".menu");

const footer = document.querySelector(".list");
const basket = footer.querySelector(".basket");
const ul = basket.querySelector(".basket_items");

// 선택한 메뉴 정보를 담아 놓는 리스트
let itemsSelected = [];
// 세트 메뉴를 고를 경우, 옵션으로 선택한 디저트와 드링크 정보
let dessert_info = [];
let drink_info = [];
// 로컬스토리지에 저장할 때 사용하는 key값
const ITEM = "item";
const TOTAL = "total";

// Select the category and the default value
function categorySelect() {
	//카테고리 선택 안했을때 -> hamburger
	menus.forEach((menu) => {
		if (menu.dataset.type !== "hamburger") {
			console.log(menu.dataset.type);
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
function saveItems() {
	localStorage.setItem(ITEM, JSON.stringify(itemsSelected));
}

function saveTotal() {
	let total_amount = 0;
	itemsSelected.forEach(function (item) {
		total_amount = total_amount + item.amount;
	});
	// 결제예상금액 정보
	let total_price = 0;
	if (itemsSelected.length !== 0) {
		itemsSelected.forEach(function (each) {
			total_price = total_price + parseInt(each.price);
		});
	}

	// 총 수량 및 금액 정보 로컬스토리지에 저장
	const totalObj = {
		amount: total_amount,
		price: total_price,
	};
	localStorage.setItem(TOTAL, JSON.stringify(totalObj));
}

// 세자리 마다 , 추가
function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 메뉴가 선택됨에 따른 장바구니에 담긴 총 수량과 총 주문금액의 업데이트
function updateCheck() {
	const check_div = footer.querySelector(".check");

	const total_amount_h1 = check_div.querySelector(".check_num");
	const total_price_h1 = check_div.querySelector(".check_price");
	const totals = localStorage.getItem(TOTAL);
	if (totals !== null) {
		const parsedTotals = JSON.parse(totals);
		const amount_total = parsedTotals.amount;
		const price_total = numberWithCommas(parsedTotals.price);

		total_amount_h1.innerHTML = `${amount_total}`;
		total_price_h1.innerHTML = `${price_total} 원`;
	} else {
		total_amount_h1.innerHTML = "0";
		total_price_h1.innerHTML = "0";
	}
}

function deleteItem(event) {
	const btn = event.target;
	const btn_div = btn.parentNode;
	const wrapper = btn_div.parentNode;
	const li = wrapper.parentNode;
	// 화면에서 보여지는 삭제
	ul.removeChild(li);
	// 로컬스토리지에 저장된 정보 수정
	const delete_name = wrapper.querySelector(".item_name").innerHTML;
	if (itemsSelected.length > 1) {
		const cleanItems = itemsSelected.filter(function (item) {
			return item.name !== delete_name;
		});
		// itemsSelected 배열에서도 삭제한 메뉴 지워줌 -> 로컬스토리지에 저장
		itemsSelected = cleanItems;
		saveItems();
		// 로컬스토리지에 총수량/금액 정보 수정 -> html 상에서도 반영
		saveTotal();
		updateCheck();
	} else {
		itemsSelected = [];
		localStorage.clear();
		updateCheck();
	}
}

// 수량 옆에 삼각형 버튼 컨트롤
function changeAmount(event) {
	const btn = event.target;
	const btn_div = btn.parentNode;
	const amount_div = btn_div.parentNode;
	const amount_text = amount_div.querySelector("h3");
	const wrapper = amount_div.parentNode;
	const menu_name = wrapper.querySelector(".item_name").innerHTML;
	const price_div = wrapper.querySelector(".item_price");
	const price_text = price_div.querySelector("h3");

	const btn_type = btn.getAttribute("class");
	if (btn_type === "item_numup") {
		itemsSelected.forEach(function (each) {
			if (each.name === menu_name) {
				each.price = each.price / each.amount + each.price;
				each.amount = each.amount + 1;
				amount_text.innerHTML = `${each.amount}`;
				price_text.innerHTML = `${numberWithCommas(each.price)}`;
				saveItems();
				saveTotal();
				updateCheck();
			}
		});
	} else {
		itemsSelected.forEach(function (each) {
			// 담긴 수량이 하나라면 더이상 수량을 줄일 수 없음.
			if (each.amount > 1) {
				if (each.name === menu_name) {
					each.price = each.price - each.price / each.amount;
					each.amount = each.amount - 1;
					amount_text.innerHTML = `${each.amount}`;
					price_text.innerHTML = `${numberWithCommas(each.price)}`;
					saveItems();
					saveTotal();
					updateCheck();
				}
			}
		});
	}
}
// (세트 메뉴) 디저트 옵션 
function dessertOption(event) {
	const btn = event.target;

	if (btn.dataset === "set_dessert") {
		const dessert_name = btn.querySelector(".menu_dessert_name").innerText;
		dessert_info.push(dessert_name);
		const dessert_price = parseInt(
			btn.querySelector(".menu_dessert_price").innerHTML
		);
		dessert_info.push(dessert_price);
		addToCartSet();
	}
	console.log(btn);
}

//똑같은 메뉴를 이미 선택한 적 있는지 체크
function findSameItem(name, price) {
	let curr_amount = 1;
	let curr_price = parseInt(price);
	if (itemsSelected.length !== 0) {
		itemsSelected.forEach(function (each) {
			if (each.name === name) {
				curr_amount = curr_amount + each.amount;
				curr_price = curr_price + each.price;
				// itemsSelected 배열 정보 업데이트
				each.amount = curr_amount;
				each.price = curr_price;
			}
		});
	}
	return [curr_amount, curr_price];
}
// 메뉴 선택하면 -> html파일에 li태그 생성 
function addToHtml(name, curr_amount, curr_price) {
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

	li_wrapper.classList.add("li_wrapper");
	item_name.classList.add("item_name");
	item_amount.classList.add("item_amount");
	item_price.classList.add("item_price");
	amount_up.classList.add("item_numup");
	amount_down.classList.add("item_numdown");

	item_name.innerHTML = `${name}`;
	amount_h3.innerText = `${curr_amount}`;
	price_h3.innerHTML = `${numberWithCommas(curr_price)}`;
	amount_up.innerHTML = "&xutri;";
	amount_up.setAttribute("onclick", "changeAmount(event)");
	amount_down.innerHTML = "&xdtri;";
	amount_down.setAttribute("onclick", "changeAmount(event)");
	del_btn.innerHTML = "삭제";
	// 삭제 버튼 누르면 아이템 삭제
	del_btn.setAttribute("onclick", "deleteItem(event)");

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
	ul.appendChild(li);
}
// 세트 메뉴
function addToCartSet() {
	const name = "hh";
	let curr_price = dessert_info.pop(0);
	const id = "set";
	// 중복검사 -> 똑같은거 또 고르면 수량 +1, +가격 됨
	const result = findSameItem(name, curr_price);
	const curr_amount = result[0];
	curr_price = curr_price + result[1];
	console.log(dessert_info);
	addToHtml(name, curr_amount, curr_price);
}
// 버거 단품, 음료, 
function addToCart(name, price) {
	const id = "only";
	// 중복검사 -> 똑같은거 또 고르면 수량 +1, +가격 됨
	const result = findSameItem(name, price);
	const curr_amount = result[0];
	let curr_price = result[1];

	// 이번이 처음 선택하는 메뉴라면
	if (curr_amount === 1) {
		addToHtml(name, curr_amount, curr_price);
		const itemObj = {
			name: name,
			amount: curr_amount,
			price: curr_price,
			id: id,
		};
		itemsSelected.push(itemObj);
	}
	// 이미 한 번 이상 선택한 적이 있는 메뉴라면
	else {
		const lists = ul.querySelectorAll("li");
		for (const list of lists) {
			const amount_container = list.querySelector(".item_amount");
			const its_name = list.querySelector(".item_name").innerHTML;
			const old_amount = amount_container.querySelector("h3");
			const price_container = list.querySelector(".item_price");
			const old_price = price_container.querySelector("h3");
			// 내가 수량을 바꿔야 할 li 태그가 맞는지 이름을 비교해서 확인
			if (its_name === name) {
				old_amount.innerHTML = `${curr_amount}`;
				old_price.innerHTML = `${numberWithCommas(curr_price)}`;
			}
		}
	}
	//메뉴를 선택하면 총 주문 내역 - 수량&결제예상금액 변경됨
	saveTotal();
	updateCheck();
	saveItems();
}

// 디저트/음료 선택 모달 디테일
function chooseModalCategory(name, price) {
	const modal_category = document.querySelector(".modal_category");
	const modal_menus = document.querySelectorAll(".menu_set");
	const modal_question_set = document.querySelector(".modal_question.set");
	const modal_set_btn_no = document.querySelector(".modal_set_btn.no");

	modal_set_btn_no.onclick = function () {
		modal_set.style.display = "none";
	};
	modal_menus.forEach((menu) => {
		if (menu.dataset.type !== "set_dessert") {
			menu.classList.add("invisible");
			menu.setAttribute("onclick", "drinkOption(event)");
			dessert_info.push([name, price]);
		} else {
			menu.setAttribute("onclick", "dessertOption(event)");
		}
	});
	modal_category.addEventListener("click", (event) => {
		const filter = event.target.dataset.filter;
		if (filter == null) {
			return;
		}

		if (event.target.dataset.filter === "set_drink") {
			modal_question_set.innerHTML = `
				세트드링크 1개를 선택해 주세요
			`;
		} else {
			modal_question_set.innerHTML = `
			세트디저트 1개를 선택해 주세요
		`;
		}
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

// **추가. 햄버거 선택시 관련 정보 보여줌
function menuShowdata(name, img) {
	const ad_container = document.querySelector(".ad");
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
	`;
	const menu_data_bottom = document.querySelector(".menu_data_bottom");
	const menu_data_btn = document.querySelector(".menu_data_btn");
	// console.log(menu_data_btn);
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
		addToCart(name, price, id);
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
		const img = menu.querySelector("img");
		let id = "only";

		// 햄버거 메뉴만 선택 시 모달 창이 뜨도록
		if (menu.dataset.type === "hamburger") {
			getModal(name, price);
			menuShowdata(name, img);
		} else {
			addToCart(name, price, id);
			menuShowdata(name, img);
		}
	});
}

// 이전/취소하기 버튼을 눌렀을 때, local storage도 같이 비워줌
function backBtns() {
	localStorage.clear();
}
function init() {
	const back_btn = document.querySelectorAll("#back_btn");
	const cancle_btn = document.querySelectorAll("#cancle_btn");
	back_btn.onclick = backBtns();
	cancle_btn.onclick = backBtns();

	categorySelect();
	for (const menu of menus) {
		menu.addEventListener("click", getValueFromBtn(menu));
	}
}
init();
