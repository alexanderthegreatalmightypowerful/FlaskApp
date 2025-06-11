from flask import session



def get_cookie(request):
    return request.cookies.get('session')

def get_user_by_cookie(request, session):
    cookie = get_cookie(request)
    return session[cookie]
