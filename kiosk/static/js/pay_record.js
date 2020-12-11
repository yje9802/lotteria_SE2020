"use strict";


const remove_btn = document.querySelector(".remove");
const describe_remove = document.querySelector(".describe_remove");

//환불/삭제 버튼 클릭
function clickRemoveBtn(){
    remove_btn.addEventListener("click",()=>{
        remove_btn.classList.add("clicked");
        describe_remove.style.display = "block";
    })
}


//클릭된 행 색상 변경
var orgBColor = '#ffffff';
var orgTColor = '#000000';
function HighLightTR(target, backColor,textColor) {
    if (remove_btn.classList.contains("clicked")){
        var tbody = target.parentNode;
        var trs = tbody.getElementsByTagName('tr');
            for ( var i = 0; i < trs.length; i++ ) {
                if ( trs[i] != target ) {
                trs[i].style.backgroundColor = orgBColor;
                trs[i].style.color = orgTColor;
            } else {
                trs[i].style.backgroundColor = backColor;
                trs[i].style.color = textColor;
                setTimeout(function() {
                    func_confirm();
                    }, 100);
                } 
            }} 
    } 

//환불/삭제 후 경고창 (삭제 경고창 '확인'선택 후에도 색상이 지워지지 않아서 재부팅(?)필요할듯..)
function func_confirm(){
    var do_remove;
    do_remove=confirm("해당 내용을 삭제하시겠습니까?")
    if(do_remove){
        alert("삭제되었습니다");
        remove_btn.classList.remove("clicked");
        describe_remove.style.display = "none";
    } 
}



clickRemoveBtn();
