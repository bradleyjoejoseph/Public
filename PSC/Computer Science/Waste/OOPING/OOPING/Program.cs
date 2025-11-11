/*class Program
{
    static void Main(string[] args)
    {

        string thisFishState = "Fish";
        int thisFishSize = 1;
        Console.WriteLine("{0} is of size {1}", thisFishState, thisFishSize);
        while (thisFishState != "FISH")
        {
            feed(ref thisFishState, ref thisFishSize);
        }
        Console.WriteLine("It is now a big {0}", thisFishSize);
        Console.ReadLine();
    }

    static void feed(ref string state, ref int size)
    {
        size++;
        Console.WriteLine("Fish fed");
        if (size == 5)
        {
            state = "FISH";
        }
    }
}*/
/*
class Program
{
    static void Main(string[] args)
    {
        Animal thisFish = new Animal("Fish", 1);
        Console.WriteLine("{0} is of size {1}", thisFish.getState(), thisFish.getSize());
        while (thisFish.getState() != "FISH")
        {
            thisFish.feed();
        }
        Console.WriteLine("It is now a big {0}", thisFish.getState());

        Console.ReadLine();
    }

}

class Animal
{
    private string state;
    private int size;

    public Animal(string s, int n)
    {
        state = s;
        size = n;
    }
    public string getState()
    {
        return state;
    }
    public int getSize()
    {
        return size;
    }
    public void feed()
    {
        size++;
        Console.WriteLine("Fish Fed");
        if (size == 5)
        {
            state = "FISH";
        }
    }
}*/

class Program
{
    static void Main(string[] args)
    {
        while (true)
        {
            Console.WriteLine("Make a new car or inspect? (make | inspect | quit)");
            string answer = Console.ReadLine();
        }
        Console.ReadLine();
    }

}

class Car
{
    private string registration;
    private string make;
    private int mileage;
    private string dateofinspection;

    public Car(string a, string b)
    {
        registration = a;
        make = b;
        mileage = 0;
    }
    public string GetRegistration()
    {
        return registration;
    }
    public string GetMake()
    {
        return make;
    }
    public int GetMileage()
    {
        return mileage;
    }
    public string GetDOI()
    {
        return dateofinspection;
    }
    public void inspect(string DOI, int mylage)
    {
        mileage = mylage;
        dateofinspection = DOI;
    }
}