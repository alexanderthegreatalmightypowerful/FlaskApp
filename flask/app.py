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
    data = jsonify_request(request.get_data())
    print('dict json data:',data)

    print('DATA:' , data)
    new_data = {'result' : "success", 'username' : data['username']}
    return jsonify(new_data) 


@app.route('/create_new_account', methods=['POST', 'GET'])
def create_new_account():
    data = jsonify_request(request.get_data())
    print('dict json data:', data)
    #data = js['data']

    make_new_account(data['username'], data['password'])

    print('DATA:' , data)
    new_data = {'result' : "success", 'username' : data['username']}
    return jsonify(new_data) 

#SESSION STUFF

app.config["SESSION_PERMANENT"] = False     # Sessions expire when the browser is closed
app.config["SESSION_TYPE"] = "filesystem"     # Store session data in files

# Initialize Flask-Session


Session(app)
app.config.from_object(__name__)

@app.route('/set/')
def set():
    session['key'] = 'value'
    return 'ok'

@app.route('/get/')
def get():
    return session.get('key', 'not set')

if __name__ == '__main__':
    app.run(debug = True)