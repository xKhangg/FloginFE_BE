import productPage from '../pages/ProductPage.js'; // Đảm bảo đường dẫn import đúng
import LoginPage from '../pages/LoginPage.js';

describe('Product Management E2E Tests using POM', () => {

    // Dữ liệu test: Tạo tên ngẫu nhiên để tránh trùng lặp khi chạy test nhiều lần
    const timestamp = new Date().getTime();

    const initialProduct = {
        name: `Sách POM ${timestamp}`,
        price: '150000',
        quantity: '50',
        categoryName: 'Trinh thám', // Phải khớp với text trong <option>
        description: 'Mô tả test tự động dùng Page Object Model'
    };

    const updatedProduct = {
        name: `Sách POM ${timestamp} UPDATED`,
        price: '250000',
        quantity: '10'
    };

    // Chạy trước mỗi bài test (it block)
    beforeEach(() => {
        cy.session('user-session', () => {
            LoginPage.open();
            LoginPage.login('testuser', 'Test123'); // Nhớ sửa pass
            // Đợi login thành công (quan trọng)
            cy.url().should('not.include', '/login');
        });

        productPage.visit();
    });

    // =================================================================
    // a) Test Create product flow
    // =================================================================
    it('a) Create: Tạo sản phẩm mới thành công', () => {
        productPage.openAddModal();
        productPage.fillProductForm(initialProduct);
        productPage.submitCreate();

        // Verify: Sản phẩm vừa tạo phải hiển thị trong bảng
        // (Có thể cần search nếu sản phẩm nằm ở trang sau,
        // nhưng ở đây ta giả định nó hiện ở đầu hoặc ta search để verify chắc chắn)
        productPage.searchProduct(initialProduct.name);
        productPage.verifyProductVisible(initialProduct.name);
    });

    // =================================================================
    // b) Test Read/List products
    // (Bao gồm: Xem danh sách và Xem chi tiết 1 sản phẩm)
    // =================================================================
    it('b) Read: Hiển thị danh sách và Xem chi tiết sản phẩm', () => {
        // 1. Kiểm tra danh sách (Table) có dữ liệu
        productPage.elements.tableRows().should('have.length.greaterThan', 0);

        // 2. Tìm sản phẩm vừa tạo ở bước (a)
        productPage.searchProduct(initialProduct.name);

        // 3. Xem chi tiết sản phẩm đó
        productPage.viewProduct(initialProduct.name);

        // Verify: Dialog chi tiết mở ra (Action viewProduct đã verify dialog visible)
        // Có thể verify thêm nội dung bên trong dialog nếu cần
        cy.contains(initialProduct.description).should('be.visible');

        // Đóng dialog
        productPage.elements.closeViewBtn().click();
    });

    // =================================================================
    // e) Test Search/Filter functionality
    // (Đặt ở đây để test tính năng tìm kiếm trước khi sửa tên)
    // =================================================================
    it('e) Search & Filter: Tìm theo tên và Lọc theo loại', () => {
        // 1. Test Search theo tên
        productPage.searchProduct(initialProduct.name);
        productPage.verifyProductVisible(initialProduct.name);

        // Verify bảng chỉ hiện 1 dòng (nếu tên là duy nhất)
        productPage.elements.tableRows().should('have.length', 1);

        // 2. Test Filter theo loại
        // Clear search trước để test riêng tính năng filter
        productPage.searchProduct('');

        productPage.filterByCategory(initialProduct.categoryName);

        // Verify: Sau khi lọc, sản phẩm thuộc loại đó vẫn phải hiển thị
        // (Ta kết hợp search lại tên để chắc chắn tìm thấy đúng nó trong danh sách đã lọc)
        productPage.searchProduct(initialProduct.name);
        productPage.verifyProductVisible(initialProduct.name);
    });

    // =================================================================
    // c) Test Update product
    // =================================================================
    it('c) Update: Cập nhật thông tin sản phẩm', () => {
        // Tìm sản phẩm cần sửa
        productPage.searchProduct(initialProduct.name);

        // Mở modal sửa
        productPage.openEditModal(initialProduct.name);

        // Điền thông tin mới
        productPage.fillProductForm(updatedProduct);

        // Submit
        productPage.submitUpdate();

        // Verify:
        // 1. Tìm theo tên MỚI -> Phải thấy
        productPage.searchProduct(updatedProduct.name);
        productPage.verifyProductVisible(updatedProduct.name);

        // 2. Kiểm tra giá mới (đã format) hiển thị trên bảng
        // (Giả sử 250000 -> 250,000)
        cy.contains('250,000').should('be.visible');

        // 3. Tìm theo tên CŨ -> Không được thấy
        productPage.searchProduct(initialProduct.name);
        cy.contains('Không tìm thấy dữ liệu').should('exist'); // Hoặc check table rỗng
    });

    // =================================================================
    // d) Test Delete product
    // =================================================================
    it('d) Delete: Xóa sản phẩm thành công', () => {
        // Tìm sản phẩm đã bị đổi tên ở bước (c)
        productPage.searchProduct(updatedProduct.name);

        // Thực hiện xóa
        productPage.deleteProduct(updatedProduct.name);

        // Verify: Tìm lại tên đó thì không thấy nữa
        productPage.searchProduct(updatedProduct.name);

        // Kiểm tra bảng không còn dòng nào chứa tên đó
        // (Lưu ý: Nếu bảng rỗng hoàn toàn, tableRows có thể không tồn tại hoặc length = 0)
        cy.get('body').then(($body) => {
            if ($body.find('table tbody tr').length > 0) {
                productPage.verifyProductNotVisible(updatedProduct.name);
            } else {
                // Nếu bảng rỗng hoặc hiện thông báo "No data"
                cy.contains(updatedProduct.name).should('not.exist');
            }
        });
    });

});

describe('Security Test: XSS Vulnerability', () => {
    it('Nên ngăn chặn thực thi mã độc JavaScript (XSS)', () => {
        // 1. Chuẩn bị payload độc hại
        const xssPayload = "<script>alert('Hacked')</script>";

        // 2. Dùng Page Object để tạo sản phẩm với tên là payload này
        // (Giả sử bạn đã login trong beforeEach)
        cy.visit('http://localhost:3000');
        cy.contains('button', 'Thêm mới').click();
        cy.get('input[name="name"]').type(xssPayload);
        // ... điền các trường khác ...
        cy.get('form').submit();

        // 3. VERIFY (Quan trọng nhất)
        // Nếu React an toàn: Nó sẽ hiển thị nguyên văn chuỗi text đó
        cy.contains(xssPayload).should('be.visible');

        // Nếu React lỗi: Nó sẽ chạy script và KHÔNG hiện text đó lên màn hình
        // (Cypress sẽ tự động fail nếu window.alert xuất hiện mà không được handle,
        // nhưng kiểm tra text visible là cách dễ nhất để chứng minh nó bị escape).
    });
});