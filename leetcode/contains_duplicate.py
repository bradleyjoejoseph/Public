class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        """
        LeetCode 217: Contains Duplicate
        Difficulty: Easy
        
        Given an integer array nums, return true if any value appears at least twice 
        in the array, and return false if every element is distinct.
        """
        # TODO: Implement this method
        pass

if __name__ == "__main__":
    sol = Solution()
    
    # Test cases
    test_cases = [
        ([1, 2, 3, 1], True),
        ([1, 2, 3, 4], False),
        ([1, 1, 1, 3, 3, 4, 3, 2, 4, 2], True)
    ]
    
    for i, (nums, expected) in enumerate(test_cases):
        result = sol.containsDuplicate(nums)
        assert result == expected, f"Test {i+1} Failed: Got {result}, expected {expected} for {nums}"
        print(f"Test {i+1} Passed!")
    
    print("All tests passed successfully!")
