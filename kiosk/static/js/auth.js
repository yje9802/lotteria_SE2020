"use strict";

function login(username, password){
	sessionStorage.setItem("username", username);
	sessionStorage.setItem("password", password);
	var id = document.getElementById("username").value;
	var pwd = document.getElementById("password").value;
	id += "";
	pwd += "";
	if ((id == username) && (pwd == password)){
		return window.location.href='{{ url_for('auth.manager_btn') }}';
	}
	else{
		alert('로그인 실패');
		return;
	}
}
