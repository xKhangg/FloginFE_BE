describe('Product Management E2E Tests', () => {
    // Biến tạo dữ liệu ngẫu nhiên để tránh trùng lặp khi chạy test nhiều lần
    const timestamp = new Date().getTime();
    const testProduct = {
        name: `Sách E2E ${timestamp}`,
        price: '150000',
        quantity: '100',
        categoryId: '1', // Giả sử ID 1 là "Trinh thám" (hoặc value trong <option>)
        description: 'Mô tả test tự động Cypress'
    };

    const updatedProduct = {
        name: `Sách E2E ${timestamp} EDITED`,
        price: '200000'
    };

    beforeEach(() => {
        // Thay đổi port nếu bạn chạy khác (ví dụ 3000 hoặc 5173)
        cy.visit('http://localhost:5173');

        // Đợi bảng tải xong (không còn hiện "Đang tải dữ liệu...")
        cy.contains('Đang tải dữ liệu...').should('not.exist');
    });

    // ==========================================
    // a) Test Create product flow (0.5 điểm)
    // ==========================================
    it('a) Create: Nên tạo sản phẩm mới thành công', () => {
        // 1. Nhấn nút "Thêm mới" (Dựa vào text trong nút)
        cy.contains('button', 'Thêm mới').click();

        // 2. Kiểm tra Dialog mở ra (Dựa vào title của Dialog)
        cy.contains('h2', 'Thêm sản phẩm mới').should('be.visible');

        // 3. Điền Form
        // Lưu ý: Giả định input trong renderFormFields có name tương ứng
        cy.get('input[name="name"]').type(testProduct.name);
        cy.get('input[name="price"]').type(testProduct.price);
        cy.get('input[name="quantity"]').type(testProduct.quantity);

        // Chọn loại sản phẩm (Tìm thẻ select bên trong Dialog)
        // Giả sử form dùng <select name="categoryId">
        cy.get('form select[name="categoryId"]').select(testProduct.categoryId);

        cy.get('textarea[name="description"]').type(testProduct.description);

        // 4. Nhấn nút "Lưu" (Type submit trong form)
        cy.get('form').submit(); // Hoặc: cy.contains('button', 'Lưu').click();

        // 5. Verify: Dialog đóng và thấy sản phẩm trong bảng
        cy.contains('h2', 'Thêm sản phẩm mới').should('not.exist');
        cy.contains(testProduct.name).should('be.visible');
    });

    // ==========================================
    // e) Test Search/Filter functionality (0.5 điểm)
    // (Test Filter theo Category để tìm sản phẩm vừa tạo)
    // ==========================================
    it('e) Filter: Nên lọc sản phẩm theo loại thành công', () => {
        // 1. Tìm thẻ <select> và chọn loại sản phẩm
        // (Giả sử testProduct.categoryName là "Trinh thám" hoặc giá trị bạn dùng trong JSX)
        const categoryToSelect = 'Trinh thám'; // Hoặc dùng biến: testProduct.categoryName

        // Cypress sẽ tìm thẻ select và chọn option có text hoặc value khớp
        cy.get('select').select(categoryToSelect);

        // 2. Đợi/Kiểm tra UI phản hồi (React sẽ render lại bảng)

        // 3. Verify: Bảng vẫn phải hiển thị sản phẩm vừa tạo (vì nó thuộc loại này)
        cy.contains('tbody tr', testProduct.name).should('be.visible');

        // 4. Kiểm tra kỹ hơn: Cột "Loại sản phẩm" trong bảng phải hiển thị đúng loại đã chọn
        // (Lấy dòng đầu tiên -> tìm trong dòng đó -> phải chứa chữ "Trinh thám")
        cy.get('tbody tr').first().within(() => {
            cy.contains('td', categoryToSelect).should('exist');
        });
    });

    // ==========================================
    // b) Test Read/List products (0.5 điểm)
    // ==========================================
    it('b) Read: Nên hiển thị danh sách và xem chi tiết', () => {
        // 1. Kiểm tra các cột tiêu đề (Dựa vào JSX thead)
        cy.contains('th', 'Tên sản phẩm').should('be.visible');
        cy.contains('th', 'Giá').should('be.visible');
        cy.contains('th', 'Hành động').should('be.visible');

        // 2. Tìm sản phẩm vừa tạo và nhấn nút "Xem chi tiết" (icon con mắt)
        // Dùng cy.get('button[title="Xem chi tiết"]') như trong JSX
        cy.contains('tr', testProduct.name)
            .find('button[title="Xem chi tiết"]')
            .click();

        // 3. Verify Dialog chi tiết hiện ra
        cy.contains('h2', 'Chi tiết sản phẩm').should('be.visible');
        cy.contains(testProduct.name).should('be.visible');
        cy.contains(testProduct.description).should('be.visible');

        // 4. Đóng dialog
        cy.contains('button', 'Đóng').click();
        cy.contains('h2', 'Chi tiết sản phẩm').should('not.exist');
    });

    // ==========================================
    // c) Test Update product (0.5 điểm)
    // ==========================================
    it('c) Update: Nên cập nhật thông tin sản phẩm thành công', () => {
        // 1. Tìm sản phẩm (search để chắc chắn chọn đúng)
        cy.get('input[placeholder="Tìm kiếm theo tên..."]').clear().type(testProduct.name);

        // 2. Nhấn nút "Sửa" (icon cây bút)
        // Dựa vào title="Sửa" trong JSX
        cy.contains('tr', testProduct.name)
            .find('button[title="Sửa"]')
            .click();

        // 3. Verify Dialog cập nhật mở ra
        cy.contains('h2', 'Cập nhật sản phẩm').should('be.visible');

        // 4. Sửa giá trị (Name và Price)
        cy.get('input[name="name"]').clear().type(updatedProduct.name);
        cy.get('input[name="price"]').clear().type(updatedProduct.price);

        // 5. Nhấn "Cập nhật"
        cy.contains('button', 'Cập nhật').click();

        // 6. Verify: Tên mới xuất hiện trong bảng
        // Xóa ô search cũ đi để nhìn thấy list mới (nếu cần)
        cy.get('input[placeholder="Tìm kiếm theo tên..."]').clear().type(updatedProduct.name);
        cy.contains(updatedProduct.name).should('be.visible');
        cy.contains(testProduct.name).should('not.exist');
    });

    // ==========================================
    // d) Test Delete product (0.5 điểm)
    // ==========================================
    it('d) Delete: Nên xóa sản phẩm thành công', () => {
        // 1. Tìm sản phẩm đã được update
        cy.get('input[placeholder="Tìm kiếm theo tên..."]').clear().type(updatedProduct.name);

        // 2. Nhấn nút "Xóa" (icon thùng rác)
        // Dựa vào title="Xóa" trong JSX
        cy.contains('tr', updatedProduct.name)
            .find('button[title="Xóa"]')
            .click();

        // 3. Verify Dialog xác nhận xóa mở ra
        cy.contains('h2', 'Xác nhận Xóa').should('be.visible');
        cy.contains(`Bạn có chắc chắn muốn xóa sản phẩm "${updatedProduct.name}"?`).should('be.visible');

        // 4. Nhấn nút "Xác nhận Xóa" (Nút nguy hiểm)
        cy.contains('button', 'Xác nhận Xóa').click();

        // 5. Verify: Sản phẩm biến mất khỏi bảng
        cy.contains(updatedProduct.name).should('not.exist');
    });

});