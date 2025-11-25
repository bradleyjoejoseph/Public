class LinkedNode:

    def __init__(self, data=None, next= None):
        self._data = data
        if next is None or isinstance(next, LinkedNode):
            self._next = next
        else:
            raise TypeError('Node type object expected!')
        

    def __str__(self):
        """
        Note, this is a recursive method (implicit via str()). As you can see
        recursion can be used for linked data structures.
        """
        if self._data is None:
            return ''
        elif self._next is None:
            return str(self._data)
        else:
            return str(self._data) + ', ' + str(self._next)

    def __eq__(self, other):
        if not isinstance(other, LinkedNode):
            return False
        else:
            return self.data == other.data and self._next == other._next 


    @property
    def data(self):
        return self._data

    @data.setter
    def data(self, value):
        self._data = value

    @property
    def tail(self):
        return self._next

    @tail.setter
    def tail(self, node):
        if node is None or isinstance(node, LinkedNode):
            self._next = node
        else:
            raise TypeError('Node type object expected!')
