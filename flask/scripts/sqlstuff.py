import sqlite3 as sql
import os

class SqlDatabase():
    dumps = []
    def __init__(self, path = 'CodingLanguages.db'):
        total_path = os.getcwd() + '\\flask\\DataBases\\' + path
        print(total_path)
        self.connection = sql.connect(total_path)
        self.db = self.connection.cursor()
        for item in SqlDatabase.dumps:
            #item.close()
            del item
        SqlDatabase.dumps = []
        SqlDatabase.dumps.append(self)
        self.closed = False

    def fetchall(self, command = None, close = True):
        if command == None:
            return
        if self.close == True:
            self.close()
        return self.db.execute(command).fetchall()
    

    def close(self):
        if self.closed == True:
            return
        self.connection.close()
        self.closed = True

