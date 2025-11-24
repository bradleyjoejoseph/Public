import math


class Vector:
    def __init__(self, *data):
        if len(data) == 0:
            self._vector = []
        elif len(data) == 1 and type(data[0]) == list:
            self._vector = [float(x) for x in data[0]]
        else:
            self._vector = [float(x) for x in data]
    def __str__(self):
        if self._vector == None:
            return "<>"
        return '<' + ", ".join([str(i) for i in self._vector]) + '>'
    
    def __getitem__(self, index):
        return self.get(index)
    
    def __setitem__(self, index, value):
        return self.set(index, value)
    
    def __rmul__(self, scalar):
        return self.scalar_product(scalar)
    
    def __add__(self, other_vector):
        return self.add(other_vector)
    
    def __eq__(self, other_vector):
        return self.equals(other_vector)

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

