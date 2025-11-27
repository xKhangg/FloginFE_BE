import React, { useState, useEffect, useMemo } from 'react';
import styles from './ProductManagement.module.css'; 

// --- IMPORT API ---
import { 
    getProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct 
} from '../../services/productService';

// Import thêm service Category mới (bạn nhớ tạo file này nhé)
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
    categoryName: '', // Lưu ý: Form thêm mới vẫn cần nhập tên category hoặc chọn từ dropdown (tùy logic bạn muốn)
    description: '',
};

function ProductManagement() {
    // --- STATE DỮ LIỆU ---
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // Danh sách loại lấy từ Server
    const [isLoading, setIsLoading] = useState(false);
    
    // --- STATE BỘ LỌC & PHÂN TRANG ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('All'); // Lọc theo ID hoặc 'All'
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5; // Số lượng item/trang (khớp với config backend nếu có)

    // --- STATE FORM & DIALOG ---
    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    // --- 1. TẢI DANH SÁCH CATEGORY (Chạy 1 lần khi mount) ---
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                // Giả sử API trả về mảng object [{id: 1, name: 'Trinh thám'}, ...]
                setCategories(res.data || []);
            } catch (err) {
                console.error("Lỗi tải categories", err);
            }
        };
        fetchCategories();
    }, []);

    // --- 2. TẢI SẢN PHẨM (Server-side Pagination & Filtering) ---
    const fetchProducts = async (page, catId) => {
        setIsLoading(true);
        setApiError(null);
        try {
            // Xử lý tham số lọc category (nếu 'All' thì gửi null hoặc không gửi)
            const idToSend = (catId === 'All' || catId === '') ? null : catId;
            
            // Gọi API: getProducts(page, categoryId)
            const response = await getProducts(page, idToSend);
            
            // Cập nhật state từ response của Spring Page<ProductDTO>
            setProducts(response.data.content || []);
            setTotalPages(response.data.totalPages || 0); 

        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
            setApiError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.");
        }
        setIsLoading(false);
    };

    // --- 3. GỌI API KHI THAY ĐỔI TRANG HOẶC BỘ LỌC ---
    useEffect(() => {
        // Gọi fetchProducts mỗi khi currentPage hoặc selectedCategoryId thay đổi
        fetchProducts(currentPage, selectedCategoryId);
    }, [currentPage, selectedCategoryId]);

    // --- XỬ LÝ THAY ĐỔI BỘ LỌC ---
    const handleCategoryFilterChange = (e) => {
        setSelectedCategoryId(e.target.value);
        setCurrentPage(0); // Reset về trang 1 khi đổi bộ lọc
    };

    // --- XỬ LÝ FORM ---
    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Tên sản phẩm là bắt buộc";
        if (!formData.categoryName) newErrors.categoryName = "Loại sản phẩm là bắt buộc";
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
            // Lưu ý: Backend đang nhận DTO có thể cần categoryId hoặc categoryName
            // Tạm thời giữ nguyên logic cũ là gửi tên category
            categoryName: formData.categoryName, 
        };

        try {
            await addProduct(newProductData);
            setOpenAddDialog(false);
            fetchProducts(currentPage, selectedCategoryId); // Tải lại trang hiện tại
        } catch (error) {
            setErrors({ api: "Không thể thêm sản phẩm. Vui lòng thử lại." });
        }
    };

    // --- ACTIONS (UPDATE) ---
    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setFormData(product);
        setErrors({});
        setOpenEditDialog(true);
    };

    const handleUpdateProduct = async () => {
        if (!validateForm()) return;
        const updatedData = {
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity, 10),
            categoryName: formData.categoryName,
        };

        try {
            await updateProduct(currentProduct.id, updatedData);
            setOpenEditDialog(false);
            setCurrentProduct(null);
            setFormData(emptyForm);
            fetchProducts(currentPage, selectedCategoryId);
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
                fetchProducts(currentPage, selectedCategoryId);
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

    // --- RENDER FORM ---
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
            
            {/* Dropdown chọn loại sản phẩm khi thêm/sửa */}
        <div className={styles.formGroup}>
                        <label htmlFor="categoryName" className={styles.label}>Loại sản phẩm <span className={styles.requiredStar}>*</span></label>

                        {/* Thay bằng thẻ SELECT để hiển thị danh sách */}
                        <select
                            id="categoryName"
                            name="categoryName"
                            className={`${styles.input} ${errors.categoryName ? styles.inputError : ''}`}
                            value={formData.categoryName}
                            onChange={handleFormChange}
                        >

                            {/* Duyệt qua danh sách categories đã tải từ API */}
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        {errors.categoryName && <span className={styles.helperText}>{errors.categoryName}</span>}
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
                    {/* Tìm kiếm Client-side (nếu muốn) hoặc Server-side (cần cập nhật API) */}
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

                    {/* Dropdown Lọc Server-side */}
                    <div className={styles.categoryFilter}>
                        <select
                            className={styles.categorySelect}
                            value={selectedCategoryId}
                            onChange={handleCategoryFilterChange}
                        >
                            <option value="All">Tất cả</option>
                            {/* Render danh sách category lấy từ API */}
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
                            // Lọc tìm kiếm ở client-side (tạm thời)
                            products
                                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((product) => (
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
                    </tbody>
                </table>
            </div>

            {/* --- PHÂN TRANG (MỚI) --- */}
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

            {/* ... Các Dialog Add/Edit/Delete/View giữ nguyên như cũ ... */}
            {/* (Tôi lược bớt phần JSX Dialog để code ngắn gọn, bạn giữ nguyên phần đó nhé) */}
            
            {/* --- (CREATE) DIALOG THÊM MỚI --- */}
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
             {/* --- DELETE & VIEW Dialogs (Giữ nguyên code cũ của bạn) --- */}
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
             <div className={`${styles.dialogOverlay} ${openViewDialog ? styles.dialogOpen : ''}`} onClick={() => setOpenViewDialog(false)}>
                <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
                    <h2 className={styles.dialogTitle}>Chi tiết sản phẩm</h2>
                    {currentProduct && (
                        <div>
                            <p><strong>Tên:</strong> {currentProduct.name}</p>
                            <p><strong>Giá:</strong> {currentProduct.price}</p>
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