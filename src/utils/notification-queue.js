import { reactive, ref, computed } from 'vue';

   // --- Estado (Padrão Singleton) ---
   // Estas variáveis reativas são definidas uma vez a nível de módulo,
   // garantindo uma única fonte de verdade para a fila de notificações em toda a aplicação.
   const queue = reactive([]);
   const isOpen = ref(false);
   const currentNotification = ref(null);
   const currentIndex = ref(0);
   const totalInSession = ref(0); // Total de notificações no "lote" atual

   // --- Funções Internas ---

   /**
    * Exibe a próxima notificação na fila ou fecha o modal se a fila estiver vazia.
    */
   function _showNext() {
     if (queue.length > 0) {
       // Calcula o índice atual baseado no total do lote e no que resta na fila
       currentIndex.value = totalInSession.value - queue.length;
       currentNotification.value = queue.shift(); // Pega o próximo item
       isOpen.value = true;
     } else {
       // A fila está vazia, resecta o estado para o próximo lote.
       isOpen.value = false;
       currentNotification.value = null;
       currentIndex.value = 0;
       totalInSession.value = 0;
     }
   }

   // --- API Pública ---

   /**
    * Adiciona uma nova notificação à fila.
    * @param {object} notification - O objeto da notificação.
    * @param {string} [notification.type='info'] - O tipo (e.g., 'success', 'error').
    * @param {string} [notification.title=''] - O título.
    * @param {string} notification.message - O conteúdo principal da mensagem.
    * @param {string} [notification.id=null] - O ID opcional da notificação.
    */
   function addNotification({ type = 'info', title = '', message = '' , id = null }) {
     if (!message) {
       console.warn('Notificação ignorada: a mensagem é obrigatória.');
       return;
     }

     queue.push({ id, type, title, message });

     // Se o modal não estiver aberto, este é o início de um novo lote.
     if (!isOpen.value) {
       totalInSession.value = queue.length;
       _showNext();
     } else {
       // Se o modal já estiver aberto, apenas atualiza o total do lote.
       totalInSession.value = Math.max(totalInSession.value, queue.length + currentIndex.value + 1);
     }
   }

   /**
    * Fecha a notificação atual e mostra a próxima.
    * Retorna uma promessa que resolve após a transição de fechamento.
    */
   function nextNotification() {
     return new Promise((resolve) => {
       isOpen.value = false;

       // Aguarda a animação de fechamento do modal antes de mostrar o próximo.
       setTimeout(() => {
         _showNext();
         resolve();
       }, 300); // Esta duração deve corresponder à `transition-hide` do q-dialog.
     });
   }

   /**
    * Composable para acessar o estado e as ações da fila de notificações.
    */
   export function useNotificationQueue() {
     return {
       // --- Estado Reativo (apenas leitura) ---
       isOpen: computed(() => isOpen.value),
       currentNotification: computed(() => currentNotification.value),

       // --- Indicadores de Progresso ---
       /** O índice da notificação exibida no momento (base zero). */
       currentIndex: computed(() => currentIndex.value),
       /** O número total de notificações no lote atual. */
       totalNotifications: computed(() => totalInSession.value),
       /** O número de notificações ainda aguardando na fila. */
       queueLength: computed(() => queue.length),

       // --- Ações ---
       addNotification,
       nextNotification,
     };
   }