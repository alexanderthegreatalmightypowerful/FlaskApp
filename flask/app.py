from flask import Flask, render_template, request, jsonify
from scripts.calculater import calculate, log_error
from scripts.sqlstuff import *
import json

app = Flask(__name__, static_folder='static', template_folder = 'templates')


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/')
def home():
    return render_template('home.html', title = 'Home')

@app.route('/me')
def me():
    return render_template('me.html', title = 'Docs')

@app.route('/pet_rocks/<string:id>')
def pet_rocks(id):
    num = calculate(id)
    return render_template('pet_rocks.html', title = 'Rocks', id = str(num))


@app.route('/search/<string:id>')
def search(id):
    d = SqlDatabase('CodingLanguages.db')
    data = d.fetchall("SELECT * FROM LANGUAGES;")
    data = organize_sql_data(data)
    return render_template('database.html', name = 'Coding Languages')


@app.route('/request_database_data', methods=['POST'])
def request_database_data():
    print(request.form)
    data = request.form.get('data')

    d = SqlDatabase('CodingLanguages.db')
    new_data = d.fetchall("SELECT * FROM LANGUAGES;")
    new_data = organize_sql_data(new_data)
    return jsonify(new_data)

if __name__ == '__main__':
    app.run(debug = True)