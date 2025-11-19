/**
 * Validate Product Object
 * * Rules:
 * - Product Name: 3-100 ký tự, không được rỗng [cite: 113]
 * - Price: > 0, <= 999,999,999 [cite: 114, 301]
 * - Quantity: >= 0, <= 99,999 [cite: 116]
 * - Description: <= 500 ký tự [cite: 117]
 * - Category: Phải được chọn (không rỗng) [cite: 118]
 */
export const validateProduct = (product) => {
  const errors = {};
  const { name, price, quantity, description, category } = product;

  // 1. Validate Product Name
  if (!name || name.trim() === '') {
    errors.name = 'Tên sản phẩm không được để trống';
  } else if (name.length < 3) {
    errors.name = 'Tên sản phẩm phải có ít nhất 3 ký tự';
  } else if (name.length > 100) {
    errors.name = 'Tên sản phẩm không được vượt quá 100 ký tự';
  }

  // 2. Validate Price
  const priceNum = Number(price);
  if (price === undefined || price === null || String(price).trim() === '') {
    errors.price = 'Giá sản phẩm không được để trống';
  } else if (isNaN(priceNum)) {
    errors.price = 'Giá sản phẩm phải là một con số';
  } else if (priceNum <= 0) {
    errors.price = 'Giá sản phẩm phải lớn hơn 0';
  } else if (priceNum > 999999999) {
    errors.price = 'Giá sản phẩm quá lớn (tối đa 999,999,999)';
  }

  // 3. Validate Quantity
  const quantityNum = Number(quantity);
   if (quantity === undefined || quantity === null || String(quantity).trim() === '') {
    errors.quantity = 'Số lượng không được để trống';
  } else if (isNaN(quantityNum)) {
    errors.quantity = 'Số lượng phải là một con số';
  } else if (!Number.isInteger(quantityNum)) {
     errors.quantity = 'Số lượng phải là số nguyên';
  } else if (quantityNum < 0) {
    errors.quantity = 'Số lượng không được nhỏ hơn 0';
  } else if (quantityNum > 99999) {
    errors.quantity = 'Số lượng quá lớn (tối đa 99,999)';
  }

  // 4. Validate Description
  if (description && description.length > 500) {
    errors.description = 'Mô tả không được vượt quá 500 ký tự';
  }

  // 5. Validate Category
  if (!category || category.trim() === '') {
    errors.category = 'Vui lòng chọn danh mục sản phẩm';
  }

  return errors;
};