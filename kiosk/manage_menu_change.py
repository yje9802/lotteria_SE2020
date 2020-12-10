# 메뉴관리모듈의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
# https://flask.palletsprojects.com/en/1.1.x/tutorial/blog/ 참고
import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from kiosk.db import get_db

bp = Blueprint('change_menu', __name__, url_prefix='/change_menu')

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
        elif request.args.get('dessert'):
            category_tag=2
            query = set_query(category_tag)
            c.execute(query)
            info = c.fetchall()
        elif request.args.get('beverage'):
            category_tag=3
            query = set_query(category_tag)
            c.execute(query)
            info = c.fetchall()
    db.close()
    return render_template('/manage_menu/change_menu.html', data=info, menu_data=0, name=0)


@bp.route('/detail', methods=['POST'])
def view_detail():
    db = get_db()
    c = db.cursor()
    category_tag='햄버거'
    c.execute('SELECT NAME, PRICE FROM MENU WHERE ID IN (SELECT MENU_ID FROM MENU_CATEGORY WHERE CATEGORY_TAG =?)', (category_tag,)
              )
    info = c.fetchall()
    if request.method=='POST':
        menu_name=request.form['view_name']
        global original_name
        original_name = menu_name
        c.execute('SELECT NAME, IMAGE_PATH, PRICE, DESC, WEIGHT_G, KCAL, PROTEIN_G, PROTEIN_PCENT, SODIUM_MG, SODIUM_PCENT, SUGAR_G, SAT_FAT_G, SAT_FAT_PCENT, CAFFEINE_MG, ALLERGY_INFO FROM MENU WHERE NAME=?',(menu_name,))
        menu_data=c.fetchall()
        db.close()
        return render_template('/manage_menu/change_menu.html', data=info, menu_data=menu_data, name=0)

@bp.route('/change', methods=['POST'])
def change_menu():
    db = get_db()
    c = db.cursor()
    query=set_query(category_tag)
    c.execute(query)
    info = c.fetchall()
    if request.method=='POST':
        menu_name = request.form['name']
        menu_image = request.form['img']
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
        
        c.execute('SELECT ID FROM MENU WHERE NAME=?', (original_name,))
        tmp = c.fetchone()
        menu_id=tmp[0]
        db.execute('UPDATE MENU SET NAME=?, IMAGE_PATH=?, PRICE=?, DESC=?, WEIGHT_G=?, KCAL=?, PROTEIN_G=?, PROTEIN_PCENT=?, SODIUM_MG=?, SODIUM_PCENT=?, SUGAR_G=?, SAT_FAT_G=?, SAT_FAT_PCENT=?, CAFFEINE_MG=?, ALLERGY_INFO=? WHERE ID=?',(menu_name, menu_image, menu_price, menu_desc, menu_weight, menu_kcal, menu_protein_g, menu_protein_pct, menu_sodium_g, menu_sodium_pct, menu_sugar, menu_satfat_g, menu_satfat_pct, menu_caff, menu_allergy, menu_id)
                   )
        db.commit()
        db.close()

        global names
        names=[]                                        #변경 전 후 메뉴명 리스트
        names.append(original_name)
        names.append(menu_name)
        return redirect(url_for('change_menu.result', names=names))

@bp.route('/result')
def result():
    db = get_db()
    c = db.cursor()
    query=set_query(category_tag)
    c.execute(query)
    info = c.fetchall()
    return render_template('/manage_menu/change_menu.html', data=info, menu_data=0, name=names)
                           
    
