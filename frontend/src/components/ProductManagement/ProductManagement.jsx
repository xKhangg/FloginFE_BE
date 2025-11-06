import React, { useState, useEffect, useMemo, useRef } from 'react';
import styles from './ProductManagement.module.css'; // Import CSS

// <--- 1. IMPORT CÁC HÀM API ---
import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
} from '../../services/productService'; //

// Import các icon từ 'react-icons'
import {
    MdVisibility,
    MdEdit,
    MdDelete,
    MdAdd,
    MdSearch
} from "react-icons/md";

// ---------------------------------

const emptyForm = {
    name: '',
    price: '',
    quantity: '',
    categoryName: '',
    description: '',
};

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);

    // --- STATE MỚI ---
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    // <--- 5. TẠO HÀM TẢI DỮ LIỆU TỪ API ---
    const fetchProducts = async () => {
        setIsLoading(true);
        setApiError(null); // Reset lỗi cũ
        try {
            const response = await getProducts();
            setProducts(response.data.content || []);

        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
            setApiError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.");
        }
        setIsLoading(false);
    };

    // <--- 6. THAY ĐỔI useEffect ĐỂ GỌI API ---
    useEffect(() => {
        fetchProducts(); // Gọi hàm tải dữ liệu khi component được mount
    }, []); // Chỉ chạy 1 lần

    // --- LẤY DANH SÁCH CATEGORY TỰ ĐỘNG (Sửa lại để lấy từ products) ---
    const categories = useMemo(() => {
        // Thêm kiểm tra Array.isArray để an toàn
        if (!Array.isArray(products)) {
            return ['Tất cả'];
        }
        // <--- SỬA 2 --- (File của bạn đã đúng)
        const allCategories = products.map(p => p.categoryName);
        const uniqueCategories = [...new Set(allCategories)];
        return ['Tất cả', ...uniqueCategories];
    }, [products]); // Logic này vẫn đúng

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    // --- CẬP NHẬT LOGIC LỌC (Giữ nguyên) ---
    const filteredProducts = useMemo(() => {
        // Thêm kiểm tra Array.isArray để an toàn
        if (!Array.isArray(products)) {
            return [];
        }
        let filtered = products;

        // 1. Lọc theo Category
        if (selectedCategory !== 'Tất cả') {
            // <--- SỬA 3 ---
            // So sánh với categoryName vì selectedCategory là một categoryName
            filtered = filtered.filter(product => product.categoryName === selectedCategory);
        }

        // 2. Lọc theo Search Term
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(product =>
                (product.name && product.name.toLowerCase().includes(lowerCaseSearch))
            );
        }

        return filtered;
    }, [searchTerm, selectedCategory, products]);

    const validateForm = () => {
        // ... logic validate của bạn vẫn đúng ...
        const newErrors = {};
        if (!formData.name) newErrors.name = "Tên sản phẩm là bắt buộc";
        // <--- SỬA 4 ---
        if (!formData.categoryName) newErrors.categoryName = "Loại sản phẩm là bắt buộc";
        if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Số lượng phải lớn hơn 0";
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Giá phải lớn hơn 0";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- (CREATE) ---
    const handleClickOpenAddDialog = () => {
        setFormData(emptyForm);
        setErrors({});
        setOpenAddDialog(true);
    };
    const handleCloseAddDialog = () => setOpenAddDialog(false);

    // <--- 7. CẬP NHẬT HÀM (CREATE) ĐỂ GỌI API ---
    const handleSaveNewProduct = async () => {
        if (!validateForm()) return;

        // Chuẩn bị dữ liệu gửi đi (không cần ID)
        const newProductData = {
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity, 10),
            category: formData.categoryName,
        };


        try {
            await addProduct(newProductData); // Gọi API
            handleCloseAddDialog(); // Đóng dialog
            fetchProducts(); // Tải lại toàn bộ danh sách
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            setErrors({ api: "Không thể thêm sản phẩm. Vui lòng thử lại." });
        }
    };

    // --- (READ) ---
    const handleViewProduct = (product) => {
        setCurrentProduct(product);
        setOpenViewDialog(true);
    };
    const handleCloseViewDialog = () => {
        setOpenViewDialog(false);
        setCurrentProduct(null);
    };

    // --- (UPDATE) ---
    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setFormData(product);
        setErrors({});
        setOpenEditDialog(true);
    };
    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setCurrentProduct(null);
        setFormData(emptyForm);
    };

    // <--- 8. CẬP NHẬT HÀM (UPDATE) ĐỂ GỌI API ---
    const handleUpdateProduct = async () => {
        if (!validateForm()) return;

        const updatedData = {
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity, 10),
            category: formData.categoryName, // Tương tự như khi tạo mới
        };

        try {
            await updateProduct(currentProduct.id, updatedData); // Gọi API
            handleCloseEditDialog(); // Đóng dialog
            fetchProducts(); // Tải lại toàn bộ danh sách
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            setErrors({ api: "Không thể cập nhật sản phẩm. Vui lòng thử lại." });
        }
    };

    // --- (DELETE) ---
    const handleDeleteProduct = (product) => {
        setCurrentProduct(product);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setCurrentProduct(null);
    };

    // <--- 9. CẬP NHẬT HÀM (DELETE) ĐỂ GỌI API ---
    const handleConfirmDelete = async () => {
        if (currentProduct) {
            try {
                await deleteProduct(currentProduct.id); // Gọi API
                handleCloseDeleteDialog(); // Đóng dialog
                fetchProducts(); // Tải lại toàn bộ danh sách
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm:", error);
                // Bạn có thể set một lỗi chung và hiển thị ở dialog
                handleCloseDeleteDialog();
                setApiError("Không thể xóa sản phẩm. Vui lòng thử lại.");
            }
        }
    };


    // --- HÀM TẠO FORM (Giữ nguyên) ---
    const renderFormFields = () => (
        <>
            {/* --- 10. THÊM HIỂN THỊ LỖI API TRONG FORM --- */}
            {errors.api && <div className={styles.apiError}>{errors.api}</div>}

            {/* ... các trường input của bạn giữ nguyên ... */}
            <div className={styles.formGroup}>
                <label htmlFor={formData.id || 'name'} className={styles.label}>Tên sản phẩm <span className={styles.requiredStar}>*</span></label>
                <input
                    id={formData.id || 'name'}
                    name="name"
                    type="text"
                    autoFocus
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    value={formData.name}
                    onChange={handleFormChange}
                />
                {errors.name && <span className={styles.helperText}>{errors.name}</span>}
            </div>

            {/* === SỬA KHỐI NÀY === */}
            <div className={styles.formGroup}>
                {/* <--- SỬA 5 --- */}
                <label htmlFor={formData.id ? 'categoryName-edit' : 'categoryName'} className={styles.label}>Loại sản phẩm <span className={styles.requiredStar}>*</span></label>
                <input
                    id={formData.id ? 'categoryName-edit' : 'categoryName'} // <--- SỬA 6 ---
                    name="categoryName" // <--- SỬA 7 ---
                    type="text"
                    className={`${styles.input} ${errors.categoryName ? styles.inputError : ''}`} // <--- SỬA 8 ---
                    value={formData.categoryName} // <--- SỬA 9 ---
                    onChange={handleFormChange}
                />
                {errors.categoryName && <span className={styles.helperText}>{errors.categoryName}</span>} {/* <--- SỬA 10 --- */}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor={formData.id ? 'quantity-edit' : 'quantity'} className={styles.label}>Số lượng <span className={styles.requiredStar}>*</span></label>
                <input
                    id={formData.id ? 'quantity-edit' : 'quantity'}
                    name="quantity"
                    type="number"
                    className={`${styles.input} ${errors.quantity ? styles.inputError : ''}`}
                    value={formData.quantity}
                    onChange={handleFormChange}
                />
                {errors.quantity && <span className={styles.helperText}>{errors.quantity}</span>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor={formData.id ? 'price-edit' : 'price'} className={styles.label}>Giá sản phẩm (VNĐ) <span className={styles.requiredStar}>*</span></label>
                <input
                    id={formData.id ? 'price-edit' : 'price'}
                    name="price"
                    type="text"
                    className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                    value={formData.price}
                    onChange={handleFormChange}
                />
                {errors.price && <span className={styles.helperText}>{errors.price}</span>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor={formData.id ? 'description-edit' : 'description'} className={styles.label}>Mô tả</label>
                <textarea
                    id={formData.id ? 'description-edit' : 'description'}
                    name="description"
                    rows="3"
                    className={styles.input}
                    value={formData.description}
                    onChange={handleFormChange}
                />
            </div>
        </>
    );

    // --- GIAO DIỆN JSX ---
    return (
        <div className={styles.container}>

            {/* Thanh Công cụ (Toolbar) (Giữ nguyên) */}
            <div className={`${styles.paper} ${styles.toolbar}`}>
                {/* ... */}
                <div className={styles.filterControls}>
                    <div className={styles.searchBox}>
                        <div className={styles.searchInputWrapper}>
                            <span className={styles.searchIcon}><MdSearch /></span>
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    <div className={styles.categoryFilter}>
                        <select
                            className={styles.categorySelect}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)} // File của bạn đã sửa đúng
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.addButtonBox}>
                    <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={handleClickOpenAddDialog}>
                        <span className={styles.icon}><MdAdd /></span> Thêm mới
                    </button>
                </div>
            </div>

            {/* --- 11. THÊM HIỂN THỊ LỖI API TOÀN CỤC --- */}
            {apiError && (
                <div className={`${styles.paper} ${styles.apiErrorGlobal}`}>
                    {apiError}
                </div>
            )}

            {/* Bảng Sản phẩm */}
            <div className={`${styles.paper} ${styles.tableContainer}`}>
                <table className={styles.table}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th className={styles.tableCell}>ID</th>
                            <th className={styles.tableCell}>Tên sản phẩm</th>
                            <th className={styles.tableCell}>Loại sản phẩm</th>
                            <th className={styles.tableCell}>Giá</th>
                            <th className={styles.tableCell}>Số lượng</th>
                            <th className={styles.tableCell}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className={styles.tableCellLoading}>Đang tải dữ liệu...</td>
                            </tr>
                        ) : (
                            // <--- 12. HIỂN THỊ DỮ LIỆU TỪ LOGIC LỌC (ĐÃ CẬP NHẬT) ---
                            // Logic này vẫn đúng vì nó đọc từ state 'products' đã được API cập nhật
                            filteredProducts.map((product) => (
                                <tr key={product.id} className={styles.tableRow}>
                                    <td className={styles.tableCell}>{product.id}</td>
                                    <td className={styles.tableCell}>{product.name}</td>
                                    {/* <--- SỬA 11 (Lỗi chính) --- */}
                                    <td className={styles.tableCell}>{product.categoryName}</td>
                                    <td className={styles.tableCell}>{parseFloat(product.price).toLocaleString()} VNĐ</td>
                                    <td className={styles.tableCell}>{product.quantity}</td>
                                    <td className={styles.tableCell}>
                                        <button className={`${styles.iconButton} ${styles.iconView}`} title="Xem chi tiết" onClick={() => handleViewProduct(product)}>
                                            <MdVisibility />
                                        </button>
                                        <button className={`${styles.iconButton} ${styles.iconEdit}`} title="Sửa" onClick={() => handleEditProduct(product)}>
                                            <MdEdit />
                                        </button>
                                        <button className={`${styles.iconButton} ${styles.iconDelete}`} title="Xóa" onClick={() => handleDeleteProduct(product)}>
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- CÁC DIALOG (CREATE, UPDATE, READ, DELETE) --- */}
            {/* (Không có thay đổi gì ở JSX của các Dialog) */}

            {/* --- (CREATE) DIALOG THÊM MỚI --- */}
            <div className={`${styles.dialogOverlay} ${openAddDialog ? styles.dialogOpen : ''}`} onClick={handleCloseAddDialog}>
                {/* ... */}
                <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveNewProduct(); }}>
                        <h2 className={styles.dialogTitle}>Thêm sản phẩm mới</h2>
                        <p className={styles.dialogSubtitle}>Vui lòng nhập thông tin cho sản phẩm mới.</p>
                        {renderFormFields()}
                        <div className={styles.dialogActions}>
                            <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleCloseAddDialog}>Hủy</button>
                            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>Lưu</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* --- (UPDATE) DIALOG SỬA SẢN PHẨM --- */}
            <div className={`${styles.dialogOverlay} ${openEditDialog ? styles.dialogOpen : ''}`} onClick={handleCloseEditDialog}>
                {/* ... */}
                <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateProduct(); }}>
                        <h2 className={styles.dialogTitle}>Cập nhật sản phẩm</h2>
                        <p className={styles.dialogSubtitle}>Chỉnh sửa thông tin sản phẩm.</p>
                        {renderFormFields()}
                        <div className={styles.dialogActions}>
                            <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleCloseEditDialog}>Hủy</button>
                            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>Cập nhật</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* --- (READ) DIALOG XEM CHI TIẾT --- */}
            <div className={`${styles.dialogOverlay} ${openViewDialog ? styles.dialogOpen : ''}`} onClick={handleCloseViewDialog}>
                {/* ... */}
                <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
                    <h2 className={styles.dialogTitle}>Chi tiết sản phẩm</h2>
                    {currentProduct && (
                        <div className={styles.viewDetails}>
                            <p><strong>ID:</strong> {currentProduct.id}</p>
                            <p><strong>Tên sản phẩm:</strong> {currentProduct.name}</p>
                            {/* <--- SỬA 12 --- */}
                            <p><strong>Loại sản phẩm:</strong> {currentProduct.categoryName}</p>
                            <p><strong>Giá:</strong> {parseFloat(currentProduct.price).toLocaleString()} VNĐ</p>
                            <p><strong>Số lượng:</strong> {currentProduct.quantity}</p>
                            <p><strong>Mô tả:</strong> {currentProduct.description || '(Không có mô tả)'}</p>
                        </div>
                    )}
                    <div className={styles.dialogActions}>
                        <button type="button" className={`${styles.button} ${styles.buttonPrimary}`} onClick={handleCloseViewDialog}>Đóng</button>
                    </div>
                </div>
            </div>

            {/* --- (DELETE) DIALOG XÁC NHẬN XÓA --- */}
            <div className={`${styles.dialogOverlay} ${openDeleteDialog ? styles.dialogOpen : ''}`} onClick={handleCloseDeleteDialog}>
                {/* ... */}
                <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
                    <h2 className={styles.dialogTitle}>Xác nhận Xóa</h2>
                    <p className={styles.dialogSubtitle}>
                        Bạn có chắc chắn muốn xóa sản phẩm <strong>"{currentProduct?.name}"</strong>?
                        <br />
                        Hành động này không thể hoàn tác.
                    </p>
                    <div className={styles.dialogActions}>
                        <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleCloseDeleteDialog}>
                            Hủy
                        </button>
                        <button type="button" className={`${styles.button} ${styles.buttonDanger}`} onClick={handleConfirmDelete}>
                            Xác nhận Xóa
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ProductManagement;