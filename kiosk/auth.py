# 로그인모듈의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from kiosk.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/', methods=('GET', 'POST'))
def index():
    db=get_db()
    c = db.cursor()
    c.execute('SELECT LOGIN_ID FROM MANAGER')
    username = c.fetchone()
    c.execute('SELECT LOGIN_PWD FROM MANAGER')
    password = c.fetchone()

    username = str(username[0])
    password = str(password[0])
    db.commit()
    db.close()
    return render_template('/auth/auth.html', username=username, password=password)
