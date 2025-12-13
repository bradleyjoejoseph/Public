import re
class Solution:
    def validateCoupons(self, code: List[str], businessLine: List[str], isActive: List[bool]) -> List[str]:
        coupons = list(zip(code, businessLine, isActive))
        #returner = []
        businesses = {"electronics": 0, 
            "grocery": 1, 
            "pharmacy": 2, 
            "restaurant": 3
        }
        #for i in range(len(code)):
            #if re.match(r"^[a-zA-Z0-9_]+$", code[i]):
                #returner.append(code[i])
        

        return [
            x for x, y, z in sorted(
                [(x, y, z) for x, y, z in coupons 
                    if re.match(r"^[a-zA-Z0-9_]+$", x) and y in businesses and z
                ],
                key=lambda i: (businesses[i[1]], i[0])
            )
        ]

#learnt alot. how to use filter, then list comphrehension, how to use sort how to use lambda and how to use zip.