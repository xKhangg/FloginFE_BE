-- =========================================================================
--  CHÈN DỮ LIỆU CHO BẢNG CATEGORIES (LOẠI SẢN PHẨM)
-- =========================================================================

-- 1. Trinh thám
INSERT INTO categories (name)
SELECT 'Trinh thám'
    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Trinh thám');

-- 2. Thiếu nhi
INSERT INTO categories (name)
SELECT 'Thiếu nhi'
    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Thiếu nhi');

-- 3. Khoa học
INSERT INTO categories (name)
SELECT 'Khoa học'
    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Khoa học');


-- =========================================================================
--  CHÈN DỮ LIỆU CHO BẢNG PRODUCTS (SẢN PHẨM)
-- =========================================================================

-- --- 5 CUỐN SÁCH CŨ ---

-- Cuốn 1: Trinh thám
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Sherlock Holmes Toàn Tập', 350000, 50, 'Tuyển tập các vụ án kinh điển của Sherlock Holmes.', (SELECT id FROM categories WHERE name = 'Trinh thám')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sherlock Holmes Toàn Tập');

-- Cuốn 2: Trinh thám
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Án Mạng Trên Sông Nile', 120000, 30, 'Tác giả: Agatha Christie. Một vụ án bí ẩn trên du thuyền.', (SELECT id FROM categories WHERE name = 'Trinh thám')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Án Mạng Trên Sông Nile');

-- Cuốn 3: Thiếu nhi
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Dế Mèn Phiêu Lưu Ký', 80000, 100, 'Tác giả: Tô Hoài. Phiên bản có tranh minh họa màu.', (SELECT id FROM categories WHERE name = 'Thiếu nhi')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dế Mèn Phiêu Lưu Ký');

-- Cuốn 4: Khoa học
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Lược Sử Vạn Vật', 250000, 40, 'Tác giả: Bill Bryson. Giải thích khoa học một cách hài hước.', (SELECT id FROM categories WHERE name = 'Khoa học')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Lược Sử Vạn Vật');

-- Cuốn 5: Khoa học
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Vũ Trụ Trong Vỏ Hạt Dẻ', 180000, 25, 'Tác giả: Stephen Hawking. Khám phá vật lý lý thuyết.', (SELECT id FROM categories WHERE name = 'Khoa học')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Vũ Trụ Trong Vỏ Hạt Dẻ');


-- --- 10 CUỐN SÁCH MỚI THÊM VÀO ---

-- Cuốn 6: Trinh thám
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Phía Sau Nghi Can X', 110000, 45, 'Tác giả: Keigo Higashino. Một cuộc đấu trí đỉnh cao.', (SELECT id FROM categories WHERE name = 'Trinh thám')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Phía Sau Nghi Can X');

-- Cuốn 7: Trinh thám
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Sự Im Lặng Của Bầy Cừu', 135000, 35, 'Tác giả: Thomas Harris. Tác phẩm kinh dị tâm lý xuất sắc.', (SELECT id FROM categories WHERE name = 'Trinh thám')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sự Im Lặng Của Bầy Cừu');

-- Cuốn 8: Trinh thám
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Mười Người Da Đen Nhỏ', 95000, 20, 'Tác giả: Agatha Christie. Vụ án trên đảo hoang không lối thoát.', (SELECT id FROM categories WHERE name = 'Trinh thám')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mười Người Da Đen Nhỏ');

-- Cuốn 9: Thiếu nhi
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Harry Potter và Hòn Đá Phù Thủy', 200000, 150, 'Tác giả: J.K. Rowling. Khởi đầu của thế giới phù thủy.', (SELECT id FROM categories WHERE name = 'Thiếu nhi')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Harry Potter và Hòn Đá Phù Thủy');

-- Cuốn 10: Thiếu nhi
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Kính Vạn Hoa - Tập 1', 65000, 60, 'Tác giả: Nguyễn Nhật Ánh. Những câu chuyện học trò thú vị.', (SELECT id FROM categories WHERE name = 'Thiếu nhi')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Kính Vạn Hoa - Tập 1');

-- Cuốn 11: Thiếu nhi
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', 85000, 80, 'Tác giả: Nguyễn Nhật Ánh. Vé đi tàu về miền ký ức.', (SELECT id FROM categories WHERE name = 'Thiếu nhi')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cho Tôi Xin Một Vé Đi Tuổi Thơ');

-- Cuốn 12: Thiếu nhi
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Hoàng Tử Bé', 50000, 90, 'Tác giả: Antoine de Saint-Exupéry. Cuốn sách dành cho trẻ em và người lớn.', (SELECT id FROM categories WHERE name = 'Thiếu nhi')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Hoàng Tử Bé');

-- Cuốn 13: Khoa học
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Sapiens: Lược Sử Loài Người', 220000, 55, 'Tác giả: Yuval Noah Harari. Hành trình của loài người.', (SELECT id FROM categories WHERE name = 'Khoa học')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sapiens: Lược Sử Loài Người');

-- Cuốn 14: Khoa học
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Gen: Lịch Sử Và Tương Lai Của Nhân Loại', 280000, 15, 'Tác giả: Siddhartha Mukherjee. Câu chuyện về mã di truyền.', (SELECT id FROM categories WHERE name = 'Khoa học')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Gen: Lịch Sử Và Tương Lai Của Nhân Loại');

-- Cuốn 15: Khoa học
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Bản Thiết Kế Vĩ Đại', 160000, 25, 'Tác giả: Stephen Hawking. Những câu hỏi lớn về vũ trụ.', (SELECT id FROM categories WHERE name = 'Khoa học')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bản Thiết Kế Vĩ Đại');

INSERT INTO users (username, password)
SELECT 'testuser', 'Test123'
    WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE username = 'testuser');
