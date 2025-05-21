import { Button } from "./ui/button";
import { useState } from "react";

const ApplicationForm = ({ onSubmit, defaultValues }: any) => {
  const [title, setTitle] = useState(defaultValues?.title || "");
  const [company, setCompany] = useState(defaultValues?.company || "");
  const [status, setStatus] = useState(defaultValues?.status || "Applied");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, company, status }); // Pass the form data to the parent onSubmit handler
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)} required>
        <option value="Applied">Applied</option>
        <option value="Interviewing">Interviewing</option>
        <option value="Offer">Offer</option>
      </select>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default ApplicationForm;
