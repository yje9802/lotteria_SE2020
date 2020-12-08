# 고객주문모듈의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
# https://flask.palletsprojects.com/en/1.1.x/tutorial/blog/ 참고
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.exceptions import abort

from kiosk.db import get_db

bp = Blueprint('order', __name__, url_prefix='/order')

@bp.route('/')
def index():
    return render_template('order/home.html')
    

@bp.route('/payment')
def payment():
    return render_template('order/payment.html')


@bp.route('/menu')
def menu():
    return render_template('order/menu.html')
    

@bp.route('/charge')
def charge():
    return render_template('order/charge.html')


@bp.route('/order_num')
def order_num():
    return render_template('order/order_num.html')
