import { useState, useEffect } from "react";
import { addDoc, updateDoc, doc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JobApplication {
  id?: string;
  title: string;
  company: string;
  status: string;
  appliedDate: string;
}

interface JobApplicationFormProps {
  application?: JobApplication | null;
  onClose: () => void;
  onSuccess: () => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  application,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<JobApplication>({
    title: "",
    company: "",
    status: "",
    appliedDate: "",
  });

  useEffect(() => {
    if (application) {
      setFormData(application); // Pre-fill form with data if editing an application
    }
  }, [application]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      console.log("Form Data before submission:", formData); // Log form data
  
      if (application?.id) {
        // Update existing application
        const appDoc = doc(db, "applications", application.id);
        console.log("Updating application with ID:", application.id); // Log the ID
        await updateDoc(appDoc, { ...formData } as { [key: string]: any });
        console.log("Application updated successfully");
      } else {
        // Add new application
        const docRef = await addDoc(collection(db, "applications"), { ...formData } as { [key: string]: any });
        console.log("New application added with ID:", docRef.id); // Log new ID
      }
  
      onSuccess(); // Trigger success callback
      onClose(); // Close modal after submit
    } catch (error) {
      console.error("Error saving application:", error);
    }
  };
  


  return (
    <div className="fixed inset-0 !bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="!bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {application ? "Edit Application" : "Add Application"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="status"
            placeholder="Status (e.g., Applied, Interview Scheduled)"
            value={formData.status}
            onChange={handleChange}
            required
          />
          <Input
            type="date"
            name="appliedDate"
            value={formData.appliedDate}
            onChange={handleChange}
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose} className="!bg-gray-400 text-white">
              Cancel
            </Button>
            <Button type="submit" className="!bg-blue-500 text-white">
              {application ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm;
