from flask import Flask, render_template
from scripts.calculater import calculate, log_error
from scripts.sqlstuff import *

app = Flask(__name__,
            static_folder='static',
            template_folder = 'templates')


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


@app.route('/languages')
def languages():
    d = SqlDatabase('CodingLanguages.db')
    data = d.fetchall("SELECT * FROM LANGUAGES;")
    #d.close()
    print(data)
    return render_template('database.html', data = data, name = 'Coding Languages')


if __name__ == '__main__':
    app.run(debug = True)