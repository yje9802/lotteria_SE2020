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


@bp.route('/add', methods=('POST', 'GET'))
def menu_add():
    if request.method == 'POST':
        menu_id = int(request.form['id'])
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
        menu_allergy = float(request.form['allergy'])
        menu_category = request.form['category']
        
        db = get_db()
        error = None
    
        if db.execute(
            'SELECT NAME FROM "MENU" WHERE name = ?', (menu_name,)
        ).fetchone() is not None:
            error = 'Menu {} is already registered.'.format(menu_name)

        if error is None:
            db.execute(
                'INSERT INTO "MENU" VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',(menu_id, menu_name, menu_image, menu_price, menu_desc, 0, menu_weight, menu_kcal, menu_protein_g, menu_protein_pct, menu_sodium_g, menu_sodium_pct, menu_sugar, menu_satfat_g, menu_satfat_pct, menu_caff, menu_allergy)
                )
            db.execute(
                'INSERT INTO "MENU_CATEGORY" VALUES (?,?)', (menu_id, menu_category)
                )
            db.commit()
            return render_template('/manage_menu/add_menu.html')

        flash(error)

        db.close()

        return render_template('/manage_menu/add_menu.html')
    elif request.method == 'GET':
        if request.args.get('burger'): 
            db = get_db()
            c = db.cursor()
            c.execute('SELECT NAME, PRICE FROM MENU WHERE ID IN (SELECT MENU_ID FROM MENU_CATEGORY WHERE CATEGORY_TAG ="햄버거")'
                   )
            info = c.fetchall()
            db.close()
            return render_template('/manage_menu/add_menu.html', data=info)
        elif request.args.get('dessert'): 
            db = get_db()
            c = db.cursor()
            c.execute('SELECT NAME, PRICE FROM MENU WHERE ID IN (SELECT MENU_ID FROM MENU_CATEGORY WHERE CATEGORY_TAG ="디저트" OR CATEGORY_TAG="치킨")'
                   )
            info = c.fetchall()
            db.close()
            return render_template('/manage_menu/add_menu.html', data=info)
        elif request.args.get('beverage'): 
            db = get_db()
            c = db.cursor()
            c.execute('SELECT NAME, PRICE FROM MENU WHERE ID IN (SELECT MENU_ID FROM MENU_CATEGORY WHERE CATEGORY_TAG ="음료"  OR CATEGORY_TAG="커피")'
                   )
            info = c.fetchall()
            db.close()
            return render_template('/manage_menu/add_menu.html', data=info)

@bp.route('/delete', methods=('GET', 'POST'))
def menu_delete():
    if request.method == 'POST':
        menu_name = request.form['menu_name']
        db = get_db()
        error = None
        if db.execute(
            'SELECT * FROM "MENU" WHERE name =?', (menu_name)
            ).fetchone() is None:
            error = 'Menu {} is already deleted.'.format(menu_name)

        if error is None:
            db.exectue(
                'DELETE FROM "MENU" WHERE name =?', (menu_name)
            )
            db.commit()
            return

        db.close()

        flash(error)

    return 
