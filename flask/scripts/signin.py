from .sqlstuff import *
import hashlib

def compare_sign_in():
    pass


def make_new_account(username, password):
    base = SqlDatabase()

    querrey = f"""
INSERT INTO UserData
(PlayerID, USERNAME, Money, Medal, Hits, Rank, PASSWORD, Wins, Achievements, Picture) 
VALUES 
(1, 'BOB', 20, 0, 0, 1000, "beans", 0, 0, 0)    
    """

    base.execute(querrey, close=False)
    base.connection.commit()

    print("MADE NEW ACCOUNT!")
    return username
