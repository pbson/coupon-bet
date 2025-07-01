const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-white"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => (
  <header className="bg-[#053176] backdrop-blur-sm flex justify-between items-center p-4 shadow-lg sticky top-0 z-20 border-b-2 border-slate-700">
    <button
      onClick={onMenuClick}
      className="cursor-pointer"
    >
      <img
        src="https://cdn.boylesports.com/sportsbook-v5/sports_logo.svg"
        alt="Logo"
        className="h-8"
      />
    </button>

    <MenuIcon />
  </header>
);
