# 메뉴관리모듈의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
# https://flask.palletsprojects.com/en/1.1.x/tutorial/blog/ 참고
import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from kiosk.db import get_db

bp = Blueprint('add_menu', __name__, url_prefix='/add_menu')

def set_query(n):
    if n == 1:
        return 'SELECT NAME, PRICE FROM MENU WHERE ID IN (SELECT MENU_ID FROM MENU_CATEGORY WHERE CATEGORY_TAG ="햄버거")'
    elif n == 2:
        return 'SELECT NAME, PRICE FROM MENU WHERE ID IN (SELECT MENU_ID FROM MENU_CATEGORY WHERE CATEGORY_TAG ="디저트" OR CATEGORY_TAG="치킨")'
    elif n == 3:
        return 'SELECT NAME, PRICE FROM MENU WHERE ID IN (SELECT MENU_ID FROM MENU_CATEGORY WHERE CATEGORY_TAG ="음료"  OR CATEGORY_TAG="커피")'

@bp.route('/', methods=['GET'])
def view_menu():
    db = get_db()
    c = db.cursor()
    
    global category_tag    
    category_tag=1
    query = set_query(category_tag)
    c.execute(query)
    info = c.fetchall()
    
    if request.method == 'GET':
        if request.args.get('burger'): 
            category_tag=1
            c.execute(query )
            info = c.fetchall()
            db.close()
            return render_template('/manage_menu/add_menu.html', data=info, name=0)
        elif request.args.get('dessert'): 
            category_tag=2
            query = set_query(category_tag)
            c.execute(query)
            info = c.fetchall()
            db.close()
            return render_template('/manage_menu/add_menu.html', data=info, name=0)
        elif request.args.get('beverage'): 
            category_tag=3
            query = set_query(category_tag)
            c.execute(query)
            info = c.fetchall()
            db.close()
            return render_template('/manage_menu/add_menu.html', data=info, name=0)
    db.close()
    return render_template('/manage_menu/add_menu.html', data=info, name=0)

@bp.route('/add', methods=['POST'])
def add_menu():
    db = get_db()
    c = db.cursor()
    query=set_query(category_tag)
    c.execute(query)
    info = c.fetchall()
    if request.method == 'POST':
        menu_name = request.form['name']
        menu_image = str(request.form['img'])
        menu_price = int(request.form['price'])
        menu_desc = request.form['desc']
        menu_weight = float(request.form['weight'])
        menu_kcal = float(request.form['kcal'])
        menu_protein_g = float(request.form['protein_g'])
        menu_protein_pct = float(request.form['protein_pct'])
        menu_sodium_g = float(request.form['sodium_g'])
        menu_sodium_pct = float(request.form['sodium_pct'])
        menu_sugar = float(request.form['sugar'])
        menu_satfat_g = float(request.form['satfat_g'])
        menu_satfat_pct = float(request.form['satfat_pct'])
        menu_caff = float(request.form['caff'])
        menu_allergy = request.form['allergy']
        menu_category = request.form['category']
        
        error = None
    
        if db.execute(
            'SELECT NAME FROM "MENU" WHERE name = ?', (menu_name,)
        ).fetchone() is not None:
            error = 'Menu {} is already registered.'.format(menu_name)

        if error is None:
            db.execute(
                'INSERT INTO MENU (NAME, IMAGE_PATH, PRICE, DESC, IS_SOLDOUT, WEIGHT_G, KCAL, PROTEIN_G, PROTEIN_PCENT, SODIUM_MG, SODIUM_PCENT, SUGAR_G, SAT_FAT_G, SAT_FAT_PCENT, CAFFEINE_MG, ALLERGY_INFO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',(menu_name, menu_image, menu_price, menu_desc, 0, menu_weight, menu_kcal, menu_protein_g, menu_protein_pct, menu_sodium_g, menu_sodium_pct, menu_sugar, menu_satfat_g, menu_satfat_pct, menu_caff, menu_allergy)
                )
            c.execute('SELECT ID FROM MENU WHERE NAME=?', (menu_name,))
            tmp = c.fetchone()
            menu_id = tmp[0]
            db.execute(
                'INSERT INTO "MENU_CATEGORY" VALUES (?,?)', (menu_id, menu_category)
                )
            db.commit()
            db.close()
            global name
            name = menu_name
            return redirect(url_for('add_menu.result', name=name))

        flash(error)
        db.close()
        return render_template('/manage_menu/add_menu.html', data=info, name=0)

@bp.route('/result')
def result():
    db = get_db()
    c = db.cursor()
    query=set_query(category_tag)
    c.execute(query)
    info = c.fetchall()
    return render_template('/manage_menu/add_menu.html', data=info, menu_data=0, name=name)
