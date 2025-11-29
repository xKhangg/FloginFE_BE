const {defineConfig} = require("cypress");

module.exports = defineConfig({
    e2e: {
        supportFile: "cypress/support/e2e.js",

        // 2. Sửa đường dẫn specPattern (Để nó tìm thấy file test)
        specPattern: "cypress/e2e/*.cy.{js,jsx,ts,tsx}",
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
