

def add_time(time1,time2,*days):
   daysLater = 0
   MerdiumHours = 0
   quotes = '\''
   daysFixIntoLower = days
   daysOfTheWeek = {
      'monday' : 24,
      'tuesday' : 48,
      'wednesday' : 72,
      'thursday' : 96,
      'friday' : 120,
      'saturday' : 144,
      'sunday' : 168
   }
   daysOfTheWeekCountHours = 0
   if ':' in time2:
      time2NumForColonPlace = time2.find(':')
      TIME2firstPartColonPlaceNum = time2NumForColonPlace
      TIME2secondPartColonPlaceNum = time2NumForColonPlace + 1
      time2FirstNum = time2[:TIME2firstPartColonPlaceNum]
      time2SecondNum = time2[TIME2secondPartColonPlaceNum:]
      
   if ":" in time1:
      time1NumForColonPlace = time1.find(':')
      TIME1firstPartColonPlaceNum = time1NumForColonPlace
      TIME1secondPartColonPlaceNum = time1NumForColonPlace + 1
      endBeforeMerdium = TIME1secondPartColonPlaceNum + 3
      time1FirstNum = time1[:TIME1firstPartColonPlaceNum]
      time1SecondNum = time1[TIME1secondPartColonPlaceNum:endBeforeMerdium]
      time1Merdium = time1[endBeforeMerdium:]
      timeAddedHours = int(time1FirstNum) + int(time2FirstNum)
      timeAddedMin = int(time1SecondNum) + int(time2SecondNum)
      while timeAddedMin >=60:
         timeAddedHours += 1
         timeAddedMin -= 60
      timeAddedMinsStr = str(timeAddedMin)
      timeAddedMinsStrCounted = len(timeAddedMinsStr)
      if timeAddedMinsStrCounted <= 1:
         timeAddedMins = '0' + str(timeAddedMin)
      else:
         timeAddedMins = timeAddedMin





      if time1Merdium == 'PM':
         MerdiumHours += 1
      if len(days) >= 1:
         
         daysFix = str(days)
         daysFixIntoLower = daysFix.lower()
         res = [i for i in range(len(daysFixIntoLower)) if daysFixIntoLower.startswith(quotes, i)] 
         firstRes = res[0] + 1
         secondRes = res[1]
         theDayWord = daysFixIntoLower[firstRes:secondRes]
         monday = daysOfTheWeek['monday']
         tuesday = daysOfTheWeek['tuesday']
         wednesday = daysOfTheWeek['wednesday']
         thursday = daysOfTheWeek['thursday']
         friday = daysOfTheWeek['friday']
         saturday = daysOfTheWeek['saturday']
         sunday = daysOfTheWeek['sunday']
         aDay = 24
         if theDayWord == 'monday':

            theDayNum = monday
         elif theDayWord == 'tuesday':
  
            theDayNum = tuesday
         elif theDayWord == 'wednesday':

            theDayNum = wednesday
         elif theDayWord == 'thursday':

            theDayNum = thursday
         elif theDayWord == 'friday':

            theDayNum = friday
         elif theDayWord == 'saturday':

            theDayNum = saturday
         elif theDayWord == 'sunday':

            theDayNum = sunday
         while timeAddedHours >= 12:
            MerdiumHours += 1
            timeAddedHours -= 12
         if MerdiumHours >= 2:
            nextDayBoolVal = True
            
         else:
            nextDayBoolVal = False
            
         while MerdiumHours >= 2:
            daysLater += 1
            MerdiumHours -= 2
            theDayNum += 24
            if theDayNum > 168:
               theDayNum -= 168
         ifDayBoolval = True
         if MerdiumHours == 1:
            periodBoolVal = True
         else:
            periodBoolVal = False
         
      else:
         while timeAddedHours >= 12:
            MerdiumHours += 1
            timeAddedHours -= 12
         while MerdiumHours >=2:
            daysLater += 1
            nextDayBoolVal = True
            MerdiumHours -= 2
         ifDayBoolval = False
         if MerdiumHours == 1:
            periodBoolVal = True
         else:
            periodBoolVal = False
         if MerdiumHours >= 2:
            nextDayBoolVal = True
            
         else:
            nextDayBoolVal = True
         
   if ifDayBoolval is True:
      if timeAddedHours == 0:
         timeAddedHours += 12
      print(timeAddedHours,':',timeAddedMins,end="")

      ifDay = theDayWord
      if periodBoolVal is True:
         
         period = ' PM, '
         print(period,end="")
         print(ifDay,end="")
      else:

         period = ' AM, '
         print(period,end="")
         print(ifDay,end="")
      if nextDayBoolVal is True:
         print(' (',daysLater,'days later )')
      else:
         print('')
   elif ifDayBoolval is False:
      if timeAddedHours == 0:
         timeAddedHours += 12
      print(timeAddedHours,':',timeAddedMins,end="")
      if periodBoolVal is True:

         period = ' PM '
         print(period,end="")
      else:

         period = ' AM '
         print(period,end="")
      if nextDayBoolVal is True:
         print(' (',daysLater,'days later )')
      else:
         print('')


          
   
  
    



add_time("3:00 PM", "3:10")
# Returns: 6:10 PM

add_time("11:30 AM", "2:32", "Monday")
# Returns: 2:02 PM, Monday

add_time("11:43 AM", "00:20")
# Returns: 12:03 PM

add_time("10:10 PM", "3:30")
# Returns: 1:40 AM (next day)

add_time("11:43 PM", "24:20", "tueSday")
# Returns: 12:03 AM, Thursday (2 days later)

add_time("6:30 PM", "205:12")
# Returns: 7:42 AM (9 days later)



