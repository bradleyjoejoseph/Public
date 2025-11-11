
// Program 5.1
/*
string[] clubs = new String[5];

for (int i = 0; i < 5; i++)
{
    Console.WriteLine("What is the name o the football club you want to store?");
    clubs[i] = Console.ReadLine();
}
Console.WriteLine("[{0}]", string.Join(", ", clubs));
*/


// Program 5.2
/*
string[] clubs = new String[5];

for (int i = 0; i < 5; i++)
{
    Console.WriteLine("What is the name of the football club you want to store?");
    clubs[i] = Console.ReadLine();
}
Console.WriteLine("[{0}]", string.Join(", ", clubs));

Console.WriteLine("Club?");
string answer = Console.ReadLine();
bool lin = false;
for (int i = 0; i < 5; i++)
{
    
    if (clubs[i] == answer)
    {
        lin = true;
        Console.WriteLine("Linear search successful!");
        break;
    }
}
if (lin == false)
{
    Console.WriteLine("Linear was not successful!");
}
Array.Sort(clubs);
if (Array.BinarySearch(clubs, answer) > 0){
    Console.WriteLine(Array.BinarySearch(clubs, answer));
    Console.WriteLine("Binary search succesful!", clubs, answer);
}
else
{
    Console.WriteLine("Binary search was not succesful!", clubs, answer);
    Console.WriteLine(Array.BinarySearch(clubs, answer));
}
*/

// Program 5.3
/*
string[,] x = new string[6, 6];
for (int i = 0; i < x.GetLength(0); i++)
{
    for (int j = 0; j < x.GetLength(1); j++)
    {
        x[i, j] = "             ";
    }
}
x[0, 0] = "Patrol";
x[1, 3] = "Ship";
x[2, 5] = "Carrier";
x[3, 5] = "Carrier";
x[4, 5] = "Carrier";
x[3, 1] = "Destroyer";
x[4, 1] = "Destroyer";
for (int i = 0; i < x.GetLength(0); i++)
{
    for (int j = 0; j < x.GetLength(1); j++)
    {
        Console.Write(x[i, j] + "\t");
    }
    Console.WriteLine();
}
*/

// Program 5.4

Console.ReadLine();
