export default function Helper() {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-md">
        {/* Contact Us Section */}
        <section className="mb-6">
          <h1 className="text-2xl font-bold mb-4 border-b-2 border-purple-500 inline-block">
            Contact Us
          </h1>
          <p className="text-lg leading-relaxed">
            We’re here to help! If you have any questions or need assistance, don’t hesitate to reach out. Whether it’s a question, a suggestion, or just a comment, we’d love to hear from you.
          </p>
        </section>
  
        {/* Get In Touch Section */}
        <section>
          <h1 className="text-2xl font-bold mb-4 border-b-2 border-purple-500 inline-block">
            Get In Touch
          </h1>
          <p className="text-lg leading-relaxed">
            You can contact us via email at{" "}
            <a
              href="mailto:patelnikhil2605@gmail.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              patelnikhil2605@gmail.com
            </a>
            . We will do our best to respond to your inquiry as soon as possible.
          </p>
        </section>
      </div>
    );
  }
  