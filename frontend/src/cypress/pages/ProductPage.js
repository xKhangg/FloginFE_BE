class ProductPage {
    elements = {
        searchInput: () => cy.get('input[placeholder="Tìm kiếm theo tên..."]'),
        categorySelect: () => cy.contains('option', 'Tất cả').parent(),
        addBtn: () => cy.contains('button', 'Thêm mới'),

        tableRows: () => cy.get('table tbody tr'),
        nextPageBtn: () => cy.contains('button', 'Sau'),
        prevPageBtn: () => cy.contains('button', 'Trước'),
        pageInfo: () => cy.get('span').contains('Trang'), // Tìm span có chữ "Trang"

        nameInput: () => cy.get('input[name="name"]').filter(':visible'),
        priceInput: () => cy.get('input[name="price"]').filter(':visible'),
        quantityInput: () => cy.get('input[name="quantity"]').filter(':visible'),
        categoryInput: () => cy.get('select[name="categoryId"]').filter(':visible'), // Select trong Form
        descriptionInput: () => cy.get('textarea[name="description"]').filter(':visible'),

        saveBtn: () => cy.contains('button', 'Lưu'),
        updateBtn: () => cy.contains('button', 'Cập nhật'),
        cancelBtn: () => cy.contains('button', 'Hủy'),
        confirmDeleteBtn: () => cy.contains('button', 'Xác nhận Xóa'),
        closeViewBtn: () => cy.contains('button', 'Đóng'),

        addDialogTitle: () => cy.contains('h2', 'Thêm sản phẩm mới'),
        editDialogTitle: () => cy.contains('h2', 'Cập nhật sản phẩm'),
        deleteDialogTitle: () => cy.contains('h2', 'Xác nhận Xóa'),
        viewDialogTitle: () => cy.contains('h2', 'Chi tiết sản phẩm'),
    };

    visit() {
        cy.visit('http://localhost:3000');
        cy.contains('Đang tải dữ liệu...').should('not.exist');
    }

    searchProduct(name) {
        this.elements.searchInput().clear().type(name);
    }

    filterByCategory(categoryName) {
        this.elements.categorySelect().select(categoryName);
    }

    openAddModal() {
        this.elements.addBtn().click();
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
    }

    openEditModal(productName) {
        cy.contains('tr', productName)
            .find('button[title="Sửa"]')
            .click();
    }

    submitUpdate() {
        this.elements.updateBtn().click();
    }

    deleteProduct(productName) {
        cy.contains('tr', productName)
            .find('button[title="Xóa"]')
            .click();
        this.elements.deleteDialogTitle().should('be.visible');
        this.elements.confirmDeleteBtn().click();
    }

    viewProduct(productName) {
        cy.contains('tr', productName)
            .find('button[title="Xem chi tiết"]')
            .click();
        this.elements.viewDialogTitle().should('be.visible');
    }

    verifyProductVisible(name) {
        cy.contains('td', 'Đang tải dữ liệu...').should('not.exist');

        cy.contains('table tbody tr', name)
            .scrollIntoView()
            .should('be.visible');
    }

    verifyProductNotVisible(name) {
        cy.contains('table tbody tr', name).should('not.exist');
    }
}

export default new ProductPage();