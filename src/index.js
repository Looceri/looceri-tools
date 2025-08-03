import EssentialLink from './components/EssentialLink.vue';
import NavItem from './components/NavItem.vue';
import UInput from './components/UInput.vue';
import BaseCheckbox from './components/BaseCheckbox.vue';
import * as authValidations from './validations/auth-validations.js';
import * as reportsValidations from './validations/reports-validations.js';
import * as baseValidations from './validations/base-validations.js';
import * as suggestionsValidations from './validations/suggestions-validations.js';
import * as profileValidations from './validations/profile-validations.js';
import * as notifyMessages from './utils/notify-messages.js';
import * as externalLinks from './utils/external-links.js';
import * as notificationFunctions from './utils/notification-functions.js';
import * as notificationQueue from './utils/notification-queue.js';

export {
  EssentialLink,
  NavItem,
  UInput,
  BaseCheckbox,
  authValidations,
  reportsValidations,
  baseValidations,
  suggestionsValidations,
  profileValidations,
  notifyMessages,
  externalLinks,
  notificationFunctions,
  notificationQueue
};

// Vue plugin to register components globally
export default {
  install(app) {
    app.component('EssentialLink', EssentialLink);
    app.component('NavItem', NavItem);
    app.component('UInput', UInput);
    app.component('BaseCheckbox', BaseCheckbox);
  }
};