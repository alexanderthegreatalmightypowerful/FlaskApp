from .sqlstuff import SqlDatabase, update_sql
import time


def update_leaderboard() -> None:
    """
    this function sorts the ranks of the users by how many hits
    they have. The more hits they have, the higher their rank is

    user with the highest rank gets the goat achievement
    """
    names = {}
    base = SqlDatabase()
    data = base.fetchall("SELECT USERNAME, hits FROM UserData", close=True)
    print(data)
    for item in data:
        name = item[0]
        hits = item[1]
        names[name] = hits

    sorted_items = sorted(names.items(), key=lambda item: item[1],
                          reverse=True)
    
    sorted_dict = dict(sorted_items)
    print(sorted_dict)

    for rank, name in enumerate(sorted_dict.keys()):
        print(name, rank + 1)
        update_sql('UserData', 'rank', rank + 1, 'USERNAME', name)


def update_leaderboard_loop() -> None:
    # while True:
    update_leaderboard()
    time.sleep(60)