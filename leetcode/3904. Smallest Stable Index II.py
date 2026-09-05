class Solution:
    def firstStableIndex(self, nums: list[int], k: int) -> int:
        prefMax = [None] * len(nums)
        sufMin = [None] * len(nums)
        for i in range(len(nums)):
            if (i == 0):
                prefMax[0] = nums[0]
                sufMin[-1] = nums[-1]
            else:
                prefMax[i] = max(nums[i], prefMax[i-1])
                sufMin[-1-i] = min(nums[-1-i], sufMin[-i])
        
        for i in range(len(nums)):
            if prefMax[i] - sufMin[i] <= k:
                return i

        return -1
