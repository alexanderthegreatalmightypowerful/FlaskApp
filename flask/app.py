"""
Author : Alexander Krakowiak

This is the main script that hold the flask routing code for the entertainment website

The purpose of this application to deliver a webpage experience
"""

from flask import Flask, render_template, request, jsonify, session
from flask_session import Session
# from scripts.calculater import calculate, log_error
from scripts.sqlstuff import (SqlDatabase, organize_sql_data, 
                              sort_request_sql_data, update_sql, 
                              check_sql_data, get_profile_info)
import json
# from types import TracebackType
from scripts.signin import make_new_account, compare_sign_in
# from sqlite3 import OperationalError
from scripts.flask_sess import get_cookie, get_user_by_cookie


app = Flask(__name__)  # create flask app object
app.secret_key = 'BAD_SECRET_KEY'

# FrontEnd Requests


@app.errorhandler(404)  # handle 404 missing page errors
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/')
@app.route('/home')  # home route / front page
def home():
    print(session)
    print(session, app.session_interface.get_cookie_path(app))
    print(app.session_interface.get_cookie_name(app=app))

    try:
        print("COOKIE USER!", get_user_by_cookie(request, session))
    except Exception as e:
        print(e)

    return render_template('home.html', title='Home')


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

# JAVASCRIPT AJAX ROUTES


def jsonify_request(data) -> list:  # this handles incoming ajax requests and parses them to a readable python dictionary
    js = json.loads(data.decode())
    return js['data']


@app.route('/sign_in', methods=['POST', 'GET'])
def sign_in():
    message = ''
    data = jsonify_request(request.get_data())
    print('dict json data:', data)

    compared = compare_sign_in(data['username'], data['password'], message)

    print('DATA:', data, compared, message)
    new_data = {'result': compared[0], 'username': data['username'], 
                'message': compared[1]}
    if compared[0] == True:
        print("NEW ACCOUNT SIGN IN!:", request.form.get("name"), 
              request.cookies, get_cookie(request))
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
    except Exception as e: 
        print(e)
    print(session)
    return jsonify({})


@app.route('/create_new_account', methods=['POST', 'GET'])
def create_new_account():
    message = 'success!'

    data = jsonify_request(request.get_data())
    print('dict json data:', data)
    # data = js['data']

    check = make_new_account(data['username'], data['password'], message)

    print('DATA:', data)
    new_data = {'result': check[0], 'username': data['username'], 
                'message': check[1]}
    return jsonify(new_data) 

# SESSION INITIALIZATION


app.config["SESSION_PERMANENT"] = False     # Sessions expire when the browser is closed
app.config["SESSION_TYPE"] = "filesystem"     # Store session data in folder instead of ram


@app.route('/get_sql_data', methods=['POST', 'GET'])  # get incoming database querry requests from frontend
def get_sql_data():
    data = jsonify_request(request.get_data())
    print('dict json data:', data)

    base = SqlDatabase()
    print('DATA:', data)
    if check_sql_data(data) is True:  # if the system thinks the sql query is valid, post a complete data object
        new_data = organize_sql_data(base.fetchall(data))
    else:  # if the system deetcs or thinks the query has failed, it will send an incomplete error data object
        new_data = {'failed': True}
    # print(new_data)
    return jsonify(new_data)


@app.route('/get_profile_data', methods=['POST', 'GET'])
def get_profile_data():
    try:
        cookie = session[get_cookie(request)]
    except Exception as e:
        print(e)
        return jsonify({'failed': True})
    
    data = get_profile_info(cookie)
    print(data)
    return jsonify(data)


@app.route('/set_profile_picture', methods=['POST', 'GET'])
def set_profile_picture():
    try:
        cookie = session[get_cookie(request)]
    except Exception as e:
        print(e)
        return jsonify({'failed': True})
    data = jsonify_request(request.get_data())
    update_sql('UserData', "Picture", data['picture'], "USERNAME", cookie)    
    return jsonify({})


Session(app)
app.config.from_object(__name__)


@app.route('/set/')
def set():
    session['key'] = 'value'
    return 'ok'


@app.route('/get/')
def get():
    return session.get('key', 'not set')


@app.route('/get_clicks', methods=["POST", "GET"]) 
def get_clicks():
    """
    this route is part of the game statistics and records how many times the 
    user has clicked the boss game object in the frontend
    """
    data = jsonify_request(request.get_data())
    user = None
    try:
        # trys to get the user session token
        user = get_user_by_cookie(request, session)
        print('GOT USER!')
    except Exception: 
        return jsonify({})

    if user is None:
        return jsonify({})

    base = SqlDatabase()
    hits = base.fetchone(f'SELECT hits FROM UserData Where USERNAME = "{user}"')[0]
    print(data['hits'], hits, user)
    hits += data['hits']
    # update the hit column on a player
    update_sql('UserData', 'Hits', hits, 'USERNAME', user)

    return jsonify({})


@app.route("/world_statistics_data", methods=['POST', 'GET'])
def world_statistics_data():
    return jsonify({"testing": "BEANS"})


@app.route("/world_statistics_data_custom", methods=['POST', 'GET'])
def world_statistics_data_custom():
    data = jsonify_request(request.get_data())
    print(data)
    return_string = sort_request_sql_data(data)
    base = SqlDatabase()
    d = base.fetchall(return_string)
    sorted = organize_sql_data(d)
    # print(sorted)
    return jsonify(sorted)

# INITATE FLASK SERVER / APP


if __name__ == '__main__':
    app.run(debug=True)