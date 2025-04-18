import React from 'react';
import moment from 'moment/moment';

function NoteSingle(action, i) {
  return (
    <li key={i} className={`mt-2 mb-10`}>
      <div
        className="text-xs font-light text-base-content mb-1">{moment(action.note?.createdAt).calendar()}</div>
      <div className="text-sm mb-3">{action.note?.noteContent || 'Note could not be found, sorry.'}</div>
    </li>
  );
}

export default NoteSingle;
