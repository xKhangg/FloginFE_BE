Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes("Cannot read properties of null (reading 'document')")) {
        return false;
    }
    return true;
});
class ProductPage {
    elements = {
        searchInput: () => cy.get('input[placeholder="Tìm kiếm theo tên..."]'),
        addBtn: () => cy.contains('button', 'Thêm mới'),

        tableRows: () => cy.get('table tbody tr'),

        nameInput: () => cy.get('input[name="name"]').filter(':visible'),
        priceInput: () => cy.get('input[name="price"]').filter(':visible'),
        quantityInput: () => cy.get('input[name="quantity"]').filter(':visible'),
        categoryInput: () => cy.get('select[name="categoryId"]').filter(':visible'),
        descriptionInput: () => cy.get('textarea[name="description"]').filter(':visible'),

        saveBtn: () => cy.contains('button', 'Lưu'),
        updateBtn: () => cy.contains('button', 'Cập nhật'),
        confirmDeleteBtn: () => cy.contains('button', 'Xác nhận Xóa'),
        closeViewBtn: () => cy.contains('button', 'Đóng'),

        addDialogTitle: () => cy.contains('h2', 'Thêm sản phẩm mới'),
        deleteDialogTitle: () => cy.contains('h2', 'Xác nhận Xóa'),
        viewDialogTitle: () => cy.contains('h2', 'Chi tiết sản phẩm'),
    };

    visit() {
        cy.visit('http://localhost:3000');
    }

    searchProduct(name) {
        this.elements.searchInput().clear().type(name);
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
        cy.contains('table tbody tr', name)
            .scrollIntoView()
            .should('be.visible');
    }

    verifyProductNotVisible(name) {
        cy.contains('table tbody tr', name).should('not.exist');
    }
}

export default new ProductPage();