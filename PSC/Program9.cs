// Program 9.1
/*
class Program
{
    static string filename = "login.txt";
    static int choice = 0;
    static void Main(string[] args)
    {
        do
        {
            do
            {
                Console.WriteLine("This is a password entry program - do you want to:\n1 - add a new username and password\n2 - output the username and passowrd file\n3 - quit the program");
                try
                {
                    choice = int.Parse(Console.ReadLine());
                    if (choice > 0 && choice < 4)
                    {
                        break;
                    }
                    else
                    {
                        Console.WriteLine("please enter a valid option number");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Please enter a number");
                }
            
            } while (true);

            switch (choice)
            {
                case 1:
                    Console.WriteLine("username: ");
                    string username = Console.ReadLine();
                    Console.WriteLine("password: ");
                    string password = Console.ReadLine();
                    File.WriteAllText(filename, ("username: " + username + "\npassword: " + password));
                    break;
                case 2:
                    Console.WriteLine(File.ReadAllText(filename));
                    break;
                case 3:
                    System.Environment.Exit(3);
                    break;
            }
        } while (true);



    }
}
*/

// Program 9.2
/*
class Program
{
    static string filename = "login.txt";
    static int choice = 0;
    static void Main(string[] args)
    {
        do
        {
            do
            {
                Console.WriteLine("This is a password entry program - do you want to:\n1 - add a new username and password\n2 - output the username and passowrd file\n3 - quit the program");
                try
                {
                    choice = int.Parse(Console.ReadLine());
                    if (choice > 0 && choice < 4)
                    {
                        break;
                    }
                    else
                    {
                        Console.WriteLine("please enter a valid option number");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Please enter a number");
                }

            } while (true);

            switch (choice)
            {
                case 1:
                    Console.WriteLine("username: ");
                    string username = Console.ReadLine();
                    Console.WriteLine("password: ");
                    string password = Console.ReadLine();

                    StreamWriter SW = new StreamWriter(filename);
                    SW.Write("username: " + username + "\npassword: " + password);
                    SW.Close();

                    break;
                case 2:
                    StreamReader SR = new StreamReader(filename);
                    while (SR.Peek() > -1){
                        Console.WriteLine(SR.ReadLine());
                    }
                    break;
                case 3:
                    System.Environment.Exit(3);
                    break;
            }
        } while (true);



    }
}
*/

// Program 9.3
class Program
{
    static string filename = "team.txt";
    static int choice = 0;
    static string name;
    static int goal;
    static int yellowCard;
    static int redCard;
    static int goals;
    static int yCards;
    static int rCards;
    static int playerCount;
    static void Main(string[] args)
    {
        do
        {
            do
            {
                Console.WriteLine("Welcome to your fantasy team - do you want to:\n1: Add a new player\n2: View the team\n3: Calculate the team value\n4: Quit the program");
                try
                {
                    choice = int.Parse(Console.ReadLine());
                    if (choice > 0 && choice < 5)
                    {
                        break;
                    }
                    else
                    {
                        Console.WriteLine("please enter a valid option number");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Please enter a number");
                }

            } while (true);

            switch (choice)
            {
                case 1:
                    if (playerCount == 5)
                    {
                        Console.WriteLine("Team is full!");
                        break;
                    }
                    Console.WriteLine("name: ");
                    name = Console.ReadLine();
                    Console.WriteLine("goals: ");


                    goal = int.Parse(Console.ReadLine());
                    goals += goal;
                    Console.WriteLine("no of yellow cards: ");
                    yellowCard = int.Parse(Console.ReadLine());
                    yCards += yellowCard;
                    Console.WriteLine("no of red cards: ");
                    redCard = int.Parse(Console.ReadLine());
                    rCards += redCard;
                    playerCount++;

                    StreamWriter SW = new StreamWriter(filename, append: true);
                    SW.Write("---------------------\n{0}\n{1} | {2} | {3}\n---------------------\n", name, goal, redCard, yellowCard);
                    SW.Close();

                    break;
                case 2:
                    StreamReader SR = new StreamReader(filename);
                    while (SR.Peek() > -1)
                    {
                        Console.WriteLine(SR.ReadLine());
                    }
                    SR.Close();
                    break;
                case 3:
                    int value = (goals*10) + (-5*rCards) + (-2*yCards);
                    Console.WriteLine("\nThe team has:\nGoals - {0}\nYellow cards - {1}\nRed cards - {2}\nSo the total team value is {3}\n", goals, yCards, rCards, value);
                    break;
                case 4:
                    SW = new StreamWriter(filename);
                    SW.Write("");
                    Environment.Exit(0);
                    break;
            }
        } while (true);
    }
}
