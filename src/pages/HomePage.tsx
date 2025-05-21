// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
// import { Button } from "../components/ui/button";
// import { auth } from "../firebase";


// interface JobApplication {
//   id: string;
//   title: string;
//   company: string;
//   status: string;
//   appliedDate: string;
// }

// const HomePage = () => {
//   const [user, setUser] = useState<any>(null);
//   const navigate = useNavigate();
//   const [applications, setApplications] = useState<JobApplication[]>([]);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(setUser);
//     return () => unsubscribe();
//   }, []);

//   const handleLogout = async () => {
//     await signOut(auth);
//     localStorage.removeItem("user");
//     navigate("/");
//   };

//   // Mock data (Replace with Firebase Firestore)
//   useEffect(() => {
//     setApplications([
//       { id: "1", title: "Frontend Developer", company: "Google", status: "Applied", appliedDate: "2025-03-01" },
//       { id: "2", title: "Backend Engineer", company: "Amazon", status: "Interviewing", appliedDate: "2025-03-05" },
//     ]);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col p-6">
//       {/* Header */}
//       <header className="bg-white shadow-md">
//         <div className="max-w-7xl mx-auto mb-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
//           <div className="flex items-center">
//             <div className="flex-shrink-0 flex items-center">
//               <span className="text-5xl font-bold">📌 Application Tracker</span>
//             </div>
//           </div>
//           <div className="flex items-center mt-4 space-x-4 ml-90">
//             <span className="text-gray-700">{user?.displayName || user?.email}</span>
//             <Button 
//               onClick={handleLogout} 
//               className="bg-black text-white px-4 py-2 rounded-md"
//             >
//               Log Out
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Add Application Button */}
//         <div className="flex justify-end mb-4">
//           <Button className="!bg-green-500 text-white px-4 py-2 rounded-md">
//             + Add Application
//           </Button>
//         </div>

//         {/* Applications Table */}
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {applications.map((app) => (
//                 <tr key={app.id}>
//                   <td className="px-6 py-4 whitespace-nowrap">{app.title}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{app.company}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span 
//                       className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         app.status === "Applied" ? "bg-blue-100 text-blue-800" :
//                         app.status === "Interviewing" ? "bg-yellow-100 text-yellow-800" :
//                         app.status === "Offer" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {app.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">{app.appliedDate}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-center">
//                     <Button className="!mr-2 !bg-blue-500 !hover:bg-blue-600 !text-white px-3 py-1 rounded-md text-xs">
//                       Edit
//                     </Button>
//                     <Button className="!bg-red-500 !hover:bg-red-900 text-white px-3 py-1 rounded-md text-xs !important">
//                       Delete
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default HomePage;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
// import { db, auth } from "../firebase";
// import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
// import { Button } from "../components/ui/button";

// interface JobApplication {
//   id: string;
//   title: string;
//   company: string;
//   status: string;
//   appliedDate: string;
// }

// interface ApplicationForm {
//   title: string;
//   company: string;
//   status: string;
//   appliedDate: string;
// }


// const HomePage = () => {
//   const [user, setUser] = useState<any>(null);
//   const [errors, setErrors] = useState<Partial<ApplicationForm>>({});
//   const navigate = useNavigate();
//   const [applications, setApplications] = useState<JobApplication[]>([]);
//   const [form, setForm] = useState<ApplicationForm>({ title: "", company: "", status: "Applied", appliedDate: "" });
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(setUser);
//     return () => unsubscribe();
//   }, []);

//   // Fetch Applications from Firestore
//   useEffect(() => {
//     const fetchApplications = async () => {
//       const querySnapshot = await getDocs(collection(db, "applications"));
//       const apps = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as JobApplication));
//       setApplications(apps);
//     };
//     fetchApplications();
//   }, []);

//   const handleLogout = async () => {
//     await signOut(auth);
//     localStorage.removeItem("user");
//     navigate("/");
//   };

//   // Handle form input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const {name, value} = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   // Add New Application
//   const handleAddApplication = async () => {
//     if (!validateForm()) return; // Stop submission if validation fails
  
//     try {
//       const docRef = await addDoc(collection(db, "applications"), form as { [key: string]: any });
//       setApplications([...applications, { id: docRef.id, ...form }]);
//       setIsModalOpen(false);
//       setForm({ title: "", company: "", status: "Applied", appliedDate: "" });
//       setErrors({}); // Clear errors after successful submission
//     } catch (error) {
//       console.error("Error adding application:", error);
//     }
//   };
  
//   const handleEditApplication = async () => {
//     if (!validateForm()) return; // Stop submission if validation fails
  
//     try {
//       const appRef = doc(db, "applications", selectedApplicationId!);
//       await updateDoc(appRef, form as { [key: string]: any });
//       setApplications(
//         applications.map((app) =>
//           app.id === selectedApplicationId ? { ...app, ...form } : app
//         )
//       );
//       setIsModalOpen(false);
//       setIsEditMode(false);
//       setForm({ title: "", company: "", status: "Applied", appliedDate: "" });
//       setSelectedApplicationId(null);
//       setErrors({}); // Clear errors after successful submission
//     } catch (error) {
//       console.error("Error updating application:", error);
//     }
//   };

//   // Delete Application
//   const handleDelete = async (id: string) => {
//     await deleteDoc(doc(db, "applications", id));
//     setApplications(applications.filter((app) => app.id !== id));
//   };

//   const handleOpenEditModal = (application: JobApplication) => {
//     setIsEditMode(true);
//     setForm(application);
//     setSelectedApplicationId(application.id);
//     setIsModalOpen(true);
//   };

//   const validateForm = () => {
//     const newErrors: Partial<ApplicationForm> = {};
  
//     if (!form.title) newErrors.title = "Job title is required";
//     if (!form.company) newErrors.company = "Company name is required";
//     if (!form.status) newErrors.status = "Please select a status";
//     if (!form.appliedDate) newErrors.appliedDate = "Applied date is required";
  
//     setErrors(newErrors);
  
//     return Object.keys(newErrors).length === 0; // Return true if no errors
//   };
  

//   const statusColors: { [key: string]: string } = {
//     "Applied": "bg-blue-100 text-blue-800",
//     "Interviewing": "bg-yellow-100 text-yellow-800",
//     "Offer": "bg-green-100 text-green-800",
//     "Rejected": "bg-red-100 text-red-800", // added for completeness
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col p-6">
//       <header className="bg-white shadow-md">
//         <div className="max-w-7xl mx-auto mb-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
//           <span className="text-5xl font-bold">📌 Application Tracker</span>
//           <div className="flex items-center mt-4 space-x-4 ml-90">
//             <span className="text-gray-700">{user?.displayName || user?.email}</span>
//             <Button onClick={handleLogout} className="bg-black text-white px-4 py-2 rounded-md">
//               Log Out
//             </Button>
//           </div>
//         </div>
//       </header>

//       <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Add Application Button */}
//         <div className="flex justify-end mb-4">
//           <Button className="!bg-green-500 text-white px-4 py-2 rounded-md" onClick={() => setIsModalOpen(true)}>
//             + Add Application
//           </Button>
//         </div>

//         {/* Applications Table */}
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Job Title</th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Company</th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Applied Date</th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {applications.map((app) => (
//                 <tr key={app.id}>
//                   <td className="px-6 py-4 whitespace-nowrap">{app.title}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{app.company}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                       className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         statusColors[app.status] || "bg-gray-100 text-gray-800" // Default if status doesn't match
//                       }`}
//                     >
//                     {app.status}</span></td>
//                   <td className="px-6 py-4 whitespace-nowrap">{app.appliedDate}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-center">
//                     <Button className="!bg-blue-500 !text-white px-3 py-1 rounded-md text-xs mr-2" onClick={() => handleOpenEditModal(app)}>
//                       Edit
//                     </Button>
//                     <Button className="!bg-red-500 !text-white px-3 py-1 rounded-md text-xs" onClick={() => handleDelete(app.id)}>
//                       Delete
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </main>

//       {/* Add/Edit Application Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
//         <div className="bg-white p-6 rounded-md w-96">
//           <h2 className="text-lg font-semibold mb-4">{isEditMode ? "Edit Application" : "Add New Application"}</h2>
          
//           <input 
//             className={`w-full p-2 mb-2 border rounded ${errors.title ? 'border-red-500' : ''}`} 
//             type="text" 
//             name="title" 
//             placeholder="Job Title" 
//             value={form.title} 
//             onChange={handleChange} 
//           />
//           {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          
//           <input 
//             className={`w-full p-2 mb-2 border rounded ${errors.company ? 'border-red-500' : ''}`} 
//             type="text" 
//             name="company" 
//             placeholder="Company" 
//             value={form.company} 
//             onChange={handleChange} 
//           />
//           {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
          
//           <select 
//             className={`w-full p-2 mb-2 border rounded ${errors.status ? 'border-red-500' : ''}`} 
//             name="status" 
//             value={form.status} 
//             onChange={handleChange}
//           >
//             <option value="Applied">Applied</option>
//             <option value="Interviewing">Interviewing</option>
//             <option value="Offer">Offer</option>
//             <option value="Rejected">Rejected</option>
//           </select>
//           {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
          
//           <input 
//             className={`w-full p-2 mb-4 border rounded ${errors.appliedDate ? 'border-red-500' : ''}`} 
//             type="date" 
//             name="appliedDate" 
//             value={form.appliedDate} 
//             onChange={handleChange} 
//           />
//           {errors.appliedDate && <p className="text-red-500 text-sm">{errors.appliedDate}</p>}
          
//           <div className="flex justify-between">
//             <Button 
//               className="bg-green-500 text-white px-4 py-2 rounded-md" 
//               onClick={isEditMode ? handleEditApplication : handleAddApplication}
//             >
//               {isEditMode ? "Update" : "Add"}
//             </Button>
//             <Button 
//               className="bg-gray-400 text-white px-4 py-2 rounded-md" 
//               onClick={() => setIsModalOpen(false)}
//             >
//               Cancel
//             </Button>
//           </div>
//         </div>
//       </div>
//     )}
//     </div>
//   );
// };

// export default HomePage;

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
    <div className="!min-h-screen w-fullbg-white text-black dark:bg-gray-900 dark:text-white flex flex-col p-6">
      <header className={`!shadow-md flex justify-between items-center px-6 py-4 ${darkMode ? '!bg-gray-900' : '!bg-white'}`}>
        <span className="!text-2xl font-bold">📌 Application Tracker</span>
        <div className="!flex items-center space-x-4 ${darkMode ? '!bg-gray-900' : '!bg-white'}">
          {user?.photoURL && <Avatar><AvatarImage src={user.photoURL} /></Avatar>}
          <span className="!text-gray-700">{user?.displayName || user?.email}</span>
          <Button onClick={handleLogout} className="!bg-black text-white">Log Out</Button>
        </div>
      </header>
      
      <main className="!flex-grow w-full max-w-7xl mx-auto py-8">
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
        <div className="flex items-center gap-0 ml-auto">
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
          <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden transition-colors">
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