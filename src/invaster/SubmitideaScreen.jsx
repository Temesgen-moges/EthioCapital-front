import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  Plus,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addBussinessIdea } from '../redux/BussinessIdeaSlice';
import { fetchUserData } from '../redux/UserSlice';

const SubmitIdeaForm = () => {
  const [step, setStep] = useState(1);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    entrepreneurName: '',
    entrepreneurImage: null,
    entrepreneurBackground: '',
    entrepreneurEducation: '',
    entrepreneurLocation: '',
    businessCategory: '',
    overview: '',
    problemStatement: '',
    solution: '',
    marketSize: '',
    currentStage: '',
    fundingNeeded: '',
    fundingRaised: '',
    useOfFunds: [],
    investmentTimeline: '', // Will be selected from dropdown
    entrepreneurEquity: '',
    investorEquity: '',
    financials: {
      valuation: '',
      revenue2023: '',
      projectedRevenue2024: '',
      breakEvenPoint: '',
    },
    traction: [],
    team: [{ name: '', role: '', expertise: '' }],
    documents: {
      businessRegistration: null,
      financialProjections: null,
      patentDocumentation: null,
      pitchDeck: null,
      teamCertifications: null,
      marketResearchReport: null,
    },
  });

  const [newFundUse, setNewFundUse] = useState('');
  const [newTraction, setNewTraction] = useState('');

  const validateStep = (stepNumber) => {
    const errors = {};
    
    if (stepNumber === 1) {
      if (!formData.title.trim()) errors.title = "Business title is required";
      if (!formData.entrepreneurName.trim()) errors.entrepreneurName = "Entrepreneur name is required";
      if (!formData.entrepreneurImage) errors.entrepreneurImage = "Entrepreneur image is required";
      if (!formData.businessCategory) errors.businessCategory = "Business category is required";
      if (!formData.entrepreneurLocation.trim()) errors.entrepreneurLocation = "Location is required";
      if (!formData.entrepreneurBackground.trim()) errors.entrepreneurBackground = "Background information is required";
    }
    
    else if (stepNumber === 2) {
      if (!formData.overview.trim()) errors.overview = "Business overview is required";
      if (!formData.problemStatement.trim()) errors.problemStatement = "Problem statement is required";
      if (!formData.solution.trim()) errors.solution = "Solution description is required";
      if (!formData.marketSize.trim()) errors.marketSize = "Market size is required";
      if (!formData.currentStage) errors.currentStage = "Current stage is required";
    }
    
    else if (stepNumber === 3) {
      if (!formData.fundingNeeded) {
        errors.fundingNeeded = "Funding needed is required";
      } else if (parseFloat(formData.fundingNeeded) < 100000) {
        errors.fundingNeeded = "Minimum funding needed is 100,000 Birr";
      }
      
      if (!formData.fundingRaised) errors.fundingRaised = "Funding raised is required";
      if (!formData.investmentTimeline) errors.investmentTimeline = "Investment timeline is required";
      if (!formData.entrepreneurEquity) errors.entrepreneurEquity = "Entrepreneur equity is required";
      if (!formData.financials.valuation) errors.valuation = "Valuation is required";
      if (!formData.financials.revenue2023) errors.revenue2023 = "Revenue 2023 is required";
      if (!formData.financials.projectedRevenue2024) errors.projectedRevenue2024 = "Projected revenue is required";
      if (!formData.financials.breakEvenPoint) errors.breakEvenPoint = "Break-even point is required";
      if (formData.useOfFunds.length === 0) errors.useOfFunds = "At least one use of funds is required";
    }
    
    else if (stepNumber === 4) {
      const hasEmptyTeamMember = formData.team.some(
        member => !member.name.trim() || !member.role.trim() || !member.expertise.trim()
      );
      
      if (hasEmptyTeamMember) errors.team = "All team member fields are required";
      if (formData.traction.length === 0) errors.traction = "At least one traction item is required";
    }
    
    else if (stepNumber === 5) {
      // Check if any required document is missing
      for (const [key, value] of Object.entries(formData.documents)) {
        if (!value) errors[key] = `${key.split(/(?=[A-Z])/).join(' ')} is required`;
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (step < 5) {
      const isValid = validateStep(step);
      if (isValid) {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      if (name === 'entrepreneurEquity') {
        const entrepreneurEquity = value ? parseFloat(value) : '';
        const investorEquity = entrepreneurEquity ? (100 - entrepreneurEquity).toFixed(2) : '';
        return {
          ...prev,
          [name]: value,
          investorEquity: investorEquity.toString(),
        };
      }
      
      // Clear the validation error for this field if it exists
      if (validationErrors[name]) {
        setValidationErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[name];
          return newErrors;
        });
      }
      
      return { ...prev, [name]: value };
    });
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    // Only allow numeric input (and decimal point for some fields)
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    const formattedValue = parts.length > 1 
      ? parts[0] + '.' + parts.slice(1).join('')
      : numericValue;
      
    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
    
    // Clear validation error if needed
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFinancialChange = (e) => {
    const { name, value } = e.target;
    // Only allow numeric input for financial fields
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    const formattedValue = parts.length > 1 
      ? parts[0] + '.' + parts.slice(1).join('')
      : numericValue;
    
    setFormData((prev) => ({
      ...prev,
      financials: { ...prev.financials, [name]: formattedValue },
    }));
    
    // Clear validation error if needed
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      documents: { ...prev.documents, [docType]: file },
    }));
    
    // Clear validation error if needed
    if (validationErrors[docType]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[docType];
        return newErrors;
      });
    }
  };

  const handleAddTeamMember = () => {
    setFormData((prev) => ({
      ...prev,
      team: [...prev.team, { name: '', role: '', expertise: '' }],
    }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      ),
    }));
    
    // Clear team validation error if it exists
    if (validationErrors.team) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.team;
        return newErrors;
      });
    }
  };

  const handleAddFundUse = () => {
    if (newFundUse.trim()) {
      setFormData((prev) => ({
        ...prev,
        useOfFunds: [...prev.useOfFunds, newFundUse.trim()],
      }));
      setNewFundUse('');
      
      // Clear useOfFunds validation error if it exists
      if (validationErrors.useOfFunds) {
        setValidationErrors(prev => {
          const newErrors = {...prev};
          delete newErrors.useOfFunds;
          return newErrors;
        });
      }
    }
  };

  const handleAddTraction = () => {
    if (newTraction.trim()) {
      setFormData((prev) => ({
        ...prev,
        traction: [...prev.traction, newTraction.trim()],
      }));
      setNewTraction('');
      
      // Clear traction validation error if it exists
      if (validationErrors.traction) {
        setValidationErrors(prev => {
          const newErrors = {...prev};
          delete newErrors.traction;
          return newErrors;
        });
      }
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setFormData((prev) => ({
          ...prev,
          entrepreneurImage: base64,
        }));
        
        // Clear entrepreneurImage validation error if it exists
        if (validationErrors.entrepreneurImage) {
          setValidationErrors(prev => {
            const newErrors = {...prev};
            delete newErrors.entrepreneurImage;
            return newErrors;
          });
        }
      } catch (error) {
        console.error('Error converting file:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 5) {
      return;
    }
    
    const isValid = validateStep(step);
    if (!isValid) {
      setSubmissionMessage('Please fill all required documents before submitting.');
      return;
    }
    
    try {
      await dispatch(addBussinessIdea(formData)).unwrap();
      setSubmissionMessage('Sent to admin for approval.');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionMessage('Error submitting form. Please try again.');
    }
  };

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step === 5) {
        handleSubmit(e);
      }
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 flex items-center shadow-md">
        <button
          onClick={() => navigate('/FundingTypeSelector')}
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

          {submissionMessage && (
            <div className={`mb-4 p-4 ${submissionMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded-lg text-center`}>
              {submissionMessage}
            </div>
          )}

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

          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" {...stepVariants} className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  <div>
                    <input
                      type="text"
                      name="title"
                      placeholder="Business Idea Title *"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.title ? 'border-red-500' : ''}`}
                    />
                    {validationErrors.title && <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      name="entrepreneurName"
                      placeholder="Your Full Name *"
                      value={formData.entrepreneurName}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.entrepreneurName ? 'border-red-500' : ''}`}
                    />
                    {validationErrors.entrepreneurName && <p className="text-red-500 text-sm mt-1">{validationErrors.entrepreneurName}</p>}
                  </div>
                  
                  <div>
                    <label
                      htmlFor="entrepreneurImageInput"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Upload Entrepreneur's Picture *
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        name="entrepreneurImage"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="entrepreneurImageInput"
                      />
                      <label
                        htmlFor="entrepreneurImageInput"
                        className={`cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg inline-block ${validationErrors.entrepreneurImage ? 'ring-2 ring-red-500' : ''}`}
                      >
                        Choose File
                      </label>
                      {formData.entrepreneurImage && (
                        <span className="text-gray-600">Image selected</span>
                      )}
                    </div>
                    {validationErrors.entrepreneurImage && <p className="text-red-500 text-sm mt-1">{validationErrors.entrepreneurImage}</p>}
                  </div>
                  
                  <div>
                    <select
                      name="businessCategory"
                      value={formData.businessCategory}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.businessCategory ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select Business Category *</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                    </select>
                    {validationErrors.businessCategory && <p className="text-red-500 text-sm mt-1">{validationErrors.businessCategory}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      name="entrepreneurLocation"
                      placeholder="Location *"
                      value={formData.entrepreneurLocation}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.entrepreneurLocation ? 'border-red-500' : ''}`}
                    />
                    {validationErrors.entrepreneurLocation && <p className="text-red-500 text-sm mt-1">{validationErrors.entrepreneurLocation}</p>}
                  </div>
                  
                  <div>
                    <textarea
                      name="entrepreneurBackground"
                      placeholder="Your Professional Background *"
                      value={formData.entrepreneurBackground}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none ${validationErrors.entrepreneurBackground ? 'border-red-500' : ''}`}
                    />
                    {validationErrors.entrepreneurBackground && <p className="text-red-500 text-sm mt-1">{validationErrors.entrepreneurBackground}</p>}
                  </div>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div key="step2" {...stepVariants} className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Business Details</h2>
                  
                  <div>
                    <textarea
                      name="overview"
                      placeholder="Business Overview *"
                      value={formData.overview}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none ${validationErrors.overview ? 'border-red-500' : ''}`}
                    />
                    {validationErrors.overview && <p className="text-red-500 text-sm mt-1">{validationErrors.overview}</p>}
                  </div>
                  
                  <div>
                    <textarea
                      name="problemStatement"
                      placeholder="Problem Statement *"
                      value={formData.problemStatement}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none ${validationErrors.problemStatement ? 'border-red-500' : ''}`}
                    />
                    {validationErrors.problemStatement && <p className="text-red-500 text-sm mt-1">{validationErrors.problemStatement}</p>}
                  </div>
                  
                  <div>
                    <textarea
                      name="solution"
                      placeholder="Your Solution *"
                      value={formData.solution}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none ${validationErrors.solution ? 'border-red-500' : ''}`}
                    />
                    {validationErrors.solution && <p className="text-red-500 text-sm mt-1">{validationErrors.solution}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      name="marketSize"
                      placeholder="Market Size *"
                      value={formData.marketSize}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.marketSize ? 'border-red-500' : ''}`}
                    />
                    {validationErrors.marketSize && <p className="text-red-500 text-sm mt-1">{validationErrors.marketSize}</p>}
                  </div>
                  
                  <div>
                    <select
                      name="currentStage"
                      value={formData.currentStage}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.currentStage ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select Current Stage *</option>
                      <option value="Idea">Idea Stage</option>
                      <option value="MVP">MVP</option>
                      <option value="Early Revenue">Early Revenue</option>
                      <option value="Growth">Growth</option>
                      <option value="Scale">Scale</option>
                    </select>
                    {validationErrors.currentStage && <p className="text-red-500 text-sm mt-1">{validationErrors.currentStage}</p>}
                  </div>
                </motion.div>
              )}
              
              {step === 3 && (
                <motion.div key="step3" {...stepVariants} className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Financial Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="fundingNeeded"
                        placeholder="Funding Needed (Birr) *"
                        value={formData.fundingNeeded}
                        onChange={handleNumericChange}
                        className={`p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full ${validationErrors.fundingNeeded ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.fundingNeeded && <p className="text-red-500 text-sm mt-1">{validationErrors.fundingNeeded}</p>}
                      <p className="text-xs text-gray-500 mt-1">Minimum: 100,000 Birr</p>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="fundingRaised"
                        placeholder="Funding Raised So Far (Birr) *"
                        value={formData.fundingRaised}
                        onChange={handleNumericChange}
                        className={`p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full ${validationErrors.fundingRaised ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.fundingRaised && <p className="text-red-500 text-sm mt-1">{validationErrors.fundingRaised}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <select
                        name="investmentTimeline"
                        value={formData.investmentTimeline}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.investmentTimeline ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select Investment Timeline *</option>
                        <option value="1 month">1 Month</option>
                        <option value="2 months">2 Months</option>
                        <option value="6 months">6 Months</option>
                        <option value="9 months">9 Months</option>
                        <option value="1 year">1 Year</option>
                      </select>
                      {validationErrors.investmentTimeline && <p className="text-red-500 text-sm mt-1">{validationErrors.investmentTimeline}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Entrepreneur's Equity (%) *
                        </label>
                        <input
                          type="number"
                          name="entrepreneurEquity"
                          placeholder="Your Equity Percentage"
                          value={formData.entrepreneurEquity}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          step="0.01"
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.entrepreneurEquity ? 'border-red-500' : ''}`}
                        />
                        {validationErrors.entrepreneurEquity && <p className="text-red-500 text-sm mt-1">{validationErrors.entrepreneurEquity}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Investors' Equity (%)
                        </label>
                        <input
                          type="number"
                          name="investorEquity"
                          placeholder="Investors' Equity Percentage"
                          value={formData.investorEquity}
                          readOnly
                          className="w-full p-3 border rounded-lg bg-gray-100 outline-none"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <input
                        type="text"
                        name="valuation"
                        placeholder="Current Valuation (Birr) *"
                        value={formData.financials.valuation}
                        onChange={handleFinancialChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.valuation ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.valuation && <p className="text-red-500 text-sm mt-1">{validationErrors.valuation}</p>}
                    </div>
                    
                    <div>
                      <input
                        type="text"
                        name="revenue2023"
                        placeholder="Revenue 2023 (Birr) *"
                        value={formData.financials.revenue2023}
                        onChange={handleFinancialChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.revenue2023 ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.revenue2023 && <p className="text-red-500 text-sm mt-1">{validationErrors.revenue2023}</p>}
                    </div>
                    
                    <div>
                      <input
                        type="text"
                        name="projectedRevenue2024"
                        placeholder="Projected Revenue 2024 (Birr) *"
                        value={formData.financials.projectedRevenue2024}
                        onChange={handleFinancialChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.projectedRevenue2024 ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.projectedRevenue2024 && <p className="text-red-500 text-sm mt-1">{validationErrors.projectedRevenue2024}</p>}
                    </div>
                    
                    <div>
                      <input
                        type="text"
                        name="breakEvenPoint"
                        placeholder="Break-Even Point *"
                        value={formData.financials.breakEvenPoint}
                        onChange={handleFinancialChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.breakEvenPoint ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.breakEvenPoint && <p className="text-red-500 text-sm mt-1">{validationErrors.breakEvenPoint}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Use of Funds *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFundUse}
                        onChange={(e) => setNewFundUse(e.target.value)}
                        placeholder="Add Use of Funds"
                        className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.useOfFunds ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={handleAddFundUse}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    {validationErrors.useOfFunds && <p className="text-red-500 text-sm mt-1">{validationErrors.useOfFunds}</p>}
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.useOfFunds.map((use, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {use}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                useOfFunds: prev.useOfFunds.filter((_, i) => i !== index),
                              }))
                            }
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
                <motion.div key="step4" {...stepVariants} className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Team & Traction</h2>
                  
                  <div className="space-y-4">
                    {validationErrors.team && <p className="text-red-500 text-sm">{validationErrors.team}</p>}
                    
                    {formData.team.map((member, index) => (
                      <div key={index} className={`p-4 border rounded-lg space-y-4 ${validationErrors.team ? 'border-red-500' : ''}`}>
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Team Member #{index + 1}</h3>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  team: prev.team.filter((_, i) => i !== index),
                                }))
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Name *"
                          value={member.name}
                          onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Role *"
                          value={member.role}
                          onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Expertise *"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Traction/Achievements *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTraction}
                        onChange={(e) => setNewTraction(e.target.value)}
                        placeholder="Add Traction/Achievement"
                        className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.traction ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={handleAddTraction}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    {validationErrors.traction && <p className="text-red-500 text-sm mt-1">{validationErrors.traction}</p>}
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.traction.map((item, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                traction: prev.traction.filter((_, i) => i !== index),
                              }))
                            }
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
                <motion.div key="step5" {...stepVariants} className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
                  {Object.entries(formData.documents).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="block font-medium">
                        {key.split(/(?=[A-Z])/).join(' ')} *
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
                          className={`flex-1 p-4 border-2 border-dashed ${validationErrors[key] ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-blue-500 cursor-pointer`}
                        >
                          <div className="flex items-center gap-2 text-gray-600">
                            <Upload className="w-5 h-5" />
                            <span>
                              {value ? value.name : `Upload ${key.split(/(?=[A-Z])/).join(' ')}`}
                            </span>
                          </div>
                        </label>
                      </div>
                      {validationErrors[key] && <p className="text-red-500 text-sm">{validationErrors[key]}</p>}
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
                  type="button"
                  onClick={handleSubmit}
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



// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronRight, ChevronLeft, Upload, Plus, X } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { addBussinessIdea } from '../redux/BussinessIdeaSlice';
// import { fetchUserData } from '../redux/UserSlice';
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';

// // Define Yup validation schema: All fields are required
// const validationSchema = yup.object({
//   title: yup
//     .string()
//     .required('Business Idea Title is required')
//     .max(100, 'Title cannot exceed 100 characters')
//     .matches(/^[a-zA-Z0-9\s.,-]+$/, 'Title can only contain letters, numbers, spaces, commas, and hyphens'),
//   entrepreneurName: yup
//     .string()
//     .required('Your Full Name is required')
//     .max(50, 'Name cannot exceed 50 characters')
//     .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
//   entrepreneurImage: yup
//     .mixed()
//     .required('Entrepreneur image is required')
//     .test('fileSize', 'Image size must be less than 2MB', (value) => value && value.size <= 2 * 1024 * 1024)
//     .test('fileType', 'Image must be JPEG or PNG', (value) => value && ['image/jpeg', 'image/png'].includes(value.type)),
//   entrepreneurBackground: yup
//     .string()
//     .required('Professional Background is required')
//     .max(500, 'Background cannot exceed 500 characters'),
//   entrepreneurEducation: yup
//     .string()
//     .required('Education is required')
//     .max(200, 'Education cannot exceed 200 characters'),
//   entrepreneurLocation: yup
//     .string()
//     .required('Location is required')
//     .max(100, 'Location cannot exceed 100 characters'),
//   businessCategory: yup
//     .string()
//     .required('Business Category is required')
//     .oneOf(['Technology', 'Healthcare', 'Finance', 'Education', 'Retail'], 'Invalid business category'),
//   overview: yup
//     .string()
//     .required('Business Overview is required')
//     .max(1000, 'Overview cannot exceed 1000 characters'),
//   problemStatement: yup
//     .string()
//     .required('Problem Statement is required')
//     .max(1000, 'Problem Statement cannot exceed 1000 characters'),
//   solution: yup
//     .string()
//     .required('Solution is required')
//     .max(1000, 'Solution cannot exceed 1000 characters'),
//   marketSize: yup
//     .string()
//     .required('Market Size is required')
//     .max(200, 'Market Size cannot exceed 200 characters'),
//   currentStage: yup
//     .string()
//     .required('Current Stage is required')
//     .oneOf(['Idea', 'MVP', 'Early Revenue', 'Growth', 'Scale'], 'Invalid stage'),
//   fundingNeeded: yup
//     .string()
//     .required('Funding Needed is required')
//     .matches(/^\d+$/, 'Funding Needed must be a positive number')
//     .test('minFunding', 'Funding Needed must be at least 100,000 Birr', (value) => parseInt(value) >= 100000)
//     .max(20, 'Funding Needed cannot exceed 20 characters'),
//   fundingRaised: yup
//     .string()
//     .required('Funding Raised is required')
//     .matches(/^\d+$/, 'Funding Raised must be a positive number')
//     .max(20, 'Funding Raised cannot exceed 20 characters'),
//   useOfFunds: yup
//     .array()
//     .of(yup.string().required('Fund use is required').max(100, 'Each fund use cannot exceed 100 characters'))
//     .min(1, 'At least one use of funds is required'),
//   investmentTimeline: yup
//     .string()
//     .required('Investment Timeline is required')
//     .oneOf(['1 month', '2 months', '6 months', '9 months', '1 year'], 'Invalid timeline'),
//   entrepreneurEquity: yup
//     .number()
//     .required('Entrepreneur Equity is required')
//     .min(0, 'Equity must be at least 0%')
//     .max(100, 'Equity cannot exceed 100%')
//     .typeError('Equity must be a number'),
//   investorEquity: yup
//     .number()
//     .required('Investor Equity is required')
//     .test('equity-sum', 'Entrepreneur and Investor Equity must sum to 100%', function (value) {
//       const entrepreneurEquity = this.parent.entrepreneurEquity;
//       return Math.abs(100 - (entrepreneurEquity + value)) < 0.01;
//     }),
//   financials: yup.object({
//     valuation: yup
//       .string()
//       .required('Valuation is required')
//       .matches(/^\d+$/, 'Valuation must be a positive number')
//       .max(20, 'Valuation cannot exceed 20 characters'),
//     revenue2023: yup
//       .string()
//       .required('Revenue 2023 is required')
//       .matches(/^\d+$/, 'Revenue 2023 must be a positive number')
//       .max(20, 'Revenue 2023 cannot exceed 20 characters'),
//     projectedRevenue2024: yup
//       .string()
//       .required('Projected Revenue 2024 is required')
//       .matches(/^\d+$/, 'Projected Revenue 2024 must be a positive number')
//       .max(20, 'Projected Revenue 2024 cannot exceed 20 characters'),
//     breakEvenPoint: yup
//       .string()
//       .required('Break-Even Point is required')
//       .max(100, 'Break-Even Point cannot exceed 100 characters'),
//   }),
//   traction: yup
//     .array()
//     .of(yup.string().required('Traction item is required').max(200, 'Each traction item cannot exceed 200 characters'))
//     .min(1, 'At least one traction item is required'),
//   team: yup
//     .array()
//     .of(
//       yup.object({
//         name: yup.string().required('Team member name is required').max(50, 'Name cannot exceed 50 characters'),
//         role: yup.string().required('Role is required').max(50, 'Role cannot exceed 50 characters'),
//         expertise: yup.string().required('Expertise is required').max(200, 'Expertise cannot exceed 200 characters'),
//       })
//     )
//     .min(1, 'At least one team member is required'),
//   documents: yup.object({
//     businessRegistration: yup
//       .mixed()
//       .required('Business Registration document is required')
//       .test('fileSize', 'File size must be less than 5MB', (value) => value && value.size <= 5 * 1024 * 1024)
//       .test('fileType', 'File must be a PDF', (value) => value && value.type === 'application/pdf'),
//     financialProjections: yup
//       .mixed()
//       .required('Financial Projections document is required')
//       .test('fileSize', 'File size must be less than 5MB', (value) => value && value.size <= 5 * 1024 * 1024)
//       .test('fileType', 'File must be a PDF', (value) => value && value.type === 'application/pdf'),
//     patentDocumentation: yup
//       .mixed()
//       .required('Patent Documentation is required')
//       .test('fileSize', 'File size must be less than 5MB', (value) => value && value.size <= 5 * 1024 * 1024)
//       .test('fileType', 'File must be a PDF', (value) => value && value.type === 'application/pdf'),
//     pitchDeck: yup
//       .mixed()
//       .required('Pitch Deck is required')
//       .test('fileSize', 'File size must be less than 5MB', (value) => value && value.size <= 5 * 1024 * 1024)
//       .test('fileType', 'File must be a PDF', (value) => value && value.type === 'application/pdf'),
//     teamCertifications: yup
//       .mixed()
//       .required('Team Certifications document is required')
//       .test('fileSize', 'File size must be less than 5MB', (value) => value && value.size <= 5 * 1024 * 1024)
//       .test('fileType', 'File must be a PDF', (value) => value && value.type === 'application/pdf'),
//     marketResearchReport: yup
//       .mixed()
//       .required('Market Research Report is required')
//       .test('fileSize', 'File size must be less than 5MB', (value) => value && value.size <= 5 * 1024 * 1024)
//       .test('fileType', 'File must be a PDF', (value) => value && value.type === 'application/pdf'),
//   }),
// });

// // Define fields for each step (all fields are mandatory)
// const stepFields = {
//   1: [
//     'title',
//     'entrepreneurName',
//     'entrepreneurImage',
//     'entrepreneurBackground',
//     'entrepreneurEducation',
//     'entrepreneurLocation',
//     'businessCategory',
//   ],
//   2: ['overview', 'problemStatement', 'solution', 'marketSize', 'currentStage'],
//   3: [
//     'fundingNeeded',
//     'fundingRaised',
//     'useOfFunds',
//     'investmentTimeline',
//     'entrepreneurEquity',
//     'investorEquity',
//     'financials.valuation',
//     'financials.revenue2023',
//     'financials.projectedRevenue2024',
//     'financials.breakEvenPoint',
//   ],
//   4: ['team', 'traction'],
//   5: [
//     'documents.businessRegistration',
//     'documents.financialProjections',
//     'documents.patentDocumentation',
//     'documents.pitchDeck',
//     'documents.teamCertifications',
//     'documents.marketResearchReport',
//   ],
// };

// const SubmitIdeaForm = () => {
//   const [step, setStep] = useState(1);
//   const [submissionMessage, setSubmissionMessage] = useState('');
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//     setValue,
//     watch,
//     trigger,
//   } = useForm({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       title: '',
//       entrepreneurName: '',
//       entrepreneurImage: null,
//       entrepreneurBackground: '',
//       entrepreneurEducation: '',
//       entrepreneurLocation: '',
//       businessCategory: '',
//       overview: '',
//       problemStatement: '',
//       solution: '',
//       marketSize: '',
//       currentStage: '',
//       fundingNeeded: '',
//       fundingRaised: '',
//       useOfFunds: [],
//       investmentTimeline: '',
//       entrepreneurEquity: null,
//       investorEquity: null,
//       financials: {
//         valuation: '',
//         revenue2023: '',
//         projectedRevenue2024: '',
//         breakEvenPoint: '',
//       },
//       traction: [],
//       team: [{ name: '', role: '', expertise: '' }],
//       documents: {
//         businessRegistration: null,
//         financialProjections: null,
//         patentDocumentation: null,
//         pitchDeck: null,
//         teamCertifications: null,
//         marketResearchReport: null,
//       },
//     },
//   });

//   const [newFundUse, setNewFundUse] = useState('');
//   const [newTraction, setNewTraction] = useState('');

//   const entrepreneurEquity = watch('entrepreneurEquity');

//   useEffect(() => {
//     dispatch(fetchUserData());
//   }, [dispatch]);

//   useEffect(() => {
//     if (entrepreneurEquity != null) {
//       setValue('investorEquity', entrepreneurEquity ? (100 - entrepreneurEquity).toFixed(2) : 0);
//     }
//   }, [entrepreneurEquity, setValue]);

//   const handleNext = async () => {
//     // Validate all fields for the current step
//     const isValid = await trigger(stepFields[step], { shouldFocus: true });
//     if (isValid && step < 5) {
//       setStep(step + 1);
//     }
//   };

//   const handleBack = () => {
//     if (step > 1) {
//       setStep(step - 1);
//     }
//   };

//   const handleAddTeamMember = () => {
//     setValue('team', [...watch('team'), { name: '', role: '', expertise: '' }]);
//   };

//   const handleAddFundUse = async () => {
//     if (newFundUse.trim()) {
//       const newFunds = [...watch('useOfFunds'), newFundUse.trim()];
//       setValue('useOfFunds', newFunds);
//       setNewFundUse('');
//       await trigger('useOfFunds');
//     }
//   };

//   const handleAddTraction = async () => {
//     if (newTraction.trim()) {
//       const newTractionList = [...watch('traction'), newTraction.trim()];
//       setValue('traction', newTractionList);
//       setNewTraction('');
//       await trigger('traction');
//     }
//   };

//   const handlePhotoUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setValue('entrepreneurImage', file);
//       await trigger('entrepreneurImage');
//     }
//   };

//   const handleFileChange = async (e, docType) => {
//     const file = e.target.files[0];
//     if (file) {
//       setValue(`documents.${docType}`, file);
//       await trigger(`documents.${docType}`);
//     }
//   };

//   const onSubmit = async (data) => {
//     if (step !== 5) {
//       return;
//     }
//     try {
//       // Convert entrepreneurImage to base64
//       if (data.entrepreneurImage) {
//         data.entrepreneurImage = await convertFileToBase64(data.entrepreneurImage);
//       }
//       // Convert document files to base64
//       const documents = {};
//       for (const [key, file] of Object.entries(data.documents)) {
//         documents[key] = file ? await convertFileToBase64(file) : null;
//       }
//       data.documents = documents;

//       await dispatch(addBussinessIdea(data)).unwrap();
//       setSubmissionMessage('Sent to admin for approval.');
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       setSubmissionMessage('Error submitting form. Please try again.');
//     }
//   };

//   const convertFileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   const stepVariants = {
//     initial: { opacity: 0, x: 50 },
//     animate: { opacity: 1, x: 0 },
//     exit: { opacity: 0, x: -50 },
//   };

//   return (
//     <div>
//       <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 flex items-center shadow-md">
//         <button
//           onClick={() => navigate('/FundingTypeSelector')}
//           className="flex items-center space-x-2 text-white text-lg font-medium"
//         >
//           <ChevronLeft size={24} />
//           <span>Back to Dashboard</span>
//         </button>
//       </nav>
//       <div className="min-h-screen bg-gray-50 p-8 mt-16">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8"
//         >
//           <h1 className="text-3xl font-bold text-center mb-8 text-blue-600 pt-7">
//             Submit Your Business Idea
//           </h1>

//           {submissionMessage && (
//             <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg text-center">
//               {submissionMessage}
//             </div>
//           )}

//           <div className="mb-8">
//             <div className="h-2 bg-gray-200 rounded-full">
//               <motion.div
//                 className="h-full bg-blue-600 rounded-full"
//                 initial={{ width: '0%' }}
//                 animate={{ width: `${(step / 5) * 100}%` }}
//                 transition={{ duration: 0.3 }}
//               />
//             </div>
//             <div className="flex justify-between mt-2 text-sm text-gray-600">
//               <span>Basic Info</span>
//               <span>Business Details</span>
//               <span>Financials</span>
//               <span>Team & Traction</span>
//               <span>Documents</span>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)}>
//             <AnimatePresence mode="wait">
//               {step === 1 && (
//                 <motion.div key="step1" {...stepVariants} className="space-y-4">
//                   <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
//                   <div>
//                     <input
//                       {...register('title')}
//                       placeholder="Business Idea Title"
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     />
//                     {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
//                   </div>
//                   <div>
//                     <input
//                       {...register('entrepreneurName')}
//                       placeholder="Your Full Name"
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     />
//                     {errors.entrepreneurName && (
//                       <p className="text-red-500 text-sm">{errors.entrepreneurName.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Upload Entrepreneur's Picture
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/jpeg,image/png"
//                       {...register('entrepreneurImage')}
//                       onChange={handlePhotoUpload}
//                       className="hidden"
//                       id="entrepreneurImageInput"
//                     />
//                     <label
//                       htmlFor="entrepreneurImageInput"
//                       className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg inline-block"
//                     >
//                       Choose File
//                     </label>
//                     {watch('entrepreneurImage') && (
//                       <span className="text-gray-600 ml-4">{watch('entrepreneurImage').name}</span>
//                     )}
//                     {errors.entrepreneurImage && (
//                       <p className="text-red-500 text-sm">{errors.entrepreneurImage.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <textarea
//                       {...register('entrepreneurBackground')}
//                       placeholder="Your Professional Background"
//                       rows={4}
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
//                     />
//                     {errors.entrepreneurBackground && (
//                       <p className="text-red-500 text-sm">{errors.entrepreneurBackground.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <input
//                       {...register('entrepreneurEducation')}
//                       placeholder="Your Education"
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     />
//                     {errors.entrepreneurEducation && (
//                       <p className="text-red-500 text-sm">{errors.entrepreneurEducation.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <input
//                       {...register('entrepreneurLocation')}
//                       placeholder="Location"
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     />
//                     {errors.entrepreneurLocation && (
//                       <p className="text-red-500 text-sm">{errors.entrepreneurLocation.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <select
//                       {...register('businessCategory')}
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     >
//                       <option value="" disabled>Select Business Category</option>
//                       <option value="Technology">Technology</option>
//                       <option value="Healthcare">Healthcare</option>
//                       <option value="Finance">Finance</option>
//                       <option value="Education">Education</option>
//                       <option value="Retail">Retail</option>
//                     </select>
//                     {errors.businessCategory && (
//                       <p className="text-red-500 text-sm">{errors.businessCategory.message}</p>
//                     )}
//                   </div>
//                 </motion.div>
//               )}
//               {step === 2 && (
//                 <motion.div key="step2" {...stepVariants} className="space-y-4">
//                   <h2 className="text-xl font-semibold mb-4">Business Details</h2>
//                   <div>
//                     <textarea
//                       {...register('overview')}
//                       placeholder="Business Overview"
//                       rows={4}
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
//                     />
//                     {errors.overview && <p className="text-red-500 text-sm">{errors.overview.message}</p>}
//                   </div>
//                   <div>
//                     <textarea
//                       {...register('problemStatement')}
//                       placeholder="Problem Statement"
//                       rows={4}
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
//                     />
//                     {errors.problemStatement && (
//                       <p className="text-red-500 text-sm">{errors.problemStatement.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <textarea
//                       {...register('solution')}
//                       placeholder="Your Solution"
//                       rows={4}
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
//                     />
//                     {errors.solution && <p className="text-red-500 text-sm">{errors.solution.message}</p>}
//                   </div>
//                   <div>
//                     <input
//                       {...register('marketSize')}
//                       placeholder="Market Size"
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     />
//                     {errors.marketSize && <p className="text-red-500 text-sm">{errors.marketSize.message}</p>}
//                   </div>
//                   <div>
//                     <select
//                       {...register('currentStage')}
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     >
//                       <option value="" disabled>Select Current Stage</option>
//                       <option value="Idea">Idea Stage</option>
//                       <option value="MVP">MVP</option>
//                       <option value="Early Revenue">Early Revenue</option>
//                       <option value="Growth">Growth</option>
//                       <option value="Scale">Scale</option>
//                     </select>
//                     {errors.currentStage && (
//                       <p className="text-red-500 text-sm">{errors.currentStage.message}</p>
//                     )}
//                   </div>
//                 </motion.div>
//               )}
//               {step === 3 && (
//                 <motion.div key="step3" {...stepVariants} className="space-y-4">
//                   <h2 className="text-xl font-semibold mb-4">Financial Information</h2>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <input
//                         {...register('fundingNeeded')}
//                         placeholder="Funding Needed (Birr)"
//                         type="number"
//                         min="100000"
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                       />
//                       {errors.fundingNeeded && (
//                         <p className="text-red-500 text-sm">{errors.fundingNeeded.message}</p>
//                       )}
//                     </div>
//                     <div>
//                       <input
//                         {...register('fundingRaised')}
//                         placeholder="Funding Raised So Far (Birr)"
//                         type="number"
//                         min="0"
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                       />
//                       {errors.fundingRaised && (
//                         <p className="text-red-500 text-sm">{errors.fundingRaised.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <select
//                       {...register('investmentTimeline')}
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     >
//                       <option value="" disabled>Select Investment Timeline</option>
//                       <option value="1 month">1 Month</option>
//                       <option value="2 months">2 Months</option>
//                       <option value="6 months">6 Months</option>
//                       <option value="9 months">9 Months</option>
//                       <option value="1 year">1 Year</option>
//                     </select>
//                     {errors.investmentTimeline && (
//                       <p className="text-red-500 text-sm">{errors.investmentTimeline.message}</p>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Entrepreneur's Equity (%)
//                       </label>
//                       <input
//                         type="number"
//                         {...register('entrepreneurEquity')}
//                         placeholder="Your Equity Percentage"
//                         min="0"
//                         max="100"
//                         step="0.01"
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                       />
//                       {errors.entrepreneurEquity && (
//                         <p className="text-red-500 text-sm">{errors.entrepreneurEquity.message}</p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Investors' Equity (%)
//                       </label>
//                       <input
//                         type="number"
//                         {...register('investorEquity')}
//                         placeholder="Investors' Equity Percentage"
//                         readOnly
//                         className="w-full p-3 border rounded-lg bg-gray-100 outline-none"
//                       />
//                       {errors.investorEquity && (
//                         <p className="text-red-500 text-sm">{errors.investorEquity.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <input
//                       {...register('financials.valuation')}
//                       placeholder="Current Valuation (Birr)"
//                       type="number"
//                       min="1"
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     />
//                     {errors.financials?.valuation && (
//                       <p className="text-red-500 text-sm">{errors.financials.valuation.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <input
//                       {...register('financials.revenue2023')}
//                       placeholder="Revenue 2023 (Birr)"
//                       type="number"
//                       min="0"
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     />
//                     {errors.financials?.revenue2023 && (
//                       <p className="text-red-500 text-sm">{errors.financials.revenue2023.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <input
//                       {...register('financials.projectedRevenue2024')}
//                       placeholder="Projected Revenue 2024 (Birr)"
//                       type="number"
//                       min="0"
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     />
//                     {errors.financials?.projectedRevenue2024 && (
//                       <p className="text-red-500 text-sm">{errors.financials.projectedRevenue2024.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <input
//                       {...register('financials.breakEvenPoint')}
//                       placeholder="Break-Even Point"
//                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     />
//                     {errors.financials?.breakEvenPoint && (
//                       <p className="text-red-500 text-sm">{errors.financials.breakEvenPoint.message}</p>
//                     )}
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         value={newFundUse}
//                         onChange={(e) => setNewFundUse(e.target.value)}
//                         placeholder="Add Use of Funds"
//                         className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                       />
//                       <button
//                         type="button"
//                         onClick={handleAddFundUse}
//                         className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                       >
//                         <Plus className="w-5 h-5" />
//                       </button>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       {watch('useOfFunds').map((use, index) => (
//                         <span
//                           key={index}
//                           className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
//                         >
//                           {use}
//                           <button
//                             type="button"
//                             onClick={() =>
//                               setValue('useOfFunds', watch('useOfFunds').filter((_, i) => i !== index))
//                             }
//                             className="hover:text-blue-800"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                     {errors.useOfFunds && (
//                       <p className="text-red-500 text-sm">{errors.useOfFunds.message}</p>
//                     )}
//                   </div>
//                 </motion.div>
//               )}
//               {step === 4 && (
//                 <motion.div key="step4" {...stepVariants} className="space-y-6">
//                   <h2 className="text-xl font-semibold mb-4">Team & Traction</h2>
//                   <div className="space-y-4">
//                     {watch('team').map((member, index) => (
//                       <div key={index} className="p-4 border rounded-lg space-y-4">
//                         <div className="flex justify-between items-center">
//                           <h3 className="font-medium">Team Member #{index + 1}</h3>
//                           {index > 0 && (
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 setValue('team', watch('team').filter((_, i) => i !== index))
//                               }
//                               className="text-red-500 hover:text-red-700"
//                             >
//                               <X className="w-5 h-5" />
//                             </button>
//                           )}
//                         </div>
//                         <div>
//                           <input
//                             {...register(`team.${index}.name`)}
//                             placeholder="Name"
//                             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                           />
//                           {errors.team?.[index]?.name && (
//                             <p className="text-red-500 text-sm">{errors.team[index].name.message}</p>
//                           )}
//                         </div>
//                         <div>
//                           <input
//                             {...register(`team.${index}.role`)}
//                             placeholder="Role"
//                             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                           />
//                           {errors.team?.[index]?.role && (
//                             <p className="text-red-500 text-sm">{errors.team[index].role.message}</p>
//                           )}
//                         </div>
//                         <div>
//                           <input
//                             {...register(`team.${index}.expertise`)}
//                             placeholder="Expertise"
//                             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                           />
//                           {errors.team?.[index]?.expertise && (
//                             <p className="text-red-500 text-sm">{errors.team[index].expertise.message}</p>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                     <button
//                       type="button"
//                       onClick={handleAddTeamMember}
//                       className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2"
//                     >
//                       <Plus className="w-5 h-5" />
//                       Add Team Member
//                     </button>
//                     {errors.team && <p className="text-red-500 text-sm">{errors.team.message}</p>}
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         value={newTraction}
//                         onChange={(e) => setNewTraction(e.target.value)}
//                         placeholder="Add Traction/Achievement"
//                         className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                       />
//                       <button
//                         type="button"
//                         onClick={handleAddTraction}
//                         className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                       >
//                         <Plus className="w-5 h-5" />
//                       </button>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       {watch('traction').map((item, index) => (
//                         <span
//                           key={index}
//                           className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
//                         >
//                           {item}
//                           <button
//                             type="button"
//                             onClick={() =>
//                               setValue('traction', watch('traction').filter((_, i) => i !== index))
//                             }
//                             className="hover:text-blue-800"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                     {errors.traction && (
//                       <p className="text-red-500 text-sm">{errors.traction.message}</p>
//                     )}
//                   </div>
//                 </motion.div>
//               )}
//               {step === 5 && (
//                 <motion.div key="step5" {...stepVariants} className="space-y-6">
//                   <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
//                   {Object.keys(watch('documents')).map((key) => (
//                     <div key={key} className="space-y-2">
//                       <label className="block font-medium">
//                         {key.split(/(?=[A-Z])/).join(' ')}
//                       </label>
//                       <div className="flex items-center gap-4">
//                         <input
//                           type="file"
//                           accept="application/pdf"
//                           {...register(`documents.${key}`)}
//                           onChange={(e) => handleFileChange(e, key)}
//                           className="hidden"
//                           id={`file-${key}`}
//                         />
//                         <label
//                           htmlFor={`file-${key}`}
//                           className="flex-1 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer"
//                         >
//                           <div className="flex items-center gap-2 text-gray-600">
//                             <Upload className="w-5 h-5" />
//                             <span>
//                               {watch(`documents.${key}`)
//                                 ? watch(`documents.${key}`).name
//                                 : `Upload ${key.split(/(?=[A-Z])/).join(' ')}`}
//                             </span>
//                           </div>
//                         </label>
//                       </div>
//                       {errors.documents?.[key] && (
//                         <p className="text-red-500 text-sm">{errors.documents[key].message}</p>
//                       )}
//                     </div>
//                   ))}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//             <div className="flex justify-between mt-8">
//               {step > 1 && (
//                 <button
//                   type="button"
//                   onClick={handleBack}
//                   className="flex items-center gap-2 px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                   Back
//                 </button>
//               )}
//               {step < 5 ? (
//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto"
//                 >
//                   Next
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               ) : (
//                 <button
//                   type="submit"
//                   className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-auto"
//                 >
//                   Submit Idea
//                 </button>
//               )}
//             </div>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default SubmitIdeaForm;