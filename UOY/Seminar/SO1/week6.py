import math

def find_pair(l, t):
    output = []
    for i in range(math.floor(len(l) / 2)):
        j = t - l[i]
        temp = l.copy()
        temp.remove(l[i])
        if j in temp:
            output.append((l[i], j))
    
    return output

print(find_pair([-1, 1, 2, 4, 8], 7))
print(find_pair([2, 4, 5, 7], 9))
print(find_pair([2, 4, 5, 7], 8))