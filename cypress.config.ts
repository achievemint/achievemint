import {defineConfig} from 'cypress';
import webpackConfig from './cypress/webpack.config'

export default defineConfig({
    viewportWidth: 1920,
    viewportHeight: 1080,
    e2e: {
        baseUrl: 'http://localhost:3472',
        specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
        supportFile: 'cypress/support/e2e.ts',
        setupNodeEvents(/* on, config */) {
            // implement node event listeners here
        },
    },
    component: {
        devServer: {
            framework: 'react',
            bundler: 'webpack',
            webpackConfig
        },
        specPattern: 'src/**/*.cy.{ts,tsx}',
        supportFile: 'cypress/support/component.ts',
        indexHtmlFile: 'cypress/support/component-index.html',
    },
    video: false,
});
