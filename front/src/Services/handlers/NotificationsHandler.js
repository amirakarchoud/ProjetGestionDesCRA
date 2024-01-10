import { toast } from 'react-toastify';

/**
 * @typedef NotificationsHandlerType {Readonly<Object>}
 * @property {function(string)} error
 * @property {function(string)} success
 * @property {function(string)} warning
 */

/**
 * @type {NotificationsHandlerType}
 */

const NotificationsHandler = Object.freeze({
  error: (text) => toast.error(text),
  success: (text) => toast.success(text),
  warning: (text) => toast.warning(text),
});

export default NotificationsHandler;
