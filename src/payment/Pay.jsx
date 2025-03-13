import React from "react";
import { v4 as uuidv4 } from "uuid"; // Import UUID package
import { FaLock } from 'react-icons/fa'; // For secure payment icon

const Pay = ({ fname, lname, email, amount, public_key, project_id, project_name, shares, onCancel }) => {
  const tx_ref = `tx-${uuidv4()}`; // Generate unique transaction reference
  
  return (
    <form method="POST" action="https://api.chapa.co/v1/hosted/pay">
      <input type="hidden" name="public_key" value={public_key} />
      <input type="hidden" name="tx_ref" value={tx_ref} />
      <input type="hidden" name="amount" value={amount} />
      <input type="hidden" name="currency" value="ETB" />
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="first_name" value={fname} />
      <input type="hidden" name="last_name" value={lname} />
      <input type="hidden" name="title" value="Ethio Capital Investment" />
      <input type="hidden" name="description" value={`Investment in ${project_name} - Shares: ${shares}`} />
      <input type="hidden" name="callback_url" value="http://localhost:3001/callback" />
      {/* <input type="hidden" name="return_url" value="http://localhost:3001/success" /> */}
      <input type="hidden" name="meta[project_id]" value={project_id} />
      <input type="hidden" name="meta[shares]" value={shares} />

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