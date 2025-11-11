from random import seed
from random import randint

answeredYet = False
username = str(input("Hi my name is Bob. Nice to meet you! What is your name?\n"))
entranceTuple = (["Great,"], ["Wow,"], ["Cool,"], ["Okay,"])
randomInt = randint(0, 3)
print(str(*entranceTuple[randomInt]), username)
while answeredYet == False:
    question = str(input("So what's up?\n"))
    learnFile = open("learn.txt", "a+")
    learnFile.write(question + "\n")
    