package shopping;

import java.util.*;

public class Inventory {
    Map<String, Laptop> stockList;

    public Inventory() {
        stockList = new HashMap<>();
    }

    public void addLaptop(Laptop laptop) {
        stockList.put(laptop.getBarcode(), laptop);
    }

    public List<Laptop> sortInventory(String field) {
        List<Laptop> laptops = new ArrayList<>(stockList.values());
        Comparator<Laptop> comparator = Laptop.getComparator(field);

        laptops.sort(comparator);
        
        return laptops;
    }
}
