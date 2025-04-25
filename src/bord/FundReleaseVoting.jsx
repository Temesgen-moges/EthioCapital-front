import React, { useState } from 'react';
import { DollarSign, Bell, X, AlertCircle } from 'lucide-react';
import axios from 'axios';

const VOTE_THRESHOLD = 0.75;

const FundReleaseVoting = ({
  fundReleases,
  fundReleaseId,
  fundReleaseStatus,
  votes,
  boardMemberData,
  isEntrepreneur,
  newFundRelease,
  token,
  businessIdeaId,
  setNotificationMessage,
  setShowNotification,
  setVotes,
  setFundReleaseStatus,
  setFundReleases,
  API_URL,
}) => {
  const [localShowVoteConfirmation, setLocalShowVoteConfirmation] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  console.log('[FundReleaseVoting] Props:', {
    fundReleases,
    fundReleaseId,
    fundReleaseStatus,
    votes,
    boardMemberData,
    isEntrepreneur,
    newFundRelease,
    token,
    businessIdeaId,
  });

  const handleVote = (type) => {
    console.log('[FundReleaseVoting] handleVote called', { type, isEntrepreneur, fundReleaseId, fundReleases });
    if (isEntrepreneur) {
      setNotificationMessage('Entrepreneurs cannot vote on fund releases.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    if (!fundReleaseId || !fundReleases.length || !fundReleases[0]?.bankName) {
      setNotificationMessage('No valid fund release request to vote on.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    if (hasVoted) {
      setNotificationMessage('You have already voted on this fund release.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    setLocalShowVoteConfirmation(true);
  };

  const confirmVote = async () => {
    console.log('[FundReleaseVoting] confirmVote called', { fundReleaseId });
    if (isVoting) return;
    setIsVoting(true);
    try {
      const response = await axios.post(
        `${API_URL}/fund-release/vote`,
        { businessIdeaId, voteType: 'releaseFunds', fundReleaseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('[FundReleaseVoting] Vote response:', response.data);
      setVotes((prev) => ({
        ...prev,
        releaseFunds: Number.isInteger(response.data.votes) ? response.data.votes : prev.releaseFunds,
      }));
      setFundReleaseStatus(response.data.status || fundReleaseStatus);
      setFundReleases((prev) =>
        prev.map((fr) =>
          fr._id === fundReleaseId
            ? { ...fr, status: response.data.status || fr.status, votes: response.data.votes }
            : fr
        )
      );
      setHasVoted(true);
      setLocalShowVoteConfirmation(false);
      setNotificationMessage('Vote confirmed successfully');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('[FundReleaseVoting] Vote error:', {
        message: error.message,
        response: error.response?.data,
      });
      let message = 'Failed to confirm vote';
      if (error.response?.data?.message === 'User has already voted') {
        setHasVoted(true);
        message = 'You have already voted on this fund release.';
      } else {
        message = error.response?.data?.message || message;
      }
      setNotificationMessage(message);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setIsVoting(false);
    }
  };

  const renderVoteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Fund Release Vote Confirmation</h3>
          <button onClick={() => setLocalShowVoteConfirmation(false)} aria-label="Close vote confirmation">
            <X size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
            <AlertCircle className="text-yellow-600 dark:text-yellow-400 inline-block mr-2" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              You are voting to release funds to the entrepreneur. Please verify transfer details below:
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Transfer Details</h4>
            <div className="space-y-2 text-sm text-gray-700 dark:text-white">
              <p><span className="text-gray-600 dark:text-gray-400">Purpose:</span> Project funding release</p>
              <p><span className="text-gray-600 dark:text-gray-400">Bank:</span> {fundReleases[0]?.bankName || 'N/A'}</p>
              <p><span className="text-gray-600 dark:text-gray-400">Account Name:</span> {fundReleases[0]?.accountName || 'N/A'}</p>
              <p><span className="text-gray-600 dark:text-gray-400">Account Number:</span> {fundReleases[0]?.accountNumber || 'N/A'}</p>
              <p><span className="text-gray-600 dark:text-gray-400">Amount:</span>{' '}
                {(fundReleases[0]?.amount || 0).toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}
              </p>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setLocalShowVoteConfirmation(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              aria-label="Cancel vote"
            >
              Cancel
            </button>
            <button
              onClick={confirmVote}
              disabled={isVoting}
              className={`flex-1 px-4 py-2 rounded-lg ${
                isVoting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
              aria-label="Confirm vote"
            >
              {isVoting ? 'Voting...' : 'Confirm Vote'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  console.log('[FundReleaseVoting] Render', { localShowVoteConfirmation, fundReleaseId, fundReleaseStatus, hasVoted });

  return (
    <div
      className="p-6 border rounded-lg transition-colors border-gray-200 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/30"
      role="region"
      aria-label="Fund release voting section"
    >
      <div className="relative">
        <DollarSign className="mx-auto mb-2 text-orange-500 dark:text-orange-400" size={24} />
        {newFundRelease && (
          <Bell className="absolute top-0 right-0 text-red-500 animate-pulse" size={16} />
        )}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white">Release Funds</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Release project funds to entrepreneur</p>
      {fundReleaseId && fundReleases.length > 0 ? (
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <p><strong>Bank:</strong> {fundReleases[0]?.bankName || 'N/A'}</p>
          <p><strong>Account Name:</strong> {fundReleases[0]?.accountName || 'N/A'}</p>
          <p><strong>Account Number:</strong> {fundReleases[0]?.accountNumber || 'N/A'}</p>
          <p><strong>Amount:</strong> {(fundReleases[0]?.amount || 0).toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}</p>
        </div>
      ) : (
        <p className="text-sm text-red-600 dark:text-red-400 mb-2">
          Fund release details unavailable. Please contact support if you are a board member.
        </p>
      )}
      <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
        <div
          className="bg-orange-500 rounded-full h-2"
          style={{ width: `${(votes.releaseFunds / (boardMemberData?.investors?.length || 4)) * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Votes: {votes.releaseFunds}/{boardMemberData?.investors?.length || 4}
      </p>
      {fundReleaseId && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Status: {fundReleaseStatus === 'pending' ? 'Pending' : 'Sent to Admin'}
        </p>
      )}
      {votes.releaseFunds >= Math.ceil((boardMemberData?.investors?.length || 4) * VOTE_THRESHOLD) && (
        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
          Majority Achieved - Funds Sent to Admin
        </p>
      )}
      {fundReleaseId && fundReleaseStatus === 'pending' && !hasVoted ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleVote('releaseFunds');
          }}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 w-full"
          aria-label="Vote for fund release"
        >
          Vote
        </button>
      ) : (
        <button
          disabled
          className="mt-4 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed w-full"
          aria-label={hasVoted ? 'Already voted' : 'Voting unavailable'}
        >
          {hasVoted ? 'Already Voted' : 'Vote'}
        </button>
      )}
      {localShowVoteConfirmation && renderVoteConfirmationModal()}
    </div>
  );
};

export default FundReleaseVoting;