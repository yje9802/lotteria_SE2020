"use strict";

function login(username, password){
	sessionStorage.setItem("username", username);
	sessionStorage.setItem("password", password);
	var id = document.getElementById("username").value;
	var pwd = document.getElementById("password").value;
	id += "";
	pwd += "";
	if ((id == username) && (pwd == password)){
		return window.location.href='http://127.0.0.1:5000/manage_sale';
	}
	else{
		alert('로그인 실패');
		return;
	}
}