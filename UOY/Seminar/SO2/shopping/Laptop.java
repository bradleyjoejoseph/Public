package shopping;

import java.util.Comparator;

public class Laptop {
    public static final String BRAND = "brand";
    public static final String MODEL = "model";
    public static final String RAM = "ram";
    public static final String SSD = "ssd";
    public static final String PRICE = "price";

    String barcode;
    String brand;
    String model;
    int ram;
    int ssd;
    int price;

    public Laptop(String barcode, String brand, String model, int ram, int ssd, int price) {
        this.barcode = barcode;
        this.brand = brand;
        this.model = model;
        this.ram = ram;
        this.ssd = ssd;
        this.price = price;
    }

    public String getBarcode() {
        return barcode;
    }

    public String getBrand() {
        return brand;
    }

    public String getModel() {
        return model;
    }

    public int getRam() {
        return ram;
    }

    public int getSsd() {
        return ssd;
    }

    public int getPrice() {
        return price;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setRam(int ram) {
        this.ram = ram;
    }

    public void setSsd(int ssd) {
        this.ssd = ssd;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    @Override
    public String toString() {
        return "Laptop<" + brand + ":" + model + "(RAM=" + ram + ", SSD=" + ssd + ", Price=£" + (price / 100.0) + ")>";
    }

    public static Comparator<Laptop> getComparator(String field) {
        switch (field) {
            case BRAND:
                return Comparator.comparing(Laptop::getBrand);
            case MODEL:
                return Comparator.comparing(Laptop::getModel);
            case RAM:
                return Comparator.comparingInt(Laptop::getRam);
            case SSD:
                return Comparator.comparingInt(Laptop::getSsd);
            case PRICE:
                return Comparator.comparingInt(Laptop::getPrice);
            default:
                throw new IllegalArgumentException("Invalid field: " + field);
        }
    }
}
