import { useState, useEffect } from "react";
import { addDoc, updateDoc, doc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import { Calendar as CalendarIcon } from "lucide-react";
import React, { forwardRef } from "react";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      // console.log("Form Data before submission:", formData); // Log form data
      const formattedData = {
      ...formData,
      appliedDate: startDate ? startDate.toISOString().split("T")[0] : "",
    };
  
      if (application?.id) {
        // Update existing application
        const appDoc = doc(db, "applications", application.id);
        console.log("Updating application with ID:", application.id); // Log the ID
        await updateDoc(appDoc, { ...formattedData } as { [key: string]: any });
        console.log("Application updated successfully");
      } else {
        // Add new application
        const docRef = await addDoc(collection(db, "applications"), { ...formattedData } as { [key: string]: any });
        console.log("New application added with ID:", docRef.id); // Log new ID
      }
  
      onSuccess(); // Trigger success callback
      onClose(); // Close modal after submit
    } catch (error) {
      console.error("Error saving application:", error);
    }
  };
  
  const [startDate, setStartDate] = useState<Date | null>(
  application?.appliedDate ? new Date(application.appliedDate) : null
);

const CustomDateInput = forwardRef<HTMLInputElement, any>(({ value, onClick, placeholder }, ref) => (
  <div className="relative w-full">
    <input
      ref={ref}
      onClick={onClick}
      value={value}
      placeholder={placeholder}
      readOnly
      className="block w-full h-10 px-3 py-2 pr-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
    />
    <CalendarIcon className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-300 pointer-events-none" size={18} />
  </div>
));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 dark:bg-gray-800 dark:text-gray-400">
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-black dark:bg-gray-900 dark:text-gray-300">
          {application ? "Edit Application" : "Add Application"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-black dark:text-white transition-colors">
          <Input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-md px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-400"
          />
          <Input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-400"
          />
          {/* <Input
            type="text"
            name="status"
            placeholder="Status (e.g., Applied, Interview Scheduled)"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-400"
          /> */}
          <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full h-10 rounded-md px-2 py-2 bg-white dark:bg-gray-800 text-black dark:text-gray-400 border border-gray-300 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="">Select status</option>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
          {/* <div className="max-w-md relative">
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            placeholderText="Select date"
            className="block w-full h-10 rounded-md px-3 py-2 pr-55 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"

            // className="w-full bg-white dark:bg-gray-800 text-black dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            dateFormat="yyyy-MM-dd" // or "dd-MM-yyyy", etc.
          />
          <CalendarIcon className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-300 pointer-events-none" size={18} />
          </div> */}
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            placeholderText="Select date"
            dateFormat="yyyy-MM-dd"
            customInput={<CustomDateInput />}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose} className="!bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500 text-white rounded-md px-4 py-2 transition">
              Cancel
            </Button>
            <Button type="submit" className="!bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-md px-4 py-2 transition">
              {application ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm;
