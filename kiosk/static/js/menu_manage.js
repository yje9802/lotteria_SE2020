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
    })
}



//메뉴추가, 메뉴수정, 메뉴 삭제 버튼 클릭시 입력창 생성
function addMenubtn(){
    const add_btn = document.querySelector(".add_btn");
    const change_btn = document.querySelector(".change_btn");
    const remove_btn = document.querySelector(".remove_btn");
    const input_container = document.querySelector(".input_container");
    const submit_btn = document.querySelector(".submit_btn");
    const clicked_class = "clicked";
    //메뉴 추가 버튼 클릭시 
    add_btn.addEventListener("click",()=>{
        add_btn.classList.add(clicked_class);
        remove_btn.classList.remove(clicked_class);
        change_btn.classList.remove(clicked_class);
        input_container.style.display = 'block';
        // add_btn.addEventListener("click",()=>{
        //     hasClicked(add_btn, clicked_class);
        // })
        //저장 버튼 클릭시 닫음 
        submit_btn.addEventListener("click", ()=>{
            input_container.style.display = "none";
            add_btn.classList.remove(clicked_class);
        })
    })
    //메뉴 수정 버튼 클릭시 
    change_btn.addEventListener("click", ()=>{
        add_btn.classList.remove(clicked_class);
        remove_btn.classList.remove(clicked_class);
        change_btn.classList.add(clicked_class);

        menus.forEach((menu)=>{
            menu.addEventListener("click",()=>{
                input_container.style.display = 'block';
                submit_btn.value = "수정";
            })
        })
    })
    //메뉴 삭제 버튼 클릭시 
    remove_btn.addEventListener("click", ()=>{
        add_btn.classList.remove(clicked_class);
        change_btn.classList.remove(clicked_class);
        remove_btn.classList.add(clicked_class);
        const submit_container = document.querySelector(".input_container_right");
        submit_container.innerHTML=`
        <button class="submit_btn return">취소</button>
        <input type="submit" value="삭제" class="submit_btn remove">
        
        `;
        menus.forEach((menu)=>{
            menu.addEventListener("click",(event)=>{  
                input_container.style.display = 'block'; 
            })
        })
        //취소 버튼 클릭
        const submit_cancle_btn = document.querySelector(".submit_btn.return");
        submit_cancle_btn.addEventListener("click", ()=>{
            input_container.style.display = 'none';
        })

        //삭제 버튼 클릭
        const submit_remove_btn = document.querySelector(".submit_btn.remove")
        submit_remove_btn.addEventListener("click",()=>{
            var returnValue = confirm("해당 메뉴를 '삭제'하시겠습니까?");
            //경고창 버튼 선택
            if(returnValue){
                //삭제기능 추가해야함***
                input_container.style.display = 'none'; 
                alert("삭제되었습니다");
            }
        })
        

    })


    

}


//이미지 첨부시 보여주기 (다시 다른걸 선택할 경우 문제 발생)
function setThumbnail(event) { 
    for (var image of event.target.files) { 
        var reader = new FileReader(); 
        reader.onload = function(event) { 
            var img = document.createElement("img"); 
            img.setAttribute("src", event.target.result); 
            document.querySelector("div#image_container").appendChild(img); 
        };

        console.log(image); 
        reader.readAsDataURL(image); 
        } 
    }




categorySelect();
addMenubtn();


