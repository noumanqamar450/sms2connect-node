class SMS2Connect {
  /**
   * Initializes the SMS2Connect client.
   * @param {string} apiKey - Your SMS2Connect API key.
   */
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('SMS2Connect Error: API key is required.');
    }
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.sms2connect.com/v1/send-sms';
  }

  /**
   * Sends an SMS message using native fetch.
   * @param {Object} options - The SMS configuration options.
   * @param {string} options.senderId - Your approved Brand/Sender ID.
   * @param {string} options.mobile - The recipient's mobile number.
   * @param {string} options.message - The text message content.
   * @returns {Promise<Object>} The API response parsed as JSON.
   */
  async sendSMS({ senderId, mobile, message }) {
    if (!senderId) {
      throw new Error('SMS2Connect Error: senderId is required.');
    } else if (!mobile) {
      throw new Error('SMS2Connect Error: mobile is required.');
    } else if (!message) {
      throw new Error('SMS2Connect Error: message is required.');
    }

    const payload = {
      api_key: this.apiKey,
      sender_id: senderId,
      mobile: mobile,
      message: message
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      // fetch only throws on network errors, so we manually check for HTTP bad statuses
      if (!response.ok) {
        throw new Error(JSON.stringify(responseData || `HTTP Error ${response.status}`));
      }

      return responseData;
    } catch (error) {
      throw new Error(`SMS2Connect API Request Failed: ${error.message}`);
    }
  }
}

module.exports = SMS2Connect;
