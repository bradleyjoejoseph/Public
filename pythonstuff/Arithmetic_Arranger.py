enter = '\n'

def arithmetic_arranger(problems):# this is the function to arrange it
    sorted_through_problems = 0 # this is the problem sorter
    for problem_working in problems:
        lines = '______'# this is the line between the numbers
        problem_count = len(problems) # this counts how many problems there are
        problem = problems[sorted_through_problems]
        problems_working = problem
        problem_sorted = problems_working.split()
        problem_num1 = int(problem_sorted[0])
        problem_op = problem_sorted[1]
        problem_num2 = int(problem_sorted[2])
        if problem_op == '+':
            problem_answer_str = problem_num1 + problem_num2
            problem_answer = int(problem_answer_str)
        elif problem_op == '-':
            problem_answer = problem_num1 - problem_num2
        problem_num1_count = len(str(problem_num1))
        problem_num2_count = len(str(problem_num2))
        problem_answer_count = len(str(problem_answer))


        if problem_num1_count == 1: # this whole if statment is
            space1 = '     '
        elif problem_num1_count == 2: # to check if you have entered more than 4 numbers
            space1 = '    '
        elif problem_num1_count == 3:
            space1 = '   '
        elif problem_num1_count == 4:
            space1 = '  '
        else:
            print('ERROR : YOU CAN ONLY DO 4 DIGITS') # this exits the code when you enter more than 4
            exit()


        if problem_num2_count == 1: # this is for the second number essentially does the same thing
            space2 = '   '
        elif problem_num2_count == 2:
            space2 = '  '
        elif problem_num2_count == 3:
            space2 = ' '
        elif problem_num2_count == 4:
            space2 = ''
        else:
            print('ERROR : YOU CAN ONLY DO 4 DIGITS')
            exit()


        if problem_answer_count == 1: # this is to count how many numbers there is in the answer and since it is numbericaly
            space3 = '    '
        elif problem_answer_count == 2: # impossible to get a 6 digit number from additon with 4 digits
            space3 = '   '
        elif problem_answer_count == 3:
            space3 = '  '
        elif problem_answer_count == 4:
            space3 = ' '
        elif problem_answer_count == 5:
            space3 = ''
        else:
            print('ERROR : SOMETHING HAS GONE WRONG PLEASE TRY AGAIN') # this is incase you decide to change the code and forget to increase the cap or if something goes wrong
            exit()
        sorted_through_problems = sorted_through_problems + 1
        print(space1,problem_num1,'\n',problem_op+space2,problem_num2,'\n',lines,'\n',space3,problem_answer,enter,enter)

        for problem_working in problems:
            lines = '______'
            problem = problems[sorted_through_problems] # this is the same thing but for it to run four times this is the best
            problems_working = problem # way I know to repeat it
            problem_sorted = problems_working.split()
            problem_num1 = int(problem_sorted[0])
            problem_op = problem_sorted[1]
            problem_num2 = int(problem_sorted[2])
            if problem_op == '+':
                problem_answer_str = problem_num1 + problem_num2
                problem_answer = int(problem_answer_str)
            elif problem_op == '-':
                problem_answer = problem_num1 - problem_num2
            problem_num1_count = len(str(problem_num1))
            problem_num2_count = len(str(problem_num2))
            problem_answer_count = len(str(problem_answer))

            if problem_num1_count == 1:
                space1 = '     '
            elif problem_num1_count == 2:
                space1 = '    '
            elif problem_num1_count == 3:
                space1 = '   '
            elif problem_num1_count == 4:
                space1 = '  '
            else:
                print('ERROR : YOU CAN ONLY DO 4 DIGITS')
                exit()

            if problem_num2_count == 1:
                space2 = '   '
            elif problem_num2_count == 2:
                space2 = '  '
            elif problem_num2_count == 3:
                space2 = ' '
            elif problem_num2_count == 4:
                space2 = ''
            else:
                print('ERROR : YOU CAN ONLY DO 4 DIGITS')
                exit()

            if problem_answer_count == 1:
                space3 = '    '
            elif problem_answer_count == 2:
                space3 = '   '
            elif problem_answer_count == 3:
                space3 = '  '
            elif problem_answer_count == 4:
                space3 = ' '
            elif problem_answer_count == 5:
                space3 = ''
            else:
                print('ERROR : SOMETHING HAS GONE WRONG PLEASE TRY AGAIN')
                exit()
            if problem_count == 5:
                print('ERROR : NO MORE THAN 4 SUMS')
                exit()
            elif problem_count <= sorted_through_problems:
                sorted_through_problems = sorted_through_problems + 1
            print(space1, problem_num1, '\n', problem_op + space2, problem_num2, '\n', lines, '\n', space3, # this prints out the statment
                  problem_answer,enter,enter)

        return problems

arithmetic_arranger(['482 - 1343', '12 + 1782','482 - 1343', '12 + 1342',]) # this is to call on the function any numbers can be put in here apart from decimals 
# and you need spaces otherwise the split doesn't work
