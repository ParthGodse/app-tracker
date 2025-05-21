import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold !text-red-600">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">Oops! The page you're looking for does not exist.</p>
      <Link to="/" className="mt-4 inline-block px-4 py-2 !bg-blue-700 !text-white rounded-md">
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
