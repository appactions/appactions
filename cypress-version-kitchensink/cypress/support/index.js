import '../../config/polyfills';
import './app-actions';
import './commands';
import './server';
import './global-hooks';
import './reporter-context';

// we need this jQuery utility because of the hack in
// src/lib/ui/components/collapsible-row-content/collapsible-row-content.jsx
Cypress.$.fn.extend({
    textWithoutBlacklist() {
        const cloned = this.clone();
        cloned.find('[data-cypress-blacklist="true"]').remove();
        return cloned.text().trim();
    },
});
