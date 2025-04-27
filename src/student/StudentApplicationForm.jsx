import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  User,
  BookOpen,
  ClipboardList,
  FileText,
  CheckCircle,
  Camera,
  Link,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentApplicationForm = () => {
  const [step, setStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    contactEmail: '',
    profilePicture: null,
    socialMedia: {
      linkedIn: '',
      twitter: '',
      github: '',
      other: '',
    },
    portfolioDescription: '',
    educationHistory: [
      {
        institution: '',
        degree: '',
        fieldOfStudy: '',
      },
    ],
    fundingPurpose: 'university',
    fundingAmount: '',
    fundingDuration: '',
    fundingRaised: '0',
    financialNeedsDescription: '',
    documents: {
      academicTranscripts: null,
      researchProposal: null,
      additionalDocuments: [],
    },
  });

  const validateStep = () => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Birth date required';
        if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email required';
        else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) newErrors.contactEmail = 'Invalid email format';
        if (formData.socialMedia.linkedIn && !/^https?:\/\/(www\.)?linkedin\.com\//.test(formData.socialMedia.linkedIn))
          newErrors.linkedIn = 'Invalid LinkedIn URL';
        if (formData.socialMedia.twitter && !/^https?:\/\/(www\.)?(twitter|x)\.com\//.test(formData.socialMedia.twitter))
          newErrors.twitter = 'Invalid Twitter URL';
        if (formData.socialMedia.github && !/^https?:\/\/(www\.)?github\.com\//.test(formData.socialMedia.github))
          newErrors.github = 'Invalid GitHub URL';
        if (!formData.profilePicture) newErrors.profilePicture = 'Profile picture required';
        if (!formData.portfolioDescription.trim()) newErrors.portfolioDescription = 'Portfolio description required';
        break;
      case 2:
        formData.educationHistory.forEach((edu, index) => {
          if (!edu.institution) newErrors[`edu${index}Institution`] = 'Institution required';
          if (!edu.degree) newErrors[`edu${index}Degree`] = 'Degree required';
        });
        break;
      case 3:
        if (!formData.fundingAmount) newErrors.fundingAmount = 'Funding amount required';
        else if (isNaN(formData.fundingAmount) || Number(formData.fundingAmount) <= 0)
          newErrors.fundingAmount = 'Enter a valid amount';
        if (!formData.fundingDuration) newErrors.fundingDuration = 'Funding duration required';
        if (!formData.financialNeedsDescription)
          newErrors.financialNeedsDescription = 'Description required';
        break;
      case 4:
        if (!formData.documents.academicTranscripts)
          newErrors.academicTranscripts = 'Academic transcripts required';
        if (formData.fundingPurpose === 'research' && !formData.documents.researchProposal) {
          newErrors.researchProposal = 'Research proposal required';
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialMedia.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [field]: value },
      }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = formData.educationHistory.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData((prev) => ({ ...prev, educationHistory: updatedEducation }));
    setErrors((prev) => ({
      ...prev,
      [`edu${index}Institution`]: undefined,
      [`edu${index}Degree`]: undefined,
    }));
  };

  const addEducationEntry = () => {
    setFormData((prev) => ({
      ...prev,
      educationHistory: [
        ...prev.educationHistory,
        {
          institution: '',
          degree: '',
          fieldOfStudy: '',
        },
      ],
    }));
  };

  const removeEducationEntry = (index) => {
    setFormData((prev) => ({
      ...prev,
      educationHistory: prev.educationHistory.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = (e, field) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const readers = files.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((results) => {
        setFormData((prev) => ({
          ...prev,
          [field === 'profilePicture' ? field : 'documents']: field === 'profilePicture' 
            ? results[0]
            : {
                ...prev.documents,
                [field]: field === 'additionalDocuments' ? [...(prev.documents[field] || []), ...results] : results[0],
              },
        }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 4 || !validateStep()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Please log in to submit the application.');
      }
      console.log('Submitting form to /api/v1/student-applications:', formData);
      const response = await axios.post(
        'http://localhost:3001/api/v1/student-applications',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Submission response:', response.data);
      setSuccessMessage('The application has been successfully sent to the admin for approval.');
      setTimeout(() => {
        setSuccessMessage('');
        setFormData({
          fullName: '',
          dateOfBirth: '',
          contactEmail: '',
          profilePicture: null,
          socialMedia: {
            linkedIn: '',
            twitter: '',
            github: '',
            other: '',
          },
          portfolioDescription: '',
          educationHistory: [
            {
              institution: '',
              degree: '',
              fieldOfStudy: '',
            },
          ],
          fundingPurpose: 'university',
          fundingAmount: '',
          fundingDuration: '',
          fundingRaised: '0',
          financialNeedsDescription: '',
          documents: {
            academicTranscripts: null,
            researchProposal: null,
            additionalDocuments: [],
          },
        });
        setStep(1);
      }, 3000);
    } catch (error) {
      console.error('Submission failed:', error.response?.data || error.message);
      setErrors({
        submit:
          error.response?.status === 404
            ? 'Application endpoint not found. Please contact support.'
            : error.response?.data?.message || error.message || 'Submission failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToDashboard = () => {
    console.log('Navigating to /FundingTypeSelector');
    navigate('/FundingTypeSelector');
  };

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <button
          type="button"
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded transition-colors"
        >
          <ChevronLeft size={28} className="text-white" />
          <span className="text-lg">Back to Dashboard</span>
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Education Funding Application</h1>

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {successMessage}
            </motion.div>
          )}

          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.submit}
            </motion.div>
          )}

          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                className="h-full bg-blue-600 rounded-full"
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              {['Personal', 'Education', 'Funding', 'Documents'].map((label) => (
                <span
                  key={label}
                  className={
                    step > ['Personal', 'Education', 'Funding', 'Documents'].indexOf(label) + 1
                      ? 'text-blue-600'
                      : ''
                  }
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" {...stepVariants} className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User size={20} />
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name *"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className={`w-full p-3 border rounded-lg ${
                            errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.dateOfBirth && (
                          <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="email"
                          name="contactEmail"
                          placeholder="Email *"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          className={`w-full p-3 border rounded-lg ${
                            errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.contactEmail && (
                          <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Camera size={16} />
                        Profile Picture *
                        {errors.profilePicture && (
                          <span className="text-red-500 text-sm ml-2">{errors.profilePicture}</span>
                        )}
                      </label>
                      <input
                        type="file"
                        accept=".jpg,.png"
                        onChange={(e) => handleFileUpload(e, 'profilePicture')}
                        className="w-full p-3 border rounded-lg border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Link size={16} />
                        Social Media Links (optional)
                      </label>
                      <div className="space-y-2">
                        <div>
                          <input
                            type="text"
                            name="socialMedia.linkedIn"
                            placeholder="LinkedIn URL"
                            value={formData.socialMedia.linkedIn}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${
                              errors.linkedIn ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.linkedIn && <p className="text-red-500 text-sm mt-1">{errors.linkedIn}</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            name="socialMedia.twitter"
                            placeholder="Twitter URL"
                            value={formData.socialMedia.twitter}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${
                              errors.twitter ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.twitter && <p className="text-red-500 text-sm mt-1">{errors.twitter}</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            name="socialMedia.github"
                            placeholder="GitHub URL"
                            value={formData.socialMedia.github}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${
                              errors.github ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.github && <p className="text-red-500 text-sm mt-1">{errors.github}</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            name="socialMedia.other"
                            placeholder="Other Portfolio URL"
                            value={formData.socialMedia.other}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <textarea
                        name="portfolioDescription"
                        placeholder="Describe yourself and your achievements for your portfolio *"
                        value={formData.portfolioDescription}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full p-3 border rounded-lg ${
                          errors.portfolioDescription ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.portfolioDescription && (
                        <p className="text-red-500 text-sm mt-1">{errors.portfolioDescription}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" {...stepVariants} className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BookOpen size={20} />
                    Education Background
                  </h2>
                  {formData.educationHistory.map((edu, index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Education #{index + 1}</h3>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeEducationEntry(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Institution Name *"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                          className={`w-full p-3 border rounded-lg ${
                            errors[`edu${index}Institution`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`edu${index}Institution`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`edu${index}Institution`]}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <select
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                            className={`w-full p-3 border rounded-lg ${
                              errors[`edu${index}Degree`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select Degree *</option>
                            <option value="High School">High School</option>
                            <option value="Bachelor's">Bachelor's</option>
                            <option value="Master's">Master's</option>
                          </select>
                          {errors[`edu${index}Degree`] && (
                            <p className="text-red-500 text-sm mt-1">{errors[`edu${index}Degree`]}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Field of Study"
                            value={edu.fieldOfStudy}
                            onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                            className="w-full p-3 border rounded-lg border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addEducationEntry}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add Education Entry
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" {...stepVariants} className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ClipboardList size={20} />
                    Funding Request
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Funding Purpose *</label>
                      <select
                        name="fundingPurpose"
                        value={formData.fundingPurpose}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg border-gray-300"
                      >
                        <option value="university">University Tuition</option>
                        <option value="research">Research Project</option>
                        <option value="conference">Academic Conference</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        name="fundingAmount"
                        placeholder="Requested Amount (USD) *"
                        value={formData.fundingAmount}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg ${
                          errors.fundingAmount ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.fundingAmount && (
                        <p className="text-red-500 text-sm mt-1">{errors.fundingAmount}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Funding Duration *</label>
                      <select
                        name="fundingDuration"
                        value={formData.fundingDuration}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg ${
                          errors.fundingDuration ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Duration</option>
                        <option value="3">3 Months</option>
                        <option value="6">6 Months</option>
                        <option value="9">9 Months</option>
                        <option value="12">12 Months</option>
                      </select>
                      {errors.fundingDuration && (
                        <p className="text-red-500 text-sm mt-1">{errors.fundingDuration}</p>
                      )}
                    </div>
                    <div>
                      <textarea
                        name="financialNeedsDescription"
                        placeholder="Explain your funding needs *"
                        value={formData.financialNeedsDescription}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full p-3 border rounded-lg ${
                          errors.financialNeedsDescription ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.financialNeedsDescription && (
                        <p className="text-red-500 text-sm mt-1">{errors.financialNeedsDescription}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" {...stepVariants} className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Required Documents
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Academic Transcripts *
                        {errors.academicTranscripts && (
                          <span className="text-red-500 text-sm ml-2">{errors.academicTranscripts}</span>
                        )}
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={(e) => handleFileUpload(e, 'academicTranscripts')}
                        className="w-full p-3 border rounded-lg border-gray-300"
                      />
                    </div>
                    {formData.fundingPurpose === 'research' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Research Proposal *
                          {errors.researchProposal && (
                            <span className="text-red-500 text-sm ml-2">{errors.researchProposal}</span>
                          )}
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, 'researchProposal')}
                          className="w-full p-3 border rounded-lg border-gray-300"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium mb-2">Additional Documents (optional)</label>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        onChange={(e) => handleFileUpload(e, 'additionalDocuments')}
                        className="w-full p-3 border rounded-lg border-gray-300"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                  Previous
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Next
                  <ChevronRight size={20} className="text-white" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentApplicationForm;