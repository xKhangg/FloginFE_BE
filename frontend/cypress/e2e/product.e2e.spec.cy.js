import productPage from '../pages/ProductPage.js';
import LoginPage from '../pages/LoginPage.js';

describe('Product Management E2E Tests using POM', () => {

    const initialProduct = {
        name: `Sách POM`,
        price: '150000',
        quantity: '50',
        categoryName: 'Trinh thám',
        description: 'Mô tả test tự động dùng Page Object Model'
    };

    const updatedProduct = {
        name: `Sách POM 1`,
        price: '250000',
        quantity: '10'
    };

    beforeEach(() => {
        LoginPage.open();
        LoginPage.login('testuser', 'Test123');
        cy.url().should('not.include', '/login');

        productPage.visit();
    });

    it('a) Create: Tạo sản phẩm mới thành công', () => {
        cy.intercept('GET', '/api/categories').as('getCategories');
        productPage.openAddModal();
        cy.wait('@getCategories');
        productPage.fillProductForm(initialProduct);
        productPage.submitCreate();

        productPage.searchProduct(initialProduct.name);
        productPage.verifyProductVisible(initialProduct.name);
    });

    it('b) Read: Hiển thị danh sách và Xem chi tiết sản phẩm', () => {
        productPage.elements.tableRows().should('have.length.greaterThan', 0);

        productPage.searchProduct(initialProduct.name);

        productPage.viewProduct(initialProduct.name);

        cy.contains(initialProduct.description).should('be.visible');

        productPage.elements.closeViewBtn().click();
    });

    it('e) Search & Filter: Tìm theo tên sản phẩm', () => {
        productPage.searchProduct(initialProduct.name);
        productPage.verifyProductVisible(initialProduct.name);
    });

    it('c) Update: Cập nhật thông tin sản phẩm', () => {
        productPage.searchProduct(initialProduct.name);

        productPage.openEditModal(initialProduct.name);

        productPage.fillProductForm(updatedProduct);

        productPage.submitUpdate();

        productPage.searchProduct(updatedProduct.name);
        productPage.verifyProductVisible(updatedProduct.name);

        cy.contains('250,000').should('be.visible');
    });

    it('d) Delete: Xóa sản phẩm thành công', () => {
        productPage.searchProduct(updatedProduct.name);

        productPage.deleteProduct(updatedProduct.name);

        productPage.searchProduct(updatedProduct.name);

        productPage.verifyProductNotVisible(updatedProduct.name);
    });

    it('Validation: Nên hiện lỗi khi nhập dữ liệu không hợp lệ', () => {
        productPage.openAddModal();

        productPage.fillProductForm({
            name: '',
            price: '-50000'
        });

        productPage.submitCreate();

        productPage.elements.addDialogTitle().should('be.visible');

        cy.contains('Tên sản phẩm là bắt buộc').should('be.visible');
        cy.contains('Số lượng phải lớn hơn 0').should('be.visible');
    });

});

describe('Security Test: XSS Vulnerability', () => {
    const initialProduct1 = {
        name: `<script>alert('Hacked')</script>`,
        price: '150000',
        quantity: '50',
        categoryName: 'Trinh thám',
        description: 'Mô tả test tự động dùng Page Object Model'
    };

    beforeEach(() => {
        LoginPage.open();
        LoginPage.login('testuser', 'Test123');
        cy.url().should('not.include', '/login');

        productPage.visit();
    });

    it('Nên ngăn chặn thực thi mã độc JavaScript (XSS)', () => {
        productPage.openAddModal();
        productPage.fillProductForm(initialProduct1);
        productPage.submitCreate();

        productPage.searchProduct(initialProduct1.name);
        productPage.verifyProductVisible(initialProduct1.name);
    });
});