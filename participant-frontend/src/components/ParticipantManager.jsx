import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';


const ParticipantManager = () => {
  const [participants, setParticipants] = useState([]);
  const [participant, setParticipant] = useState({
    id: '',
    name: '',
    gender: '',
    email: '',
    contact: '',
    eventName: '',
    role: '',
    organization: ''
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedParticipant, setFetchedParticipant] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

 const baseUrl = `${import.meta.env.VITE_API_URL}/participantapi`; 

  useEffect(() => {
    fetchAllParticipants();
  }, []);

  const fetchAllParticipants = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setParticipants(res.data);
    } catch (error) {
      setMessage('Failed to fetch participants.');
    }
  };

  const handleChange = (e) => {
    setParticipant({ ...participant, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (let key in participant) {
      if (!participant[key] || participant[key].toString().trim() === '') {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const addParticipant = async () => {
    if (!validateForm()) return;
    try {
      const payload = { ...participant, id: parseInt(participant.id) };
      await axios.post(`${baseUrl}/add`, payload);
      setMessage('Participant added successfully.');
      fetchAllParticipants();
      resetForm();
    } catch (error) {
      setMessage('Error adding participant.');
      console.error(error);
    }
  };

  const updateParticipant = async () => {
    if (!validateForm()) return;
    try {
      const payload = { ...participant, id: parseInt(participant.id) };
      await axios.put(`${baseUrl}/update`, payload);
      setMessage('Participant updated successfully.');
      fetchAllParticipants();
      resetForm();
    } catch (error) {
      setMessage('Error updating participant.');
      console.error(error);
    }
  };

  const deleteParticipant = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data);
      fetchAllParticipants();
    } catch (error) {
      setMessage('Error deleting participant.');
      console.error(error);
    }
  };

  const getParticipantById = async () => {
    if (!idToFetch) return;
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedParticipant(res.data);
      setMessage('');
    } catch (error) {
      setFetchedParticipant(null);
      setMessage('Participant not found.');
    }
  };

  const handleEdit = (p) => {
    setParticipant(p);
    setEditMode(true);
    setMessage(`Editing participant with ID ${p.id}`);
  };

  const resetForm = () => {
    setParticipant({
      id: '',
      name: '',
      gender: '',
      email: '',
      contact: '',
      eventName: '',
      role: '',
      organization: ''
    });
    setEditMode(false);
  };

  return (
    <div className="student-container">
      {message && (
        <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <h2>Participant Management</h2>

      {/* Add / Edit Form */}
      <div>
        <h3>{editMode ? 'Edit Participant' : 'Add Participant'}</h3>
        <div className="form-grid">
          <input type="number" name="id" placeholder="ID" value={participant.id} onChange={handleChange} />
          <input type="text" name="name" placeholder="Name" value={participant.name} onChange={handleChange} />
          <select name="gender" value={participant.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
          </select>
          <input type="email" name="email" placeholder="Email" value={participant.email} onChange={handleChange} />
          <input type="text" name="contact" placeholder="Contact" value={participant.contact} onChange={handleChange} />
          <input type="text" name="eventName" placeholder="Event Name" value={participant.eventName} onChange={handleChange} />
          <input type="text" name="role" placeholder="Role (Attendee, Speaker, etc.)" value={participant.role} onChange={handleChange} />
          <input type="text" name="organization" placeholder="Organization" value={participant.organization} onChange={handleChange} />
        </div>

        <div className="btn-group">
          {!editMode ? (
            <button className="btn-blue" onClick={addParticipant}>Add Participant</button>
          ) : (
            <>
              <button className="btn-green" onClick={updateParticipant}>Update Participant</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      {/* Fetch by ID */}
      <div>
        <h3>Get Participant By ID</h3>
        <input
          type="number"
          value={idToFetch}
          onChange={(e) => setIdToFetch(e.target.value)}
          placeholder="Enter ID"
        />
        <button className="btn-blue" onClick={getParticipantById}>Fetch</button>

        {fetchedParticipant && (
          <div>
            <h4>Participant Found:</h4>
            <pre>{JSON.stringify(fetchedParticipant, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* All Participants */}
      <div>
        <h3>All Participants</h3>
        {participants.length === 0 ? (
          <p>No participants found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(participant).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id}>
                    {Object.keys(participant).map((key) => (
                      <td key={key}>{p[key]}</td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="btn-red" onClick={() => deleteParticipant(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantManager;
