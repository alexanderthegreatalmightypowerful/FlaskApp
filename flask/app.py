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

app = Flask(__name__, static_folder='static', template_folder = 'templates')

app.secret_key = 'BAD_SECRET_KEY'

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html', title = 'Home')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/statistics')
def statistics():
    return render_template('statistics.html')


#JAVASCRIPT ROUTS


@app.route('/sign_in', methods=['POST'])
def sign_in():
    #print(request.get_data())
    raw_bytes = request.get_data()
    js = json.loads(raw_bytes.decode())
    print('dict json data:',js)
    data = js['data']#request.form.get('data')
    print('DATA:' , data)
    new_data = {'TESTING' : "HELLO WORLD"}
    return jsonify(new_data) 


if __name__ == '__main__':
    app.run(debug = True)