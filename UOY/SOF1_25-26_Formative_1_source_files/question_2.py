def time_to_seconds(time): 
    try:
        time = time.split(":") # split the input string into components based on the colon separator
    except:
        return None
    if len(time) == 2:
        return (int(time[0]) * 60) + int(time[1]) # return seconds for mm:ss format
    elif len(time) == 3:
        return (int(time[0]) * 3600) + (int(time[1]) * 60) + int(time[2]) # return seconds for hh:mm:ss format
    else:
        return None # return none for every other format
    
#print(time_to_seconds(input("")))