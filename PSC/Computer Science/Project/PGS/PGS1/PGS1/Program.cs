using System;
using System.IO;

namespace SeedSimulation
{
    class Program
    {
        const char SOIL = '.';
        const char SEED = 'S';
        const char PLANT = 'P';
        const char ROCKS = 'X';
        const char WEED = 'W';
        const int FIELDLENGTH = 20;
        const int FIELDWIDTH = 35;

        static int GetHowLongToRun()
        {
            int Years = 0;
            Console.WriteLine("Welcome to the Plant Growing Simulation");
            Console.WriteLine();
            Console.WriteLine("You can step through the simulation a year at a time");
            Console.WriteLine("or run the simulation for 0 to 5 years");
            Console.WriteLine("How many years do you want the simulation to run?");
            Console.Write("Enter a number between 0 and 5, or -1 for stepping mode: ");

            do
            {
                try
                {
                    Years = Convert.ToInt32(Console.ReadLine());
                    if (Years >= -1 && Years <= 5)
                    {
                        break;
                    }
                    else
                    {
                        Console.WriteLine("Please enter a whole number between -1 and 5");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Please enter a whole number between -1 and 5");

                }

            } while (true);

            return Years;
        }

        static void CreateNewField(char[,] Field)
        {
            int answer = 0;
            while (true)
            {
                try
                {
                    Console.WriteLine("Enter the number of seeds to scatter: ");
                    answer = int.Parse(Console.ReadLine());
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Please enter a valid number (0-99)");
                }
                break;
            }
            int Row = 0;
            int Column = 0;
            for (Row = 0; Row < FIELDLENGTH; Row++)
            {
                
                for (Column = 0; Column < FIELDWIDTH; Column++)
                {
                    Field[Row, Column] = SOIL;
                }
            }
            int count = 0;
            int counting = 0;
            int killcount = 0;
            while (true)
            {

                Random rnd = new Random();
                int x = rnd.Next(FIELDLENGTH);
                int y = rnd.Next(FIELDWIDTH);
                
                if (Field[x, y] == SOIL)
                {
                    Field[x, y] = SEED;
                    count++;
                }
                else if (Field[x, y] == SEED)
                {
                    killcount++;
                    count++;
                }


                if (count == answer)
                {
                    break;
                }

            }

            while (true)
            {
                
                Random rnd = new Random();
                int x = rnd.Next(FIELDLENGTH);
                int y = rnd.Next(FIELDWIDTH);
                if (Field[x, y] == SOIL)
                {
                    Field[x, y] = ROCKS;
                    counting++;
                }
                

                if (counting == 5)
                {
                    break;
                }

            }
            Console.WriteLine("{0} seed(s) lost.", killcount);
        }

        static void ReadFile(char[,] Field)
        {
            string FileName = "";
            string FieldRow = "";
            Console.Write("Enter file name: ");
            FileName = Console.ReadLine();
            if (!FileName.Contains(".txt")){
                FileName += ".txt";
            }
            try
            {
                StreamReader CurrentFile = new StreamReader(FileName);
                for (int Row = 0; Row < FIELDLENGTH; Row++)
                {
                    FieldRow = CurrentFile.ReadLine();
                    for (int Column = 0; Column < FIELDWIDTH; Column++)
                    {
                        Field[Row, Column] = FieldRow[Column];
                    }
                }
                CurrentFile.Close();
            }
            catch (Exception)
            {
                CreateNewField(Field);
            }
        }

        static void InitialiseField(char[,] Field)
        {
            string Response = "";
            
            while (true)
            {
                Console.Write("Do you want to load a file with seed positions? (Y/N): ");
                Response = Console.ReadLine();
                if (Response == "Y" || Response == "y")
                {
                    ReadFile(Field);
                    break;
                }
                else if (Response == "N" || Response == "n")
                {
                    CreateNewField(Field);
                    break;
                }
                else
                {
                    Console.WriteLine("Not a valid option.");
                }
            }
            
        }

        static void Display(char[,] Field, string Season, int Year)
        {
            Console.WriteLine("Season: " + Season + " Year number: " + Year);
            for (int Row = 0; Row < FIELDLENGTH; Row++)
            {
                for (int Column = 0; Column < FIELDWIDTH; Column++)
                {
                    Console.Write(Field[Row, Column]);
                }
                Console.WriteLine("| " + String.Format("{0,3}", Row));
            }
        }

        static void CountPlants(char[,] Field)
        {
            int NumberOfPlants = 0;
            for (int Row = 0; Row < FIELDLENGTH; Row++)
            {
                for (int Column = 0; Column < FIELDWIDTH; Column++)
                {
                    if (Field[Row, Column] == PLANT)
                    {
                        NumberOfPlants++;
                    }
                }
            }
            if (NumberOfPlants == 1)
            {
                Console.WriteLine("There is 1 plant growing");
            }
            else
            {
                Console.WriteLine("There are " + NumberOfPlants + " plants growing");
            }
        }

        static void SimulateSpring(char[,] Field)
        {
            int PlantCount = 0;
            bool Frost = false;
            for (int Row = 0; Row < FIELDLENGTH; Row++)
            {
                for (int Column = 0; Column < FIELDWIDTH; Column++)
                {
                    if (Field[Row, Column] == SEED)
                    {
                        Random rnd = new Random();
                        int num = rnd.Next(5);

                        if (num <= 1)
                        {
                            Field[Row, Column] = PLANT;
                        }
                    }
                }
            }

            for (int Row = 0; Row < FIELDLENGTH; Row++)
            {
                for (int Column = 0; Column < FIELDWIDTH; Column++)
                {
                    if (Field[Row, Column] == SOIL)
                    {
                        Random rnd = new Random();
                        int num = rnd.Next(10);

                        if (num == 0)
                        {
                            Field[Row, Column] = WEED;
                        }
                    }
                }
            }

            CountPlants(Field);
            Random RandomInt = new Random();
            if (RandomInt.Next(0, 2) == 1)
            {
                Frost = true;
            }
            else
            {
                Frost = false;
            }
            if (Frost)
            {
                PlantCount = 0;
                for (int Row = 0; Row < FIELDLENGTH; Row++)
                {
                    for (int Column = 0; Column < FIELDWIDTH; Column++)
                    {
                        if (Field[Row, Column] == PLANT)
                        {
                            PlantCount++;
                            if (PlantCount % 3 == 0)
                            {
                                Field[Row, Column] = SOIL;
                            }
                        }
                    }
                }
                Console.WriteLine("There has been a frost");
                CountPlants(Field);
            }
        }

        static void SimulateSummer(char[,] Field)
        {
            Random RandomInt = new Random();
            int RainFall = RandomInt.Next(0, 3);
            int PlantCount = 0;
            int KillCount = 0;
            if (RainFall == 0)
            {
                PlantCount = 0;
                for (int Row = 0; Row < FIELDLENGTH; Row++)
                {
                    for (int Column = 0; Column < FIELDWIDTH; Column++)
                    {
                        if (Field[Row, Column] == PLANT)
                        {
                            PlantCount++;
                            if (PlantCount % 2 == 0)
                            {
                                Field[Row, Column] = SOIL;
                                KillCount++;
                            }
                        }
                    }
                }
                Console.WriteLine("There has been a severe drought, {0} plants have died.", KillCount);
                CountPlants(Field);
            }
        }

        static void SeedLands(char[,] Field, int Row, int Column)
        {
            if (Row >= 0 && Row < FIELDLENGTH && Column >= 0 && Column < FIELDWIDTH)
            {
                if (Field[Row, Column] == SOIL)
                {
                    Field[Row, Column] = SEED;
                }
            }
        }

        static void SimulateAutumn(char[,] Field)
        {
            Random randint = new Random();
            int num = randint.Next(4);
            for (int Row = 0; Row < FIELDLENGTH; Row++)
            {
                for (int Column = 0; Column < FIELDWIDTH; Column++)
                {
                    if (Field[Row, Column] == PLANT)
                    {
                        switch (num)
                        {
                            case 0:
                                SeedLands(Field, Row + 1, Column + 1);
                                SeedLands(Field, Row - 1, Column + 1);
                                SeedLands(Field, Row, Column + 1);
                                break;
                            case 1:
                                SeedLands(Field, Row - 1, Column - 1);
                                SeedLands(Field, Row - 1, Column);
                                SeedLands(Field, Row - 1, Column + 1);
                                break;
                            case 2:
                                SeedLands(Field, Row - 1, Column - 1);
                                SeedLands(Field, Row, Column - 1);
                                SeedLands(Field, Row + 1, Column - 1);
                                break;
                            case 3:
                                SeedLands(Field, Row + 1, Column - 1);
                                SeedLands(Field, Row + 1, Column);
                                SeedLands(Field, Row + 1, Column + 1);
                                break;

                        }
   
                    }
                }
            }
        }

        static void SimulateWinter(char[,] Field)
        {
            for (int Row = 0; Row < FIELDLENGTH; Row++)
            {
                for (int Column = 0; Column < FIELDWIDTH; Column++)
                {
                    if (Field[Row, Column] == PLANT)
                    {
                        Field[Row, Column] = SOIL;
                    }
                }
            }
        }

        static void SimulateOneYear(char[,] Field, int Year)
        {
            SimulateSpring(Field);
            Display(Field, "spring", Year);
            SimulateSummer(Field);
            Display(Field, "summer", Year);
            SimulateAutumn(Field);
            Display(Field, "autumn", Year);
            SimulateWinter(Field);
            Display(Field, "winter", Year);
        }

        private static void Simulation()
        {
            int YearsToRun;
            char[,] Field = new char[FIELDLENGTH, FIELDWIDTH];
            bool Continuing;
            int Year;
            string Response;
            YearsToRun = GetHowLongToRun();

            InitialiseField(Field);

            Display(Field, "start", 0);
            if (YearsToRun != 0)
            {
                
                if (YearsToRun >= 1)
                {
                    for (Year = 1; Year <= YearsToRun; Year++)
                    {
                        SimulateOneYear(Field, Year);
                    }
                }
                else
                {
                    Continuing = true;
                    Year = 0;
                    while (Continuing)
                    {
                        Year++;
                        SimulateOneYear(Field, Year);
                        Console.Write("Press Enter to run simulation for another Year, Input X to stop: ");
                        Response = Console.ReadLine();
                        if (Response == "x" || Response == "X")
                        {
                            Continuing = false;
                        }
                    }
                }
                Console.WriteLine("End of Simulation");
            }
            Console.ReadLine();
        }

        static void Main(string[] args)
        {
            Simulation();
        }

    }
}