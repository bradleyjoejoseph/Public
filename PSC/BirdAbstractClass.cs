using System;
namespace BirdAbstract
{

	class Program
	{
		static void Main(string[] args)
		{
			Duck duck1 = new Duck("Duck");
			duck1.MakeSound();
			Console.WriteLine(duck1.Name);
			Console.ReadLine();
		}
	}


	abstract class BirdClassAbstract
	{
		public string Name;
        public BirdClassAbstract(string name)
		{
			Name = name;
		}
		public abstract void MakeSound();
	}
	class Duck : BirdClassAbstract
	{
		public Duck(string name) : base(name)
		{
			this.Name = name;
		}
        override public void MakeSound()
        {
			Console.WriteLine("Quack");
        }
    }
}

