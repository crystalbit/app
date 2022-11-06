type MessageProps = {
  type: string;
};

const Message = ({ type }: MessageProps) => {
  return (
    <div id="access-msg" className={type}>
      {type === 'denied' ? 'Access Denied' : 'Access Granted'}
    </div>
  );
};

export default Message;
