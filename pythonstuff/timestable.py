import random

score = 0

while True:
    numberOne = random.randint(1, 12)
    numberTwo = random.randint(1, 12)
    answer = numberOne * numberTwo
    print(f"{numberOne} x {numberTwo} = ")
    try:
        playerAnswer = int(input())
    except:
        break

    if playerAnswer != answer:
        break

    score += 1

print(f"Game Over\nYour score: {score}")