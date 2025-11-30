import React, { useState } from 'react';

function ProductForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        category: '',
        description: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validation Rules
        if (!formData.name) newErrors.name = 'Tên sản phẩm là bắt buộc';
        if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Giá phải lớn hơn 0';
        if (!formData.quantity || Number(formData.quantity) < 0) newErrors.quantity = 'Số lượng không hợp lệ'; // Sửa lại logic check số lượng >= 0
        if (!formData.category) newErrors.category = 'Loại sản phẩm là bắt buộc';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Nếu có prop onSubmit thì gọi nó (dùng để test)
            if (onSubmit) {
                onSubmit(formData);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} aria-label="product-form">
            <div>
                <label htmlFor="name">Tên sản phẩm</label>
                <input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                />
                {errors.name && <span role="alert">{errors.name}</span>}
            </div>

            <div>
                <label htmlFor="category">Loại sản phẩm</label>
                <select 
                    id="category" 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                >
                    <option value="">-- Chọn --</option>
                    <option value="1">Trinh thám</option>
                    <option value="2">Thiếu nhi</option>
                </select>
                {errors.category && <span role="alert">{errors.category}</span>}
            </div>

            <div>
                <label htmlFor="price">Giá</label>
                <input 
                    id="price" 
                    name="price" 
                    type="number"
                    value={formData.price} 
                    onChange={handleChange} 
                />
                {errors.price && <span role="alert">{errors.price}</span>}
            </div>

            <div>
                <label htmlFor="quantity">Số lượng</label>
                <input 
                    id="quantity" 
                    name="quantity" 
                    type="number"
                    value={formData.quantity} 
                    onChange={handleChange} 
                />
                {errors.quantity && <span role="alert">{errors.quantity}</span>}
            </div>

            <div>
                <label htmlFor="description">Mô tả</label>
                <textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                />
            </div>

            <button type="submit">Lưu</button>
        </form>
    );
}

export default ProductForm;