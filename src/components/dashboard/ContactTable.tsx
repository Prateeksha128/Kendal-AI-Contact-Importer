interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
}

// Sample data for demonstration
const sampleContacts: Contact[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corp",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 987-6543",
    company: "Tech Solutions",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1 (555) 456-7890",
    company: "StartupXYZ",
  },
];

interface ContactTableProps {
  onImportClick: () => void;
}

export default function ContactTable({ onImportClick }: ContactTableProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Contacts</h2>
        <button
          onClick={onImportClick}
          className="cursor-pointer flex items-center gap-2 bg-[#1D283C] hover:bg-[#0D2A5A] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-colors duration-200"
        >
          Import Contacts
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sampleContacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {contact.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {contact.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {contact.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {contact.company}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State (when no contacts) */}
      {sampleContacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No contacts found</p>
          <button
            onClick={onImportClick}
            className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Import your first contacts
          </button>
        </div>
      )}
    </div>
  );
}
