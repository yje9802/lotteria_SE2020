# 메뉴관리모듈의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
# https://flask.palletsprojects.com/en/1.1.x/tutorial/blog/ 참고
import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from kiosk.db import get_db

bp = Blueprint('delete_menu', __name__, url_prefix='/delete_menu')

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
            return render_template('/manage_menu/delete_menu.html', data=info, menu_data=0, name=0)
        elif request.args.get('dessert'):
            category_tag=2
            query = set_query(category_tag)
            c.execute(query)
            info = c.fetchall()
            db.close()
            return render_template('/manage_menu/delete_menu.html', data=info, menu_data=0, name=0)
        elif request.args.get('beverage'):
            category_tag=3
            query = set_query(category_tag)
            c.execute(query)
            info = c.fetchall()
            db.close()
            return render_template('/manage_menu/delete_menu.html', data=info, menu_data=0, name=0)
    db.close()
    return render_template('/manage_menu/delete_menu.html', data=info, menu_data=0, name=0)


@bp.route('/detail', methods=['POST'])
def view_detail():
    db = get_db()
    c = db.cursor()
    query=set_query(category_tag)
    c.execute(query)
    info = c.fetchall()
    if request.method=='POST':
        menu_name=request.form['view_name']
        c.execute('SELECT NAME, IMAGE_PATH, PRICE, DESC, WEIGHT_G, KCAL, PROTEIN_G, PROTEIN_PCENT, SODIUM_MG, SODIUM_PCENT, SUGAR_G, SAT_FAT_G, SAT_FAT_PCENT, CAFFEINE_MG, ALLERGY_INFO FROM MENU WHERE NAME=?',(menu_name,))
        menu_data=c.fetchall()
        db.close()
        return render_template('/manage_menu/delete_menu.html', data=info, menu_data=menu_data)

@bp.route('/delete', methods=['POST'])
def delete_menu():
    db = get_db()
    c = db.cursor()
    query=set_query(category_tag)
    c.execute(query)
    info = c.fetchall()
    if request.method=='POST':
        menu_name=request.form['name']
        c.execute('SELECT ID FROM MENU WHERE NAME=?', (menu_name,))
        tmp = c.fetchone()
        menu_id=tmp[0]
        db.execute(
            'DELETE FROM "MENU_CATEGORY" WHERE MENU_ID=?', (menu_id,))
        db.execute(
            'DELETE FROM "MENU" WHERE NAME=?', (menu_name,))
        db.commit()
        db.close()

        global name
        name = menu_name
        return redirect(url_for('delete_menu.result', name=name))

@bp.route('/result')
def result():
    db = get_db()
    c = db.cursor()
    query=set_query(category_tag)
    c.execute(query)
    info = c.fetchall()
    return render_template('/manage_menu/delete_menu.html', data=info, menu_data=0, name=name)
 
