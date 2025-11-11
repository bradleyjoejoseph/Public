namespace FibonacciExample
{
    class Program
    {
        static void Main(string[] args)
        {
            for (int i = 0; i < 6; i++)
            {
                Console.WriteLine(TFibonacci.Fibonacci(i));
            }
            Console.ReadLine();
        }
    }
    class TFibonacci
    {
        public static int Fibonacci(int n)
        {
            int x = 0;
            int y = 1;
            for (int i = 0; i < n; i++)
            {
                int temp = x;
                x = y;
                y = temp + y;
            }
            return x;
        }
    }

}

