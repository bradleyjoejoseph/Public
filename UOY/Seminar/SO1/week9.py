import math

coins = [2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01]
def minCoins(m):
    count = 0
    for i in range(len(coins)):
        if m < coins[i]:
            pass
        count += math.floor(m / coins[i])
        m = m % coins[i]
    return count

print(minCoins(3.58)) # should return 6
print(minCoins(23.88))