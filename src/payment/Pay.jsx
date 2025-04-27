
import React from 'react';
import { FaLock } from 'react-icons/fa';

const Pay = ({
  fname,
  lname,
  email,
  amount,
  public_key,
  project_id,
  project_name,
  shares,
  equityPercentage,
  onCancel,
  fullName,
  txRef,
}) => {
  const handleSubmit = (e) => {
    console.log('Submitting payment form to Chapa:', {
      txRef,
      email,
      amount,
      project_id,
      project_name,
      shares,
      fullName,
      callback_url: 'https://your-ngrok-url.ngrok.io/api/v1/callback',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <form method="POST" action="https://api.chapa.co/v1/hosted/pay" onSubmit={handleSubmit}>
      <input type="hidden" name="public_key" value={public_key} />
      <input type="hidden" name="tx_ref" value={txRef} />
      <input type="hidden" name="amount" value={amount} />
      <input type="hidden" name="currency" value="ETB" />
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="first_name" value={fname} />
      <input type="hidden" name="last_name" value={lname} />
      <input type="hidden" name="title" value="Ethio Capital Investment" />
      <input type="hidden" name="description" value={`Investment in ${project_name} - Shares: ${shares}`} />
      <input type="hidden" name="callback_url" value="https://ethio-capital-backend-123.onrender.com/api/v1/callback" />
      <input type="hidden" name="return_url" value="http://localhost:3000/success" />
      <input type="hidden" name="meta[project_id]" value={project_id} />
      <input type="hidden" name="meta[shares]" value={shares} />
      <input type="hidden" name="meta[equityPercentage]" value={equityPercentage} />
      <input type="hidden" name="meta[fullName]" value={fullName} />
      <input type="hidden" name="meta[projectName]" value={project_name} />
      <input type="hidden" name="meta[amount]" value={amount} />
      <input type="hidden" name="meta[email]" value={email} />
      <input type="hidden" name="meta[timestamp]" value={new Date().toISOString()} />

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition duration-300 flex items-center gap-2"
      >
        <FaLock /> Confirm & Pay
      </button>
    </form>
  );
};

export default Pay;
