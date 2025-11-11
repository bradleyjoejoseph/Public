abcs = "abcdefghijklmnopqrstuvwxyz"
def encrypt(message, shifts, alphabet): # question doesnt really make sense with the alphabet can be any series of 
                                        # characters not just letters when it also says the message cant contain any characters that arent part of the normal alphabet
                                        # have done it in a way that makes sense to me hopefully will get some marks
    try:
        encrypted = ""
        for i in range(len(message)):
            encrypted += alphabet[(abcs.find(message[i]) + shifts[i]) % len(abcs)] # this allows you to put anything for the alphabet
        return encrypted
    except:
        return None