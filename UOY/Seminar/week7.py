# kadanes algorithm
# find the biggest sum of contiguous numbers in an unsorted list.

def find_max_sum(nums):
    sumSoFar = []
    bestList = []
    maxSum = nums[0]
    currentSum = nums[0]

    for i in range(len(nums)):
        #print(f"\nnums[i]: {nums[i]}\ncurrentSum: {currentSum}\nmaxSum: {maxSum}\nsumSoFar: {sumSoFar}\nbestList: {bestList}\n")
        sumSoFar.append(nums[i])
        if i == 0:
            continue
        else:
            if nums[i] > nums[i] + currentSum:
                currentSum = nums[i]
                sumSoFar.clear()
                sumSoFar.append(nums[i])
            else:
                currentSum += nums[i]
            if currentSum > maxSum:
                maxSum = currentSum
                bestList = sumSoFar.copy()
    return bestList

print(find_max_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4]))

