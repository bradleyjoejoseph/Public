from linkednode import LinkedNode

class LinkedList:

    def __init__(self):
        self._front = None
        self._tail = None
        self._size = 0


    def __str__(self):
        if self._front is None:
            return 'LinkedList([])'
        else:
            return 'LinkedList([' + str(self._front) +'])'


    def __len__(self):
        """ 
        Rather than traversing the list from front to end, it is better to have an attribute _size
        that is updated every time we add or remove an element.
        The code below shows you how to traverse a linked list, from start to end. 
        To traverse the list, we need to use a local variable <currentnode> to move along the list, 
        we must not change/move the pointer _front.
            count = 0
            currentnode = self._front
            while currentnode is not None:
                count += 1
                currentnode = currentnode._next

        """        
        return self._size

    def append(self, value):
        newnode = LinkedNode(value)
        if self._front is None:
            self._front = newnode
            self._tail = newnode
        else:
            self._tail.tail = newnode
            self._tail = newnode

        self._size += 1

    def pop(self):
        if self.isempty():
            raise IndexError('The list is empty.')
        
        front_node = self._front
        self._front = self._front.tail
        front_node.tail = None
        self._size -= 1
        return front_node.data

    def clear(self):
        self._front = None
        self._tail = None
        self._size = 0
    
    def index(self, value, start=0, stop=2147483647):
        item = self._front
        for i in range(self._size):
            if item._data == value:
                return i 
            item = item._next
        
        raise ValueError(f"{value} is not in the list")
    
    def insert(self, index, object):
        if index < 0 or index > self._size:
            raise IndexError("out of ranage")
        nodey = LinkedNode(object)

        if index == 0:
            nodey._next = self._front
            self._front = nodey
            if self._size == 0:
                self._tail = nodey
        elif index == self._size:
            self._tail._next = nodey
            self.tail = nodey
        else:
            item = self._front
            for i in range(index-1):
                item = item._next
            nodey._next = item._next
            item._next = nodey
    
    def remove(self, value):
        if not value:
            raise ValueError("no value")
        

        self._size += 1