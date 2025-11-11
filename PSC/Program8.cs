// Program 8.1
/*
class Program
{
    static void Main(string[] args)
    {
        int menuoption;
        bool validchoice;
        do
        {
            do
            {
                menuoption = Displaymenu();
                validchoice = ValidChoice(menuoption);
            }
            while (validchoice == false);
            switch (menuoption)
            {
                case 1:
                    PlayGame();
                    break;

                case 2:
                    Environment.Exit(0);
                    break;


            }
        }
        while (menuoption != 2);


        Console.ReadLine();

    }
    static bool ValidChoice(int menuchoice)
    {
        bool valid;
        if (menuchoice == 1 || menuchoice == 2)
        {
            valid = true;
        }
        else
        {
            valid = false;
        }
        return valid;
    }
    static int Displaymenu()
    {
        int choice = 0;

        Console.WriteLine("Option 1: Start New Game");
        Console.WriteLine("Option 2: Quit");
        Console.WriteLine("what would you like to do");
        try
        // the try catch will catch invalid data types being entered
        //or nothing at all
        {
            choice = int.Parse(Console.ReadLine());

        }
        catch (Exception)
        {
            Console.WriteLine("an error has occurred - please choose again ");

        }
        return choice;
    }



    static void PlayGame()
    {
        Console.Clear();

        int computerscore = 0;
        int playerscore = 0;

        char whoseturn = 'P';
        bool winner = false;
        Console.WriteLine("Welcome to the dice-rolling game");


        do
        {

            if (whoseturn == 'P')
            {
                Console.WriteLine("player it is your turn");
                playerscore += RollDice();
                Console.WriteLine("player your score is {0}", playerscore);
                whoseturn = 'C';
                if (playerscore >= 30)
                {
                    winner = true;
                    Console.WriteLine("well done you have won this game with a score of {0}", playerscore);
                }
            }
            else
            {
                Console.WriteLine("It is the computer's turn");
                computerscore += RollDice();
                Console.WriteLine("The computer score is {0}", computerscore);
                whoseturn = 'P';
                if (computerscore >= 30)
                {
                    winner = true;
                    Console.WriteLine("the computer has won this game with a score of {0}", computerscore);
                }
            }
        }
        while (winner == false);

    }



    static int RollDice()
    {
        int dicenumber;
        Random rnd = new Random();
        dicenumber = rnd.Next(1, 7);
        return dicenumber;
    }





}
*/

// Program 8.2

namespace Treasure
{
    class Program
    {
        static string choice;
        static bool validation = false;
        static int x = -1;
        static int y = -1;
        static char[,] Board = new char[10, 10];

        static void Main(string[] args)
        {
            
            PlaceTreasure(Board);
            OutputMenuOptions();
            



            Console.ReadLine();
        }
        static void OutputMenuOptions()
        {
            Console.WriteLine("OutputMenuOptions()");
            OutputBoard(Board);
            do
            {
                Console.WriteLine("Input coordinates from 0 to 9 in format : '0,1'");
                try
                {
                    choice = Console.ReadLine();
                    validate();

                }
                catch (Exception ex)
                {
                    Console.WriteLine("Please try again");
                }
            } while (validation == false);
            
        }

        static void validate()
        {
            if (choice.Length > 3)
            {
                validation = false;
            }
            try
            {
                x = choice[0] - '0';
                y = choice[2] - '0';
                Console.WriteLine("x{0} y{1}", x, y);
                //x = Int32.Parse();

                validation = true;
            }
            catch (Exception)
            {
                validation = false;
            }
        }

        private static void PlaceTreasure(char[,] Board)
        {
            Random randomnumber = new Random();
            int row;
            int column;
            for (int x = 0; x < 10; x++)
            {
                for (int y = 0; y < 10; y++)
                {
                    Board[x, y] = '-';
                }
            }
            for (int i = 0; i < 6; i++)
            {
                row = GetRandomCoord(randomnumber);
                column = GetRandomCoord(randomnumber);
                Board[row, column] = 'T';
            }
        }

        private static int GetRandomCoord(Random randomnumber)
        {
            int randomcoord;

            randomcoord = randomnumber.Next(0, 10);
            return randomcoord;
        }

        private static void OutputBoard(char[,] Board)
        {
            Console.WriteLine();
            Console.WriteLine("The board looks like this");
            Console.WriteLine();
            Console.Write(" ");
            for (int column = 0; column < 10; column++)
            {
                Console.Write(" " + column + "");
            }
            Console.WriteLine();
            for (int row = 0; row < 10; row++)
            {
                Console.Write(row + " ");
                for (int column = 0; column < 10; column++)
                {
                    if (Board[row, column] == 'T')
                    {
                        Console.Write("T");
                        Console.Write("|");
                    }
                    else
                    {
                        Console.Write(Board[row, column]);
                        Console.Write("|");
                    }

                }
                Console.WriteLine();
            }

        }
    }
}
