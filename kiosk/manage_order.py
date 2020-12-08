# 주문관리모듈의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
# https://flask.palletsprojects.com/en/1.1.x/tutorial/blog/ 참고
from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

from kiosk.db import get_db

bp = Blueprint('manage_order', __name__, url_prefix='/manage_order')

@bp.route('/orders')
def orders():
    # db = get_db()
    # posts = db.execute(
        # 'SELECT p.id, title, body, created, author_id, username'
        # ' FROM post p JOIN user u ON p.author_id = u.id'
        # ' ORDER BY created DESC'
    # ).fetchall()
    return render_template('manage_order/order_manage.html')
    

@bp.route('/stock')
def stock():
    return render_template('manage_order/stock_manage.html')
