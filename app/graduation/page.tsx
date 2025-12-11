'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { GraduationCap } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://brandmonk-backend-1.onrender.com';

interface Attendee {
  name: string;
  relation: string;
}

export default function GraduationRegistration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    nationality: '',
    idNumber: '',
    politicalStatus: '',
    degreeType: '',
    educationLevel: '',
    major: '',
    currentAddress: '',
    admissionTime: '',
    graduationTime: '',
    diplomaNumber: '',
    employer: '',
    workPhone: '',
    cellPhone: '',
    homePhone: '',
    learningExperience: '',
    studyPeriod: '',
    studyLocation: '',
    selfIdentification: '',
    batch: '',
    course: '',
  });
  const [attendees, setAttendees] = useState<Attendee[]>([
    { name: '', relation: 'Self' }
  ]);

  const relationOptions = ['Self', 'Friend', 'Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Other'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAttendeeChange = (index: number, field: 'name' | 'relation', value: string) => {
    const updatedAttendees = [...attendees];
    updatedAttendees[index][field] = value;
    setAttendees(updatedAttendees);
  };

  const addAttendee = () => {
    setAttendees([...attendees, { name: '', relation: 'Friend' }]);
  };

  const removeAttendee = (index: number) => {
    if (attendees.length > 1) {
      setAttendees(attendees.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validAttendees = attendees.filter(a => a.name.trim());
      if (validAttendees.length === 0) {
        alert('Please add at least one attendee');
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_URL}/api/graduation/register`, {
        studentName: formData.studentName,
        email: formData.email,
        phone: formData.cellPhone || formData.phone,
        batch: formData.batch,
        course: formData.course || formData.major,
        attendees: validAttendees
      });

      if (response.data.success) {
        router.push(`/graduation/success?seats=${response.data.data.seatNumbers}&total=${response.data.data.totalSeats}&student=${encodeURIComponent(formData.studentName)}&course=${encodeURIComponent(formData.course || formData.major)}&batch=${encodeURIComponent(formData.batch)}`);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <GraduationCap className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2 tracking-tight">
            COLLEGE GRADUATE REGISTRATION FORM
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-4"></div>
        </div>

        {/* Form Container */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border-4 border-slate-300">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8">
            <h2 className="text-2xl font-bold text-white text-center">Graduate Registration Form</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Main Registration Table */}
            <table className="w-full border-collapse border-2 border-slate-800 mb-8">
              <tbody>
                {/* Row 1 - Name & Email */}
                <tr>
                  <td className="border-2 border-slate-800 p-4 bg-slate-50 font-semibold w-1/4 text-slate-800">Full Name *</td>
                  <td className="border-2 border-slate-800 p-3" colSpan={3}>
                    <input
                      type="text"
                      name="studentName"
                      required
                      value={formData.studentName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200 rounded"
                      placeholder="Enter your full name"
                    />
                  </td>
                </tr>

                {/* Row 2 - Email */}
                <tr>
                  <td className="border-2 border-slate-800 p-4 bg-slate-50 font-semibold text-slate-800">Email Address *</td>
                  <td className="border-2 border-slate-800 p-3" colSpan={3}>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200 rounded"
                      placeholder="your.email@example.com"
                    />
                  </td>
                </tr>

                {/* Row 3 - Phone */}
                <tr>
                  <td className="border-2 border-slate-800 p-4 bg-slate-50 font-semibold text-slate-800">Phone Number *</td>
                  <td className="border-2 border-slate-800 p-3" colSpan={3}>
                    <input
                      type="tel"
                      name="cellPhone"
                      required
                      value={formData.cellPhone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200 rounded"
                      placeholder="+91 1234567890"
                    />
                  </td>
                </tr>

                {/* Row 4 - Course/Major */}
                <tr>
                  <td className="border-2 border-slate-800 p-4 bg-slate-50 font-semibold text-slate-800">Course / Major *</td>
                  <td className="border-2 border-slate-800 p-3" colSpan={3}>
                    <input
                      type="text"
                      name="major"
                      required
                      value={formData.major}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200 rounded"
                      placeholder="e.g., Digital Marketing, Social Media Marketing"
                    />
                  </td>
                </tr>

                {/* Row 5 - Batch */}
                <tr>
                  <td className="border-2 border-slate-800 p-4 bg-slate-50 font-semibold text-slate-800">Batch Year *</td>
                  <td className="border-2 border-slate-800 p-3" colSpan={3}>
                    <input
                      type="text"
                      name="batch"
                      required
                      value={formData.batch}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200 rounded"
                      placeholder="e.g., 2024"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Attendees Section */}
            <div className="mb-8 border-4 border-indigo-200 rounded-xl p-6 bg-indigo-50">
              <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                Celebration Attendees
              </h3>
              <div className="space-y-3">
                {attendees.map((attendee, index) => (
                  <div key={index} className="flex gap-3 items-center bg-white p-3 rounded-lg border-2 border-indigo-300">
                    <input
                      type="text"
                      value={attendee.name}
                      onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)}
                      placeholder="Name"
                      required
                      className="flex-1 px-3 py-2 border-2 border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                      value={attendee.relation}
                      onChange={(e) => handleAttendeeChange(index, 'relation', e.target.value)}
                      className="px-3 py-2 border-2 border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {relationOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeAttendee(index)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 font-semibold"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addAttendee}
                className="mt-4 w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              >
                + Add Another Attendee
              </button>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Submitting Registration...
                  </span>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-8 text-slate-600">
          <p className="text-sm">* Required fields</p>
          <p className="text-sm mt-2">BrandMonk Academy © 2024 - Empowering Future Leaders</p>
        </div>
      </div>
    </div>
  );
}
