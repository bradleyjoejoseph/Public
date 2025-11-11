// Program 6.1
/*
namespace ConsoleApplication1
{
    class Program
    {
        static string secretword = "Computer";
        static string guess;
        static int menuoption;

        static void Main(string[] args)
        {
            do
            {
                OutputMenu();
                menuoption = Convert.ToInt32(Console.ReadLine());

                switch (menuoption)
                {
                    case 1:
                        ChangeWord();
                        break;
                    case 2:
                        GuessingWord();
                        break;
                    case 3:
                        ExitingProgram();
                        break;
                }
            }
            while (menuoption == 1 || menuoption == 2);


            Console.ReadLine();
        }





        static void OutputMenu()
        {
            Console.WriteLine("Welcome to the guessing program menu - choose your option");
            Console.WriteLine("1 - change the secret word");
            Console.WriteLine("2 - Make a guess");
            Console.WriteLine("3 - Quit");

        }


        static void ChangeWord()
        {
            Console.WriteLine("What is the secret word");
            secretword = Console.ReadLine();
        }


        static void GuessingWord()
        {
            Console.WriteLine("guess the secret word");
            guess = Console.ReadLine();
            if (guess == secretword)
            {
                Console.WriteLine("Well done - you have guessed the secret word");
            }
            else
            {
                Console.WriteLine("sorry that is not the secret word");
            }
        }


        static void ExitingProgram()
        {
            Console.WriteLine("thank you for playing secret word");
            Environment.Exit(0);
        }
    }
}
*/

// Program 6.2
/*
class Program { 
    static void Main(string[] args)
    {
        Console.WriteLine("num1: ");
        int num1 = int.Parse(Console.ReadLine());
        Console.WriteLine("num1: ");
        int num2 = int.Parse(Console.ReadLine());
        AddNumbers(num1, num2);
        Console.ReadLine();

    }

    static void AddNumbers(int num1, int num2)
    {
        Console.WriteLine("the answer is {0}", num1 + num2);
    }
}
*/

//Program 6.3
/*
class Program
{
    static double[] marks = new double[5];
    static double[] marki = new double[5];
    static string[] marked = new string[5];
    static double avg = 0;

    static void Main(string[] args)
    {
        InputAllMarks();

        ConvertToPercentage(marks);

        WorkoutAverageMark(marks);

        OutputMarks();
    }

    static void InputAllMarks()
    {
        for (int i = 0; i < 5; i++)
        {
            Console.WriteLine("Student {0}'s mark?", i+1);
            marks[i] = double.Parse(Console.ReadLine());
        }
    }

    static string[] ConvertToPercentage(double[] mark)
    {
        
        for (int i = 0; i < 5; i++)
        {
            marked[i] = ((mark[i] / 60) * 100).ToString() + "%";
        }
        return marked;
    }

    static string WorkoutAverageMark(double[] mark)
    {
        
        for (int i = 0; i < 5; i++)
        {
            avg += (mark[i] / 60) * 100;
        }
        avg = avg / 5;
        return avg.ToString() + "%";
    }

    static void OutputMarks()
    {
        for (int i = 0; i < 5; i++)
        {
            Console.WriteLine("Student {0}'s Percent: {1}", i + 1, marked[i]);
        }
        Console.WriteLine("Class Average: {0}", avg.ToString() + "%");
        Console.ReadLine();
    }
*/

// Program 6.4

class Program
{
    static int answer = 0;
    static int column = 1;
    static string binaryNumber;

    static void Main(string[] args)
    { 
        while (true)
        {
            Console.WriteLine("Please enter the binary number to be converted:    (q or enter to quit)");
            binaryNumber = Console.ReadLine();
            if (binaryNumber == "q" || binaryNumber == "")
            {
                break;
            }
            calculator();
            Console.WriteLine(answer);
        }
        Console.ReadLine();
    }

    static void calculator()
    {
        for (int i = binaryNumber.Length - 1; i >= 0; i--)
        {
            if (binaryNumber[i] == '1')
            {
                answer += column;
            }
            column *= 2;
        }
    }
}