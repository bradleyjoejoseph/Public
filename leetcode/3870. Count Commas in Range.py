class Solution:
    def countCommas(self, n: int) -> int:
        return n - 1000 + 1 if n >= 1000 else 0