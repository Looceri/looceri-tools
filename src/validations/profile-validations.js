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

// Email
export const email = (message = 'E-mail inválido') => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return val => (!val || emailRegex.test(val)) || message;
};

// Telefone
export const phone = (message = 'Telefone inválido') => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{9,}$/;
  return val => (!val || phoneRegex.test(val)) || message;
};

// Senha: maiúscula
export const hasUppercase = (message = 'Deve conter uma letra maiúscula') => {
  return val => (!val || /[A-Z]/.test(val)) || message;
};

// Senha: minúscula
export const hasLowercase = (message = 'Deve conter uma letra minúscula') => {
  return val => (!val || /[a-z]/.test(val)) || message;
};

// Senha: número
export const hasNumber = (message = 'Deve conter um número') => {
  return val => (!val || /\d/.test(val)) || message;
};

// Senha: caractere especial
export const hasSpecialChar = (message = 'Deve conter um caractere especial') => {
  return val => (!val || /[!@#$%^&*(),.?":{}|<>]/.test(val)) || message;
};

// Confirmar senha igual
export const sameAs = (getOther, message = 'As senhas não coincidem') => {
  return val => (!getOther() || val === getOther()) || message;
};

// Papel válido
export const validRole = (roles = ['user', 'admin', 'moderator'], message = 'Papel inválido') => {
  return val => roles.includes(val) || message;
};

// Validações do perfil
export const profileValidations = {
  name: [
    required('Nome é obrigatório'),
    minLength(2, 'Nome deve ter pelo menos 2 caracteres'),
    maxLength(100, 'Nome deve ter menos de 100 caracteres')
  ],
  email: [
    required('E-mail é obrigatório'),
    email('Digite um e-mail válido')
  ],
  phone: [
    optional(phone('Digite um telefone válido'))
  ],
  currentPassword: [
    required('Senha atual é obrigatória')
  ],
  newPassword: [
    optional(minLength(8, 'Senha deve ter pelo menos 8 caracteres')),
    optional(hasUppercase('Senha deve conter pelo menos uma letra maiúscula')),
    optional(hasLowercase('Senha deve conter pelo menos uma letra minúscula')),
    optional(hasNumber('Senha deve conter pelo menos um número')),
    optional(hasSpecialChar('Senha deve conter pelo menos um caractere especial'))
  ],
  confirmPassword: [
    sameAs(() => '', 'As senhas não coincidem') // Substitua pelo getter correto do campo newPassword
  ],
  role: [
    required('Papel é obrigatório'),
    validRole(['user', 'admin', 'moderator'], 'Papel inválido')
  ]
};

// Validação de arquivo de imagem de perfil
export const validateProfileImage = (file) => {
  const errors = [];

  if (!file) {
    return errors;
  }

  // Tamanho máximo 2MB
  if (file.size > 2 * 1024 * 1024) {
    errors.push('O arquivo deve ter menos de 2MB');
  }

  // Tipos permitidos
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Apenas imagens JPEG, PNG, GIF e WebP são permitidas');
  }

  return errors;
};
