import React, { useState, useEffect } from 'react';

// Danh sách category mặc định (để test hoặc fallback)
const DEFAULT_CATEGORIES = [
    { id: 1, name: 'Trinh thám' },
    { id: 2, name: 'Thiếu nhi' },
    { id: 3, name: 'Khoa học' }
];

const initialFormState = {
    name: '',
    price: '',
    quantity: '',
    categoryId: '',
    description: ''
};

function ProductForm({ onSubmit, initialData = null, categories = DEFAULT_CATEGORIES, onCancel }) {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    // --- 1. Xử lý điền dữ liệu khi ở chế độ Sửa (Edit Mode) ---
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                price: initialData.price || '',
                quantity: initialData.quantity || '',
                // Ưu tiên lấy categoryId, nếu không có thì lấy từ object category
                categoryId: initialData.categoryId || (initialData.category ? initialData.category.id : ''),
                description: initialData.description || ''
            });
        } else {
            setFormData(initialFormState);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Tên sản phẩm là bắt buộc';
        
        const priceNum = Number(formData.price);
        if (!formData.price || priceNum <= 0) newErrors.price = 'Giá phải lớn hơn 0';
        
        const quantityNum = Number(formData.quantity);
        if (!formData.quantity || quantityNum < 0) newErrors.quantity = 'Số lượng không hợp lệ';
        
        if (!formData.categoryId) newErrors.categoryId = 'Loại sản phẩm là bắt buộc';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Gửi dữ liệu đã được chuẩn hóa
            onSubmit({
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity, 10),
                categoryId: parseInt(formData.categoryId, 10)
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} aria-label="product-form" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>{initialData ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h3>

            {/* Tên sản phẩm */}
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Tên sản phẩm
                </label>
                <input 
                    id="name" 
                    name="name" 
                    type="text"
                    value={formData.name} 
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px' }}
                />
                {errors.name && <span role="alert" style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>}
            </div>

            {/* Loại sản phẩm */}
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="categoryId" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Loại sản phẩm
                </label>
                <select 
                    id="categoryId" 
                    name="categoryId" 
                    value={formData.categoryId} 
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px' }}
                >
                    <option value="">-- Chọn loại --</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                {errors.categoryId && <span role="alert" style={{ color: 'red', fontSize: '12px' }}>{errors.categoryId}</span>}
            </div>

            {/* Giá */}
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="price" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Giá
                </label>
                <input 
                    id="price" 
                    name="price" 
                    type="number"
                    value={formData.price} 
                    onChange={handleChange} 
                    style={{ width: '100%', padding: '8px' }}
                />
                {errors.price && <span role="alert" style={{ color: 'red', fontSize: '12px' }}>{errors.price}</span>}
            </div>

            {/* Số lượng */}
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="quantity" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Số lượng
                </label>
                <input 
                    id="quantity" 
                    name="quantity" 
                    type="number"
                    value={formData.quantity} 
                    onChange={handleChange} 
                    style={{ width: '100%', padding: '8px' }}
                />
                {errors.quantity && <span role="alert" style={{ color: 'red', fontSize: '12px' }}>{errors.quantity}</span>}
            </div>

            {/* Mô tả */}
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Mô tả
                </label>
                <textarea 
                    id="description" 
                    name="description" 
                    rows="3"
                    value={formData.description} 
                    onChange={handleChange} 
                    style={{ width: '100%', padding: '8px' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {initialData ? 'Cập nhật' : 'Lưu'}
                </button>
                
                {onCancel && (
                    <button 
                        type="button" 
                        onClick={onCancel}
                        style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Hủy
                    </button>
                )}
            </div>
        </form>
    );
}

export default ProductForm;