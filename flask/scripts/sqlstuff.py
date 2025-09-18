import sqlite3 as sql
import os


def read_sql_file_for_tables(file) -> list:
    """
    to detect and find tables in sql, we have to manualy read 
    through the raw data and search for
    key words like 'sqlitestudio_temp_table' which means the 
    table name is straight after this key word.
    """

    with open(file, 'rb') as reader:
        read = str(reader.read())

    splitter = read.split(' ')

    tables = []

    for index in range(len(splitter)):
        item = splitter[index]
        if index + 1 >= len(splitter):
            break
        item2 = splitter[index + 1]
        if item2.startswith('sqlitestudio_temp_table('):
            continue

        if item == 'TABLE' and item2 not in tables:
            tables.append(item2)

    # print('TABLES:', tables)
    return tables


class SqlDatabase():
    """
    Since the website is primarly built for a database, to make it easier 
    to load data through many functions
    we can use a self cleaning up class that simplifies and takes care
    of systems like cleanup.
    """
    dumps = []  # public class object for active database classes (for cleanup)

    # what will first happened when the class object is created
    def __init__(self, path='GameData.db'):
        total_path = os.getcwd() + '\\DataBases\\' + path
        print('THE TOTAL PATH:', total_path)
        self.tables = []
        try:
            self.connection = sql.connect(total_path)
            self.db = self.connection.cursor()
            self.closed = False
            self.tables = read_sql_file_for_tables(total_path)
        except Exception as e: 
            self.closed = True
            print('SQL FAILED TO CONNECT:', e)
        
        for item in SqlDatabase.dumps:
            try:
                if item.closed is False:
                    item.close()
            except Exception: 
                pass

            del item  # clean up existing active unused database classes
        SqlDatabase.dumps = []
        SqlDatabase.dumps.append(self)

    # fetches every value returned from the sql querey

    def fetchall(self, command=None, close=True) -> tuple:
        """
        in most cases, we only need to use one command to 
        get what we want from the database
        so the close varaibale is set to 'True' by default 
        so when you call function sto extract or append data
        to the database, it will close the tunnel automaticly 
        (if close's value is unchanged).
        """

        if self.closed is True:
            return []

        if command is None:
            return
        if self.close is True:
            self.close()
        return self.db.execute(command).fetchall()
    
    # fetches the first value from querey
    def fetchone(self, command=None, close=True) -> tuple:
        if self.closed is True:
            return []
        if command is None:
            return
        if self.close is True:
            self.close()
        return self.db.execute(command).fetchone()
    
    # execute command allows any querey to be executed.
    def execute(self, command=None, close=True):
        if self.closed is True:
            return []
        if command is None:
            return
        if self.close is True:
            self.close()
        self.db.execute(command)
        self.connection.commit()
        return self.db.lastrowid  # returns cursor data
    
    # closes database (can be called manualy or automaticly 
    # by querey functions)
    def close(self):
        if self.closed is True:
            return
        self.connection.close()
        self.closed = True


def organize_sql_data(data) -> dict: 
    """
    like the function suggests, we organize a returned sql querey from the 
    SqlDatabase class.
    To easily make display tables in html, we have to send a readible, 
    easily interperated dictionary, 
    where the javascript in the front end can convert the organised data 
    in clean html tables.
    """

    try:
        result = data
        # extract columns from sql class
        columns = [i[0] for i in SqlDatabase.dumps[-1].db.description]

        #  ===============TABLES
        tables = {}

        # END TABLES

        dump = SqlDatabase.dumps[-1]
        table_names = SqlDatabase.dumps[-1].tables
        print("DATABASE TABLES:", table_names)

        for item in table_names:
            tables[item] = []
            for keys in dump.db.execute(f"""SELECT * 
                                        FROM pragma_table_info('{item}');
                                        """).fetchall():
                tables[item].append(keys[1])

        # print(tables)

        print_line = ''

        data = {}
        table_rows = []
        column_data = []

        for column in columns:
            print_line += f'{str(column)}{" " * (15 - len(str(column)))} | '
            data[str(column)] = []
            column_data.append(str(column))
        # prepares a string that will be printed into console for visualization
        print_line += f'\n{("_" * 18) * len(columns)}\n'
        colum_name = -1
        for item in result:
            table_rows.append([])
            colum_name += 1
            for words in item:
                print_line += f'{str(words)}{" " * (15 - len(str(words)))} | '
                table_rows[colum_name].append(str(words))

            print_line += '\n'
        # return a succesfull table request object
        return {'columns': columns, 'data': data, 'rows': table_rows, 
                'output': print_line, 'tables': tables, 'failed': False}
    except Exception as e:
        print(e)
        # if an error, still send something else it will break. we send N/A
        # send a failed table request object
        return {'columns': ['N/A'], 'data': 'there is no data', 
                'rows': {'N/A': 'N/A'}, 'output': '', 
                'tables': {}, 'failed': True}


# update something in the database
def update_sql(table, name, value, where, what) -> None:
    # we add extra parenthasies so when it is formated in string
    # it keeps its string properties
    if type(value) is str:
        value = f"'{value}'"
    if type(what) is str:
        what = f'"{what}"'
    base = SqlDatabase()
    base.execute(f'UPDATE {table} SET {name} = {value} WHERE {where} = {what}')


def check_sql_data(data: str) -> bool:  # check for malisouse inputs
    splitz = data.lower().split(' ')
    if "insert" in splitz:
        return False
    if '*' in list(data):
        return False
    if 'password' in splitz:
        return False

    return True


def get_profile_info(profile) -> dict:
    db = SqlDatabase()
    data = {"name": profile, "failed": False}
    data['rank'] = db.fetchone(f"""Select Rank FROM UserData 
                               WHERE USERNAME = '{profile}';""", 
                               close=False)[0]
    print('PASSED')
    data['hits'] = db.fetchone(f"""Select Hits FROM UserData 
                               WHERE USERNAME = '{profile}';""",
                               close=False)[0]
    data['medals'] = db.fetchall(f"""Select Medal From Medals Where Medals.ID 
                                 = (Select Medal FROM UserData 
                                 WHERE USERNAME = '{profile}');""", 
                                 close=False)[0]
    
    data['achievements'] = db.fetchall(f"""Select Achievement 
                                          From Achievements Where 
                                          (ID In (Select AwardID From Awarded 
                                          Where 
                                          PlayerID = (Select PlayerID From
                                           UserData Where 
                                          USERNAME = '{profile}')));""", 
                                       close=False)
    
    data['picture'] = db.fetchall(f"""Select Picture FROM UserData 
                                  WHERE USERNAME = '{profile}';""", 
                                  close=True)[0]
    
    return data


def sort_request_sql_data(data) -> str:
    final = """Select UserData.rank, UserData.USERNAME, 
    UserData.hits From UserData """

    # generates medals join querey
    if data['medals'] != []:
        medals = ''  # Where UserData.Medal =

        for i, item in enumerate(data['medals']):
            if i == 0:
                medals += f'Where (UserData.Medal = {item}'
            else:
                medals += f' Or UserData.Medal = {item}'

        medals += ')'

        print("MEDALS:", medals)
        final += medals
    # generates many to many querey
    if data['achievements'] != []:
        if data['medals'] != []:
            ach = ' And '
        else:
            ach = " Where "
        for i, item in enumerate(data['achievements']):
            if i == 0:
                ach += f''' ( PlayerID In (Select PlayerID From Awarded Where 
                AwardID = (Select ID From Achievements Where 
                Achievement = "{item}"))'''
            else:
                ach += f''' OR PlayerID In (Select PlayerID From Awarded 
                Where AwardID = (Select ID From Achievements Where 
                Achievement = "{item}"))'''

        ach += ')'

        print("ACHIEVEMENTS:", ach)
        final += ach
    # find a range of hits
    if len(data['hits']) > 1:
        if data['medals'] != [] or data['achievements'] != []:
            hit = ' And '
        else:
            hit = " Where "

        hit += f""" (UserData.hits >= {data['hits'][0]} 
        And UserData.hits <= {data['hits'][1]}) """

        final += hit
    
    final += 'ORDER BY UserData.rank ASC;'
    print("FINAL:", final)
    return final
