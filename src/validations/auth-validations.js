// src/utils/form-validations/auth-validations.js

// Import base validators
import { required, minLength } from './base-validations.js';

// --- Reusable Validation Factories ---

/**
 * Creates a validation rule to check for a valid email format.
 * @param {string} [message='O email inserido não é válido.'] - Optional custom error message.
 * @returns {function} A Quasar validation rule.
 */
export const isEmail = (message = 'O email inserido não é válido.') => (val) => {
  if (!val) return true; // Optional by default. Use required() for mandatory fields.
  const pattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return pattern.test(val) || message;
};

/**
 * Creates a validation rule to check for a valid phone number (at least 7 digits).
 * @param {string} [message='O telefone inserido não é válido.'] - Optional custom error message.
 * @returns {function} A Quasar validation rule.
 */
export const isPhone = (message = 'O telefone inserido não é válido.') => (val) => {
  if (!val) return true;
  const pattern = /^\d{7,}$/;
  return pattern.test(val) || message;
};

/**
 * Creates a validation rule to check if the input is either a valid email or a valid phone number.
 * @param {string} [message='O formato deve ser um email ou telefone válido.'] - Optional custom error message.
 * @returns {function} A Quasar validation rule.
 */
export const isEmailOrPhone = (message = 'O formato deve ser um email ou telefone válido.') => (val) => {
  if (!val) return true;
  // A little trick: we call the rule factories without arguments to get their default behavior
  const emailValid = isEmail()(val) === true;
  const phoneValid = isPhone()(val) === true;
  return emailValid || phoneValid || message;
};

/**
 * Creates a validation rule to check if the password matches another.
 * @param {function} getPassword - A function that returns the value of the other password field.
 * @param {string} [message='As senhas não coincidem.'] - Optional custom error message.
 * @returns {function} A Quasar validation rule.
 */
export const passwordMatch = (getPassword, message = 'As senhas não coincidem.') => (val) => {
  return val === getPassword() || message;
};


// --- Validation Schemas (now using the new factories) ---

export const loginValidation = {
  emailOrPhone: [
    required('Email ou telefone é indispensável'),
    isEmailOrPhone() // Call the factory to get the rule
  ],
  password: [
    required('A senha é indispensável'),
    minLength(6) // The base validator already has a good default message
  ]
};

export const signupValidation = {
  name: [
    required('O nome completo é obrigatório'),
    minLength(3)
  ],
  email: [
    required('O email é obrigatório'),
    isEmail()
  ],
  phone: [
    required('O número de telefone é obrigatório'),
    isPhone('O número de telefone parece inválido.') // Example with a custom message
  ],
  password: [
    required('A senha é obrigatória'),
    minLength(6)
  ],
  password_confirmation: (getPasswordField) => [ // This is now a function
    required('A confirmação da senha é necessária'),
    passwordMatch(getPasswordField)
  ]
};
