class ProductPage {
    // ===========================
    // 1. SELECTORS (ELEMENTS)
    // ===========================
    elements = {
        // Toolbar
        searchInput: () => cy.get('input[placeholder="Tìm kiếm theo tên..."]'),
        categorySelect: () => cy.get('select'), // Tìm thẻ select (Dropdown lọc)
        addBtn: () => cy.contains('button', 'Thêm mới'),

        // Bảng & Phân trang
        tableRows: () => cy.get('table tbody tr'),
        nextPageBtn: () => cy.contains('button', 'Sau'),
        prevPageBtn: () => cy.contains('button', 'Trước'),
        pageInfo: () => cy.get('span').contains('Trang'), // Tìm span có chữ "Trang"

        // Dialog (Form Thêm/Sửa)
        // Giả định renderFormFields tạo ra input có name chuẩn
        nameInput: () => cy.get('input[name="name"]').filter(':visible'),
        priceInput: () => cy.get('input[name="price"]').filter(':visible'),
        quantityInput: () => cy.get('input[name="quantity"]').filter(':visible'),
        categoryInput: () => cy.get('select[name="categoryId"]').filter(':visible'), // Select trong Form
        descriptionInput: () => cy.get('textarea[name="description"]').filter(':visible'),

        // Nút trong Dialog
        saveBtn: () => cy.contains('button', 'Lưu'),
        updateBtn: () => cy.contains('button', 'Cập nhật'),
        cancelBtn: () => cy.contains('button', 'Hủy'),
        confirmDeleteBtn: () => cy.contains('button', 'Xác nhận Xóa'),
        closeViewBtn: () => cy.contains('button', 'Đóng'),

        // Tiêu đề Dialog (để kiểm tra dialog đã mở chưa)
        addDialogTitle: () => cy.contains('h2', 'Thêm sản phẩm mới'),
        editDialogTitle: () => cy.contains('h2', 'Cập nhật sản phẩm'),
        deleteDialogTitle: () => cy.contains('h2', 'Xác nhận Xóa'),
        viewDialogTitle: () => cy.contains('h2', 'Chi tiết sản phẩm'),
    };

    // ===========================
    // 2. ACTIONS (METHODS)
    // ===========================

    visit() {
        cy.visit('http://localhost:3000'); // Thay port nếu cần
        // Đợi loading biến mất để chắc chắn trang đã tải
        cy.contains('Đang tải dữ liệu...').should('not.exist');
    }

    // --- Nghiệp vụ Tìm kiếm & Lọc ---
    searchProduct(name) {
        this.elements.searchInput().clear().type(name);
        // Code của bạn dùng onChange nên không cần bấm enter, có thể wait nhẹ nếu có debounce
        // cy.wait(500);
    }

    filterByCategory(categoryName) {
        this.elements.categorySelect().select(categoryName);
    }

    // --- Nghiệp vụ Thêm mới ---
    openAddModal() {
        this.elements.addBtn().click();
        this.elements.addDialogTitle().should('be.visible');
    }

    fillProductForm(product) {
        if (product.name) this.elements.nameInput().clear().type(product.name);
        if (product.price) this.elements.priceInput().clear().type(product.price);
        if (product.quantity) this.elements.quantityInput().clear().type(product.quantity);
        if (product.categoryName) this.elements.categoryInput().select(product.categoryName);
        if (product.description) this.elements.descriptionInput().clear().type(product.description);
    }

    submitCreate() {
        this.elements.saveBtn().click();
        // this.elements.addDialogTitle().should('not.exist'); // Đợi dialog đóng
    }

    // --- Nghiệp vụ Sửa ---
    openEditModal(productName) {
        // Tìm dòng chứa tên sản phẩm -> tìm nút có title="Sửa" -> Click
        cy.contains('tr', productName)
            .find('button[title="Sửa"]')
            .click();
        this.elements.editDialogTitle().should('be.visible');
    }

    submitUpdate() {
        this.elements.updateBtn().click();
        this.elements.editDialogTitle().should('not.exist');
    }

    // --- Nghiệp vụ Xóa ---
    deleteProduct(productName) {
        cy.contains('tr', productName)
            .find('button[title="Xóa"]')
            .click();
        this.elements.deleteDialogTitle().should('be.visible');
        this.elements.confirmDeleteBtn().click();
        this.elements.deleteDialogTitle().should('not.exist');
    }

    // --- Nghiệp vụ Xem chi tiết ---
    viewProduct(productName) {
        cy.contains('tr', productName)
            .find('button[title="Xem chi tiết"]')
            .click();
        this.elements.viewDialogTitle().should('be.visible');
    }

    // --- Helpers ---
    verifyProductVisible(name) {
        cy.contains('td', 'Đang tải dữ liệu...').should('not.exist');

        // 2. Tìm dòng (tr) chứa tên sản phẩm
        // .scrollIntoView(): Giúp test không bị lỗi nếu sản phẩm nằm ở cuối danh sách dài
        cy.contains('table tbody tr', name)
            .scrollIntoView()
            .should('be.visible');
    }

    verifyProductNotVisible(name) {
        cy.contains('table tbody tr', name).should('not.exist');
    }
}

export default new ProductPage();