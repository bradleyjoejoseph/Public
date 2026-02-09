# problem 1
# Two words are anagrams of each other if they contain the same letters that are
# arranged in different orders. Write the pseudocode for a recursive function
# isAnagram that can identify if two given words are anagrams of each other.
# isAnagram (word, anagram):
# 	If word.length != anagram.length
# 		Return false
# 	If word == anagram or word.length == 0:
# 		Return true
	
# 	Letter = word[0]
# 	If letter is not in anagram
# 		Return false
# 	Return isAnagram(word, anagram.removeonlyfirst(letter))

def isAnagram(word, anagram):
    if len(word) != len(anagram):
        return False
    if word == anagram or len(word) == 0:
        return True
    
    letter = word[0]


    if letter not in anagram:
        return False
    
    firstIndex = anagram.index(letter)

    return isAnagram(word[1:], anagram[:firstIndex]+anagram[firstIndex+1:])


# problem 2
# function sum1(n: int): long
# total = 0
# for i := 0 to n-1 do
# total = total + 1
# endfor
# return total
# but in python

def sum1(n):
    total = 0
    for i in range(n):
        total += 1
    return total

print(sum1(3))

# # problem 3
# function sum2(n: int): long
# total = 0
# for i := 0 to n-1 do
# for j := 0 to (n*n)-1 do
# total = total + 1
# endfor
# endfor
# return total

def sum2(n):
    total = 0
    for i in range(n):
        for j in range(n*n):
            total +=1
    return total

print(sum2(3))

# problem 4
# function sum3(n: int): long
# total = 0
# for i := 0 to n-1 do
# for j := 0 to (i*i)-1 do
# if (j mod i == 0)
# for k := 0 to j-1 do
# total = total + 1
# endfor
# endif
# endfor
# endfor
# return total

def sum3(n):
    total = 0
    for i in range(n):
        for j in range(i*i):
            if (j % i ==0):
                for k in range(j):
                    total += 1
    return total