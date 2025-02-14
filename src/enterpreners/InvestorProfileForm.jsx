import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, Upload, Plus, X,
  Camera, Linkedin, Twitter, Instagram, Globe, Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { setUserData, clearUserData, addUserData, fetchUserData } from '../redux/UserSlice';

const InvestorProfileForm = () => {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.userData);

  useEffect(() => {
    dispatch(fetchUserData()); // Ensure this function is being called
  }, [dispatch]);

  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    title: '',
    photo: null,
    about: '',

    // Investment Details
    capital: '',
    experience: '',
    successfulExits: '',
    portfolioCompanies: '',

    // Fields and Preferences
    preferredFields: [],
    minimumInvestment: '',
    maximumInvestment: '',

    // Social Links
    socialLinks: {
      linkedin: '',
      twitter: '',
      website: '',
      instagram: '',
      email: ''
    },

    // Portfolio
    previousInvestments: [
      { name: '', result: '', description: '', image: null }
    ]
  });

  const [newField, setNewField] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };


  // const handlePhotoUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setSelectedFile(file); // Store in local state only!
  //     // Optionally, you could also generate a preview URL:
  //     setFormData(prev => ({
  //       ...prev,
  //       // You might use a preview URL for display purposes
  //       photoPreview: URL.createObjectURL(file)
  //     }));
  //   }
  // };
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setFormData(prev => ({
          ...prev,
          photo: base64 // now photo is a serializable string
        }));
      } catch (error) {
        console.error("Error converting file:", error);
      }
    }
  };


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleAddField = () => {
    if (newField.trim()) {
      setFormData(prev => ({
        ...prev,
        preferredFields: [...prev.preferredFields, newField.trim()]
      }));
      setNewField('');
    }
  };

  const handleRemoveField = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      preferredFields: prev.preferredFields.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleAddInvestment = () => {
    setFormData(prev => ({
      ...prev,
      previousInvestments: [...prev.previousInvestments, { name: '', result: '', description: '', image: null }]
    }));
  };

  const handleRemoveInvestment = (index) => {
    setFormData(prev => ({
      ...prev,
      previousInvestments: prev.previousInvestments.filter((_, i) => i !== index)
    }));
  };

  const handleInvestmentChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      previousInvestments: prev.previousInvestments.map((investment, i) =>
        i === index ? { ...investment, [field]: value } : investment
      )
    }));
  };

  // Update `email` when `userData` is available
  useEffect(() => {
    if (userData && userData.email) {
      setFormData((prevData) => ({
        ...prevData,
        socialLinks: {
          ...prevData.socialLinks,
          email: userData.email,
        },
      }));
    }
  }, [userData]);
  

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Remove the file from formData that you store in Redux
  // Instead, use local state to manage the file
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dispatch the form data to the server using async thunk
    try {
      await dispatch(addUserData(formData)).unwrap();
      alert('Profile submitted successfully!');
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('Failed to submit profile.');
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (

    <div className="min-h-screen bg-gray-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="flex justify-between mb-4">
          <Link to="/Investor-Profile">
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Investor Profile Setup
        </h1>

        {/* Navigation */}


        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Personal Info</span>
            <span>Investment Details</span>
            <span>Preferences</span>
            <span>Portfolio</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                {...stepVariants}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

                {/* Photo Upload */}
                <div className="flex justify-center">
                  <div
                    className={`w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer
                      ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    onDragEnter={() => setDragActive(true)}
                    onDragLeave={() => setDragActive(false)}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById('photo-upload').click()}
                  >
                    {formData.photo ? (
                      <img
                        src={formData.photo}  // This is now a Base64 data URL
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}


                    <input
                      id="photo-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    name="title"
                    placeholder="Professional Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <textarea
                    name="about"
                    placeholder="About yourself..."
                    value={formData.about}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                {...stepVariants}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="capital"
                    placeholder="Available Capital"
                    value={formData.capital}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    name="experience"
                    placeholder="Years of Experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="number"
                    name="successfulExits"
                    placeholder="Number of Successful Exits"
                    value={formData.successfulExits}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="number"
                    name="portfolioCompanies"
                    placeholder="Number of Portfolio Companies"
                    value={formData.portfolioCompanies}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                {...stepVariants}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-4">Preferences & Social Links</h2>

                {/* Preferred Fields */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Preferred Investment Fields</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newField}
                      onChange={(e) => setNewField(e.target.value)}
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Add field"
                    />
                    <button
                      type="button"
                      onClick={handleAddField}
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.preferredFields.map((field, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {field}
                        <button
                          type="button"
                          onClick={() => handleRemoveField(index)}
                          className="hover:text-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <input
                      type="text"
                      name="linkedin"
                      placeholder="LinkedIn URL"
                      value={formData.socialLinks.linkedin}
                      onChange={handleSocialLinkChange}
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="w-5 h-5 text-blue-400" />
                    <input
                      type="text"
                      name="twitter"
                      placeholder="Twitter URL"
                      value={formData.socialLinks.twitter}
                      onChange={handleSocialLinkChange}
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-gray-600" />
                    <input
                      type="text"
                      name="website"
                      placeholder="Website URL"
                      value={formData.socialLinks.website}
                      onChange={handleSocialLinkChange}
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                {...stepVariants}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-4">Previous Investments</h2>

                {formData.previousInvestments.map((investment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Investment #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => handleRemoveInvestment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Company Name"
                      value={investment.name}
                      onChange={(e) => handleInvestmentChange(index, 'name', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Investment Result (e.g., 3x Return)"
                      value={investment.result}
                      onChange={(e) => handleInvestmentChange(index, 'result', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <textarea
                      placeholder="Description"
                      value={investment.description}
                      onChange={(e) => handleInvestmentChange(index, 'description', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      rows={3}
                    />
                  </motion.div>
                ))}

                <button
                  type="button"
                  onClick={handleAddInvestment}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Another Investment
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-auto"
              >
                Submit Profile
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default InvestorProfileForm;