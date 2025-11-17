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

