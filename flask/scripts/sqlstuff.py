import sqlite3 as sql
import os, sys
from warnings import WarningMessage
import pickle


def read_sql_file_for_tables(file):
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

        if item == 'TABLE' and not item2 in tables:
            tables.append(item2)

    #print('TABLES:', tables)
    return tables



class SqlDatabase():
    dumps = []
    def __init__(self, path = 'GameData.db'):
        total_path = os.getcwd() + '\\DataBases\\' + path
        print('THE TOTAL PATH:',total_path)
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
            #item.close()
            del item
        SqlDatabase.dumps = []
        SqlDatabase.dumps.append(self)


    def fetchall(self, command = None, close = True):
        if self.closed == True:
            return []

        if command == None:
            return
        if self.close == True:
            self.close()
        return self.db.execute(command).fetchall()
    
    def fetchone(self, command = None, close = True):
        if self.closed == True:
            return []
        if command == None:
            return
        if self.close == True:
            self.close()
        return self.db.execute(command).fetchone()
    

    def execute(self, command = None, close = True):
        if self.closed == True:
            return []
        if command == None:
            return
        if self.close == True:
            self.close()
        self.db.execute(command)
        self.connection.commit()
        return self.db.lastrowid
    

    def close(self):
        if self.closed == True:
            return
        self.connection.close()
        self.closed = True



def organize_sql_data(data):
    try:
        result = data
        columns = [i[0] for i in SqlDatabase.dumps[-1].db.description]

        #===============TABLES
        tables = {}

        #END TABLES

        dump = SqlDatabase.dumps[-1]
        table_names = SqlDatabase.dumps[-1].tables
        print("DATABASE TABLES:", table_names)

        for item in table_names:
            tables[item] = []
            for keys in dump.db.execute(f"SELECT * FROM pragma_table_info('{item}');").fetchall():
                tables[item].append(keys[1])

        print(tables)


        print_line = ''

        data = {}
        table_rows = []
        column_data = []

        for column in columns:
            print_line += f'{str(column)}{" " * (15 - len(str(column)))} | '
            data[str(column)] = []
            column_data.append(str(column))

        print_line += f'\n{("_" * 18) * len(columns)}\n'
        colum_name = -1
        for item in result:
            table_rows.append([])
            colum_name += 1
            for words in item:
                print_line += f'{str(words)}{" " * (15 - len(str(words)))} | '
                table_rows[colum_name].append(str(words))

            print_line += '\n'

        
        return {'columns' : columns, 'data' : data, 'rows' : table_rows, 'output' : print_line, 'tables' : tables}
    except Exception as e: # if an error, still send something else it will break. we send N/A here
        print(e)
        return {'columns' : ['N/A'], 'data' : 'there is no data', 'rows' : {'N/A':'N/A'},'output' : '', 'tables' : {}}

