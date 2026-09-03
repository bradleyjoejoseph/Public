class Solution:
    def uniformArray(self, nums1: list[int]) -> bool:
        if min(nums1) % 2 != 0 or all(i % 2 == 0 for i in nums1):
            return True
        return False
            