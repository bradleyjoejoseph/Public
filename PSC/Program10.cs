using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace classes_chapter_10
{
    class Program
    {
        static void Main(string[] args)
        {
            GCSEComputerStudent AStudent = new GCSEComputerStudent();
            int menuchoice;
            Console.WriteLine("The student's name is {0}", AStudent.GetStudentName());
            do
            {
                Console.WriteLine("Do you want to:");
                Console.WriteLine("1 - Calculate a new target grade");
                Console.WriteLine("2 - Input the new progress grade:");
                Console.WriteLine("3 - View the student's grades");
                Console.WriteLine("4 - Quit the grades program");
                menuchoice = int.Parse(Console.ReadLine());

                switch (menuchoice)
                {
                    case 1:


                        Console.WriteLine("Hello {0}", AStudent.GetStudentName());
                        AStudent.CalcNewTarget();
                        Console.WriteLine("Your new target grade is {0}", AStudent.GetTarget());
                        break;
                    case 2:
                        AStudent.UpdateProgress();
                        AStudent.CalcNewTarget();
                        break;
                    case 3:
                        Console.WriteLine("Hello {0}", AStudent.GetStudentName());
                        Console.WriteLine("Your target grade is {0}", AStudent.GetTarget());
                        Console.WriteLine("Your current progress grade is {0}", AStudent.GetProgress());
                        break;
                    case 4:
                        Environment.Exit(0);
                        break;
                }
            }
            while (menuchoice != 4);
            Console.ReadLine();



        }
    }

    class ComputerStudent
    {
        protected string firstname;
        protected string surname;
        protected string form;


        public ComputerStudent()
        {
            Console.WriteLine("Please enter the firstname");
            firstname = Console.ReadLine();
            Console.WriteLine("Please enter the surname");
            surname = Console.ReadLine();
            Console.WriteLine("Please enter the form");
            form = Console.ReadLine();


        }

        public string GetStudentName()
        {
            string studentname;
            studentname = firstname + " " + surname;
            return studentname;
        }

        public string GetForm()
        {
            return form;
        }


    }

    class GCSEComputerStudent : ComputerStudent
    {

        private int target;
        private int progressgrade;

        public GCSEComputerStudent()
        {
            do
            {
                try
                {
                    Console.WriteLine("What target do you want to set for this student? Input a grade between 1 and 9");
                    target = int.Parse(Console.ReadLine());
                }
                catch (Exception)
                {
                    Console.WriteLine("You must enter a digit between 1 and 9");
                }

            }
            while (target < 1 && target > 9);
        }

        public int GetTarget()
        {

            return target;
        }

        public void CalcNewTarget()
        {
            if (progressgrade > target)
            {
                target = progressgrade + 1;
            }

        }

        public void UpdateProgress()
        {
            do
            {
                try
                {
                    Console.WriteLine("What progress grade do you want to set for this student? Input a grade between 1 and 9");
                    progressgrade = int.Parse(Console.ReadLine());
                }
                catch (Exception)
                {
                    Console.WriteLine("You must enter a digit between 1 and 9");
                }
            }
            while (progressgrade < 1 && progressgrade > 9);
        }

        public int GetProgress()
        {
            return progressgrade;
        }


    }
}
