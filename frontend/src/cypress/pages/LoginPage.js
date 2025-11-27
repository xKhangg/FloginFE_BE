class LoginPage {
    getusernameInput() {
        return cy.get('[data-testid="username-input"]');
    }
    getpasswordInput() {
        return cy.get('[data-testid="password-input"]');

    }
    getsubmitButton() {
        return cy.get('[data-testid="login-button"]');
    }
    open(){
        cy.visit('http://localhost:3000/login');
    }
    login(username, password) {
        this.getusernameInput().type(username);
        this.getpasswordInput().type(password);
        this.getsubmitButton().click();
    }
}
export default new LoginPage();