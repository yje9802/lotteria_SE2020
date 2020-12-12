# 로그인모듈의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
from flask import (
    Blueprint, flash, redirect, render_template, request, session, url_for
)
# from werkzeug.security import check_password_hash, generate_password_hash


bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        error = None
        user = 'admin'
        user_pw = 'admin1234'

        if username is not user:
            error = 'Incorrect username.'
        elif not password == user_pw:
            error = 'Incorrect password.'

        if error is None:
            session.clear()
            session['user_id'] = user['id']
            return redirect(url_for('templates/auth/manager_btn.html'))

        flash(error)

    return render_template('templates/auth/manager_btn.html')
