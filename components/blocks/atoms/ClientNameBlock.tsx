// /components/atoms/ClientNameBlock.tsx

type ClientNameBlockProps = {
  firstName: string;
  lastName: string;
  latestInteraction: string;
};

const ClientNameBlock: React.FC<ClientNameBlockProps> = ({
  firstName,
  lastName,
  latestInteraction,
}) => {
  return (
    <div>
      <div className="font-bold">
        {firstName} {lastName}
      </div>
      <div className="text-sm opacity-50">{latestInteraction}</div>
    </div>
  );
};

export default ClientNameBlock;
