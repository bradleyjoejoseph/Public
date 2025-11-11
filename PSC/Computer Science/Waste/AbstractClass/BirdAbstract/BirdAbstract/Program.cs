using BirdAbstract;

class Program
{
    static void Main(string args)
    {
        Duck duck1 = new Duck("Duck");
        duck1.MakeSound();
        Console.WriteLine(duck1.Name);
        Console.ReadLine();
    }
}