from .sqlstuff import *
import hashlib


def hash_data(data):
    hasher = hashlib.md5(data.encode())
    #hasher.update(data.encode('utf-8'))
    return hasher.hexdigest()


def compare_sign_in(username, password, message):
    base = SqlDatabase()
    try:
        data = base.fetchone(f"SELECT PASSWORD, USERNAME FROM UserData WHERE USERNAME == '{username}';")
        print('THE DATA IS:', data)
        has = hash_data(password)
        #print(data[0], has)
        if data == None or data[0] != has:
            message = 'Wrong username or password'
            print('MESSAGE:', message)
            return (False, message)
    except Exception as e:
        print("SIGN IN ERROR:", e)
        message = f'{e}'
        print('MESSAGE:', message)
        return (False, message)

    return (True, message)


def make_new_account(username, password, message):
    if len(username) > 16:
        message = 'The UserName has to be 16 chars max'
        return (False, message)
    elif len(username) < 1:
        message = 'You must fill in the username input'
        return (False, message)
    elif username.count(' ') > 0:
        message = "Not allowed spaces in username"
        return (False, message)
    elif password.count(' ') > 0:
        message = "Not allowed spaces in password"
        return (False, message)
    elif len(password) > 30:
        message = 'The Password has to be 30 chars max'
        return (False, message)
    elif len(password) < 6:
        message = 'The Password has to be abouve 5 chars'
        return (False, message)

    base = SqlDatabase()
    data = len(base.fetchall("Select * From UserData", close = False))

    querrey = f"""
INSERT INTO UserData
(PlayerID, USERNAME, Money, Medal, Hits, Rank, PASSWORD, Wins, Achievements, Picture) 
VALUES 
({data + 1}, '{username}', 20, 0, 0, 1000, "{hash_data(password)}", 0, 0, 0)    
    """

    try:
        base.execute(querrey, close=False)
        base.connection.commit()
        base.close()
    except:
        message = 'Username already taken'
        return (False, message)
    
    print("MADE NEW ACCOUNT!")
    return (True, message)
