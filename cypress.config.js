const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '3dr9i1',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
