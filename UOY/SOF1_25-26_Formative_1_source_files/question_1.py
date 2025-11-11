def seconds_to_time(time):
    if time < 0 or time > 359999: # check for invalid input range that is negative or exceeds 99:59:59
        return None
    
    hours = time // 3600 # calculate hours from seconds rounded down
    minutes = (time % 3600) // 60 # calculate remaining minutes from the leftover seconds from hours
    seconds = time % 60 # calculate remaining seconds from the leftover seconds from minutes
    if hours == 0:
        return f"{minutes:02}:{seconds:02}" # format the output with leading zeros but without hours
    else:
        return f"{hours:02}:{minutes:02}:{seconds:02}" # format the output with leading zeros