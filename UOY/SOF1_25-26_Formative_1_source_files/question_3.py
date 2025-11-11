ATOMS = { # nicked them from the slide had to do the last two though
        'H':{'name':'Hydrogen', 'weight':1.00797},
        'He':{'name':'Helium', 'weight':4.00260},
        'C':{'name':'Carbon', 'weight':12.011},
        'O':{'name':'Oxygen', 'weight':15.9994}
    }

def molar_mass(molecule):
    total = 0
    for i in range(len(molecule)):
        try:
            total += ATOMS[molecule[i][0]]['weight'] * molecule[i][1] # look up the weight of the atom from the dictionary and multiply by the number of atoms
        except KeyError:
            return None # if the atom isnt in the dict return none
    return total