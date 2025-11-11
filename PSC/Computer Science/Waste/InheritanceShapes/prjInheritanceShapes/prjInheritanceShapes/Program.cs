class Program
{
    static void Main()
    {
        Circle myCircle = new Circle(); // create circle

        Console.WriteLine("The radius of the circle is {0}: ", myCircle.GetRadius());

        //Add code here to ask the user to enter the radius and update using the SetRadius method
        Console.WriteLine("Enter the radius: ");
        myCircle.SetRadius(double.Parse(Console.ReadLine()));


        Console.WriteLine("------------ Circle Class ---------------");
        Console.WriteLine("The area of the circle of radius {0} is {1:N2} ", myCircle.GetRadius(), myCircle.Area());
        Console.WriteLine("The circumference of the circle of radius {0} is {1:N2} ", myCircle.GetRadius(), myCircle.Circumference());
        Console.ReadLine();

        //Add code here for cyclinder

    }
}

class Circle
{
    private const double PI = 3.14;

    private double _radius;

    public Circle(double radius)
    {
        this._radius = radius;
    }

    //Write a new method to set the radius (SetRadius)
    public void SetRadius(double radius)
    {
        this._radius = radius;
    }

    public double GetRadius()
    {
        return _radius;
    }

    public double Area()
    {
        return (PI * (_radius * _radius)); // A = Pi * R^2
    }

    public double Circumference()
    {
        return (2 * PI * _radius); // C = 2 Pi r
    }
}
class Cylinder : Circle
{
    public double Height { get; set; }

    public Cylinder()
    {
        Height = 0;
    }

    public double BaseArea()
    {
        return PI * (_radius * _radius);
    }

    public double SurfaceArea()
    {
        return 2 * PI * _radius * (Height + _radius);
    }

    public double Volume()
    {
        return PI * (_radius * _radius) * Height;
    }
}


