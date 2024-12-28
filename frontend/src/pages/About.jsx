/* eslint-disable react/no-unescaped-entities */

export default function About() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto p-6 text-center bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8">
            About Key Management System
          </h1>
          <div className="space-y-12">
            {/* Section 1 */}
            <div className="flex flex-col items-center">
              <img
                src="https://leapmax.ai/wp-content/uploads/2024/10/employee-management-system.webp"
                alt="Secure Management"
                className="w-full max-w-md h-64 object-cover rounded-lg mb-4"
              />
              <p className="text-lg text-gray-700 dark:text-gray-300">
                The Key Management System (KMS) is designed to simplify and secure the process of managing
                sensitive keys, credentials, and access data for organizations and individuals. Our mission
                is to ensure that your keys are always safe, accessible, and efficiently organized.
              </p>
            </div>
  
            {/* Section 2 */}
            <div className="flex flex-col items-center">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGtleSUyMHN0b3JhZ2V8ZW58MHx8fHwxNjg4ODUyOTg4&ixlib=rb-1.2.1&q=80&w=400"
                alt="Streamlined Workflow"
                className="w-full max-w-md h-64 object-cover rounded-lg mb-4"
              />
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Our system streamlines the workflow for managing cryptographic keys by providing a central
                hub for generation, storage, and access control. With features like automated key rotation,
                real-time monitoring, and secure sharing, KMS makes managing your sensitive data simple and
                efficient.
              </p>
            </div>
  
            {/* Section 3 */}
            <div className="flex flex-col items-center">
              <img
                src="https://images.unsplash.com/photo-1556761175-129418cb2dfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDV8fGtleXMlMjBhbmQlMjBzZWN1cml0eXxlbnwwfHx8fDE2ODg4NTMwMTg&ixlib=rb-1.2.1&q=80&w=400"
                alt="Inclusive Environment"
                className="w-full max-w-md h-64 object-cover rounded-lg mb-4"
              />
              <p className="text-lg text-gray-700 dark:text-gray-300">
                At the heart of KMS is our commitment to security and inclusivity. We ensure that your data
                is safeguarded using industry-standard encryption, while providing a user-friendly interface
                for individuals and teams alike. Your privacy and security are our top priorities.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  