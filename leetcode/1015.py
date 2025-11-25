class Solution:
    def smallestRepunitDivByK(self, k: int) -> int:
        if k%5==0 or k%2==0:
            return -1
        n = 0
        for length in range(1, k+1):
            n = n*10+1
            if n % k == 0:
                return length
            
            