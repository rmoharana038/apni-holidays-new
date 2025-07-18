// cypress.config.cjs
module.exports = {
  e2e: {
    baseUrl: 'https://apni-holidays-new.onrender.com',
    supportFile: false,
    video: false,
    screenshotsFolder: 'cypress/screenshots',
    specPattern: 'cypress/e2e/**/*.spec.js',
    defaultCommandTimeout: 8000,
  },
};
