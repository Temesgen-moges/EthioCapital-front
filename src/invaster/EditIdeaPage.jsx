import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import setupAxios from '../middleware/MiddleWare';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../redux/UserSlice';

const EditIdeaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.userData);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    businessCategory: '',
    fundingNeeded: '',
    currentStage: '',
    entrepreneurLocation: '',
    problemStatement: '',
    solution: '',
    marketSize: '',
    traction: [],
    useOfFunds: [],
    team: [],
    financials: {
      revenue2023: '',
      projectedRevenue2024: '',
      valuation: '',
      breakEvenPoint: ''
    }
  });

  useEffect(() => {
    setupAxios();
    dispatch(fetchUserData());
    fetchIdeaData();
  }, [dispatch]);

  const fetchIdeaData = async () => {
    try {
      const response = await axios.get(`/ideas/${id}`);
      setFormData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching idea:', error);
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/update-idea/${id}`, formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating idea:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Business Idea</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Overview</label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="businessCategory"
                value={formData.businessCategory}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Food Processing">Food Processing</option>
                <option value="Tourism">Tourism</option>
              </select>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Financial Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Funding Needed ($)</label>
              <input
                type="number"
                name="fundingNeeded"
                value={formData.fundingNeeded}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">2023 Revenue</label>
                <input
                  type="text"
                  name="financials.revenue2023"
                  value={formData.financials.revenue2023}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">2024 Projected Revenue</label>
                <input
                  type="text"
                  name="financials.projectedRevenue2024"
                  value={formData.financials.projectedRevenue2024}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Array Fields */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Traction Points</h2>
            {formData.traction.map((point, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={point}
                  onChange={(e) => handleArrayChange('traction', index, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('traction', index)}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('traction')}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
            >
              Add Traction Point
            </button>
          </div>

          {/* Submit Section */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Idea
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditIdeaPage;