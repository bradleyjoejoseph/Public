/*class Program
{
    static void Main(string[] args)
    {
        string[] nameList = { "Brad", "Joash", "Callum", "Tom", "Toby" };
        string nameSought = Console.ReadLine();
        Console.WriteLine("The index is {0}", linearSearch(nameList, nameSought));
        Console.ReadLine();
    }
    static int linearSearch(string[] namelist, string nameSought)
    {
        int index = -1;
        int i = 0;
        bool found = false;
        while (i < namelist.Length && !found)
        {
            if (namelist[i] == nameSought)
            {
                index = i;
                found = true;
            }
            i++;
        }
        return index;
    }
}*/

class Program
{
    static void Main(string[] args)
    {
        string[] nameList = { "Alan", "Bradley", "Callum", "David", "Ethan", "Freddie", "George", "Harry", "Ian", "Jake", "Kiran", "Leon", "Mark", "Neymar", "Oliver", "Patrick", "Quincy", "Reese", "Steve", "Tom", "Umar", "Victor", "William", "Xander", "Yuri", "Zack" };
        Console.WriteLine("What name are you searching for?");
        string nameSought = Console.ReadLine();
        Console.WriteLine("Linear or binary? ('l' or 'b')");
        string answer = Console.ReadLine();

        if (answer == "l")
        {
            Console.WriteLine("The index is {0}", linearSearch(nameList, nameSought));
        }
        else
        {
            Console.WriteLine("Your index is {0}", binarySearch(nameList, nameSought));
        }






        Console.ReadLine();
    }
    static int binarySearch(string[] nameList, string nameSought)
    {
        int low = 0;
        int high = nameList.Length - 1;
        int index = -1;
        bool found = false;
        int checks = 0;

        while (low <= high && !found)
        {
            int mid = (low + high) / 2;

            if (nameList[mid] == nameSought)
            {
                index = mid;
                found = true;
            }
            else if (String.Compare(nameSought, nameList[mid]) == -1)
            {
                high = mid - 1;
            }
            else
            {
                low = mid + 1;
            }
            checks++;
        }
        Console.WriteLine("{0} comparisons", checks);
        return index;
    }
    static int linearSearch(string[] namelist, string nameSought)
    {
        int index = -1;
        int i = 0;
        bool found = false;
        int checks = 0;
        while (i < namelist.Length && !found)
        {
            if (namelist[i] == nameSought)
            {
                index = i;
                found = true;
            }
            i++;
            checks++;
        }
        Console.WriteLine("{0} comparisons", checks);
        return index;
    }
}