"""
Author : Alexander Krakowiak

This is the main script that hold the flask routing code

Here is where the website connection and page distrabution takes place
"""

from flask import Flask, render_template, request, jsonify, session
from flask_session import Session
from scripts.calculater import calculate, log_error
from scripts.sqlstuff import *
import json
import random
import copy
from types import TracebackType
from scripts.signin import *
from sqlite3 import OperationalError

from scripts.flask_sess import *

app = Flask(__name__, static_folder='static', template_folder = 'templates')

app.secret_key = 'BAD_SECRET_KEY'

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/')
@app.route('/home')
def home():
    print(session)
    print(session, app.session_interface.get_cookie_path(app))
    print(app.session_interface.get_cookie_name(app=app))

    try:
        print("COOKIE USER!", get_user_by_cookie(request, session))
    except: pass

    return render_template('home.html', title = 'Home')


@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/create_account')
def create_account():
    return render_template('create_account.html')


@app.route('/statistics')
def statistics():
    return render_template('statistics.html')


@app.route('/personal_statistics')
def personal_statistics():
    return render_template('personal_stats.html')

@app.route('/sign_in_page')
def sign_in_page():
    return render_template('sign_in.html')


#JAVASCRIPT ROUTS


def jsonify_request(data):
    js = json.loads(data.decode())
    return js['data']


@app.route('/sign_in', methods=['POST', 'GET'])
def sign_in():
    message = ''
    data = jsonify_request(request.get_data())
    print('dict json data:',data)

    compared = compare_sign_in(data['username'], data['password'], message)

    print('DATA:' , data, compared, message)
    new_data = {'result' : compared[0], 'username' : data['username'], 'message' : compared[1]}
    if compared[0] == True:
        print("NEW ACCOUNT SIGN IN!:", request.form.get("name"), request.cookies, get_cookie(request))
        session[get_cookie(request)] = data['username']
    return jsonify(new_data) 

@app.route('/sign_out', methods=['POST', 'GET'])
def sign_out():
    print("SIGNING OUT!")
    try:
        cookie = get_user_by_cookie(request, session)
        id = get_cookie(request)
        del session[id]
        print('removed user cookie', cookie, id)
    except Exception as e: print(e)
    print(session)
    return jsonify({})





@app.route('/create_new_account', methods=['POST', 'GET'])
def create_new_account():
    message = 'success!'

    data = jsonify_request(request.get_data())
    print('dict json data:', data)
    #data = js['data']

    check = make_new_account(data['username'], data['password'], message)

    print('DATA:' , data)
    new_data = {'result' : check[0], 'username' : data['username'], 'message' : check[1]}
    return jsonify(new_data) 

#SESSION STUFF

app.config["SESSION_PERMANENT"] = False     # Sessions expire when the browser is closed
app.config["SESSION_TYPE"] = "filesystem"     # Store session data in files

# Initialize Flask-Session


@app.route('/get_sql_data', methods=['POST', 'GET'])
def get_sql_data():
    data = jsonify_request(request.get_data())
    print('dict json data:', data)

    base = SqlDatabase()

    new_data = organize_sql_data(base.fetchall('SELECT USERNAME, hits, rank FROM UserData ORDER BY rank ASC;'))
    print(new_data)
    return jsonify(new_data) 


@app.route('/get_profile_data', methods=['POST', 'GET'])
def get_profile_data():
    data = jsonify_request(request.get_data())
    return jsonify(data)

Session(app)
app.config.from_object(__name__)

@app.route('/set/')
def set():
    session['key'] = 'value'
    return 'ok'

@app.route('/get/')
def get():
    return session.get('key', 'not set')

@app.route('/get_clicks', methods = ["POST", "GET"])
def get_clicks():
    data = jsonify_request(request.get_data())
    user = None
    try:
        user = get_user_by_cookie(request, session)
        print('GOT USER!')
    except: return jsonify({})

    if user == None:
        return jsonify({})
    
    base = SqlDatabase()
    hits = base.fetchone(f'SELECT hits FROM UserData Where USERNAME = "{user}"')[0]
    print(data['hits'], hits, user)
    hits += data['hits']

    update_sql('UserData', 'Hits', hits, 'USERNAME', user)

    return jsonify({})

if __name__ == '__main__':
    app.run(debug = True)