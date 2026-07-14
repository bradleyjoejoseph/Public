package shopping;

public class Main {
    public static void main(String[] args) throws Exception {
        Inventory inventory = new Inventory();
        inventory.addLaptop(new Laptop("001", "Apple", "mac", 8, 128, 60000));
        inventory.addLaptop(new Laptop("002", "Microsoft", "SurfaceBook2", 16, 512, 260000));
        inventory.addLaptop(new Laptop("003", "HP", "Sensa", 8, 256, 80000));
        inventory.addLaptop(new Laptop("004", "Asus", "zen13", 16, 256, 100000));
        inventory.addLaptop(new Laptop("005", "Asus", "minibook", 2, 64, 40000));
        System.out.println(inventory.sortInventory(Laptop.BRAND));
        System.out.println(inventory.sortInventory(Laptop.PRICE));
    }
}