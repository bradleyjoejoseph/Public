using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace LibraryManagement
{
    class Program
    {
        static void Main(string[] args)
        {
            Book book1 = new Book("The Great Gatsby", "F. Scott Fitzgerald", "978-0743273565", true);
            Book book2 = new Book("To Kill a Mockingbird", "Harper Lee", "978-0061120084", false);

            User user1 = new User("001", "Alice");
            User user2 = new User("002", "Bob");

            Library library = new Library();

            library.AddNewBook(book1);
            library.AddNewBook(book2);

            library.RegisterMember(user1);
            library.RegisterMember(user2);

            Console.WriteLine("");

            user1.BorrowBook(book1);
            user2.BorrowBook(book2);

            Console.WriteLine("");

            user1.GetBorrowedBooks();
            user2.GetBorrowedBooks();

            Console.WriteLine("");

            user1.ReturnBook(book1);
            user2.ReturnBook(book2);

            Console.WriteLine("");

            library.RemoveMember(user2);
            library.RemoveCurrentBook(book2);

            Console.ReadLine();

        }
    }

    class Book
    {
        private string title;
        private string author;
        private string ISBN;
        private bool avaliablility;

        public Book(string a, string b, string c, bool d)
        {
            title = a;
            author = b;
            ISBN = c;
            avaliablility = d;
        }
        public bool CheckAvaliability()
        {
            return avaliablility;
        }
        public void UpdateAvalibility(bool ava)
        {
            avaliablility = ava;
            Console.WriteLine("Avalibility set to {0}", avaliablility);
        }
        public string[] GetBookInfo()
        {
            string[] list = { title, author, ISBN };
            return list;
        }
    }

    class User
    {
        private string memberID;
        private string name;
        private string[] borrowedBooks;

        public User(string a, string b)
        {
            memberID = a;
            name = b;
            
        }

        public void BorrowBook(Book book)
        {
            if (book.CheckAvaliability())
            {

            }
        }
        public void ReturnBook(Book book)
        {
            if (true)
            {
                Console.WriteLine();
            }
        }

    }

}
