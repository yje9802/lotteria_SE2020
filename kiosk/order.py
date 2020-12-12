# 고객주문모듈의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
# https://flask.palletsprojects.com/en/1.1.x/tutorial/blog/ 참고
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
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
    recommends = fetch_menu('추천메뉴')
    burgers = fetch_menu('햄버거')
    drinks = fetch_menu('음료')
    desserts = fetch_menu('디저트')
    
    return render_template('order/menu.html', recommends=recommends, burgers=burgers, drinks=drinks, desserts=desserts)
    
    
def fetch_menu(category, max_view=8, path_prefix='/static%'):
    sql = \
    '''
    SELECT ID, NAME, IMAGE_PATH, PRICE
    FROM MENU M INNER JOIN MENU_CATEGORY C
    ON M.ID = C.MENU_ID
    WHERE CATEGORY_TAG=? AND IMAGE_PATH LIKE ?
    '''
    db = get_db()
    return db.execute(sql,(category, path_prefix)).fetchmany(max_view)


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


@bp.route('/order_num')
def order_num():
    return render_template('order/order_num.html')

