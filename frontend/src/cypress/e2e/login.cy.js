import loginPage from '../pages/LoginPage.js'
describe('Login E2E Tests', ()=>{
  beforeEach(()=>{
    loginPage.open();
  })
    // =================================================================
    // Nền hiển thị form login
    // =================================================================
  it('Nen hien thi form login', () =>{
    loginPage.getusernameInput().should('be.visible')
      loginPage.getpasswordInput().should('be.visible');
    loginPage.getsubmitButton().should('be.visible');

  });
    // =================================================================
    // a) Login thất bại với User không tồn tai
    // =================================================================
    it('Nen Login that bai voi User khong ton tai ', ()=>{
        loginPage.login("wronguser","Test123")

    });
    // =================================================================
    // b) Login thất bại với password rỗng
    // =================================================================
    it('Nen Login that bai voi password rong ', ()=>{
        loginPage.login("testuser23"," ")


    });
    // =================================================================
    // c) Login thất bại với username rỗng
    // =================================================================
    it('Nen Login that bai voi username rong ', ()=>{
        loginPage.login(" ","Test123")


    });
    // =================================================================
    // d) Login thất bại với password không hợp lệ
    // =================================================================
    it('Nen Login that bai voi password khong hop le ', ()=>{
        loginPage.login("testuser","123")


    });
    // =================================================================
    // e) Login thất bại với username không hợp lệ
    // =================================================================
    it('Nen Login that bai voi username khong hop le ', ()=>{
        loginPage.login("tes","test123")


    });
    // =================================================================
    // Login thành công với credentials hợp lệ
    // =================================================================
  it('Nen Login thanh cong voi credentials hop le ', ()=>{
    loginPage.login("testuser","Test123")
    cy.url().should('include', '/products');

  });

})