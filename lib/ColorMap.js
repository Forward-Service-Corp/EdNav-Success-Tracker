
export const getBadgeColor = (status) => {
  switch (status) {
    case 'Active':
      return 'badge badge-success text-success-content  px-3 ';
    case 'Inactive':
      return 'badge badge-error text-error-content  px-3';
    case 'In Progress':
      return 'badge badge-warning text-warning-content  px-3';
    case 'graduated':
      return 'badge badge-info text-info-content  px-3';
    default:
      return 'badge badge-primary text-primary-content  px-3';
  }
};

export const getBGColor = (status) => {
  switch (status) {
    case 'Inactive':
      return 'bg-error text-error-content';
    case 'In Progress':
      return 'bg-warning text-warning-content';
    case 'Active':
      return 'bg-success text-success-content';
    case 'graduated':
      return 'bg-info text-info-content';
    default:
      return 'bg-primary text-primary-content';
  }
};

export const getBorderColor = (status) => {
  switch (status) {
    case 'Active':
      return 'border-error';
    case 'Inactive':
      return 'border-warning';
    case 'In Progress':
      return 'border-success';
    case 'graduated':
      return 'border-info';
    default:
      return 'border-primary';
  }
};

// function ActiveSpan() {
//   return null;
// }
//
// function InactiveSpan() {
//   return null;
// }
//
// function InProgressSpan() {
//   return null;
// }

// export const StatusIcon = (status) => {
//   switch (status) {
//     case 'Active':
//       return <ActiveSpan />;
//     case 'Inactive':
//       return <InactiveSpan />;
//     case 'graduated':
//       return <graduatedSpan />;
//     case 'In Progress':
//       return <InProgressSpan />;
//   }
// };

// export const toggleGrouped = () => {
//   setViewMode('grouped');
// };
//
// export const togglePinned = () => {
//   setViewMode('pinned');
//   setStatusCollapse([]);
// };
//
// export const toggleAlpha = () => {
//   setViewMode('alpha');
//   setStatusCollapse([]);
// };
//
// export const toggleDate = () => {
//   setViewMode('date');
//   setStatusCollapse([]);
// };

