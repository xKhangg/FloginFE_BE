package com.flogin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

//Thực thể
@Entity
//Bảng
@Table(name = "products")
public class ProductEntity {

    @Id
    //Tự động gán Id (tự tăng)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    //@Size kiểm tra độ dài chuỗi
    @Size(min = 3, max = 100, message = "Tên sản phẩm phải từ 3 đến 100 ký tự")
    //Cột(không được null, mỗi sản phẩm phải có tên khác nhau)
    @Column(nullable = false, unique = true)
    private String name;

    @Positive(message = "Giá sản phẩm phải lớn hơn 0")
    @Max(value = 999_999_999, message = "Giá sản phẩm tối đa 999,999,999")
    // 'nullable = false' bắt buộc sản phẩm phải có giá
    @Column(nullable = false)
    private double price;

    //@Min @Max kiểm tra giá trị của số
    @Min(value = 0, message = "Số lượng sản phẩm không được âm")
    @Max(value = 99_999, message = "Số lượng sản phẩm tối đa 99,999")
    @Column(nullable = false)
    private int quantity;

    @Size(max = 500, message = "Mô tả sản phẩm tối đa 500 ký tự")
    @Column
    @Lob // Dùng cho các trường văn bản dài
    private String description;

    @NotNull(message = "Category không được để trống")
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

    public Integer getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if(name == null || name.isBlank()){
            throw new IllegalArgumentException("Tên sản phẩm không được để trống");
        }
        if(name.length() < 3 || name.length() > 100){
            throw new IllegalArgumentException("Tên sản phẩm phải có tối thiểu 3 ký tự và tối đa 100 ký tự");
        }
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        if(price <= 0 || price > 999_999_999){
            throw new IllegalArgumentException("Giá sản phẩm phải lớn hơn 0 và tối đa 999,999,999");
        }
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        if(quantity < 0 || quantity > 99_999){
            throw new IllegalArgumentException("Số lượng sản phẩm khng được âm và tối đa 99,999");
        }
        this.quantity = quantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        if(description != null && description.length() > 500){
            throw new IllegalArgumentException("Mô tả sản phẩm tối đa 500 ký tự");
        }
        this.description = description;
    }

    public CategoryEntity getCategory() {
        return category;
    }

    public void setCategory(CategoryEntity category) {
        if (category == null) {
            throw new IllegalArgumentException("Category không được để trống.");
        }
        this.category = category;
    }
}
