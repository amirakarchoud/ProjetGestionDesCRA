import { toast } from 'react-toastify';

const NotificationsHandler = Object.freeze({
  error: (text) => toast.error(text),
  success: (text) => toast.success(text),
});

export default NotificationsHandler;
