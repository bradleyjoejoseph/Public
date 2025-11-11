def molecule_to_list(molecule):
    try:
        indexes = []
        for i in range(len(molecule)): 
            if molecule[i].isupper(): # check for uppercase letters
                indexes.append(i) # store their indexes
        indexes.pop(0) # remove the first index as it is always 0
        start = 0 
        end = 0
        firstSplit = []
        for i in range(len(indexes)):
            end = indexes[i] # get the current index
            firstSplit.append(molecule[start:end]) # get the substring from start to end and append to firstsplit
            start = end # update start to current end
        firstSplit.append(molecule[end:]) # append the last substring otherwse we lose one

        tupleList = []
        for i in range(len(firstSplit)):
            if firstSplit[i][0].islower():
                return None
            index = 0 # index to split letters and digits
            if firstSplit[i].isalpha(): # if there are no digits then give them a one for the tuple
                firstSplit[i] += "1"
            for j in range(len(firstSplit[i])):
                if firstSplit[i][j].isdigit(): # check for the first number as that is probably where the number starts so we can cut from there
                    index = j # gives us the index to cut with
                    break
            tupleList.append(tuple((firstSplit[i][:index], int(firstSplit[i][index:])))) # create the tuple and append to the list had to search up the docs for tuple and iterables as it was confusing to append
        return tupleList
    except:
        return None