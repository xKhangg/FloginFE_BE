package com.flogin.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProductDTO {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Min(value = 3, message = "Tên sản phẩm phải có tối thiểu 3 ký tự")
    @Max(value = 100, message = "Tên sản phẩm phải có tối đa 100 ký tự")
    private String name;

    @NotNull(message = "Giá sản phẩm không được để trống")
    @Min(value = 0, message = "Giá sản phẩm không được âm")
    @Max(value = 999_999_999, message = "Giá sản phẩm tối đa 999,999,999")
    private double price;

    @NotNull(message = "Số lượng sản phẩm không được để trống")
    @Min(value = 0, message = "Số lượng sản phẩm không được âm")
    @Max(value = 99_999, message = "Số lượng sản phẩm tối đa 99,999")
    private int quantity;

    @Max(value = 500, message = "Mô tả sản phẩm tối đa 500 ký tự")
    private String description;

    @NotNull(message = "ID của loại sản phẩm không được để trống")
    private int categoryId;

    public ProductDTO(String name, double price, int quantity, String description, int categoryId) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.categoryId = categoryId;
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
}
