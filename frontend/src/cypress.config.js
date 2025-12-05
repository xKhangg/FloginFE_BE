const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'g3cr9z',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
