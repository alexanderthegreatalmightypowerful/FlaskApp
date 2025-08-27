from .sqlstuff import *
import hashlib


def hash_data(data) -> str:
    """
    Using hash type md5 to hash passwords
    """
    hasher = hashlib.md5(data.encode())
    #hasher.update(data.encode('utf-8'))
    return hasher.hexdigest()

def compare_sign_in(username, password, message) -> tuple:
    """
    when a user attempts a sign in, we have to re-hash the inputed password and compare the hashe
    to the password hash under the inputed username. if no username exists or the hashes dont match, 
    we return an error code and message describing what was incorrect.
    """
    base = SqlDatabase()
    try:
        data = base.fetchone(f"SELECT PASSWORD, USERNAME FROM UserData WHERE USERNAME == '{username}';")
        print('THE DATA IS:', data)
        has = hash_data(password)
        #print(data[0], has)
        if data[1] == username and data[0] == has:
            return (True, message)
        if data == None or data[0] != has:
            message = 'Wrong username or password'
            print('MESSAGE:', message)
            return (False, message)
    except Exception as e:
        print("SIGN IN ERROR:", e)
        message = f'{e}'
        print('MESSAGE:', message)
        return (False, message)

    return (False, message)

def make_new_account(username, password, message) -> tuple:
    """
    when creating a new account, we have some rules to put in place:
    no spaces in username or password, not more than 16 characters (for username), no less than 6 characters,
    no more than 30 character (for password). We check the length of the passwords here in the backened because
    it is possible to exploit the frontend to bypass the maxiumum amount of characters leading to a database bomb where
    the user inputs an increadibly large number of character, filling up the backend ram and databases size.
    """

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
