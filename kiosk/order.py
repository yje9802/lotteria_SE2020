# 고객주문모듈의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
# https://flask.palletsprojects.com/en/1.1.x/tutorial/blog/ 참고
from flask import (
    Blueprint, render_template, request, url_for, jsonify
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
    recommends = fetch_menu('추천메뉴')
    burgers = fetch_menu('햄버거')
    drinks = fetch_menu('음료')
    desserts = fetch_menu('디저트')
    set_desserts = fetch_opt('세트_디저트')
    set_drinks = fetch_opt('세트_드링크')
    return render_template('order/menu.html', recommends=recommends, burgers=burgers, 
                            drinks=drinks, desserts=desserts, 
                            set_desserts=set_desserts, set_drinks=set_drinks)
    
    
def fetch_menu(category):
    sql = \
        '''
        SELECT ID, NAME, IMAGE_PATH, PRICE, IS_SOLDOUT
        FROM MENU M INNER JOIN MENU_CATEGORY C
        ON M.ID = C.MENU_ID
        WHERE CATEGORY_TAG=? AND IS_SOLDOUT=0
        '''
    db = get_db()
    return db.execute(sql, (category,)).fetchall()


def fetch_opt(category_tag):
    sql = \
        '''
        SELECT ID, NAME, IMAGE_PATH, OPT_PRICE
        FROM MENU M INNER JOIN OPT_PRICE P
        ON M.ID = P.MENU_ID
        WHERE OPT_TAG = ? AND IS_SOLDOUT=0
        ORDER BY OPT_PRICE
        '''
    db = get_db()
    return db.execute(sql, (category_tag, )).fetchall()


@bp.route('/fetch_info', methods=['POST'])
def fetch_info():
    id = request.get_json()
    print('id:', id)
    sql_ingredients = \
        '''
        SELECT I.NAME
        FROM (MENU M INNER JOIN INGRD_USE U ON M.ID=U.MENU_ID)
        INNER JOIN INGREDIENT I ON U.INGRD_ID=I.ID
        WHERE M.ID=?
        '''
    sql_desc = 'SELECT DESC FROM MENU WHERE ID=?'
    sql_nutrients = \
        '''
        SELECT WEIGHT_G, KCAL, PROTEIN_G, SODIUM_MG, SUGAR_G, SAT_FAT_G, CAFFEINE_MG
        FROM MENU
        WHERE ID=?
        '''
    db = get_db()
    db.row_factory = dict_factory
    ingredients = db.execute(sql_ingredients, (id,)).fetchall()
    desc = db.execute(sql_desc, (id,)).fetchall()
    nutrients = db.execute(sql_nutrients, (id,)).fetchall()
    print('ingredients:', ingredients)
    print('desc:', desc)
    print('nutrients', nutrients)
    
    return jsonify(ingredients=ingredients, desc=desc, nutrients=nutrients)


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d    
    
    
@bp.route('/charge')
def charge():
    return render_template('order/charge.html')


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print(data, type(data))
    items = data['items']
    # print(items, type(items))
    total = data['total']
    receipt_total = total['price']
    db = get_db()
    # orders 테이블 반영-price 
    now = datetime.datetime.now().replace(microsecond=0)  # todo:wait_no, is togo, pay method
    create_order = \
        '''
        INSERT INTO ORDERS (STATUS, ORDERED_AT, RECEIPT_TOTAL)
        VALUES ( ?, ?, ?)
        '''
    db.execute('BEGIN TRANSACTION')
    order_id = db.execute(create_order, ('WAITING', now, receipt_total)).lastrowid 
    print('order id:', order_id)
    
    raw_list = []
    insert_list = []
    
    # ORDER_ITEM 테이블 구조에 맞는 형태로 입력을 변환한다.
    for item in items:
        print('name:', item['name'])
        main_id = fetch_menu_id(item['name'])  # MAIN_DISH_ID를 구한다
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
            print('options:', options)
        raw_list.append((order_id, main_id, item['amount'], main_dish_total, item['options']))
    print('raw_list:', raw_list)
    
    # 2차 가공: 같은 MAIN_DISH끼리 묶어 QTY, OPTIONS를 합치고 item_no를 부여한다.
    i = 1
    insert_opt_list = []
    raw_list = sorted(raw_list, key=lambda x: x[1])
    for key, group in groupby(raw_list, lambda x: x[1]):
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
        # OPT_CHOICE 테이블 구조에 맞는 형태로 입력을 변환한다.
        for key, group in groupby(raw_options, lambda x: x[0]):
            group_list = list(group)
            print('option_group:', group_list)
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
    return render_template('order/order_num.html', order_id=order_id)
    

def fetch_menu_id(name):
    db = get_db()
    return db.execute('SELECT ID FROM MENU WHERE NAME=?', (name,)).fetchone()[0]
    
