import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchBusinessIdeaById, setSelectedBusinessIdea } from "../redux/BussinessIdeaSlice";
import setupAxios from "../middleware/MiddleWare";

const EditIdea = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedBusinessIdea = useSelector((state) => state.businessIdea.selectedBusinessIdea);
  const token = localStorage.getItem("authToken");
  const API_URL = "https://ethiocapital-back.onrender.com/api/v1";

  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    fundingNeeded: "",
    investorEquity: "",
    businessCategory: "",
    currentStage: "",
    entrepreneurEducation: "",
    entrepreneurBackground: "",
    problemStatement: "",
    solution: "",
    marketSize: "",
    useOfFunds: [],
    documents: {
      businessRegistration: null,
      financialProjections: null,
      marketResearchReport: null,
      patentDocumentation: null,
      pitchDeck: null,
      teamCertifications: null,
    },
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    setupAxios();
  }, []);

  useEffect(() => {
    if (hasFetched.current) {
      console.log("EditIdea: Skipping useEffect, data already fetched");
      return;
    }

    console.log("EditIdea: Fetching idea, id:", id);
    console.log("EditIdea: Token:", token);

    const fetchIdeaData = async () => {
      try {
        setLoading(true);
        console.log("EditIdea: Dispatching fetchBusinessIdeaById with id:", id);
        const result = await dispatch(fetchBusinessIdeaById(id)).unwrap();
        console.log("EditIdea: Fetched idea:", result);

        if (result && result._id === id) {
          setFormData({
            title: result.title || "",
            overview: result.overview || "",
            fundingNeeded: result.fundingNeeded || "",
            investorEquity: result.investorEquity || "",
            businessCategory: result.businessCategory || "",
            currentStage: result.currentStage || "",
            entrepreneurEducation: result.entrepreneurEducation || "",
            entrepreneurBackground: result.entrepreneurBackground || "",
            problemStatement: result.problemStatement || "",
            solution: result.solution || "",
            marketSize: result.marketSize || "",
            useOfFunds: result.useOfFunds || [],
            documents: {
              businessRegistration: result.documents?.businessRegistration || null,
              financialProjections: result.documents?.financialProjections || null,
              marketResearchReport: result.documents?.marketResearchReport || null,
              patentDocumentation: result.documents?.patentDocumentation || null,
              pitchDeck: result.documents?.pitchDeck || null,
              teamCertifications: result.documents?.teamCertifications || null,
            },
          });
          hasFetched.current = true;
          console.log("EditIdea: Form data initialized:", formData);
        } else {
          setError("Idea not found or you are not authorized to edit this idea.");
        }
      } catch (err) {
        console.error("EditIdea: Error fetching idea:", err);
        console.log("EditIdea: Error status:", err.status);
        console.log("EditIdea: Error response:", err.response?.data);
        if (err.status === 401 || err.isUnauthorized) {
          setError("Please log in to edit this idea.");
          localStorage.removeItem("authToken");
          navigate("/login");
        } else if (err.status === 403) {
          setError("You are not authorized to edit this idea.");
        } else {
          setError(err.response?.data?.message || "Failed to load idea details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchIdeaData();
  }, [dispatch, id, navigate]);

  useEffect(() => {
    console.log("EditIdea: formData updated:", formData);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("EditIdea: Input changed:", { name, value });
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      console.log("EditIdea: File changed:", { name, file: files[0].name });
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [name]: files[0],
        },
      }));
    }
  };

  const handleUseOfFundsChange = (index, value) => {
    console.log("EditIdea: UseOfFunds changed:", { index, value });
    setFormData((prev) => {
      const newUseOfFunds = [...prev.useOfFunds];
      newUseOfFunds[index] = value;
      return { ...prev, useOfFunds: newUseOfFunds };
    });
  };

  const addUseOfFunds = () => {
    console.log("EditIdea: Adding new UseOfFunds");
    setFormData((prev) => ({
      ...prev,
      useOfFunds: [...prev.useOfFunds, ""],
    }));
  };

  const removeUseOfFunds = (index) => {
    console.log("EditIdea: Removing UseOfFunds at index:", index);
    setFormData((prev) => ({
      ...prev,
      useOfFunds: prev.useOfFunds.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    console.log("EditIdea: Submitting form with data:", formData);

    if (!formData.title || !formData.overview || !formData.fundingNeeded) {
      setError("Title, overview, and funding needed are required.");
      setSubmitting(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("overview", formData.overview);
      submitData.append("fundingNeeded", String(formData.fundingNeeded));
      submitData.append("investorEquity", String(formData.investorEquity));
      submitData.append("businessCategory", formData.businessCategory);
      submitData.append("currentStage", formData.currentStage);
      submitData.append("entrepreneurEducation", formData.entrepreneurEducation);
      submitData.append("entrepreneurBackground", formData.entrepreneurBackground);
      submitData.append("problemStatement", formData.problemStatement);
      submitData.append("solution", formData.solution);
      submitData.append("marketSize", formData.marketSize);
      submitData.append("useOfFunds", JSON.stringify(formData.useOfFunds));

      const documentFields = [
        "businessRegistration",
        "financialProjections",
        "marketResearchReport",
        "patentDocumentation",
        "pitchDeck",
        "teamCertifications",
      ];
      documentFields.forEach((field) => {
        if (formData.documents[field] instanceof File) {
          submitData.append(`documents[${field}]`, formData.documents[field]);
        } else if (formData.documents[field]) {
          submitData.append(`documents[${field}]`, formData.documents[field]);
        }
      });

      // Log FormData entries for debugging
      for (let [key, value] of submitData.entries()) {
        console.log(`EditIdea: FormData entry: ${key}=${value instanceof File ? value.name : value}`);
      }

      const response = await axios.put(`${API_URL}/business-ideas/${id}`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setSelectedBusinessIdea(response.data.idea));
      setSuccess("Idea updated successfully!");
      setTimeout(() => navigate(`/Startup-Detail/${id}`), 2000);
    } catch (err) {
      console.error("EditIdea: Error updating idea:", err);
      console.log("EditIdea: Error response:", err.response?.data);
      console.log("EditIdea: Error status:", err.response?.status);
      console.log("EditIdea: Error headers:", err.response?.headers);
      let errorMessage = err.response?.data?.message || "Failed to update idea. Please try again.";
      if (err.response?.data?.errors) {
        errorMessage = err.response.data.errors.map((e) => `${e.field}: ${e.message}`).join(", ");
      }
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    console.log("EditIdea: Cancel clicked, navigating to /Startup-Detail/", id);
    navigate(`/Startup-Detail/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <button
        onClick={handleCancel}
        className="fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Go back"
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Your Startup Idea</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="overview" className="block text-sm font-medium text-gray-700 mb-1">
                Overview *
              </label>
              <textarea
                id="overview"
                name="overview"
                value={formData.overview}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="5"
                required
              />
            </div>
            <div>
              <label htmlFor="fundingNeeded" className="block text-sm font-medium text-gray-700 mb-1">
                Funding Needed (ETB) *
              </label>
              <input
                id="fundingNeeded"
                name="fundingNeeded"
                type="number"
                value={formData.fundingNeeded}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="investorEquity" className="block text-sm font-medium text-gray-700 mb-1">
                Investor Equity (%)
              </label>
              <input
                id="investorEquity"
                name="investorEquity"
                type="number"
                step="0.01"
                value={formData.investorEquity}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="businessCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Business Category
              </label>
              <select
                id="businessCategory"
                name="businessCategory"
                value={formData.businessCategory}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="currentStage" className="block text-sm font-medium text-gray-700 mb-1">
                Current Stage
              </label>
              <select
                id="currentStage"
                name="currentStage"
                value={formData.currentStage}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Stage</option>
                <option value="Idea">Idea</option>
                <option value="Prototype">Prototype</option>
                <option value="MVP">MVP</option>
                <option value="Growth">Growth</option>
                <option value="Scale">Scale</option>
              </select>
            </div>
            <div>
              <label htmlFor="entrepreneurEducation" className="block text-sm font-medium text-gray-700 mb-1">
                Entrepreneur Education
              </label>
              <textarea
                id="entrepreneurEducation"
                name="entrepreneurEducation"
                value={formData.entrepreneurEducation}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>
            <div>
              <label htmlFor="entrepreneurBackground" className="block text-sm font-medium text-gray-700 mb-1">
                Entrepreneur Background
              </label>
              <textarea
                id="entrepreneurBackground"
                name="entrepreneurBackground"
                value={formData.entrepreneurBackground}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>
            <div>
              <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-700 mb-1">
                Problem Statement
              </label>
              <textarea
                id="problemStatement"
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              />
            </div>
            <div>
              <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-1">
                Solution
              </label>
              <textarea
                id="solution"
                name="solution"
                value={formData.solution}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              />
            </div>
            <div>
              <label htmlFor="marketSize" className="block text-sm font-medium text-gray-700 mb-1">
                Market Size
              </label>
              <textarea
                id="marketSize"
                name="marketSize"
                value={formData.marketSize}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Use of Funds
              </label>
              {formData.useOfFunds.map((item, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUseOfFundsChange(index, e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Use of funds #${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeUseOfFunds(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addUseOfFunds}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
              >
                Add Use of Funds
              </button>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "businessRegistration", label: "Business Registration" },
                  { name: "financialProjections", label: "Financial Projections" },
                  { name: "marketResearchReport", label: "Market Research Report" },
                  { name: "patentDocumentation", label: "Patent Documentation" },
                  { name: "pitchDeck", label: "Pitch Deck" },
                  { name: "teamCertifications", label: "Team Certifications" },
                ].map((doc) => (
                  <div key={doc.name}>
                    <label
                      htmlFor={doc.name}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {doc.label}
                    </label>
                    <input
                      id={doc.name}
                      name={doc.name}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="w-full p-3 border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.documents[doc.name] && (
                      <div className="mt-2 text-green-600 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {typeof formData.documents[doc.name] === "string" ? "Document uploaded" : "New document selected"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {submitting ? (
                  <svg
                    className="animate-spin h-5 w-5 mx-auto text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditIdea;