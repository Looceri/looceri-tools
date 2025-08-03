import { required, minLength, maxLength } from "./base-validations";

export { required, minLength, maxLength };

/**
 * Creates a validation rule that ensures a value is not empty.
 * @param {string} [message='Campo obrigatório.'] - Optional custom error message.
 * @returns {function} A Quasar validation rule.
 */

/**
 * Validates that an array is not empty.
 * @param {string} [message='Deve haver pelo menos um item.'] - Optional custom error message.
 * @returns {function} A Quasar validation rule.
 */
export const notEmptyArray =
  (message = "Deve haver pelo menos um item.") =>
  (val) => {
    return (Array.isArray(val) && val.length > 0) || message;
  };

/**
 * Validates the structure of route coordinates array.
 * Ensures it's an array of objects, each having lat, lng, and name.
 * @param {string} [message='As coordenadas da rota devem ser um array válido de pontos.'] - Optional custom error message.
 * @returns {function} A Quasar validation rule.
 */
export const isValidRouteCoordinates =
  (message = "Adicione pelo menos 2 pontos de rota com nomes válidos.") =>
  (val) => {
    if (!Array.isArray(val) || val.length < 2) {
      return message;
    }
    for (const point of val) {
      if (
        !point ||
        typeof point.lat !== "number" ||
        typeof point.lng !== "number" ||
        !point.name ||
        point.name.trim() === ""
      ) {
        return "Cada ponto de rota deve ter latitude, longitude e um nome válido.";
      }
    }
    return true;
  };

/**
 * Creates a validation rule for comment content, ensuring it's not empty and meets length requirements.
 * @param {string} [requiredMessage='O comentário é obrigatório.']
 * @param {string} [minLengthMessage='Mínimo de {min} caracteres.']
 * @param {string} [maxLengthMessage='Máximo de {max} caracteres.']
 * @param {number} [min=5] - Minimum length for the comment.
 * @param {number} [max=1000] - Maximum length for the comment.
 * @returns {function[]} An array of Quasar validation rules.
 */
export const commentContentRules = (
  requiredMessage = 'O comentário é obrigatório.',
  minLengthMessage = 'Mínimo de 5 caracteres.',
  maxLengthMessage = 'Máximo de 1000 caracteres.',
  min = 5,
  max = 1000
) => {
  return [
    required(requiredMessage),
    minLength(min, minLengthMessage),
    maxLength(max, maxLengthMessage)
  ];
};
