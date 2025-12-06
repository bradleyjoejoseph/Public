from linkednode import LinkedNode

class LinkedStack:

    def __init__(self):
        self._top = None
        self._size = 0
    
    def push(self, value):
        nodey = LinkedNode(value, self._top)
        self._top = nodey
        self._size += 1
    
    def __str__(self):
        items = []
        item = self._top
        while item != None:
            items.append(item._data)
            item = item._next
        return f"LinkedStack({items})"
    
    def pop(self):
        if self._size == 0:
            raise ValueError("linked stack is empty")
        item = self._top
        self._top = item._next
        self._size -= 1
        return item._data

    def peek(self):
        if self._size == 0:
            return None
        return self._top._data

    def __len__(self):
        return self._size

    def isempty(self):
        if self._size == 0:
            return True
        return False

# linky = LinkedStack()
# print(linky) # should print an empty linked stack
# linky.push(4)
# linky.push(7)
# linky.push(9)
# print(linky) # should print a linked stack in this order 9, 7, 4
# linky.pop()
# print(linky) # should print linked stack 7, 4
# print(linky.peek()) # should print 7