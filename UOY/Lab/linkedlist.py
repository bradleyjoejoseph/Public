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
