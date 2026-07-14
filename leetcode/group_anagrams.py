class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        """
        LeetCode 49: Group Anagrams
        Difficulty: Medium
        
        Given an array of strings strs, group the anagrams together. 
        You can return the answer in any order.
        """
        # TODO: Implement this method
        pass

if __name__ == "__main__":
    sol = Solution()
    
    # Test cases
    test_cases = [
        (
            ["eat", "tea", "tan", "ate", "nat", "bat"],
            [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]
        ),
        ([""], [[""]]),
        (["a"], [["a"]])
    ]
    
    for i, (strs, expected) in enumerate(test_cases):
        result = sol.groupAnagrams(strs)
        # Normalize nested lists to compare sets of frozen sets or sorted arrays
        norm_result = sorted([sorted(x) for x in result])
        norm_expected = sorted([sorted(x) for x in expected])
        assert norm_result == norm_expected, f"Test {i+1} Failed: Got {result}, expected {expected} for strs={strs}"
        print(f"Test {i+1} Passed!")
    
    print("All tests passed successfully!")
