package com.flogin.dto;

import jakarta.validation.constraints.*;

public class ProductDTO {

    private Integer id;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    //@Size kiểm tra độ dài chuỗi
    @Size(min = 3, max = 100, message = "Tên sản phẩm phải từ 3 đến 100 ký tự")
    private String name;

    @Positive(message = "Giá sản phẩm phải lớn hơn 0")
    @Max(value = 999_999_999, message = "Giá sản phẩm tối đa 999,999,999")
    private Double price;

    //@Min @Max kiểm tra giá trị của số
    @Min(value = 0, message = "Số lượng sản phẩm không được âm")
    @Max(value = 99_999, message = "Số lượng sản phẩm tối đa 99,999")
    private Integer quantity;

    @Size(max = 500, message = "Mô tả sản phẩm tối đa 500 ký tự")
    private String description;

    @NotNull(message = "ID của loại sản phẩm không được để trống")
    private Integer categoryId;

    private String categoryName;

    public ProductDTO() {
    }

    public ProductDTO(String name, Double price, Integer quantity, String description, Integer categoryId) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.categoryId = categoryId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
