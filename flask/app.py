"""
Author : Alexander Krakowiak

This is the main script that hold the flask routing code for the entertainment
website

The purpose of this application to deliver a webpage experience
"""

from flask import Flask, render_template, request, jsonify, session
from flask_session import Session
from scripts.sqlstuff import (SqlDatabase, organize_sql_data,
                              sort_request_sql_data, update_sql,
                              check_sql_data, get_profile_info)
import json
# from types import TracebackType
from scripts.signin import make_new_account, compare_sign_in
# from sqlite3 import OperationalError
from scripts.flask_sess import get_cookie, get_user_by_cookie
from scripts.leaderboards import update_leaderboard


app = Flask(__name__)  # create flask app object
app.secret_key = 'python_better_than_javascript1234'

# FrontEnd Requests


@app.errorhandler(404)  # handle 404 missing page errors
def page_not_found(e):
    return render_template('404.html', title='Game'), 404


@app.route('/')
@app.route('/home')  # home route / front page
def home():
    global session
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
    return render_template('about.html', title='About')


@app.route('/create_account')
def create_account():
    return render_template('create_account.html', title='Sign Up')


@app.route('/statistics')
def statistics():
    return render_template('statistics.html', title='Statistics')


@app.route('/personal_statistics')
def personal_statistics():
    return render_template('personal_stats.html', title='Account')


@app.route('/sign_in_page')
def sign_in_page():
    return render_template('sign_in.html', title='Sign In')

# JAVASCRIPT AJAX ROUTES

# handles incoming ajax requests and parses them to readable python dictionary


def jsonify_request(data) -> list:
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
        session[get_cookie(request)] = data['username']
        print("NEW ACCOUNT SIGN IN!:", request.form.get("name"), 
              request.cookies, get_cookie(request))
        
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
    if check[0] is True:
        session[get_cookie(request)] = data['username']
    return jsonify(new_data)

# SESSION INITIALIZATION

# Sessions expire when the browser is closed


app.config["SESSION_PERMANENT"] = False
# Store session data in folder instead of ram
app.config["SESSION_TYPE"] = "filesystem"


# get incoming database querry requests from frontend
@app.route('/get_sql_data', methods=['POST', 'GET'])
def get_sql_data():
    data = jsonify_request(request.get_data())
    print('dict json data:', data)

    base = SqlDatabase()
    print('DATA:', data)
    # if the system thinks the sql query is valid, post a complete data object
    if check_sql_data(data) is True:
        new_data = organize_sql_data(base.fetchall(data))
    else:  
        # if the system detects or thinks the query has failed
        new_data = {'failed': True}
    # print(new_data)
    return jsonify(new_data)


@app.route('/get_profile_data', methods=['POST', 'GET'])
def get_profile_data():
    try:
        print(get_cookie(request))
        cookie = session[get_cookie(request)]
    except Exception as e:
        print("THIS IS THE ERROR!:", e)
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
    hits = base.fetchone(f'''SELECT hits FROM UserData 
                         Where USERNAME = "{user}"''')[0]
    print(data['hits'], hits, user)
    hits += data['hits']
    # update the hit column on a player
    update_sql('UserData', 'Hits', hits, 'USERNAME', user)
    update_leaderboard()

    return jsonify({})


@app.route("/world_statistics_data", methods=['POST', 'GET'])
def world_statistics_data():
    base = SqlDatabase()
    hits = base.fetchone("""SELECT MAX(hits) 
                         FROM UserData;""")
    print("MAX HITS:", hits)
    return jsonify({"hits": hits[0]})


@app.route("/world_statistics_data_custom", methods=['POST', 'GET'])
def world_statistics_data_custom():
    update_leaderboard()
    data = jsonify_request(request.get_data())
    print(data)
    return_string = sort_request_sql_data(data)
    base = SqlDatabase()
    d = base.fetchall(return_string)
    sorted = organize_sql_data(d)
    # print(sorted)
    return jsonify(sorted)


@app.route("/record_death", methods=['POST', 'GET'])
def record_death():
    # data = jsonify_request(request.get_data())
    user = None
    try:
        user = get_user_by_cookie(request, session)
        database = SqlDatabase()
        id = database.fetchone(f'''Select UserData.PlayerID From UserData Where
                          USERNAME = "{user}";
                          ''', close=False)
        hasa = database.fetchone(f'''Select PlayerID From Awarded Where
                          PlayerID = {id[0]} AND AwardID = 1;
                          ''', close=True)
        print("HE DOES HAVE:", hasa, id)
        if hasa is None:
            querrey = f"""
                INSERT INTO Awarded
                (AwardID, PlayerID)
                VALUES 
                (1 , {id[0]})
                    """
            database = SqlDatabase()
            database.execute(querrey, close=False)
            database.connection.commit()

    except Exception as e:
        print(e)
        return jsonify({})
    return jsonify({})


@app.route("/record_win", methods=['POST', 'GET'])
def record_win():
    user = None
    print('RECORDING WIN!')
    try:
        # get user cookie
        user = get_user_by_cookie(request, session) 
        print("USER:", user, get_cookie(request))
        database = SqlDatabase()
        medal = database.fetchone(f'''Select Medal FROM UserData
                                   where USERNAME = "{user}"''')
        medal = int(medal[0])
        # check what medal the user has
        # after each win, the medal value increases
        if medal < 11:  # see if at max medal level
            medal += 1
        update_sql("UserData", "Medal", medal, "USERNAME", user)
        print("UPDATED SQL MEDAL DATA!")

        database = SqlDatabase()
        id = database.fetchone(f'''Select UserData.PlayerID From UserData Where
                          USERNAME = "{user}";
                          ''', close=False)
        hasa = database.fetchone(f'''Select PlayerID From Awarded Where
                          PlayerID = {id[0]} AND AwardID = 2;
                          ''', close=True)
        print("HE DOES HAVE:", hasa, id)
        if hasa is None:
            querrey = f"""
                INSERT INTO Awarded
                (AwardID, PlayerID)
                VALUES 
                (2 , {id[0]})
                    """
            database = SqlDatabase()
            database.execute(querrey, close=False)
            database.connection.commit()
    except Exception as e:
        # if user isnt signed in, ignore
        print(e)
        return jsonify({})
    return jsonify({})

# INITATE FLASK SERVER / APP
# leaderboard_update_thread = threading.Thread(target=update_leaderboard_loop)
# leaderboard_update_thread.start()
# update_leaderboard()


if __name__ == '__main__':
    app.run(debug=True)
