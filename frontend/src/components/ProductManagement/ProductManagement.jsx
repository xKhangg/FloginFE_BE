import React, { useState, useEffect } from 'react';
import styles from './ProductManagement.module.css';

// --- IMPORT API ---
import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
} from '../../services/productService';

import { getAllCategories } from '../../services/categoryService';

import {
    MdVisibility,
    MdEdit,
    MdDelete,
    MdAdd,
    MdSearch
} from "react-icons/md";

const emptyForm = {
    name: '',
    price: '',
    quantity: '',
    categoryId: '',
    description: '',
};

function ProductManagement() {
    // --- STATE DỮ LIỆU ---
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // --- STATE BỘ LỌC & PHÂN TRANG ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('All');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    

    // --- STATE FORM & DIALOG ---
    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    // --- 1. TẢI DANH SÁCH CATEGORY  ---
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                setCategories(res.data || []);
            } catch (err) {
                console.error("Lỗi tải categories", err);
            }
        };
        fetchCategories();
    }, []);

    // --- 2. TẢI SẢN PHẨM  ---
    const fetchProducts = async (page, catId, search) => {
        setIsLoading(true);
        setApiError(null);
        try {
            const idToSend = (catId === 'All' || catId === '') ? null : catId;
            const sizeToSend = search ? 1000 : 5;
            const response = await getProducts(page, idToSend, search, sizeToSend);
            setProducts(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);

        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
            setApiError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.");
        }
        setIsLoading(false);
    };

    // --- 3. GỌI API KHI THAY ĐỔI TRANG, BỘ LỌC HOẶC TỪ KHÓA ---
    useEffect(() => {
        // Mỗi khi currentPage, selectedCategoryId HOẶC searchTerm thay đổi -> Gọi lại API
        fetchProducts(currentPage, selectedCategoryId, searchTerm);
    }, [currentPage, selectedCategoryId, searchTerm]); 

    // --- XỬ LÝ THAY ĐỔI BỘ LỌC ---
    const handleCategoryFilterChange = (e) => {
        setSelectedCategoryId(e.target.value);
        setCurrentPage(0);
    };

    // --- XỬ LÝ TÌM KIẾM ---
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0); 
    };

    // --- XỬ LÝ FORM ---
    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Tên sản phẩm là bắt buộc";
        if (!formData.categoryId) newErrors.categoryId = "Loại sản phẩm là bắt buộc";
        if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Số lượng phải lớn hơn 0";
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Giá phải lớn hơn 0";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- ACTIONS (CREATE) ---
    const handleClickOpenAddDialog = () => {
        setFormData(emptyForm);
        setErrors({});
        setOpenAddDialog(true);
    };

    const handleSaveNewProduct = async () => {
        if (!validateForm()) return;
        const newProductData = {
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity, 10),
            categoryId: parseInt(formData.categoryId, 10),
        };

        try {
            await addProduct(newProductData);
            setOpenAddDialog(false);
            // Sau khi thêm, tải lại danh sách hiện tại
            fetchProducts(currentPage, selectedCategoryId, searchTerm);
        } catch (error) {
            setErrors({ api: "Không thể thêm sản phẩm. Vui lòng thử lại." });
        }
    };

    // --- ACTIONS (UPDATE) ---
    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setFormData({
            ...product,
            categoryId: product.category ? product.category.id : product.categoryId
        });
        setErrors({});
        setOpenEditDialog(true);
    };

    const handleUpdateProduct = async () => {
        if (!validateForm()) return;
        const updatedData = {
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity, 10),
            categoryId: parseInt(formData.categoryId, 10),
        };

        try {
            await updateProduct(currentProduct.id, updatedData);
            setOpenEditDialog(false);
            setCurrentProduct(null);
            setFormData(emptyForm);
            fetchProducts(currentPage, selectedCategoryId, searchTerm);
        } catch (error) {
            setErrors({ api: "Không thể cập nhật sản phẩm. Vui lòng thử lại." });
        }
    };

    // --- ACTIONS (DELETE) ---
    const handleDeleteProduct = (product) => {
        setCurrentProduct(product);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (currentProduct) {
            try {
                await deleteProduct(currentProduct.id);
                setOpenDeleteDialog(false);
                setCurrentProduct(null);
                fetchProducts(currentPage, selectedCategoryId, searchTerm);
            } catch (error) {
                setOpenDeleteDialog(false);
                setApiError("Không thể xóa sản phẩm. Vui lòng thử lại.");
            }
        }
    };

    // --- VIEW DETAILS ---
    const handleViewProduct = (product) => {
        setCurrentProduct(product);
        setOpenViewDialog(true);
    };

    // --- RENDER FORM FIELDS ---
    const renderFormFields = () => (
        <>
            {errors.api && <div className={styles.apiError}>{errors.api}</div>}
            <div className={styles.formGroup}>
                <label className={styles.label}>Tên sản phẩm <span className={styles.requiredStar}>*</span></label>
                <input
                    name="name"
                    type="text"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    value={formData.name}
                    onChange={handleFormChange}
                />
                {errors.name && <span className={styles.helperText}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="categoryId" className={styles.label}>Loại sản phẩm <span className={styles.requiredStar}>*</span></label>
                <select
                    id="categoryId"
                    name="categoryId"
                    className={`${styles.input} ${errors.categoryId ? styles.inputError : ''}`}
                    value={formData.categoryId}
                    onChange={handleFormChange}
                >
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                {errors.categoryId && <span className={styles.helperText}>{errors.categoryId}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Số lượng <span className={styles.requiredStar}>*</span></label>
                <input
                    name="quantity"
                    type="number"
                    className={`${styles.input} ${errors.quantity ? styles.inputError : ''}`}
                    value={formData.quantity}
                    onChange={handleFormChange}
                />
                {errors.quantity && <span className={styles.helperText}>{errors.quantity}</span>}
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Giá sản phẩm (VNĐ) <span className={styles.requiredStar}>*</span></label>
                <input
                    name="price"
                    type="text"
                    className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                    value={formData.price}
                    onChange={handleFormChange}
                />
                {errors.price && <span className={styles.helperText}>{errors.price}</span>}
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Mô tả</label>
                <textarea
                    name="description"
                    rows="3"
                    className={styles.input}
                    value={formData.description}
                    onChange={handleFormChange}
                />
            </div>
        </>
    );

    return (
        <div className={styles.container}>
            {/* Toolbar */}
            <div className={`${styles.paper} ${styles.toolbar}`}>
                <div className={styles.filterControls}>
                    <div className={styles.searchBox}>
                        <div className={styles.searchInputWrapper}>
                            <span className={styles.searchIcon}><MdSearch /></span>
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên..."
                                value={searchTerm}
                                onChange={handleSearchChange} // Gọi hàm xử lý search mới
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    <div className={styles.categoryFilter}>
                        <select
                            className={styles.categorySelect}
                            value={selectedCategoryId}
                            onChange={handleCategoryFilterChange}
                        >
                            <option value="All">Tất cả</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
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

            {apiError && (
                <div className={`${styles.paper} ${styles.apiErrorGlobal}`}>
                    {apiError}
                </div>
            )}

            {/* Table */}
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
                            <tr><td colSpan={6} className={styles.tableCellLoading}>Đang tải dữ liệu...</td></tr>
                        ) : (

                            products?.map((product) => (
                                <tr key={product.id} className={styles.tableRow}>
                                    <td className={styles.tableCell}>{product.id}</td>
                                    <td className={styles.tableCell}>{product.name}</td>
                                    <td className={styles.tableCell}>{product.categoryName}</td>
                                    <td className={styles.tableCell}>{parseFloat(product.price).toLocaleString()} VNĐ</td>
                                    <td className={styles.tableCell}>{product.quantity}</td>
                                    <td className={styles.tableCell}>
                                        <button className={`${styles.iconButton} ${styles.iconView}`} title="Xem chi tiết" onClick={() => handleViewProduct(product)}><MdVisibility /></button>
                                        <button className={`${styles.iconButton} ${styles.iconEdit}`} title="Sửa" onClick={() => handleEditProduct(product)}><MdEdit /></button>
                                        <button className={`${styles.iconButton} ${styles.iconDelete}`} title="Xóa" onClick={() => handleDeleteProduct(product)}><MdDelete /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                        {/* Hiển thị thông báo nếu không tìm thấy gì */}
                        {!isLoading && products.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                                    Không tìm thấy sản phẩm nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- PHÂN TRANG: ẨN KHI ĐANG TÌM KIẾM (!searchTerm) --- */}
            {!searchTerm && (
                <div className={styles.pagination}>
                    <button
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className={styles.pageButton}
                    >
                        Trước
                    </button>
                    <span className={styles.pageInfo}>Trang {currentPage + 1} / {totalPages || 1}</span>
                    <button
                        disabled={currentPage >= totalPages - 1}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className={styles.pageButton}
                    >
                        Sau
                    </button>
                </div>
            )}

            {/* --- (CREATE) DIALOG --- */}
            <div className={`${styles.dialogOverlay} ${openAddDialog ? styles.dialogOpen : ''}`} onClick={() => setOpenAddDialog(false)}>
                <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveNewProduct(); }}>
                        <h2 className={styles.dialogTitle}>Thêm sản phẩm mới</h2>
                        {renderFormFields()}
                        <div className={styles.dialogActions}>
                            <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => setOpenAddDialog(false)}>Hủy</button>
                            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>Lưu</button>
                        </div>
                    </form>
                </div>
            </div>

             {/* --- (UPDATE) DIALOG --- */}
            <div className={`${styles.dialogOverlay} ${openEditDialog ? styles.dialogOpen : ''}`} onClick={() => setOpenEditDialog(false)}>
                <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateProduct(); }}>
                        <h2 className={styles.dialogTitle}>Cập nhật sản phẩm</h2>
                        {renderFormFields()}
                        <div className={styles.dialogActions}>
                            <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => setOpenEditDialog(false)}>Hủy</button>
                            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>Cập nhật</button>
                        </div>
                    </form>
                </div>
            </div>

             {/* --- DELETE DIALOG --- */}
             <div className={`${styles.dialogOverlay} ${openDeleteDialog ? styles.dialogOpen : ''}`} onClick={() => setOpenDeleteDialog(false)}>
                <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
                    <h2 className={styles.dialogTitle}>Xác nhận Xóa</h2>
                    <p>Bạn có chắc chắn muốn xóa sản phẩm "{currentProduct?.name}"?</p>
                    <div className={styles.dialogActions}>
                        <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => setOpenDeleteDialog(false)}>Hủy</button>
                        <button className={`${styles.button} ${styles.buttonDanger}`} onClick={handleConfirmDelete}>Xác nhận Xóa</button>
                    </div>
                </div>
            </div>

             {/* --- VIEW DIALOG --- */}
             <div className={`${styles.dialogOverlay} ${openViewDialog ? styles.dialogOpen : ''}`} onClick={() => setOpenViewDialog(false)}>
                <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
                    <h2 className={styles.dialogTitle}>Chi tiết sản phẩm</h2>
                    {currentProduct && (
                        <div>
                            <p><strong>Tên:</strong> {currentProduct.name}</p>
                            <p><strong>Giá:</strong> {currentProduct.price ? parseFloat(currentProduct.price).toLocaleString() : 0} VNĐ</p>
                            <p><strong>Loại:</strong> {currentProduct.categoryName}</p>
                            <p><strong>Số lượng:</strong> {currentProduct.quantity}</p>
                            <p><strong>Mô tả:</strong> {currentProduct.description}</p>
                        </div>
                    )}
                    <div className={styles.dialogActions}>
                        <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={() => setOpenViewDialog(false)}>Đóng</button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ProductManagement;