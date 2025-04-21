import moment from 'moment';
import { useClients } from '../contexts/ClientsContext';
import { useEffect, useState } from 'react';
import { useNavigators } from '../contexts/NavigatorsContext';

export default function Comments({ actionId, actions }) {
  const { selectedClient } = useClients();
  const { selectedNavigator } = useNavigators();
  const [comments, setComments] = useState([]);
  const [openComment, setOpenComment] = useState('');
  const [comment, setComment] = useState(
    {
      text: '',
      author: selectedNavigator?.name,
      activityId: actionId,
      authorId: selectedNavigator?._id,
      clientId: selectedClient?._id
    }
  );

  const saveComment = async () => {
    const res = await fetch(`/api/comments/`, {
      method: 'POST',
      body: JSON.stringify(comment),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    await setComments(data.comment);
  };

  const handleComment = async () => {
    await saveComment().then();
  };

  const getComments = async () => {
    if (!selectedClient?._id) return;
    const comments = await fetch(`/api/comments?clientId=${selectedClient._id}`);
    const data = await comments.json();
    return data.comment;
  };

  useEffect(() => {
    getComments().then(data => {
      if (data) setComments(data);
    });
  }, [selectedClient?._id]);

  return (
    <div className={`w-full mb-4 pt-2`}>
      {/*COMMENTS*/}
      <div className={`flex-1 mr-10 h-fit`}>
        {comments?.filter((comment) => comment?.activityId === actionId).map((event, eventIdx) => (
          <div key={event._id || eventIdx} className={`px-6`}>
            <div className="relative pb-8">
              {eventIdx !== comments.length - 1 ? (
                <span aria-hidden="true"
                      className={`absolute left-5 top-[9px] -ml-10 h-full w-[1px] bg-info/20 `} />
              ) : null}
              <div className="relative flex space-x-3 max-w-4/5">
                <div className="flex flex-1 justify-between space-x-4 ml-2 pt-1.5 ">
                  <div className={` w-full`}>
                    <div
                      className="flex flex-col tracking-wide justify-between text-left text-xs">
                      <span
                        className={`text-base-content absolute top-2 -left-[23px] rounded-full bg-info/20 w-2 h-2`} />
                      <div className={`text-base-content font-bold my-[2px]`}>{event.author}</div>
                      <div className={`text-base-content/50 my-[1px]`}>{moment(event.createdAt).calendar()}</div>
                    </div>
                    <p className="text-base-content my-1">
                      {event.text}{' '}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className={`transition-all duration-300 ${openComment ? 'h-fit ' : 'h-0 collapse'}`}>
                  <textarea
                    value={comment.text}
                    onChange={(e) => setComment({ ...comment, text: e.target.value })}
                    className={`textarea textarea-bordered my-4 w-full transition-all duration-50 ${openComment ? 'h-fit ' : 'h-0 collapse'}`}
                    placeholder="Comment"
                  />
        </div>
        <div className={`flex justify-end gap-3 ${!openComment ? 'justify-start' : 'justify-end'}`}>
          <button
            className={`btn btn-xs btn-ghost btn-success text-success rounded-lg hover:opacity-100 ${openComment ? 'text-success' : ''}`}
            onClick={() => {
              if (openComment) {
                handleComment().then();
                setOpenComment(false);
              } else {
                setComment({
                  text: '',
                  author: selectedNavigator?.name,
                  activityId: actionId,
                  authorId: selectedNavigator?._id,
                  clientId: selectedClient?._id
                });
                setOpenComment(true);
              }
            }}>{openComment ? 'Save' : 'Comment'}</button>
          <button
            className={`btn btn-xs btn-ghost btn-error rounded-lg hover:opacity-100 ${!openComment ? 'hidden' : 'text-error opacity-50'}`}
            onClick={() => {
              setOpenComment(false);
            }}>Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
