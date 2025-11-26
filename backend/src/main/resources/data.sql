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

-- Cuốn 1: Trinh thám
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Sherlock Holmes Toàn Tập', 350000, 50, 'Tuyển tập các vụ án kinh điển của Sherlock Holmes.', (SELECT id FROM categories WHERE name = 'Trinh thám')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sherlock Holmes Toàn Tập');

-- Cuốn 2: Trinh thám
INSERT INTO products (name, price, quantity, description, category_id)
SELECT 'Án Mạng Trên Sông Nile', 120000, 30, 'Tác giả: Agatha Christie. Một vụ án bí ẩn trên du thuyền.', (SELECT id FROM categories WHERE name = 'Trinh thám')
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Án Mạng Trên Sông Nile');

-- Cuốn 3: Thiếu nhi
-- (Đã sửa lỗi chính tả ở câu WHERE: 'Phiêu Lưiu' -> 'Phiêu Lưu')
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