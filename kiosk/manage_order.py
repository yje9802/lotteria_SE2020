# 주문관리모듈의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
# https://flask.palletsprojects.com/en/1.1.x/tutorial/blog/ 참고
from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort
from math import ceil
import datetime

from kiosk.db import get_db

bp = Blueprint('manage_order', __name__, url_prefix='/manage_order')

@bp.route('/orders')
def orders():
    db = get_db()
    cur = db.cursor()
    cur_order = db.cursor()
    orders = []
    max_view = 8
    cols = 4
    fetch_waiting = 'SELECT ID, WAIT_NO, strftime("%H:%M",ORDERED_AT) AS ORDERED_AT FROM ORDERS WHERE STATUS = "WAITING"'
    cur_order.execute(fetch_waiting)
    wait_rows = cur_order.fetchmany(max_view)
    for row in wait_rows:
        order = dict(row)
        fetch_items = \
        '''
        SELECT ITEM_NO, NAME, SUM(QTY) AS QTY
        FROM (ORDER_ITEM I INNER JOIN MENU M ON I.MAIN_DISH_ID = M.ID) 
        INNER JOIN ORDERS O ON I.ORDER_ID = O.ID
        WHERE ORDER_ID = ?
        GROUP BY ORDER_ID, NAME
        '''
        cur.execute(fetch_items,(order["ID"],))
        order['items'] = [dict(row) for row in cur]
        items = order['items']
        fetch_options = \
        '''
        SELECT M.NAME,OPT_QTY AS QTY
        FROM OPT_CHOICE O INNER JOIN MENU M ON O.OPTION_ID = M.ID
        WHERE ORDER_ID = ? AND ITEM_NO = ?
        '''
        for item in items: 
            cur.execute(fetch_options, (order['ID'], item['ITEM_NO']))
            item['options'] = [dict(row) for row in cur]
        orders.append(order)
    return render_template('manage_order/order_manage.html', orders=orders, 
                            len=len(orders), max_len=max_view, cols=cols)
    

@bp.route('/<int:id>/call', methods=('GET',))
def call(id):
    error = None
    if not id:
        error = 'Id is required'
    assert isinstance(id, int) == True
    if error is not None:
        flash(error)
    else:
        db = get_db()
        mark_done = \
        '''
        UPDATE ORDERS
        SET STATUS='SERVED', SERVED_AT=?
        WHERE ID = ?
        '''
        db.execute(mark_done,(datetime.datetime.now().replace(microsecond=0), id))
        db.commit()
            
    return redirect(url_for('manage_order.orders'))
    

@bp.route('/stock')
def stock():
    return render_template('manage_order/stock_manage.html')
