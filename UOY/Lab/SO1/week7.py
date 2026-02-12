# def print_all(numbers):
#     if (len(numbers) == 0):
#         return None
#     print(numbers.pop(0))
#     print_all(numbers)

# print_all([1, 2, 3, 4])

def print_all(numbers):
    if (len(numbers) == 0):
        return None
    print(numbers.pop(-1))
    print_all(numbers)

print_all([1, 2, 3, 4])