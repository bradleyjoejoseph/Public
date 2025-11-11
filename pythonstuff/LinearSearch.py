theList = []
numOfVars = int(input("How many values would you like to enter into the list?\n"))

for i in range(numOfVars):
    theList.append(input(f"Value {str(i + 1)}: "))

searchFor = input("What would you like to search for?\n")

for i in range(len(theList)):
    if searchFor == theList[i]:
        print(f"'{searchFor}' has been found")
        exit()
print(f"'{searchFor}' has not been found")
