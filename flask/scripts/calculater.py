import re, string, threading, time, sys


def log_error(error = "Null"):
    print(f"\n>>ERROR: {error}")


def calculate(inp):
    #get rid of any unwanted chars
    listed = list(inp)
    wanted_chars = list("1234567890.+-*/")
    special_symbols = list(".-+/*")
    before_char = None
    addition_string = ''
    finish_count = False

    for item in listed:
        if not item in wanted_chars:
            continue
        if item in special_symbols:
            if item == "*" and before_char == '/':
                continue
            elif item == '/' and before_char in ('-', "+", "*"):
                continue
            elif item == '*' and finish_count == False and before_char == item:
                finish_count = True
            elif before_char == item and item != '-':
                finish_count = False
                continue
            elif before_char == '*' and item == '/':
                continue

        addition_string += item
        before_char = item

    if addition_string == "":
        log_error("The Input Didn't Have Any Valid Equation")
        return

    before_char = None
    length = len(addition_string)
    counter = 0
    len_counter = 0
    wanted_chars = list("0123456789.")
    testing = addition_string.replace('/-', 't').replace('--', 'y').replace('+', 'q').replace('-', 'w').replace('/', 'e').replace('*', 'r')
    te = addition_string.replace('/-', 'p').replace('--', 'p').replace('+', 'p').replace('-', 'p').replace('/', 'p').replace('*', 'p')
    testing_array = te.split('p')
    is_divide = False
    #print(testing_array)

    for key in list(testing):
        if testing_array[counter].count('.') > 1:
            log_error('Wrong Number Input Detected')
            return

        if key in ("q", "w", "r", "y"):
            counter += 1
            is_divide = False
        elif key == 'e' or key == 't':
            is_divide = True
            counter += 1
        else:
            is_divide = False

        #print("float:",float(testing_array[counter]))
        if testing_array[counter].count('.') > 1:
            log_error('Decimal Input Error')
            return

        if testing_array[counter].startswith('0'):
            bef = None
            decimal = False
            for item in list(testing_array[counter]):
                if item == '.':
                    decimal = True
                    break
                if item != '0' and bef == "0" and decimal == False:
                    log_error('Octo Equation Error')
                    return

                bef = item

        if testing_array[counter] != '' and float(testing_array[counter]) in (0, 0.0, -0, -0.0) and is_divide == True:
            log_error('Tried Dividing By Zero')
            return

        before_char = key
        len_counter += 1

    for item in special_symbols:
        addition_string = addition_string.strip(item)

    if addition_string == "":
        log_error("The Input Didn't Have Any Valid Equation")
        return

    print('Before:', inp, ",After:", addition_string)
    print(f'ANSWER: {eval(addition_string)}')

    return eval(addition_string)