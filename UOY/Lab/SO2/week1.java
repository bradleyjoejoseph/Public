import java.util.Scanner;

public class week1 {
// exercise 1
	// public static void main(String[] args) {

	// 	Scanner keyboard = new Scanner(System.in);
	// 	System.out.print("Enter an int: ");
	// 	int number = keyboard.nextInt();

	// 	System.out.println("number entered is: " + number);
	// }

// exercise 2
// A fruit company sells bananas for £3.00 a kilogram plus £4.99 per order for postage and
// packaging. If an order is over £50.00, the P&P is reduced by £1.50. Write a program that takes
// the number of kilo of bananas as a user input and prints the cost of that order.
    public static void main(String[] args) {
        Scanner keyboard = new Scanner(System.in);
        System.out.print("Number of kilo of banas: ");
        double num = keyboard.nextInt();
        double bana = 3.00;
        double postage = 4.99;
        double totalbana = num*bana;
        if (totalbana > 50.00) {
            postage -= 1.50;
        }
        System.out.printf("Your total cost would be: £%.2f", totalbana + postage);
    }
}