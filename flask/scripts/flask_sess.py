from flask import session

def get_cookie(request) -> str: #returns cookie object from front end
    return request.cookies.get('session')

def get_user_by_cookie(request, session) -> str: #get cookie by username
    cookie = get_cookie(request)
    return session[cookie]
