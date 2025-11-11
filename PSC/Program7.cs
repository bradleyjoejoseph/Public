// Program 7.1
class Program
{
    static void Main(string[] args)
    {
        // Program 7.1
        /*
                string cat = "The domestic cat is a small, typically furry, carnivorous mammal. They are often called house cats when kept as indoor pets or simply cats when there is no need to distinguish them from other felids and felines.Cats are often valued by humans for companionship and for their ability to hunt vermin. There are more than 70 cat breeds, though different associations proclaim different numbers according to their standards.";
                //1. replace all instances of cat with dog and cats with dogs - re-output
                string dog = cat.Replace("cat", "dog").Replace("Cat", "Dog");
                Console.WriteLine("The dog string is -  {0}", dog);
                Console.WriteLine();
                //2. find the length of the string - output the length
                Console.WriteLine("The length of the cat string is - {0}", cat.Length);
                Console.WriteLine();
                //3. Return the substring "They are often called house cats" and output this substring
                Console.WriteLine("The substring - {0}", cat.Substring(cat.IndexOf("They are often called house cats"), ("They are often called house cats").Length));
                Console.WriteLine();
                //4. output the index of the first example of "cat"
                Console.WriteLine("The first index of cat - {0}", cat.IndexOf("cat"));
                Console.WriteLine();
                //5. Insert the sentence "There are a number of different breeds." after the end of the first sentence.
                Console.WriteLine("Different breeds insertion - {0}", cat.Insert(cat.IndexOf(".") + 1, " There are a number of differnt breeds."));
                Console.WriteLine();
                //6. Remove the first sentence and output it
                Console.WriteLine("Removal of first sentence - {0}", cat.Substring(cat.IndexOf(".") + 2));
                Console.WriteLine();
                //7. Split the string into an array of substrings
                string[] subCat = cat.Split(".");
                Console.WriteLine("substrings - {0}", string.Join(" | ", subCat));
                Console.WriteLine();


                Console.WriteLine("The original string is -  {0}", cat);
                Console.WriteLine();

                */

        // Program 7.2
        /*
        Console.WriteLine("Please enter your first name");
        string firstName = Console.ReadLine();

        Console.WriteLine("Please enter your last name");
        string lastName = Console.ReadLine();

        Console.WriteLine("Please enter your mothers first name");
        string mother = Console.ReadLine();

        Console.WriteLine("Please enter your the name of the city you born in");
        string place = Console.ReadLine();

        Console.WriteLine("Your space name is {0}{1} {2}{3}", lastName.Substring(0, 3), firstName.Substring(0, 2), mother.Substring(0, 2), place.Substring(0, 3));
        Console.ReadLine();
        */

        // Program 7.3

        Random rd = new Random();
        string password = "";
        int score = 0;
        string strength = "";

        for (int i = 0; i < 8; i++)
        {
            int ranNum = rd.Next(33, 127);
            if (ranNum >= 65 && ranNum <= 90)
            {
                score += 10;
            }
            if (ranNum > 90)
            {
                score += 5;
            }
            char letter = (char)ranNum;
            password += letter;
        }


        Console.WriteLine("Your password is {0}", password);





        Console.ReadLine();
    }
}
