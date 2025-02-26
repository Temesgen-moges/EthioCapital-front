import React, { useState, useEffect } from 'react';
import { ChevronLeft, AlertCircle, CheckCircle, X, Loader, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReleaseFunds = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    purpose: '',
    bank: '',
    accountName: '',
    accountNumber: '',
    amount: '',
    supportingDocs: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notification, setNotification] = useState(null);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.purpose) newErrors.purpose = 'Purpose is required';
    if (!formData.bank) newErrors.bank = 'Bank name is required';
    if (!formData.accountName) newErrors.accountName = 'Account name is required';
    
    // Account number validation (XXXX-XXXX-XXXX-XXXX format)
    if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Invalid account number format';
    }
    
    // Amount validation (numeric value)
    const amountValue = parseFloat(formData.amount.replace(/,/g, ''));
    if (isNaN(amountValue) || amountValue <= 0) {
      newErrors.amount = 'Invalid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes with formatting
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'amount') {
      // Remove all non-digit characters except decimal point
      let cleaned = value.replace(/[^0-9.]/g, '');
      
      // Split into integer and decimal parts
      let [integerPart, decimalPart] = cleaned.split('.');
      
      // Format integer part with commas
      if (integerPart) {
        integerPart = integerPart.replace(/\D/g, '');
        integerPart = integerPart.replace(/^0+/, '') || '0';
        integerPart = parseInt(integerPart, 10).toLocaleString();
      }
      
      // Limit decimal part to 2 digits
      if (decimalPart) {
        decimalPart = decimalPart.slice(0, 2);
      }
      
      // Combine parts
      const formattedValue = decimalPart 
        ? `${integerPart}.${decimalPart}`
        : integerPart;

      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }

    if (name === 'accountNumber') {
      // Auto-format account number as XXXX-XXXX-XXXX-XXXX
      const cleaned = value.replace(/\D/g, '').slice(0, 16);
      const formatted = cleaned.match(/.{1,4}/g)?.join('-') || cleaned;
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          supportingDocs: 'File size exceeds 5MB limit'
        }));
        return;
      }
      setFormData(prev => ({ ...prev, supportingDocs: file }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmation(true);
  };

  // Confirm and submit
  const confirmSubmission = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setNotification({
        type: 'success',
        message: 'Funds released successfully! Redirecting...'
      });
      
      setTimeout(() => navigate('/BoardDashboard'), 3000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Transfer failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/BoardDashboard')}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ChevronLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow p-6 relative">
          {isSubmitting && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <Loader className="animate-spin text-blue-600" size={32} />
            </div>
          )}

          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <AlertCircle className="text-red-600" size={24} />
            Fund Release Request
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Purpose Field */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Purpose of Transfer
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${
                    errors.purpose ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Project funding release"
                />
                {errors.purpose && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.purpose}
                  </p>
                )}
              </div>

              {/* Bank Details Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bank"
                    value={formData.bank}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${
                      errors.bank ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Commercial Bank of Ethiopia"
                  />
                  {errors.bank && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.bank}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${
                      errors.accountName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Smith"
                  />
                  {errors.accountName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.accountName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${
                      errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1234-5678-9012-3456"
                    maxLength={19}
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.accountNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Amount Field */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Transfer Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className={`w-full pl-8 p-2 border rounded ${
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1,000,000.00"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.amount}
                    </p>
                  )}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Supporting Documents
                </label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="text-blue-600" size={24} />
                    <span className="text-blue-600 hover:text-blue-700">
                      {formData.supportingDocs 
                        ? formData.supportingDocs.name 
                        : 'Click to upload documents'}
                    </span>
                  </label>
                </div>
                {errors.supportingDocs && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.supportingDocs}
                  </p>
                )}
              </div>
            </div>

            {/* Critical Warning */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="text-yellow-600" size={18} />
                Critical Verification Required
              </h3>
              <ul className="list-disc pl-5 text-sm text-yellow-800 space-y-1">
                <li>Verify account number matches bank records</li>
                <li>Confirm amount matches approved budget</li>
                <li>Ensure supporting documents are attached</li>
              </ul>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/BoardDashboard')}
                className="px-4 py-2 border rounded hover:bg-gray-50 flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded flex-1 ${
                  isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Confirm Transfer</h3>
              <button onClick={() => setShowConfirmation(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-medium mb-2">Transfer Details:</p>
                <div className="space-y-1">
                  <p>Amount: ${formData.amount}</p>
                  <p>Bank: {formData.bank}</p>
                  <p>Account: {formData.accountNumber}</p>
                  <p>Account Name: {formData.accountName}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmission}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Confirm Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          {notification.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ReleaseFunds;