import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  Plus,
  X,
  User,
  BookOpen,
  ClipboardList,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentApplicationForm = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    contactEmail: '',
    educationHistory: [{
      institution: '',
      degree: '',
      fieldOfStudy: '',
    }],
    fundingPurpose: 'university',
    fundingAmount: '',
    financialNeedsDescription: '',
    documents: {
      academicTranscripts: null,
      researchProposal: null,
      additionalDocuments: []
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep = () => {
    const newErrors = {};
    switch(step) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Birth date required';
        break;
      case 2:
        formData.educationHistory.forEach((edu, index) => {
          if (!edu.institution) newErrors[`edu${index}Institution`] = 'Institution required';
          if (!edu.degree) newErrors[`edu${index}Degree`] = 'Degree required';
        });
        break;
      case 3:
        if (!formData.fundingAmount) newErrors.fundingAmount = 'Funding amount required';
        if (!formData.financialNeedsDescription) newErrors.financialNeedsDescription = 'Description required';
        break;
      case 4:
        if (!formData.documents.academicTranscripts) newErrors.academicTranscripts = 'Academic transcripts required';
        if (formData.fundingPurpose === 'research' && !formData.documents.researchProposal) {
          newErrors.researchProposal = 'Research proposal required';
        }
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = formData.educationHistory.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setFormData(prev => ({ ...prev, educationHistory: updatedEducation }));
  };

  const addEducationEntry = () => {
    setFormData(prev => ({
      ...prev,
      educationHistory: [...prev.educationHistory, {
        institution: '',
        degree: '',
        fieldOfStudy: '',
      }]
    }));
  };

  const handleFileUpload = (e, field) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const readers = files.map(file => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(results => {
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [field]: field === 'additionalDocuments' 
              ? [...(prev.documents[field] || []), ...results]
              : results[0]
          }
        }));
      });
    }
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 4 || !validateStep()) return;
    
    setIsSubmitting(true);
    try {
      // Replace with actual API call
      console.log('Form submission data:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/confirmation');
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <button 
          type="button"
          onClick={() => navigate('/FundingTypeSelector')}
          className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded"
        >
          <ChevronLeft size={24} />
          Back to Dashboard
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
            Education Funding Application
          </h1>

          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                className="h-full bg-blue-600 rounded-full"
                animate={{ width: `${(step/4)*100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              {['Personal', 'Education', 'Funding', 'Documents'].map((label, index) => (
                <span key={label} className={step > index + 1 ? 'text-blue-600' : ''}>
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
                        className={`w-full p-3 border rounded-lg ${errors.fullName ? 'border-red-500' : ''}`}
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
                          className={`w-full p-3 border rounded-lg ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                        />
                        {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                      </div>
                      <input
                        type="email"
                        name="contactEmail"
                        placeholder="Email *"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg"
                      />
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
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              educationHistory: prev.educationHistory.filter((_, i) => i !== index)
                            }))}
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
                          className="w-full p-3 border rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          className="w-full p-3 border rounded-lg"
                        >
                          <option value="">Select Degree</option>
                          <option value="High School">High School</option>
                          <option value="Bachelor's">Bachelor's</option>
                          <option value="Master's">Master's</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Field of Study"
                          value={edu.fieldOfStudy}
                          onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                          className="w-full p-3 border rounded-lg"
                        />
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
                        className="w-full p-3 border rounded-lg"
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
                        className={`w-full p-3 border rounded-lg ${errors.fundingAmount ? 'border-red-500' : ''}`}
                      />
                      {errors.fundingAmount && <p className="text-red-500 text-sm mt-1">{errors.fundingAmount}</p>}
                    </div>

                    <div>
                      <textarea
                        name="financialNeedsDescription"
                        placeholder="Explain your funding needs *"
                        value={formData.financialNeedsDescription}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full p-3 border rounded-lg ${errors.financialNeedsDescription ? 'border-red-500' : ''}`}
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
                        className="w-full p-3 border rounded-lg"
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
                          className="w-full p-3 border rounded-lg"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Additional Documents (optional)
                      </label>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(e, 'additionalDocuments')}
                        className="w-full p-3 border rounded-lg"
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
                  <ChevronLeft size={18} />
                  Back
                </button>
              )}
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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