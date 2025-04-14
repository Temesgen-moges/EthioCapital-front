import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, DollarSign, Clock, CheckCircle, X, Video, 
  Activity, Send, AlertCircle, FileText, Settings, Users, ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FilePlus } from 'lucide-react';
import Documents from "./Documents";
import { ChevronDown, ChevronUp } from 'lucide-react'; 
import NavigationBar from '../invaster/NavigationBar';

const BoardDashboard = () => {
  const [activeTab, setActiveTab] = useState('discussion');
  const [messages, setMessages] = useState([
    { id: 1, user: 'Temesgen', text: 'Welcome to the board meeting.', time: '10:00 AM' },
    { id: 2, user: 'Sarah Johnson', text: 'Let\'s discuss the fund release proposal.', time: '10:02 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatRef = useRef(null);
  const [votes, setVotes] = useState({
    releaseFunds: 0,
    extendTime: 0,
    refundInvestors: 0
  });
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [currentUser] = useState('Temesgen');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [currentFunds, setCurrentFunds] = useState(1000000);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);
  const [currentVoteType, setCurrentVoteType] = useState(null);

  const boardMembers = [
    { 
      id: 1, 
      name: 'Temesgen Moges', 
      role: 'Chairman (Entrepreneur)', 
      shares: '30%', 
      status: 'online',
      image: '👨‍💼',
      bio: 'Tech entrepreneur with 10 years experience',
      contact: '+251 911 234 567',
      accountDetails: '1234-5678-9012-3456',
      bankName: 'Commercial Bank of Ethiopia'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      role: 'Lead Investor', 
      shares: '20%', 
      status: 'online',
      image: '👩‍💼',
      bio: 'Angel investor with focus on tech startups',
      contact: '+251 922 345 678'
    },
    { 
      id: 3, 
      name: 'Michael Chen', 
      role: 'Board Member', 
      shares: '15%', 
      status: 'offline',
      image: '👨‍💼',
      bio: 'Financial advisor and venture capitalist',
      contact: '+251 933 456 789'
    },
    { 
      id: 4, 
      name: 'Emma Williams', 
      role: 'Board Member', 
      shares: '12%', 
      status: 'online',
      image: '👩‍💼',
      bio: 'Investment banker with startup experience',
      contact: '+251 944 567 890'
    },
    { 
      id: 5, 
      name: 'David Brown', 
      role: 'Board Member', 
      shares: '10%', 
      status: 'online',
      image: '👨‍💼',
      bio: 'Serial investor and business consultant',
      contact: '+251 955 678 901'
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: 'John Smith',
          text: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setNewMessage('');
    }
  };

  const handleVote = (type) => {
    if (type === 'releaseFunds') {
      setCurrentVoteType(type);
      setShowVoteConfirmation(true);
    } else {
      setVotes({ ...votes, [type]: votes[type] + 1 });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const confirmVote = () => {
    setVotes({ ...votes, [currentVoteType]: votes[currentVoteType] + 1 });
    setShowVoteConfirmation(false);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);
  const navigate = useNavigate();

  const chairman = boardMembers.find(member => member.role.includes('Chairman'));

  const renderConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Fund Release Confirmation</h3>
          <button onClick={() => setShowVoteConfirmation(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <AlertCircle className="text-yellow-600 inline-block mr-2" />
            <span className="text-sm text-yellow-800">
              You are about to vote for releasing funds to the entrepreneur. 
              Please verify transfer details below:
            </span>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Transfer Details</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Purpose:</span> Project funding release</p>
              <p><span className="text-gray-600">Bank:</span> {chairman.bankName}</p>
              <p><span className="text-gray-600">Account Name:</span> {chairman.name}</p>
              <p><span className="text-gray-600">Account Number:</span> {chairman.accountDetails}</p>
              <p><span className="text-gray-600">Amount:</span> ${currentFunds.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setShowVoteConfirmation(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmVote}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirm Vote
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Project Overview</h2>
                  <p className="text-gray-600">Total Investment: ${currentFunds.toLocaleString()}</p>
                  <p className="text-gray-600">Required Votes for Approval: 3/5</p>
                </div>
                <div className="flex gap-4">
                  {currentUser === 'Temesgen' && (
                    <button 
                      onClick={() => navigate('/release-funds')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                    >
                      <FilePlus size={18} />
                      Create Proposal
                    </button>
                  )}
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Generate Report
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Schedule Meeting
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Board Members</h2>
                  <button 
                    onClick={() => setShowAllMembers(!showAllMembers)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    {showAllMembers ? 'Show Less' : 'Show More'}
                    {showAllMembers ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {boardMembers
                  .slice(0, showAllMembers ? boardMembers.length : 3)
                  .map(member => (
                    <div 
                      key={member.id} 
                      className="mb-4 p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                      onClick={() => setSelectedMember(member)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl bg-blue-50 p-2 rounded-full">
                          {member.image}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{member.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              member.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {member.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{member.role}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              Shares: {member.shares}
                            </span>
                            <span className="text-sm text-gray-500">{member.contact}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {!showAllMembers && boardMembers.length > 3 && (
                  <div className="text-center text-sm text-gray-500 mt-4">
                    {boardMembers.length - 3} more members available
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setActiveTab('discussion')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      activeTab === 'discussion' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                    }`}
                  >
                    <MessageSquare size={20} />
                    Discussion
                  </button>
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      activeTab === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                    }`}
                  >
                    <Video size={20} />
                    Video Meeting
                  </button>
                </div>

                <div className="h-96 bg-gray-50 rounded-lg">
                  {activeTab === 'discussion' ? (
                    <div className="h-full flex flex-col p-4">
                      <div className="flex-1 overflow-y-auto mb-4" ref={chatRef}>
                        {messages.map(message => (
                          <div key={message.id} className="mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                {message.user.charAt(0)}
                              </div>
                              <div>
                                <span className="font-medium">{message.user}</span>
                                <span className="text-sm text-gray-500 ml-2">{message.time}</span>
                              </div>
                            </div>
                            <div className="ml-10 mt-1 p-2 bg-white rounded-lg shadow-sm">
                              {message.text}
                            </div>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="submit"
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Send size={20} />
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                      <Video size={48} className="text-gray-400 mb-4" />
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Join Video Meeting
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Board Voting</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'releaseFunds', icon: DollarSign, title: 'Release Funds', color: 'blue', description: 'Release project funds to entrepreneur' },
                  { key: 'extendTime', icon: Clock, title: 'Extend Timeline', color: 'yellow', description: 'Extend project deadline' },
                  { key: 'refundInvestors', icon: Activity, title: 'Refund Investors', color: 'red', description: 'Return funds to investors' }
                ].map(({ key, icon: Icon, title, color, description }) => (
                  <button
                    key={key}
                    onClick={() => handleVote(key)}
                    className={`p-6 border rounded-lg hover:bg-${color}-50 transition-colors`}
                  >
                    <Icon className={`mx-auto mb-2 text-${color}-600`} size={24} />
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{description}</p>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-${color}-600 rounded-full h-2`}
                        style={{ width: `${(votes[key] / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Votes: {votes[key]}/5</p>
                    {votes[key] >= 3 && key === 'releaseFunds' && (
                      <p className="text-sm text-green-600 mt-1">Majority Achieved - Funds Ready for Release</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        );
      case 'documents':
        return <Documents />;
      case 'settings':
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar with Back Button */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="p-6 flex items-center gap-2">
          <button 
            onClick={() => navigate('/Investor-Profile')}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-blue-600">EthioCapital</h1>
            <p className="text-sm text-gray-600">Board Management System</p>
          </div>
        </div>
        <nav className="mt-6">
          {[
            { icon: Users, label: 'Dashboard', value: 'dashboard' },
            { icon: FileText, label: 'Documents', value: 'documents' },
            { icon: Settings, label: 'Settings', value: 'settings' },
          ].map(({ icon: Icon, label, value }) => (
            <button
              key={value}
              onClick={() => setActiveSection(value)}
              className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 ${
                activeSection === value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="ml-64 p-8">
        {renderMainContent()}
      </div>

      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle size={20} />
          {votes.releaseFunds >= 3 
            ? `Fund release approved! Funds will be transferred to ${chairman.bankName} account ${chairman.accountDetails}`
            : "Vote recorded successfully"}
        </div>
      )}

      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{selectedMember.name}</h3>
              <button onClick={() => setSelectedMember(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{selectedMember.image}</div>
                <div>
                  <p className="font-medium">{selectedMember.role}</p>
                  <p className="text-sm text-gray-600">Shares: {selectedMember.shares}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bio</p>
                <p className="font-medium">{selectedMember.bio}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="font-medium">{selectedMember.contact}</p>
              </div>
              {selectedMember.role === 'Chairman (Entrepreneur)' && votes.releaseFunds >= 3 && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 font-semibold">Bank Transfer Details</p>
                  <p className="font-medium">Bank: {selectedMember.bankName}</p>
                  <p className="font-medium">Account: {selectedMember.accountDetails}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showVoteConfirmation && renderConfirmationModal()}
    </div>
  );
};

export default BoardDashboard;