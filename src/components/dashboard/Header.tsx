import Logo from "../login/Logo";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "contacts", label: "Contacts" },
  { id: "import", label: "Import Contacts" },
  { id: "users", label: "Users" },
];

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-slate-950 to-slate-800  shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size="sm" variant="light" showText={true} />

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-3 text-sm font-medium font-sans transition-all duration-300 ease-in-out ${
                  activeTab === tab.id
                    ? "text-white border-b-2 border-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <select
              value={activeTab}
              onChange={(e) => onTabChange(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-white px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id} className="bg-slate-800">
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
