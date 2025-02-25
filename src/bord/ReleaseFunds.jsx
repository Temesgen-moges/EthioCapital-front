import React, { useState } from 'react';
import { X, FilePlus, ChevronLeft, Info, Clipboard, ClipboardCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReleaseFunds = ({ onSubmitProposal, currentUser }) => {
  const navigate = useNavigate();
  const [releaseProposal, setReleaseProposal] = useState({
    amount: '',
    purpose: '',
    documents: ''
  });
  const [showDetails, setShowDetails] = useState(true);
  const [copied, setCopied] = useState(false);

  const transferDetails = {
    purpose: 'Project funding release',
    bank: 'Commercial Bank of Ethiopia',
    accountName: 'John Smith',
    accountNumber: '1234-5678-9012-3456',
    amount: '$1,000,000'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitProposal({
      ...releaseProposal,
      ...transferDetails
    });
    navigate('/');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const DetailItem = ({ label, value, copyable = false, copied }) => (
    <div className="flex justify-between items-center p-2 bg-white rounded border">
      <div>
        <span className="text-sm text-gray-600">{label}:</span>
        <span className="ml-2 font-medium">{value}</span>
      </div>
      {copyable && (
        <button 
          onClick={() => copyToClipboard(value)}
          className="text-blue-600 hover:text-blue-700"
        >
          {copied ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ChevronLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <FilePlus className="mr-2" size={24} />
              New Fund Release Proposal
            </h1>
          </div>

          <div className="mb-8 bg-blue-50 rounded-lg p-4">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowDetails(!showDetails)}
            >
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Info size={18} />
                Transfer Details
              </h2>
              {showDetails ? <ChevronUp /> : <ChevronDown />}
            </div>

            {showDetails && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <DetailItem label="Purpose" value={transferDetails.purpose} />
                  <DetailItem label="Bank" value={transferDetails.bank} />
                </div>
                <div className="space-y-2">
                  <DetailItem 
                    label="Account Name" 
                    value={transferDetails.accountName} 
                    copyable 
                    copied={copied}
                  />
                  <DetailItem 
                    label="Account Number" 
                    value={transferDetails.accountNumber} 
                    copyable 
                    copied={copied}
                  />
                </div>
                <div className="col-span-full">
                  <div className="p-3 bg-white rounded border flex justify-between items-center">
                    <span className="font-medium">Transfer Amount:</span>
                    <span className="text-green-600 font-bold">{transferDetails.amount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Request Amount (USD)</label>
                <input
                  type="number"
                  value={releaseProposal.amount}
                  onChange={(e) => setReleaseProposal({...releaseProposal, amount: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Purpose of Release</label>
                <textarea
                  value={releaseProposal.purpose}
                  onChange={(e) => setReleaseProposal({...releaseProposal, purpose: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Describe the purpose"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Supporting Documents (Comma-separated URLs)</label>
              <input
                type="text"
                value={releaseProposal.documents}
                onChange={(e) => setReleaseProposal({...releaseProposal, documents: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://doc1.com, https://doc2.com"
              />
            </div>

            <div className="mt-8 p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
              <Info className="text-yellow-600 mt-1" size={18} />
              <div>
                <p className="font-medium mb-2">Before submitting:</p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Verify all transfer details above</li>
                  <li>Ensure supporting documents are properly linked</li>
                  <li>Double-check the requested amount</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                Submit Proposal
              </button>
            </div>
          </form>
        </div>

        {copied && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <ClipboardCheck size={18} />
            Copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};

export default ReleaseFunds;