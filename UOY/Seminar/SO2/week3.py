# problem 1
# Write an algorithm that returns true if a string contains properly nested and balanced
# parenthesis and false otherwise. The string may contain other characters which should be ignored.
# Optionally, the algorithm can report an error message with the position of the offending
# parenthesis. Your algorithm should use a constant amount of memory, regardless of the length of
# the string.

def bracketChecker(text):
    
    open = 0

    for i in range(len(text)):
        if text[i] == "(":
            open += 1
        if text[i] == ")":
            if open == 0:
                return False
            open -= 1
        
    if open == 0:
        return True
    else:
        return False

# print("(((x))(y))(z) = ", bracketChecker("(((x))(y))(z)")) 
# print("(y)) = ", bracketChecker("(y))")) 
# print(")(x)(  = ", bracketChecker(")(x)(")) 

# problem 2
# A palindrome is a string which is the same forwards and in reverse, e.g. ‘rotator’. Write an
# algorithm which uses the stack data structure to test if a given string is a palindrome.

def palindromeChecker(text):
    tmp = []

    for i in range(len(text)):
        tmp.append(text[len(text)-i-1])

    for i in range(len(text)):
        if tmp[i] != text[i]:
            return False
    
    return True

print("rotator = ", palindromeChecker("rotator"))
print("bradley  = ", palindromeChecker("bradley"))