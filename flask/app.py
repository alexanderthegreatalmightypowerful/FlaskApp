"""
Author : Alexander Krakowiak

This is the main script that hold the flask routing code

Here is where the website connection and page distrabution takes place
"""


from flask import Flask, render_template, request, jsonify
from scripts.calculater import calculate, log_error
from scripts.sqlstuff import *
import json
import random
import copy

app = Flask(__name__, static_folder='static', template_folder = 'templates')

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html', title = 'Home')


@app.route('/sign_in', methods=['POST'])
def sign_in():
    print(request.form)
    data = request.form.get('data')
    print('DATA:' , data)
    new_data = {'TESTING' : "HELLO WORLD"}
    return jsonify(new_data) 


if __name__ == '__main__':
    app.run(debug = True)