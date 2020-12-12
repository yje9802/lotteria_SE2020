# 메뉴관리모듈의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
# https://flask.palletsprojects.com/en/1.1.x/tutorial/blog/ 참고
import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from kiosk.db import get_db

def set_query(n):
    if n == 1:
        return 'SELECT NAME, PRICE FROM MENU WHERE ID IN (SELECT MENU_ID FROM MENU_CATEGORY WHERE CATEGORY_TAG ="햄버거")'
    elif n == 2:
        return 'SELECT NAME, PRICE FROM MENU WHERE ID IN (SELECT MENU_ID FROM MENU_CATEGORY WHERE CATEGORY_TAG ="디저트" OR CATEGORY_TAG="치킨")'
    elif n == 3:
        return 'SELECT NAME, PRICE FROM MENU WHERE ID IN (SELECT MENU_ID FROM MENU_CATEGORY WHERE CATEGORY_TAG ="음료"  OR CATEGORY_TAG="커피")'


bp = Blueprint('manage_menu', __name__, url_prefix='/manage_menu')

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
            category_tag =1
            query = set_query(category_tag)
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
    return render_template('/manage_menu/manage_menu.html', data=info)
