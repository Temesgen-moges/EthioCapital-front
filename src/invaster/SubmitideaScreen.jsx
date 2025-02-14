import React, { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  Plus,
  X,
  Building,
  DollarSign,
  Users,
  FileText,
  Briefcase,
  Target,
  LineChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { addBussinessIdea } from '../redux/BussinessIdeaSlice';
import { fetchUserData } from '../redux/UserSlice';


const SubmitIdeaForm = () => {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    entrepreneurName: '',
    entrepreneurImage: null,
    entrepreneurBackground: '',
    entrepreneurEducation: '',
    entrepreneurLocation: '',
    businessCategory: '',

    // Business Details
    overview: '',
    problemStatement: '',
    solution: '',
    marketSize: '',
    currentStage: '',

    // Financial Information
    fundingNeeded: '',
    fundingRaised: '',
    useOfFunds: [],
    financials: {
      valuation: '',
      revenue2023: '',
      projectedRevenue2024: '',
      breakEvenPoint: '',
    },

    // Traction & Team
    traction: [],
    team: [
      { name: '', role: '', expertise: '' }
    ],

    // Documents
    documents: {
      businessRegistration: null,
      financialProjections: null,
      patentDocumentation: null,
      pitchDeck: null,
      teamCertifications: null,
      marketResearchReport: null,
    }
  });

  const [newFundUse, setNewFundUse] = useState('');
  const [newTraction, setNewTraction] = useState('');

  
  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFinancialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      financials: {
        ...prev.financials,
        [name]: value
      }
    }));
  };

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: file
      }
    }));
  };

  const handleAddTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      team: [...prev.team, { name: '', role: '', expertise: '' }]
    }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const handleAddFundUse = () => {
    if (newFundUse.trim()) {
      setFormData(prev => ({
        ...prev,
        useOfFunds: [...prev.useOfFunds, newFundUse.trim()]
      }));
      setNewFundUse('');
    }
  };

  const handleAddTraction = () => {
    if (newTraction.trim()) {
      setFormData(prev => ({
        ...prev,
        traction: [...prev.traction, newTraction.trim()]
      }));
      setNewTraction('');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setFormData(prev => ({
          ...prev,
          entrepreneurImage: base64 // now photo is a serializable string
        }));
      } catch (error) {
        console.error("Error converting file:", error);
      }
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();

    try {
      await dispatch(addBussinessIdea(formData)).unwrap();
      // console.log('Form submitted successfully:', formData);
      
    } catch (error) {
      console.log('Error submitting form:', error);
      
    }
    // console.log('Form submitted:', formData);
  };

  useEffect(() => {
    dispatch(fetchUserData()); // Ensure this function is being called
  }, [dispatch]);
  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };
  const navigate = useNavigate();
  return (
    <div >
      <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 flex items-center shadow-md">
        <button
          onClick={() => navigate('/Entrepreneur-dashboard')}
          className="flex items-center space-x-2 text-white text-lg font-medium"
        >
          <ChevronLeft size={24} />
          <span>Back to Dashboard</span>
        </button>
      </nav>
      <div className="min-h-screen bg-gray-50 p-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-600 pt-7">
            Submit Your Business Idea
          </h1>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                className="h-full bg-blue-600 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(step / 5) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Basic Info</span>
              <span>Business Details</span>
              <span>Financials</span>
              <span>Team & Traction</span>
              <span>Documents</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  {...stepVariants}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

                  <input
                    type="text"
                    name="title"
                    placeholder="Business Idea Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  <input
                    type="text"
                    name="entrepreneurName"
                    placeholder="Your Full Name"
                    value={formData.entrepreneurName}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  <label htmlFor="entrepreneurImageInput" className="block text-sm font-medium text-gray-700 mb-2">Upload Entrepreneur's Picture</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      name="entrepreneurImage"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="entrepreneurImageInput"
                    />
                    <label htmlFor="entrepreneurImageInput" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg inline-block">Choose File</label>
                  </div>

                  <select
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Business Category</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                  </select>

                  <input
                    type="text"
                    name="entrepreneurLocation"
                    placeholder="Location"
                    value={formData.entrepreneurLocation}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  <textarea
                    name="entrepreneurBackground"
                    placeholder="Your Professional Background"
                    value={formData.entrepreneurBackground}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="step2"
                  {...stepVariants}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold mb-4">Business Details</h2>

                  <textarea
                    name="overview"
                    placeholder="Business Overview"
                    value={formData.overview}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />

                  <textarea
                    name="problemStatement"
                    placeholder="Problem Statement"
                    value={formData.problemStatement}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />

                  <textarea
                    name="solution"
                    placeholder="Your Solution"
                    value={formData.solution}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />

                  <input
                    type="text"
                    name="marketSize"
                    placeholder="Market Size"
                    value={formData.marketSize}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  <select
                    name="currentStage"
                    value={formData.currentStage}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Current Stage</option>
                    <option value="Idea">Idea Stage</option>
                    <option value="MVP">MVP</option>
                    <option value="Early Revenue">Early Revenue</option>
                    <option value="Growth">Growth</option>
                    <option value="Scale">Scale</option>
                  </select>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  {...stepVariants}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold mb-4">Financial Information</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="fundingNeeded"
                      placeholder="Funding Needed"
                      value={formData.fundingNeeded}
                      onChange={handleChange}
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <input
                      type="text"
                      name="fundingRaised"
                      placeholder="Funding Raised So Far"
                      value={formData.fundingRaised}
                      onChange={handleChange}
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      name="valuation"
                      placeholder="Current Valuation"
                      value={formData.financials.valuation}
                      onChange={handleFinancialChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <input
                      type="text"
                      name="revenue2023"
                      placeholder="Revenue 2023"
                      value={formData.financials.revenue2023}
                      onChange={handleFinancialChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <input
                      type="text"
                      name="projectedRevenue2024"
                      placeholder="Projected Revenue 2024"
                      value={formData.financials.projectedRevenue2024}
                      onChange={handleFinancialChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <input
                      type="text"
                      name="breakEvenPoint"
                      placeholder="Break-Even Point"
                      value={formData.financials.breakEvenPoint}
                      onChange={handleFinancialChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFundUse}
                        onChange={(e) => setNewFundUse(e.target.value)}
                        placeholder="Add Use of Funds"
                        className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddFundUse}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.useOfFunds.map((use, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {use}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                useOfFunds: prev.useOfFunds.filter((_, i) => i !== index)
                              }));
                            }}
                            className="hover:text-blue-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  {...stepVariants}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Team & Traction</h2>

                  <div className="space-y-4">
                    {formData.team.map((member, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Team Member #{index + 1}</h3>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  team: prev.team.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder="Name"
                          value={member.name}
                          onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />

                        <input
                          type="text"
                          placeholder="Role"
                          value={member.role}
                          onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />

                        <input
                          type="text"
                          placeholder="Expertise"
                          value={member.expertise}
                          onChange={(e) => handleTeamMemberChange(index, 'expertise', e.target.value)}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddTeamMember}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Team Member
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTraction}
                        onChange={(e) => setNewTraction(e.target.value)}
                        placeholder="Add Traction/Achievement"
                        className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddTraction}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.traction.map((item, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                traction: prev.traction.filter((_, i) => i !== index)
                              }));
                            }}
                            className="hover:text-blue-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  {...stepVariants}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Required Documents</h2>

                  {Object.entries(formData.documents).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="block font-medium">
                        {key.split(/(?=[A-Z])/).join(' ')}
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, key)}
                          className="hidden"
                          id={`file-${key}`}
                        />
                        <label
                          htmlFor={`file-${key}`}
                          className="flex-1 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer"
                        >
                          <div className="flex items-center gap-2 text-gray-600">
                            <Upload className="w-5 h-5" />
                            <span>{value ? value.name : `Upload ${key.split(/(?=[A-Z])/).join(' ')}`}</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </motion.div>

              )}
            </AnimatePresence>

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

              {step < 5 ? (
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
                  Submit Idea
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitIdeaForm;