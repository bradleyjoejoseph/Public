

// Program 4.1
/*
Console.WriteLine("Even numbers:");
for (int i = 100; i > 0; i -= 2)
{
    Console.WriteLine(i);
}
Console.WriteLine("\n\n\n");
Console.WriteLine("Odd Numbers:");
for (int i = 99; i > 0; i -= 2)
{
    Console.WriteLine(i);
}
*/


// Program 4.2
/*
Console.WriteLine("Number: ");
int num = Int32.Parse(Console.ReadLine());
for (int i = 1; i <= 12; i++)
{
    Console.WriteLine("{0} x {1} = {2}", i, num, i * num);
}
*/


//Program 4.3
/*
const double CON = 0.4536;

Console.WriteLine("Conversion: Pounds to Kilograms\n-------------------------------\nPounds:       Kilograms:\n-------------------------------");

for (int i = 1; i <= 20; i++)
{
    if (i < 10)
    {
        Console.WriteLine("{0}       |       {1}", i, i * CON);
    }
    else
    {
        Console.WriteLine("{0}      |       {1}", i, i * CON);
    }
    
}
*/

// Program 4.4
/*
int tries = 1;
Console.WriteLine("What is 2 + 2?");
string answer = Console.ReadLine();
while (answer != "4")
{
    tries += 1;
    Console.WriteLine("Incorrect try again!");
    Console.WriteLine("What is 2 + 2?");
    answer = Console.ReadLine();
}
Console.WriteLine("You got it right in {0} tries!", tries);
*/


// Program 4.5
/*
string answer = "yes";
int itemNO = 0;
double cost = 0;
do
{
    Console.WriteLine("Do you want to put an item in your basket? (yes/no)");
    answer = Console.ReadLine();
    if (answer == "yes")
    {
        itemNO++;
        Console.WriteLine("What is the price of the item?");
        cost += double.Parse(Console.ReadLine());
    } 
} while (answer != "no");
Console.WriteLine("The price of your {0} items is £{1}", itemNO, cost);
*/


// Program 4.6
/*
int tries = 3;
string password = "password";
Console.WriteLine("Password:");
string answer = Console.ReadLine();

do
{
    if (answer == password)
    {
        break;
    }
    else
    {
        tries--;
        Console.WriteLine("Wrong try again! You have {0} tries left.", tries);
        Console.WriteLine("Password:");
        answer = Console.ReadLine();
    }
} while (answer != password && tries > 1);

if (answer == password)
{
    Console.WriteLine("You have successfully logged in");
}
else
{
    Console.WriteLine("Sorry you are out of tries!");
}
*/

// Program 4.7
/*
Console.WriteLine("Are you ready to be tested? (y/n)");
string answer = Console.ReadLine();
Random random = new Random();

if (answer == "y")
{
    int num1 = random.Next(1, 13);
    int num2 = random.Next(1, 13);
    int num3 = num1 * num2;
    Console.WriteLine("{0} x {1}?", num1, num2);
    answer = Console.ReadLine();
    if (Int32.Parse(answer) == num3)
    {
        
    }
}
else
{
    Console.WriteLine("You did not want to be tested! :C");
}
*/







Console.ReadLine();
