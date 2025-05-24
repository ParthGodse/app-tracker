import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import { collection, getDocs, deleteDoc, doc} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Search, Sun, Moon } from "lucide-react";
import { FaTh, FaList } from "react-icons/fa";
import JobApplicationForm from "../pages/JobApplicationForm";

interface JobApplication {
  id: string;
  title: string;
  company: string;
  status: string;
  appliedDate: string;
}

const HomePage = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCardView, setIsCardView] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const statusColors: { [key: string]: string } = {
    "Applied": "!bg-blue-100 text-blue-800",
    "Interviewing": "!bg-yellow-100 text-yellow-800",
    "Offer": "bg-green-100 text-green-800",
    "Reject": "!bg-red-100 text-red-800", // added for completeness
  };
  
  const deleteApplication = async (id: string) => {
    try {
      await deleteDoc(doc(db, "applications", id));
      
      setApplications((prevApps) => prevApps.filter((app) => app.id !== id));
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const fetchApplications = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "applications"));
      const apps = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as JobApplication[];
      setApplications(apps); // Update the applications state to re-render the list
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {  
    fetchApplications();
  }, []); // Will only run once
  

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const filteredApplications = applications.filter(app => 
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const isDark = saved === "true";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // Toggle handler
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("darkMode", String(newMode));
      return newMode;
    });
  };

  return (
    <div className="min-h-screen w-full bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col p-6">
      <header className="shadow-md flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900">
        <span className="text-2xl font-bold">📌 Application Tracker</span>
        <div className="flex items-center space-x-4 bg-white dark:bg-gray-900">
          {user?.photoURL && <Avatar><AvatarImage src={user.photoURL} /></Avatar>}
          <span className="!text-gray-400">{user?.displayName || user?.email}</span>
          <Button onClick={handleLogout} className="!bg-black text-white">Log Out</Button>
        </div>
      </header>
      
      <main className="flex-grow w-full max-w-7xl mx-auto py-8">
        <div className="!flex justify-between items-center mb-4">
        <div className="relative w-100">
            <Input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-8 top-2 !text-gray-400" size={20} />
          </div>
        <Button
            onClick={() => {
              setSelectedApplication(null);
              setIsFormOpen(true);
            }}
            className="!bg-green-600 text-white"
          >
            + Add Application
          </Button>
        </div>
        <div className="ml-auto flex justify-end gap-1 items-center mb-2">
          {/* Card/List toggle */}
          <Button
            variant="icon" size="icon"
            onClick={() => setIsCardView(!isCardView)}
            className="!bg-transparent text-black dark:text-white flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-2xl transition-colors"
          >
            {isCardView ? <FaList size={20} /> : <FaTh size={20} />}
          </Button>

          {/* Dark mode toggle */}
          <Button
            variant="icon" size="icon"
            onClick={toggleDarkMode}
            className="!bg-transparent text-black dark:text-white flex items-center rounded-2xl"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
        
        {!isCardView && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-colors">
            <table className="min-w-full bg-white border border-gray-300 dark:bg-gray-800 dark:border-grap-600">
              <thead className="bg-gray-100 dark:bg-gray-800 transition-colors"> 
                <tr>
                  {["Job Title", "Company", "Status", "Applied Date", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors">
                    {header}
                  </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-600 transition-colors">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="bg-gray-50 dark:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-black dark:text-white">{app.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-black dark:text-white">{app.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusColors[app.status.trim()] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 transition-colors"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-black dark:text-white">{app.appliedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button onClick={() => { setSelectedApplication(app); setIsFormOpen(true); }} className="!bg-blue-500 text-white mr-2">Edit</Button>
                      <Button onClick={() => deleteApplication(app.id)} className="!bg-red-500 text-white">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Card View */}
        {isCardView && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black dark:text-white">
            {filteredApplications.map((app) => (
              <Card key={app.id} className="p-4 shadow-lg bg-white dark:bg-gray-900 transition-colors">
                <CardContent>
                  <h2 className="text-lg font-semibold text-black dark:text-white">{app.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{app.company}</p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Applied: {app.appliedDate}</p>
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[app.status.trim()] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="flex justify-center mt-4 text-black dark:text-white">
                    <Button onClick={() => { setSelectedApplication(app); setIsFormOpen(true); }} className="!bg-blue-500 text-white mr-2">Edit</Button>
                    <Button onClick={() => deleteApplication(app.id)} className="!bg-red-500 text-white">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      {isFormOpen && (
        <JobApplicationForm
          application={selectedApplication}  // Pass selected application for editing, or null for adding
          onClose={() => setIsFormOpen(false)}  // Close the form on cancel
          onSuccess={() => {
            setIsFormOpen(false);
            fetchApplications()
            // Optionally, you can refresh the list after submitting or editing
          }}
        />
      )}
    </div>
  );
};

export default HomePage;