import { TextInput, Button } from 'flowbite-react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
ContactManagement.propTypes = {
  leadId: PropTypes.string.isRequired
};
export default function ContactManagement({ leadId }) {
  const [contactData, setContactData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    leadId,
  });
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactData({ ...contactData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact-manage/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(contactData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      fetchContacts();
      setContactData({ ...contactData, name: '', role: '', phone: '', email: '' });
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch(`/api/contact-manage/${leadId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch contacts');
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [leadId]);

  return (
    <div className="flex flex-col gap-4">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <h3 className="text-lg text-center font-bold">Contacts:</h3>
        <ul className="list-disc ml-5">
          {contacts.map((contact) => (
            <li key={contact._id}>
              {contact.name} ({contact.role}) - {contact.phone || 'No phone'} | {contact.email || 'No email'}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          type="text"
          placeholder="Name"
          name="name"
          value={contactData.name}
          onChange={handleInputChange}
          required
        />
        <TextInput
          type="text"
          placeholder="Role"
          name="role"
          value={contactData.role}
          onChange={handleInputChange}
          required
        />
        <TextInput
          type="tel"
          placeholder="Phone"
          name="phone"
          value={contactData.phone}
          onChange={handleInputChange}
        />
        <TextInput
          type="email"
          placeholder="Email"
          name="email"
          value={contactData.email}
          onChange={handleInputChange}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Add Contact
        </Button>
      </form>
    </div>
  );
}