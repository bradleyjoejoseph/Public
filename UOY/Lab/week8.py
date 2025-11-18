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
        return Vector()

v = Vector([1, 2, 3])
empV = Vector()

print(v, empV, v.dim())