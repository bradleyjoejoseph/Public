class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        """
        LeetCode 242: Valid Anagram
        Difficulty: Easy
        
        Given two strings s and t, return true if t is an anagram of s, 
        and false otherwise.
        
        An Anagram is a word or phrase formed by rearranging the letters of a 
        different word or phrase, typically using all the original letters exactly once.
        """
        # TODO: Implement this method
        pass

if __name__ == "__main__":
    sol = Solution()
    
    # Test cases
    test_cases = [
        ("anagram", "nagaram", True),
        ("rat", "car", False)
    ]
    
    for i, (s, t, expected) in enumerate(test_cases):
        result = sol.isAnagram(s, t)
        assert result == expected, f"Test {i+1} Failed: Got {result}, expected {expected} for s={s}, t={t}"
        print(f"Test {i+1} Passed!")
    
    print("All tests passed successfully!")
