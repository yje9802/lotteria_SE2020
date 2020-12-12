# 고객주문모듈의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
# https://flask.palletsprojects.com/en/1.1.x/tutorial/blog/ 참고
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.exceptions import abort

from kiosk.db import get_db
import datetime
from itertools import groupby

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
    print(data,type(data))
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
    db.execute('BEGIN TRANSACTION')
    order_id = db.execute(create_order, ('WAITING', now, receipt_total)).lastrowid 
    print('order id:', order_id)
    
    # order_item
    raw_list = []
    insert_list = []
    
    for item in items:
        #item['MAIN_DISH_ID'] = 
        print('name:',item['name'])
        main_id = fetch_menu_id(item['name'])# MAIN_DISH_ID를 구한다
        main_dish_total = item['price']
        item['options'] = []
        if item['id'] == 'set':
            options = []
            dessert_id = fetch_menu_id(item['dessert'][0])
            drink_id = fetch_menu_id(item['drink'][0])
            options.append((dessert_id, 1, item['dessert'][1])) 
            options.append((drink_id, 1, item['drink'][1]))
            item['options'] += options
            opt_total = item['dessert'][1] + item['drink'][1]
            # MAIN_DISH_PRICE을 구한다
            # main_dish_price = item['price'] - opt_total
            print('options:', options)
        # MAIN_DISH_TOTAL을 구한다.
        # main_dish_total = main_dish_price * item['amount']
        raw_list.append((order_id, main_id, item['amount'], main_dish_total, item['options']))
    
    print('raw_list:', raw_list)
    # 같은 MAIN_DISH끼리 QTY, OPTIONS를 합친다.
    # for key, group in groupby(insert_list, lambda x: x[1]):
        # # listOfThings = " and ".join([thing[1] for thing in group])
        # item_no = min([thing])
        # print(key + "s:  " + listOfThings + ".")
    i = 1
    insert_opt_list = []
    raw_list = sorted(raw_list, key=lambda x: x[1])
    for key, group in groupby(raw_list, lambda x: x[1]):
        # listOfThings = " and ".join([thing[1] for thing in group])
        # print('i:', i)
        group_list = list(group)
        print('main_id_list:', [item[1] for item in group_list])
        order_id = group_list[0][0]
        item_no = i
        main_id = key
        qty = sum([item[2] for item in group_list])
        main_dish_total = sum([item[3] for item in group_list])
        raw_options = []
        for item in group_list:
            raw_options += item[4]
        raw_options = sorted(raw_options, key=lambda x: x[0])
        for key, group in groupby(raw_options, lambda x: x[0]):
            group_list = list(group)
            print('option_group:',group_list)
            option_id = group_list[0][0]
            opt_qty = sum([item[1] for item in group_list])
            opt_total = sum([item[2] for item in group_list])
            insert_opt_list.append((order_id, item_no, option_id, opt_qty, opt_total))
        insert_list.append((order_id, item_no, main_id, qty, main_dish_total))
        i += 1
    print('insert_list:', insert_list)
    insert_main = \
    '''
    INSERT INTO ORDER_ITEM (ORDER_ID, ITEM_NO, MAIN_DISH_ID, QTY, MAIN_DISH_TOTAL)
    VALUES ( ?, ?, ?, ?, ?)
    '''
    db.executemany(insert_main, insert_list)
    
    print('insert_opt_list:', insert_opt_list)
    insert_opt = \
    '''
    INSERT INTO OPT_CHOICE (ORDER_ID, ITEM_NO, OPTION_ID, OPT_QTY, OPT_TOTAL)
    VALUES (?, ?, ?, ?, ?)
    '''
    db.executemany(insert_opt, insert_opt_list)
    
    db.execute('COMMIT')
    return redirect(url_for('order.order_num'))
    

def fetch_menu_id(name):
    db = get_db()
    return db.execute('SELECT ID FROM MENU WHERE NAME=?', (name,)).fetchone()[0]
    
@bp.route('/order_num') #, methods=['GET']
def order_num():
    return render_template('order/order_num.html')
