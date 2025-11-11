import random
import csv

cmds = " /gen - Generates passwords\n /show - Shows all passwords\n /quit - Exits the program\n"
print("Password Generator Version Alpha 0.45")
path = "Python/password_gen/"
while True:
    choice = input("Type /cmds for list of all commands, type /quit to exit\n")  
    if choice == "/cmds":
        print(cmds)
    if choice == "/show":
        file = open(path + "passwords.csv", "r")
        csv_reader = csv.reader(file, delimiter=",")
        count = 0
        for row in csv_reader:
            table = BeautifulTable()
            #here

            if count == 0:
                table.column_headers = (row[0], row[1])
            else:
                print(row[0] + " | " + row[1])
            count += 1
        print(table)
    if choice == "/quit":
        exit()
    if choice == "/gen":
        lowChars = "abcdefjhijklmnopqrstuvwxyz"
        upChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        symbolChars = "!@£$%^&*.?"
        numberChars = "0123456789"

        try:
            lengthOfPassword = int(input("How long should your password be? (In integers)\n"))
            lowsBool = True if input("Should it contain lowercase letters? (Y/N)") == "Y" else False
            capsBool = True if input("Should it contain capital letters? (Y/N)") == "Y" else False
            symbolsBool = True if input("Should it contain symbols? (Y/N)") == "Y" else False
            numbersBool = True if input("Should it contain numbers? (Y/N)") == "Y" else False
        except:
            print("Input invalid. Please try again.")
            exit()
        bools = [lowsBool, capsBool, symbolsBool, numbersBool]
        password = ""
        for i in range(lengthOfPassword):
            while True: 
                charChoice = random.randint(1,4) - 1
                if bools[charChoice] == True:
                    break
            if charChoice == 0:
                password += random.choice(lowChars)
            if charChoice == 1:
                password += random.choice(upChars)
            if charChoice == 2:
                password += random.choice(symbolChars)
            if charChoice == 3:
                password += random.choice(numberChars)

        print("\nYour password is", password, "\nIt is", lengthOfPassword, "characters long.", "\nLowercase:", bools[0], "\nCapitals:", bools[1], "\nSymbols:", bools[2], "\nNumbers:", bools[3])
        choice = True if input("Would you like to save this to file? (Y/N)") == "Y" else False
        purpose = input("What website or application is this password for? (See all in /show)")
        file = open(path + "passwords.csv", "a")
        file.write(purpose)
        file.write(",")
        file.write(password)
        file.write("\n")
        file.close()