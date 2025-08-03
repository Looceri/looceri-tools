import { Loading, Notify } from "quasar";

/**
 * Utility for handling API request feedback (success/error messages)
 * with support for closing existing notifications and handling complex error objects
 */

// Maintain a reference to the current notification instance
let instance = null;

/**
 * Closes any existing notification
 */
export function closeNotify() {
  if (instance) {
    instance();
    instance = null;
  }
}

/**
 * Shows a success notification message
 * @param {Object|string} payload - Message string or object with notification options
 * @param {string} [payload.message] - Success message to display
 * @param {string} [payload.color='positive'] - Notification color
 * @param {number} [payload.timeout=1000] - Time in milliseconds to display notification
 * @param {boolean} [payload.closeExisting=true] - Whether to close existing notifications
 */
export function showSuccessMessage(payload) {
  Loading.hide();

  // Handle closing existing notifications
  if (payload?.closeExisting !== false) {
    closeNotify();
  }

  instance = Notify.create({
    color: payload?.color || 'positive',
    progress: true,
    icon: 'check_circle',
    message: payload?.message || payload,
    position: "top",
    timeout: payload?.timeout || 3000
  });
}

/**
 * Shows an error notification message, with special handling for complex error objects
 * @param {Object|string} payload - Error object or message string or options object
 * @param {string} [payload.message] - Error message to display
 * @param {string} [payload.color='negative'] - Notification color
 * @param {string} [payload.icon='bi-info-circle'] - Icon to display
 * @param {number} [payload.timeout=9000] - Time in milliseconds to display notification
 * @param {boolean} [payload.closeExisting=true] - Whether to close existing notifications
 * @param {boolean} [payload.multipleErrors=false] - Whether to show multiple error notifications
 */
export function showErrorMessage(payload) {
  Loading.hide();

  // Initialize options object for notifications
  const options = {
    color: 'negative',
    progress: true,
    icon: 'info',
    position: "top",
    timeout: 9000
  };

  // Handle string-only payload case
  if (typeof payload === 'string') {
    options.message = payload;

    // Close existing notifications if not specified otherwise
    closeNotify();

    // Create new notification
    instance = Notify.create(options);
    return;
  }

  // Handle object payload case
  if (payload) {
    // Apply any custom options
    if (payload.color) options.color = payload.color;
    if (payload.icon) options.icon = payload.icon;
    if (payload.timeout) options.timeout = payload.timeout;

    // Handle closing existing notifications (default to true)
    if (payload.closeExisting !== false) {
      closeNotify();
    }

    // Handle API error object response
    if (payload.response?.data) {
      // Case 1: Simple message in response

      if (!payload.response.data.errors) {
        options.message = payload.response.data.message;
        instance = Notify.create(options);
        return;
      }

      // Case 2: Complex errors object with arrays of messages
      if (payload.response.data.errors) {
        const errorsObj = payload.response.data.errors;

        // Log all errors to console for debugging
        console.error('API validation errors:', errorsObj);

        // If multipleErrors flag is set to true, show multiple notifications
        if (payload.multipleErrors) {
          let isFirstError = true;

                console.log('Multiple errors detected, showing all notifications');

          // Iterate through all error fields
          Object.keys(errorsObj).forEach(field => {
            if (Array.isArray(errorsObj[field])) {
              // Show each error message in the array
              errorsObj[field].forEach(errorMsg => {
                const errorOptions = { ...options, message: errorMsg };

                console.log('Error options:', errorOptions);
                console.log('options:', options);

                // Only keep reference to the last notification instance
                if (isFirstError) {
                  closeNotify();
                  instance = Notify.create(errorOptions);
                  isFirstError = false;
                } else {
                  Notify.create(errorOptions);
                }
              });
            } else if (typeof errorsObj[field] === 'string') {
              // Handle string error message
              const errorOptions = { ...options, message: `${field}: ${errorsObj[field]}` };

              if (isFirstError) {
                closeNotify();
                instance = Notify.create(errorOptions);
                isFirstError = false;
              } else {
                Notify.create(errorOptions);
              }
            }
          });
          return;
        } else {
                console.log('Single error detected, showing first error notification');

          // Default behavior: show only the first error message
          for (const field in errorsObj) {
            if (Array.isArray(errorsObj[field]) && errorsObj[field].length > 0) {
              options.message = errorsObj[field][0];
              break;
            } else if (typeof errorsObj[field] === 'string') {
              options.message = errorsObj[field];
              break;
            }
          }
        }
      }
    } else if (payload.message) {
      // Handle direct message property
      options.message = payload.message;
    } else {
      // Handle case where payload itself is the message
      options.message = payload;
    }
  }

  // Create notification with the determined options
  instance = Notify.create(options);
}

/**
 * Example usage:
 *
 * // Simple success message
 * showSuccessMessage('User created successfully');
 *
 * // Success with options
 * showSuccessMessage({
 *   message: 'Operation completed',
 *   timeout: 2000
 * });
 *
 * // Simple error message
 * showErrorMessage('Failed to create user');
 *
 * // Error with API response
 * showErrorMessage(error);
 *
 * // Error with multiple notifications
 * showErrorMessage({
 *   ...error,
 *   multipleErrors: true
 * });
 */
