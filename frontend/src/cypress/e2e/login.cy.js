import loginPage from '../pages/LoginPage.js'
describe('Login E2E Tests', ()=>{
  beforeEach(()=>{
    loginPage.open();
  })
  it('Nen hien thi form login', () =>{
    loginPage.getusernameInput().should('be.visible')
      loginPage.getpasswordInput().should('be.visible');
    loginPage.getsubmitButton().should('be.visible');

  });
    it('Nen Login that bai voi User khong ton tai ', ()=>{
        loginPage.login("wronguser","Test123")

    });
    it('Nen Login that bai voi password rong ', ()=>{
        loginPage.login("testuser23"," ")


    });
    it('Nen Login that bai voi username rong ', ()=>{
        loginPage.login(" ","Test123")


    });
    it('Nen Login thanh cong voi password khong hop le ', ()=>{
        loginPage.login("testuser","123")


    });
    it('Nen Login thanh cong voi username khong hop le ', ()=>{
        loginPage.login("tes","test123")


    });
  it('Nen Login thanh cong voi credentials hop le ', ()=>{
    loginPage.login("testuser","Test123")
    cy.url().should('include', '/products');

  });

})