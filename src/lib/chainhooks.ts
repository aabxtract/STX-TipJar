
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// This is a placeholder for your smart contract.
// Replace with your actual deployed contract identifier.
const DEPLOYER_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'tip-jar-contract';
const FULL_CONTRACT_IDENTIFIER = `${DEPLOYER_ADDRESS}.${CONTRACT_NAME}`;

// This should be the publicly accessible URL where your app is hosted
// and can receive webhook POST requests.
const WEBHOOK_URL = process.env.APP_URL ? `${process.env.APP_URL}/api/webhook` : 'https://example.com/api/webhook';

async function registerTipJarChainhook() {
  if (!process.env.HIRO_API_KEY) {
    console.error('HIRO_API_KEY is not set in your environment variables.');
    console.error('Please add it to a .env.local file in the root of your project.');
    return;
  }
  
  if (DEPLOYER_ADDRESS === 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM') {
    console.warn('The contract identifier is still a placeholder.');
    console.warn(`Please update 'DEPLOYER_ADDRESS' and 'CONTRACT_NAME' in src/lib/chainhooks.ts with your deployed contract details.`);
  }

  const client = new ChainhooksClient({
    baseUrl: CHAINHOOKS_BASE_URL.testnet,
    apiKey: process.env.HIRO_API_KEY,
  });

  try {
    console.log('Registering chainhook to listen for tip transactions...');
    const chainhook = await client.registerChainhook({
      version: '1',
      name: 'stx-tip-jar-tips',
      chain: 'stacks',
      network: 'testnet',
      filters: {
        // We are listening for a 'contract_call' event
        events: [
          {
            type: 'contract_call',
            // The event is on our specific smart contract
            contract_identifier: FULL_CONTRACT_IDENTIFIER,
            // We only care about the 'send-tip' function
            function_name: 'send-tip',
          },
        ],
      },
      action: {
        // When the event occurs, send an HTTP POST request
        type: 'http_post',
        // To this URL
        url: WEBHOOK_URL,
      },
      options: {
        // Automatically decode the Clarity values from the transaction
        decode_clarity_values: true,
        // Enable the chainhook immediately upon registration
        enable_on_registration: true,
      },
    });

    console.log('Chainhook registered successfully!');
    console.log('Chainhook UUID:', chainhook.uuid);
    console.log('Status:', chainhook.status.enabled ? 'Enabled' : 'Disabled');
    console.log(`Now listening for calls to the 'send-tip' function on ${FULL_CONTRACT_IDENTIFIER} on the testnet.`);

  } catch (error) {
    console.error('Failed to register chainhook:', error);
  }
}

// You can run this function from a script to register your chainhook.
// e.g., using `tsx src/lib/chainhooks.ts`
registerTipJarChainhook();
