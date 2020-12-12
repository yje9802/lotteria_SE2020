import sqlite3 as sql
from my_app import app
from flask import render_template
@app.route("/menu/<text:tag>")
def id_by_tag(tag):
    # receive tag -> search menu_id

    con = sql.connect('insert_demo_data.sql')
    curs = con.cursor()  # cursor
    query = "select * from MENU_CATEGORY where CATEGORY_TAG=%s"
    # read TAG==chosen tag
    curs.execute(query, tag)
    id_by_tag = curs.fetchone()
    # fetch the data from cursor. e.g. row[k] = (MENU_ID, '햄버거')
    return render_template('template/order/menu.html', id_by_tag=id_by_tag)


@app.route("/menu/<int:id>")
def info_by_id(id):

    con2 = sql.connect('insert_demo_data.sql')
    curs2 = con2.cursor()
    query2 = "select * from MENU where ID=%s"
    curs2.execute(query2, (id))
    info_by_id = curs2.fetchone()
    # menu_row[k] = (ID==MENU_ID, etc, etc, etc, etc, ....)
    return render_template('templates/order/menu.html', info_by_id=info_by_id)


def menu_info(tag):

    info_by_id(id_by_tag(tag))
    
