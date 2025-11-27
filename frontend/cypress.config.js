import {defineConfig} from 'cypress'
module.exports = {
  e2e: {
    baseUrl 'http://localhost:3000',
    defaultCommandTimeout:10000,
    chromeWebSecurity:false,
    setupNodeEvents(on,config){

    },
  },
};
