import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Navbar = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
    return (
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <Link to="/home" className="text-2xl font-bold">📌 Application Tracker</Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.displayName || user?.email}</span>
            <Button onClick={onLogout} className="bg-black text-white px-4 py-2 rounded-md">Log Out</Button>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
