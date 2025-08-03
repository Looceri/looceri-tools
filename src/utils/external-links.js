/**
 * Normalizes a phone number by removing spaces, hyphens, and underscores.
 * @param {string} phone - The phone number to normalize (e.g., '+258 842-000_000').
 * @returns {string} - The normalized phone number (e.g., '+258842000000').
 */
function normalizePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') {
    console.error('Invalid phone number for normalization:', phone);
    return '';
  }
  const normalized = phone.replace(/[\s-_]/g, '');
  console.log(`Normalized phone number: ${phone} -> ${normalized}`);
  return normalized;
}

/**
 * Validates a phone number to ensure it starts with '+' and contains only digits after that.
 * @param {string} phone - The phone number to validate (e.g., '+258842000000').
 * @returns {boolean} - True if the phone number is valid, false otherwise.
 */
function isValidPhoneNumber(phone) {
  return /^\+\d+$/.test(phone);
}

/**
 * Identifies the Mozambique mobile operator for a given phone number.
 * @param {string} phone - The phone number to check (e.g., '+258842000000').
 * @returns {string|null} - Returns 'Movitel', 'Vodacom', 'mCel', or null if invalid or unknown.
 */
export function identifyMozambiqueOperator(phone) {
  const normalizedPhone = normalizePhoneNumber(phone);
  if (!normalizedPhone || !isValidPhoneNumber(normalizedPhone)) {
    console.error('Invalid phone number for operator check:', normalizedPhone);
    return null;
  }

  if (!normalizedPhone.startsWith('+258')) {
    console.error('Phone number must start with +258 for Mozambique operators:', normalizedPhone);
    return null;
  }

  const prefix = normalizedPhone.slice(4, 6); // Get the two digits after +258
  let operator = null;

  switch (prefix) {
    case '86':
    case '87':
      operator = 'Movitel';
      break;
    case '84':
    case '85':
      operator = 'Vodacom';
      break;
    case '82':
    case '83':
      operator = 'mCel';
      break;
    default:
      console.error('Unknown Mozambique operator for prefix:', prefix);
      return null;
  }

  console.log(`Identified operator for ${normalizedPhone}: ${operator}`);
  return operator;
}

/**
 * Opens a phone call link using the device's dialer.
 * @param {string} phone - The phone number to call (e.g., '+258842000000').
 * @returns {void}
 */
export function makeCall(phone) {
  const normalizedPhone = normalizePhoneNumber(phone);
  if (!normalizedPhone || !isValidPhoneNumber(normalizedPhone)) {
    console.error('Invalid phone number for call:', normalizedPhone);
    return;
  }

  try {
    console.log('Opening dialer for:', normalizedPhone);
    if (window.cordova && window.cordova.InAppBrowser) {
      window.cordova.InAppBrowser.open(`tel:${normalizedPhone}`, '_system');
    } else {
      window.open(`tel:${normalizedPhone}`, '_blank');
    }
  } catch (error) {
    console.error('Error opening phone call:', error);
  }
}

/**
 * Opens an SMS link using the device's messaging app.
 * @param {string} phone - The phone number to send an SMS to (e.g., '+258842000000').
 * @returns {void}
 */
export function sendSMS(phone) {
  const normalizedPhone = normalizePhoneNumber(phone);
  if (!normalizedPhone || !isValidPhoneNumber(normalizedPhone)) {
    console.error('Invalid phone number for SMS:', normalizedPhone);
    return;
  }

  try {
    console.log('Opening SMS app for:', normalizedPhone);
    if (window.cordova && window.cordova.InAppBrowser) {
      window.cordova.InAppBrowser.open(`sms:${normalizedPhone}`, '_system');
    } else {
      window.open(`sms:${normalizedPhone}`, '_blank');
    }
  } catch (error) {
    console.error('Error opening SMS:', error);
  }
}

/**
 * Opens a WhatsApp link using the device's WhatsApp app or browser.
 * @param {string} phone - The phone number to open in WhatsApp (e.g., '+258842000000').
 * @returns {void}
 */
export function openWhatsApp(phone) {
  const normalizedPhone = normalizePhoneNumber(phone);
  if (!normalizedPhone || !isValidPhoneNumber(normalizedPhone)) {
    console.error('Invalid phone number for WhatsApp:', normalizedPhone);
    return;
  }

  const cleanPhone = normalizedPhone.replace('+', ''); // WhatsApp requires phone number without '+'
  const url = `https://wa.me/${cleanPhone}`;

  try {
    console.log('Opening WhatsApp for:', cleanPhone);
    if (window.cordova && window.cordova.InAppBrowser) {
      window.cordova.InAppBrowser.open(url, '_system');
    } else {
      window.open(url, '_blank');
    }
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
  }
}