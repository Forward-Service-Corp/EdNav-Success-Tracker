function RecentClientsList({ clients }) {
  return (
    <div className="bg-base-100 rounded-lg p-4 shadow-md">
      <h3 className="mb-2 text-lg font-bold">Recently Viewed Clients</h3>
      <ul className="space-y-1">
        {clients.map((client) => (
          <li
            key={client._id}
            className="text-sm text-blue-600 hover:underline"
          >
            <Link href={`/clients/${client._id}`}>{client.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
