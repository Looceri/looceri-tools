// Validação obrigatória
export const required = (message = 'Campo obrigatório') => {
  return val => !!val || message;
};

// Mínimo de caracteres
export const minLength = (length, message) => {
  return val => (val && val.length >= length) || message || `Mínimo de ${length} caracteres`;
};

// Máximo de caracteres
export const maxLength = (length, message) => {
  return val => (val && val.length <= length) || message || `Máximo de ${length} caracteres`;
};

// Validação condicional (ex: se tiver valor, então valida com regra fornecida)
export const optional = (ruleFn) => {
  return val => {
    if (!val) return true;
    return ruleFn(val);
  };
};
