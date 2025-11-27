import LoginPage from "../pages/LoginPage";
describe('Login E2E Tests', ()=>{
    beforeEach(()=>{
        LoginPage.open();
    })
    it('Nen hien thi form login', () =>{
        cy.get('[data-testid="username-input"]').should('be.visible');
        cy.get('[data-testid="password-input"]').should('be.visible');
        cy.get('[data-testid="login-button"]').should('be.visible');

    });
    it('Nen Login thanh cong voi credentials hop le ', ()=>{
        cy.get('[data-testid="username-input"]').type('testuser');
        cy.get('[data-testid="password-input"]').type('Test123');
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="login-message"]').should('contain', 'thanh cong');
        cy.url().should('include', '/dashboard');

    });

})