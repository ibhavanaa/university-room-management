// src/utils/helpers.js
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTime = (dateString) => {
  const options = { 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return new Date(dateString).toLocaleTimeString(undefined, options);
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'resolved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'declined':
    case 'in progress':
      return 'info';
    default:
      return 'secondary';
  }
};