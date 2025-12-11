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
    photo: null as File | null,
    photoPreview: '',
  });
  // Initialize empty to show no rows by default (Student is always included implicitly)
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  const relationOptions = ['Friend', 'Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Other'];

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
    setAttendees(attendees.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Prepare Guests (filter out empty names)
      const validGuests = attendees.filter(a => a.name.trim());
      
      // 2. ALWAYS add the Student as the first attendee ("Self")
      // This ensures Seat 1 is the Student, and Total Seats = 1 + Guests
      const finalAttendees = [
        { name: formData.studentName || 'Student', relation: 'Self' },
        ...validGuests
      ];

      const response = await axios.post(`${API_URL}/api/graduation/register`, {
        studentName: formData.studentName,
        email: formData.email,
        phone: formData.cellPhone || formData.phone,
        batch: formData.batch,
        course: formData.course || formData.major,
        attendees: finalAttendees
      });

      if (response.data.success) {
        // Encode attendees as JSON string for URL
        const attendeesParam = encodeURIComponent(JSON.stringify(finalAttendees));
        // Use seatStart (clean number) to ensure the success page logic works correctly
        router.push(`/graduation/success?seats=${response.data.data.seatStart}&total=${response.data.data.totalSeats}&student=${encodeURIComponent(formData.studentName)}&course=${encodeURIComponent(formData.course || formData.major)}&batch=${encodeURIComponent(formData.batch)}&attendees=${attendeesParam}`);
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
            <img src="/image.png" alt="BrandMonk Academy" className="w-24 h-24 object-contain" />
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
                {/* Row 1 - Name & Photo */}
                <tr>
                  <td className="border-2 border-slate-800 p-4 bg-slate-50 font-semibold w-1/4 text-slate-800">
                    Full Name *
                  </td>
                  <td className="border-2 border-slate-800 p-3" colSpan={2}>
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
                  <td className="border-2 border-slate-800 p-1 w-32 bg-slate-100/50 text-center align-middle" rowSpan={3}>
                    <div className="flex flex-col items-center justify-center p-2 relative h-full min-h-[140px]">
                      {formData.photoPreview ? (
                        <div className="relative w-28 h-28 mb-2">
                          <img 
                            src={formData.photoPreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded-lg border-2 border-indigo-200 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, photo: null, photoPreview: '' }))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <label 
                            htmlFor="photo-upload" 
                            className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors mb-2"
                          >
                            <span className="text-2xl text-slate-400">📷</span>
                            <span className="text-[10px] text-slate-500 mt-1">Upload Photo</span>
                          </label>
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const base64 = reader.result as string;
                                  setFormData(prev => ({ ...prev, photo: file, photoPreview: base64 }));
                                  // Save to sessionStorage for success page
                                  sessionStorage.setItem('graduationPhoto', base64);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </>
                      )}
                      <span className="text-[10px] text-slate-400 block">* Passport size</span>
                    </div>
                  </td>
                </tr>

                {/* Row 2 - Email */}
                <tr>
                  <td className="border-2 border-slate-800 p-4 bg-slate-50 font-semibold text-slate-800">Email Address *</td>
                  <td className="border-2 border-slate-800 p-3" colSpan={2}>
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
                  <td className="border-2 border-slate-800 p-3" colSpan={2}>
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
                      placeholder="Guest Name"
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
                    <button
                      type="button"
                      onClick={() => removeAttendee(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 font-bold"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addAttendee}
                className="mt-4 w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              >
                + Add {attendees.length === 0 ? 'Guest Attendee' : 'Another Attendee'}
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
