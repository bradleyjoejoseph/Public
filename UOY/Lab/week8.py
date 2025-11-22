import math

# class Circle:
#     def __init__(self, centre, radius):
#         self.centre = centre
#         self.radius = radius
    
#     def getArea(self):
#         return math.pi * self.radius**2
#     def getPerimeter(self):
#         return math.pi * self.radius * 2

class Vector:
    def __init__(self, data = None):
        if data != None:
            self._vector = [float(x) for x in data]
        else:
            self._vector = []
    def __str__(self):
        if self._vector == None:
            return "<>"
        return '<' + ", ".join([str(i) for i in self._vector]) + '>'
    def dim(self):
        if len(self._vector) == 0:
            return 0
        return len(self._vector)
        
    def get(self, index):
        if index == -1:
            return self._vector
        return self._vector[index]
    def set(self, index, value):
        self._vector[index] = value
    
    def scalar_product(self, scalar):
        return Vector([x * scalar for x in self._vector])
    
    def add(self, other_vector):
        if type(other_vector) != Vector:
            raise TypeError("Not a vector")
        if self.dim() != other_vector.dim():
            raise ValueError("not matching dimensions")
        return Vector([x + y for x, y in zip(self._vector, other_vector.get(-1))])
        
    def equals(self, other_vector):
        if type(other_vector) != Vector:
            return False

        if self.dim() != other_vector.dim():
            return False
        
        if False in [x == y for x, y in zip(self._vector, other_vector.get(-1))]:
            return False
        return True

# v = Vector([1, 2, 3])
# empV = Vector()

# print(v) # should print <1, 2, 3>
# print(empV) # should print <>
# print(v.dim()) # should print 3
# print(v.get(1)) # should print 2
# v.set(2, 4)
# print(v.get(2)) # should print 4
# print(v.scalar_product([3, 2, 3])) # should print <3, 4, 12>
# print(v.add([2, 3, 4])) # should print <3, 5, 8>
# print(v.equals([1, 2, 4]), v.equals([1, 2, 3])) # should print True False