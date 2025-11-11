import csv
import random

path = __file__.replace("main.py", "")
file = open(path + "users.csv", "r+")
writer = csv.writer(file)
header = next(file)
logged = False

answer = input("Sign up or Log in? (sign/log)\n")
if answer == "sign":
    username = input("Username: ")
    password = input("Password: ")
    answer = input("Confirm Password: ")
    while answer != password:
        print("Passwords do not match")
        password = input("Password: ")
        answer = input("Confirm Password: ")
    writer.writerow([username, password, 0])
    logged = True
    PB = 0
elif answer == "log":

    username = input("Username: ")
    password = input("Password: ")



    for line in file:
        if username in line:
            if password in line:
                print("Hey there " + username + ", you have been logged in!")
                logged = True
                PB = line.replace("]", "").replace("\"", "").replace("\\", "").replace("n", "").replace("'", "").split(",")[2]
                break
            else:
                print("Your password is incorrect. Please start again.")
                exit()

if logged != True:
    try:
        print("User " + username + " is not found. Please try again or make an account.")
        exit()
    except:
        print("Something went wrong please try again.")
        exit()
file.close()


songFile = open(path + "songs.csv", "r")
csvreader = csv.reader(songFile)
header = next(csvreader)
rows = [row for row in csvreader]

score = 0

while True:
    randomSongID = str(random.randint(1, 603))
    for row in rows:
        if randomSongID == row[0]:
            randomSong = row[1]
            actualSong = randomSong
            artist = row[2]
            randomSong = randomSong.split(" ")

            for i in range(len(randomSong)):
                randomSong[i] = randomSong[i][0] + (len(randomSong[i]) - 1) * "_"
            print(actualSong)# -- uncomment this for answer while playing
            randomSong = " ".join(randomSong)
            answer = input(randomSong + " By " + artist+ "\n" + randomSong[0])

            if answer != actualSong[1:]:
                print("You have got it incorrect once. You have one more chance here is a hint.")
                hint = list(actualSong[::2])
                hint = "_".join(hint)
                print(hint)
                answer = input(randomSong[0])
                if answer != actualSong[1:]:
                    print("\n" + ("-" * (len(actualSong) + 25)) + "\n\nThe song name was:", actualSong)
                    print("You lost " + username + ". Your score was", score)
                    if score > int(PB):
                        print("New highscore: " + str(score) + ". Your old one was", PB)
                        file = open(path + "users.csv", "r+")
                        writer = csv.writer(file)
                        header = next(file)
                        rows = []
                        for row in file:
                            row = row.split(",")
                            if row[0] == username:
                                row[2] = score
                            rows.append(row)
                        file.close()
                        wr = open(path + "users.csv", "w")
                        w = csv.writer(wr, quoting=csv.QUOTE_NONE,escapechar='\t')

                        w.writerow([header.replace("\n", "").replace("\"", " ")])
                        for i in range(len(rows)):
                            w.writerow(rows[i])
                    exit()
                else:
                    score += 5
                    break
            else:
                score += 10

                break
    print("\n\n")

