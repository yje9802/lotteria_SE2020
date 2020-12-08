"use strict";

const togo_btn = document.querySelector(".step1_icon_btn.togo");
const here_btn = document.querySelector(".step1_icon_btn.here");
const togo_img = document.querySelector(".step1_img.togo");
const here_img = document.querySelector(".step1_img.here");
const step1 = document.querySelector(".step1");
const step2 = document.querySelector(".step2");
const card_btn = document.querySelector(".step2_icon_btn.card");
const mobile_btn = document.querySelector(".step2_icon_btn.mobile");

const togo_path = togo_img.getAttribute("data-togo_path") // togo_img에 저장
const togo_check_path = togo_img.getAttribute("data-togo_check_path") // togo_img에 저장
const here_path = here_img.getAttribute("data-here_path") // here_img에 저장
const here_check_path = here_img.getAttribute("data-here_check_path") // here_img에 저장
const bill2_path = step2.getAttribute("data-bill2_path") //step2 div에 저장
const order_num_path = step2.getAttribute("data-order_num_path") //step2 div에 저장

//step2 선택 
function clickStep2(){
    step1.style.backgroundColor = "#e0e0e0"; 
    step1.style.color = "#757575"; 
    step2.style.backgroundColor = "#f44336";
    step2.style.color = "#ffffff";
    card_btn.style.opacity = 1;
    mobile_btn.style.opacity = 1;
    //카드 선택
    card_btn.onclick = function(){
        mobile_btn.style.opacity = 0.5;
        card_btn.style.opacity = 1;
        card_btn.style.backgroundColor = "#e0e0e0";
        mobile_btn.style.backgroundColor = "#ffffff";
        getModal();
    }
    //모바일 바코드 선택
    mobile_btn.onclick = function(){
        card_btn.style.opacity = 0.5;
        mobile_btn.style.opacity = 1;
        mobile_btn.style.backgroundColor = "#e0e0e0";
        card_btn.style.backgroundColor = "#ffffff";
    }
}

//step1 선택
function clickStep1(){
    //포장
    togo_btn.onclick = function(){
        //**아래 네개(img.src) 사진 경로 설정 필요
        togo_img.src = togo_check_path; // /kiosk/static/img/togo_check.png; 
        here_img.src = here_path; // /kiosk/static/img/here.png"; 
        togo_btn.style.opacity = 1;
        here_btn.style.opacity = 0.5;
        clickStep2();

    }
    //매장
    here_btn.onclick = function(){
        here_img.src = here_check_path; // "../img/here_check.png";
        togo_img.src = togo_path // "../img/togo.png";
        here_btn.style.opacity = 1;
        togo_btn.style.opacity = 0.5; 
        clickStep2();
    }
}

//카드결제 모달
function getModal(){
    var modal = document.getElementById('myModal'); 
    const content_top = document.querySelector('.content_top');
    const content_bottom = document.querySelector('.content_bottom');
    const discribe_1 = document.querySelector('.discribe_1');
    const discribe_2 = document.querySelector('.discribe_2');
    const cancle_btn = document.querySelector('.modal_cancle_btn');   
    const receipt_btn = document.querySelector('.receipt_btn');


    modal.style.display = "block";
    //1초 지나면 내용변경 + 취소btn 추가
    setTimeout(function() {
        discribe_1.innerHTML=`* 그림과 같이 카드를 넣어주세요`
        discribe_2.innerHTML=`(IC칩이 단말기에 투입되도록 넣어주세요)`;
        cancle_btn.style.display = "block";
    
        //영수증 발행 
        setTimeout(function() {
            //**<img src = ... > 1개 경로 설정 필요
            //** onlcilck 2개 경로설정 필요 (대기번호 화면 (/order_num)으로 넘어가는 경로)
            console.log('Works!');
            content_top.innerHTML = `영수증을 발행 하시겠습니까?`;
            content_bottom.innerHTML = `
            <div class="receipt_top">
                <div class="receipt_left">
                    <img src = "${bill2_path}" class="receipt_img">
                </div>
                <div class = "receipt_right">
                    <div class="discribe">
                        <div><span>결제영수증</span>이 필요하신</div>
                        <div>고객께서는 <span>발행버튼을<span></div>
                        눌러주세요
                    </div>
                    <div class="discribe_little">미발행 선택 시 대기번호만 출력</div>
                </div>
            </div>
            <div class = "receipt_bottom">
                <button class="receipt_btn yes" onClick="location.href='${order_num_path}'">발행</button>
                <button class="receipt_btn no" onClick="location.href='${order_num_path}'">미발행</button>
            </div>
            `;
          }, 2000);
      }, 2000);

    //카드 취소 버튼 클릭시 모달 종료
    cancle_btn.onclick = function(){
    modal.style.display = "none"};


    //배경화면 클릭시 모달 종료
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}




clickStep1();


