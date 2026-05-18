/**
 * SMS2Connect Node.js SDK
 * Lightweight wrapper for the SMS2Connect API Gateway.
 */
class SMS2Connect {
  /**
   * Initializes the SMS2Connect client.
   * @param {string} apiKey - Your secret SMS2Connect API key.
   */
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('SMS2Connect SDK Error: Secret API key is required.');
    }
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.sms2connect.com/v1';
  }

  /**
   * Private central request utility to handle POST/GET networks with native fetch.
   */
  async #request(endpoint, method = 'GET', body = null) {
    let url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (method === 'POST' && body) {
      options.body = JSON.stringify({ api_key: this.apiKey, ...body });
    } else if (method === 'GET') {
      // Append api_key as a URL query parameter for GET requests
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}api_key=${this.apiKey}`;
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(data || `HTTP Status Error ${response.status}`));
      }

      return data;
    } catch (error) {
      throw new Error(`SMS2Connect Request Failed: ${error.message}`);
    }
  }

  /**
   * Sends an SMS or automated validation OTP via the gateway.
   * @param {Object} params - Payload config data.
   * @param {string} params.senderId - Approved brand name alphanumeric masking.
   * @param {string} params.mobile - Recipient's mobile number (+92xxxxxxxxxx).
   * @param {string} params.message - Content of the text message.
   * @returns {Promise<Object>} API parsed JSON tracking response.
   */
  async sendSMS({ senderId, mobile, message }) {
    if (!senderId || !mobile || !message) {
      throw new Error('SMS2Connect SDK Error: senderId, mobile, and message configurations are mandatory.');
    }

    return await this.#request('/send-sms', 'POST', {
      sender_id: senderId,
      mobile: mobile,
      message: message
    });
  }

  /**
   * Queries account allocation balances and outstanding credits.
   * @returns {Promise<Object>} Active financial parameters status dataset.
   */
  async getBalance() {
    return await this.#request('/balance', 'GET');
  }

  /**
   * Evaluates the delivery status of a sent message mapping.
   * @param {string} messageId - The network-generated string identifier for the message resource.
   * @returns {Promise<Object>} Server delivery tracking updates.
   */
  async getDeliveryStatus(messageId) {
    if (!messageId) {
      throw new Error('SMS2Connect SDK Error: messageId parameter must be provided.');
    }
    return await this.#request(`/delivery-status/${messageId}`, 'GET');
  }
}

module.exports = SMS2Connect;