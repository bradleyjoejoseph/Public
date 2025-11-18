def sum_all(nums):
    total = 0

    for i in range(len(nums)):
        temp = nums[i]
        if type(temp) == list:
            # print(nums)
            temp = sum_all(temp)
        total += temp

    return total

# print(sum_all([1,[2,[3,[4]]]]))
# answer is 10 program outputs 10
# got told it wasnt proper recursion

def sum_alll(nums):
    if len(nums) == 0:
        return 0
    if type(nums[0]) == int:
        return nums[0] + sum_alll(nums[1:])
    else:
        return sum_alll(nums[0]) + sum_alll(nums[1:])
    

print(sum_alll([1,[2,[3,[4]]]]))
# made another solution same stuff but proper recursion