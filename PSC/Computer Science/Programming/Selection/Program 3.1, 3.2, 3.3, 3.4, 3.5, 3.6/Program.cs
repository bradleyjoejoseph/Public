using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace Program_3._1__3._2__3._3__3._4__3._5__3._6
{
    internal class Program
    {
        static void Main(string[] args)
        {
            // Program 3.1
            /*
            Console.WriteLine("Enter your first number");
            int num1 =  Int32.Parse(Console.ReadLine());

            Console.WriteLine("Enter your second number");
            int num2 = Int32.Parse(Console.ReadLine());

            Console.WriteLine("Enter your third number");
            int num3 = Int32.Parse(Console.ReadLine());

            if (num1 > num2 && num1 > num3)
            {
                Console.WriteLine("The highest value is {0}", num1);
            }
            if (num2 > num1 && num2 > num3)
            {
                Console.WriteLine("The highest value is {0}", num2);
            }
            if (num3 > num2 && num3 > num1)
            {
                Console.WriteLine("The highest value is {0}", num3);
            }
            */


            // Program 3.2
            /*
            Console.WriteLine("please enter you number to find out if its odd or even");
            int num = Int32.Parse(Console.ReadLine());
            if (num % 2 == 0)
            {
                Console.WriteLine("The number {0} is even", num);
            }
            else
            {
                Console.WriteLine("The number {0} is odd", num);
            }
            */

            // Program 3.3
            /*
            const string corUsername = "KGrid34";
            const string corPassword = "KG7&56@";

            Console.WriteLine("Username:");
            string username = Console.ReadLine();

            Console.WriteLine("Password:");
            string pasword = Console.ReadLine();

            if (corPassword == pasword && corUsername == username)
            {
                Console.WriteLine("You are logged in");
            }
            else
            {
                Console.WriteLine("The username or password is incorrect - log-in failed");
            }
            */

            // Program 3.4
            /*
            Console.WriteLine("How many marks?");
            int marks = Int32.Parse(Console.ReadLine());

            if (marks >= 80)
            {
                Console.WriteLine("You got an A");
            }
            else if (marks >= 70)
            {
                Console.WriteLine("You got an B");
            }
            else if (marks >= 55)
            {
                Console.WriteLine("You got an C");
            }
            else if (marks >= 45)
            {
                Console.WriteLine("You got an D");
            }
            else if (marks >= 30)
            {
                Console.WriteLine("You got an E");
            }
            */

            // Program 3.5

            Console.WriteLine("What is the cost of your goods?");
            double cost = double.Parse(Console.ReadLine());
            Console.WriteLine("Are you entitiled to a concession discount - enter y or n for yes or no");
            string concession = Console.ReadLine();
            if (concession == "y")
            {
                Console.WriteLine("Please enter your concession type");
                string contype = Console.ReadLine();
                switch (contype)
                {
                    case "ST":
                        cost = cost * (1-0.1);
                        Console.WriteLine("After the discount your price is {0}", cost);
                        break;
                    case "SN":
                        cost = cost * (1-0.125);
                        Console.WriteLine("After the discount your price is {0}", cost);
                        break;
                    case "CH":
                        cost = cost * (1-0.2);
                        Console.WriteLine("After the discount your price is {0}", cost);
                        break;
                    case "CN":
                        cost = cost * (1-0.75);
                        Console.WriteLine("After the discount your price is {0}", cost);
                        break;
                }
            }









            Console.ReadLine();
        }
    }
}
