package com.flogin.entity;

import jakarta.persistence.*;

//Thực thể
@Entity
//Bảng
@Table(name = "products")
public class ProductEntity {

    @Id
    //Tự động gán Id (tự tăng)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //Cột(không được null, mỗi sản phẩm phải có tên khác nhau)
    @Column(nullable = false, unique = true)
    private String name;

    // 'nullable = false' bắt buộc sản phẩm phải có giá
    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private int quantity;

    @Column
    @Lob // Dùng cho các trường văn bản dài
    private String description;

    // Quan hệ: Nhiều sản phẩm thuộc về 1 loại
    @ManyToOne(fetch = FetchType.LAZY) // LAZY: Chỉ load category khi thật sự cần
    /*
    @JoinColumn là một annotation của JPA dùng để chỉ định cột khóa ngoại (foreign key) trong bảng database.
    Nó được dùng để kết nối một mối quan hệ (như @ManyToOne hoặc @OneToOne) với một cột cụ thể trong bảng.
    @JoinColumn(...) Báo cho JPA: "Hãy dùng một cột trong bảng products để quản lý mối quan hệ này."
    name = "category_id": Chỉ định tên chính xác của cột đó trong bảng products là category_id.
    Cột này sẽ chứa giá trị ID (khóa chính) của Category mà sản phẩm này thuộc về.
    */
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryEntity category;

    public ProductEntity() {
    }

    public ProductEntity(String name, double price, int quantity, String description, CategoryEntity category) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.category = category;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CategoryEntity getCategory() {
        return category;
    }

    public void setCategory(CategoryEntity category) {
        this.category = category;
    }
}
