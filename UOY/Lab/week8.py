import math

class Circle:
    def __init__(self, centre, radius):
        self.centre = centre
        self.radius = radius
    
    def getArea(self):
        return math.pi * self.radius**2
    def getPerimeter(self):
        return math.pi * self.radius * 2

class Vector:
    def __init__(self, data = None):
        self.data = data
    def __str__(self):
        if self.data == None:
            return "<>"
        self.data = [str(i) for i in self.data]
        return '<' + ", ".join(self.data) + '>'
    def dim(self):
        return len(self.data)
    def get(self, index):
        return self.data[index]
    def set(self, index, value):
        self.data[index] = value
    
    def scalar_product(self, scalar):
        return Vector([int(x) * y for x, y in zip(self.data, scalar)])

v = Vector([1, 2, 3])
empV = Vector()

print(v) # should print <1, 2, 3>
print(empV) # should print <>
print(v.dim()) # should print 3
print(v.get(1)) # should print 2
v.set(2, 4)
print(v.get(2)) # should print 4
print(v.scalar_product([3, 2, 3])) # should print <3, 4, 12>