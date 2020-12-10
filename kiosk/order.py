# 고객주문모듈의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
# https://flask.palletsprojects.com/en/1.1.x/tutorial/blog/ 참고
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.exceptions import abort

from kiosk.db import get_db
import datetime

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


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # print(data,type(data))
    items = data['items']
    # print(items, type(items))
    total = data['total']
    receipt_total = total['price']
    db = get_db()
    # orders 테이블 반영-price 
    now = datetime.datetime.now().replace(microsecond=0)# todo:wait_no, is togo, pay method
    create_order = \ 
    '''
    INSERT INTO ORDERS (STATUS, ORDERED_AT, RECEIPT_TOTAL)
    VALUES ( ?, ?, ?)
    '''
    id = db.execute(create_order, ('WAITING', now, receipt_total)).lastrowid 
    print('order id:', id)
    
    # order_item
    insert_list = []
    for item in items:
        item['MAIN_DISH_ID'] = db.execute('SELECT ID FROM MENU WHERE NAME=?', (item['name'].strip('() '),))# MAIN_DISH_ID를 구한다
        # MAIN_DISH_PRICE을 구한다
        # MAIN_DISH_TOTAL을 구한다.
        # OPTIONS를 구한다.
    # 같은 MAIN_DISH끼리 QTY, OPTIONS를 합친다.
    # ITEM_NO를 매긴다.
    insert_main = \
    '''
    INSERT INTO ORDER_ITEM (ORDER_ID, ITEM_NO, MAIN_DISH_ID, QTY, MAIN_DISH_TOTAL)
    VALUES ( ?, ?, ?, ?, ?)
    '''
    db.executemany(create_order, mains)
    # opt_choice
    return redirect(url_for('order.order_num'))
    
    
@bp.route('/order_num') #, methods=['GET']
def order_num():
    return render_template('order/order_num.html')
