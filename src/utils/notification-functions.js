import { useNotificationQueue } from './notification-queue';

/**
 * Um local central para despachar notificações de qualquer lugar da aplicação.
 * Utiliza o `useNotificationQueue` para adicionar notificações à fila global.
 */

// Obtém a função `addNotification` uma única vez do composable.
const { addNotification } = useNotificationQueue();

/**
 * Função genérica para adicionar uma notificação à fila.
 * @param {string} type - O tipo da notificação (e.g., 'info', 'success').
 * @param {string} message - A mensagem da notificação.
 * @param {string} [title=''] - O título da notificação.
 * @param {string|number|null} [id=null] - O ID da notificação, se vier do backend.
 */
export function notifyUser(type, message, title = '', id = null) {
  if (!type || !message) {
    console.error('Falha na notificação: "type" e "message" são obrigatórios.');
    return;
  }
  addNotification({ type, title, message, id });
}

// --- Funções auxiliares para tipos específicos ---

export function notifyInfo(message, title = '') {
  notifyUser('info', message, title);
}

export function notifySuccess(message, title = '') {
  notifyUser('success', message, title);
}

export function notifyWarning(message, title = '') {
  notifyUser('warning', message, title);
}

export function notifyError(message, title = '') {
  notifyUser('error', message, title);
}

export function notifyTip(message, title = '') {
  notifyUser('tip', message, title);
}

export function notifyNewService(message, title = '') {
  notifyUser('newService', message, title);
}

export function notifyUpdate(message, title = '') {
  notifyUser('update', message, title);
}
