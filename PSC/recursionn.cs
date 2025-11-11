
static void Main(string[] args)
{
    
    calc(5);
}
static int calc(int n)
{
    int fac;
    if (n == 0)
    {
        fac = 1;
    }
    else
    {
        fac = n * calc(n - 1);
    }
    Console.WriteLine(fac);
}
