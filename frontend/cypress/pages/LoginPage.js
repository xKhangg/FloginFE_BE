class LoginPage {
    get usernameInput() {
        return cy.get('input[name="username"]');
    }
    get passwordInput() {
        return cy.get('input[name="password"]');

    }
    get submitButton() {
        return cy.get('button[type="submit"]');
    }
    get errorMessage() { return cy.get('.alert-danger'); }
    open(){
        cy.visit('/auth/login');
    }
    login(username, password) {
        this.usernameInput.value = username;
        this.passwordInput.value = password;
        this.submitButton.click();
    }
}
export default new LoginPage();