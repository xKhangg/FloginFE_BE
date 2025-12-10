import productPage from '../pages/ProductPage.js';
import LoginPage from '../pages/LoginPage.js';

describe('Product Management E2E Tests using POM', () => {

    const timestamp = new Date().getTime();

    const initialProduct = {
        name: `Sách POM ${timestamp}`,
        price: '150000',
        quantity: '50',
        categoryName: 'Trinh thám',
        description: 'Mô tả test tự động dùng Page Object Model'
    };

    const updatedProduct = {
        name: `Sách POM ${timestamp} UPDATED`,
        price: '250000',
        quantity: '10'
    };

    beforeEach(() => {
        cy.session('user-session', () => {
            LoginPage.open();
            LoginPage.login('testuser', 'Test123');
            cy.url().should('not.include', '/login');
        });

        productPage.visit();
    });

    it('a) Create: Tạo sản phẩm mới thành công', () => {
        productPage.openAddModal();
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

    it('e) Search & Filter: Tìm theo tên và Lọc theo loại', () => {
        productPage.searchProduct(initialProduct.name);
        productPage.verifyProductVisible(initialProduct.name);

        productPage.elements.tableRows().should('have.length', 1);

        productPage.filterByCategory(initialProduct.categoryName);

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

        productPage.searchProduct(initialProduct.name);
    });

    it('d) Delete: Xóa sản phẩm thành công', () => {
        productPage.searchProduct(updatedProduct.name);

        productPage.deleteProduct(updatedProduct.name);

        productPage.searchProduct(updatedProduct.name);

        cy.get('body').then(($body) => {
            if ($body.find('table tbody tr').length > 0) {
                productPage.verifyProductNotVisible(updatedProduct.name);
            } else {
                cy.contains(updatedProduct.name).should('not.exist');
            }
        });
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
        cy.session('user-session', () => {
            LoginPage.open();
            LoginPage.login('testuser', 'Test123');
            cy.url().should('not.include', '/login');
        });

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