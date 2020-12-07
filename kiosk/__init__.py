import os

from flask import Flask, render_template
from kiosk.db import get_db


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'kiosk.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    @app.route('/manage_menu', methods=["POST", "GET"])
    def add_menu():
        db = get_db()
        c = db.cursor()
        c.execute('SELECT NAME, PRICE FROM MENU WHERE ID IN (SELECT MENU_ID FROM MENU_CATEGORY WHERE CATEGORY_TAG ="햄버거")'
                   )
        info = c.fetchall()
        db.close()
        return render_template('/manage_menu/add_menu.html', data=info)

    from . import manage_menu
    app.register_blueprint(manage_menu.bp)
    
    from . import db
    db.init_app(app)
    
    from . import order
    app.register_blueprint(order.bp)
    # app.add_url_rule('/', endpoint='index') # 필요한 코드??
    
    return app
    
