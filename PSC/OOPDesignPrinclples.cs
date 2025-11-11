class Program
{
    static void Main(string[] args)
    {

    }
}
class Animal
{
    protected string state;
    protected int size;

    public Animal(string s, int n)
    {
        state = s;
        size = n;
    }
    public virtual void feed()
    {
        size++;
        Console.WriteLine("{0} fed", state);
    }
    public string getState()
    { 
        return state;
    }
    public int getSize()
    {
        return size;
    }
}

class Fish : Animal
{
    private int maxSize;

    public Fish(string s, int n) : base(s, n)
    {
        
    }
    public void setMaxSize(int m)
    {
        maxSize = m;
    }
    public override void feed()
    {
        size += 2;
        Console.WriteLine("{} fed");
        if (size >= maxSize)
        {
            state = "BIG FISH";
        }
    }
}
