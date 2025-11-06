package com.flogin.dto;

import jakarta.validation.constraints.*;

public class ProductDTO {

    private int id;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    //@Size kiểm tra độ dài chuỗi
    @Size(min = 3, max = 100, message = "Tên sản phẩm phải từ 3 đến 100 ký tự")
    private String name;

    @Positive(message = "Giá sản phẩm phải lớn hơn 0")
    @Max(value = 999_999_999, message = "Giá sản phẩm tối đa 999,999,999")
    private double price;

    //@Min @Max kiểm tra giá trị của số
    @Min(value = 0, message = "Số lượng sản phẩm không được âm")
    @Max(value = 99_999, message = "Số lượng sản phẩm tối đa 99,999")
    private int quantity;

    @Size(max = 500, message = "Mô tả sản phẩm tối đa 500 ký tự")
    private String description;

    //categoryId là Primitive nên nếu là null hoặc blank thì nó sẽ thành 0
    @Min(value = 1, message = "ID của loại sản phẩm không được để trống")
    private int categoryId;

    private String categoryName;

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

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
