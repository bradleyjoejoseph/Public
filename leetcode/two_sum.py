class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        """
        LeetCode 1: Two Sum
        Difficulty: Easy
        
        Given an array of integers nums and an integer target, return indices of 
        the two numbers such that they add up to target.
        
        You may assume that each input would have exactly one solution, and you 
        may not use the same element twice.
        
        You can return the answer in any order.
        """
        # TODO: Implement this method
        pass

if __name__ == "__main__":
    sol = Solution()
    
    # Test cases
    test_cases = [
        ([2, 7, 11, 15], 9, [0, 1]),
        ([3, 2, 4], 6, [1, 2]),
        ([3, 3], 6, [0, 1])
    ]
    
    for i, (nums, target, expected) in enumerate(test_cases):
        result = sol.twoSum(nums, target)
        # Sort output to allow comparison regardless of order
        assert sorted(result) == sorted(expected), f"Test {i+1} Failed: Got {result}, expected {expected} for nums={nums}, target={target}"
        print(f"Test {i+1} Passed!")
    
    print("All tests passed successfully!")
