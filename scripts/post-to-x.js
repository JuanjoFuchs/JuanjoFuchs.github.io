import { TwitterApi } from 'twitter-api-v2';

/**
 * Post a thread to X (Twitter)
 * @param {Array<string>} tweets - Array of tweet contents (in order)
 * @param {object} credentials - Twitter API credentials
 * @param {string} credentials.apiKey - API Key
 * @param {string} credentials.apiSecret - API Secret
 * @param {string} credentials.accessToken - Access Token
 * @param {string} credentials.accessTokenSecret - Access Token Secret
 * @returns {Promise<object>} - {success, tweetIds, error}
 */
export async function postTwitterThread(tweets, credentials) {
  try {
    if (!tweets || tweets.length === 0) {
      return {
        success: false,
        tweetIds: [],
        error: 'No tweets provided'
      };
    }

    // Validate credentials
    if (!credentials.apiKey || !credentials.apiSecret || !credentials.accessToken || !credentials.accessTokenSecret) {
      return {
        success: false,
        tweetIds: [],
        error: 'Missing Twitter API credentials'
      };
    }

    // Initialize Twitter client with OAuth 1.0a
    const client = new TwitterApi({
      appKey: credentials.apiKey,
      appSecret: credentials.apiSecret,
      accessToken: credentials.accessToken,
      accessSecret: credentials.accessTokenSecret,
    });

    const tweetIds = [];
    let previousTweetId = null;

    // Post tweets sequentially, chaining them as replies
    for (let i = 0; i < tweets.length; i++) {
      const tweetText = tweets[i];

      console.log(`Posting tweet ${i + 1}/${tweets.length}...`);

      // Truncate if over 280 characters (shouldn't happen with proper content)
      const truncatedText = tweetText.length > 280
        ? tweetText.substring(0, 277) + '...'
        : tweetText;

      try {
        // Post tweet (reply to previous tweet if not first)
        const response = previousTweetId
          ? await client.v2.reply(truncatedText, previousTweetId)
          : await client.v2.tweet(truncatedText);

        const tweetId = response.data.id;
        tweetIds.push(tweetId);
        previousTweetId = tweetId;

        console.log(`✓ Tweet ${i + 1} posted: https://twitter.com/i/web/status/${tweetId}`);
      } catch (tweetError) {
        console.error(`✗ Failed to post tweet ${i + 1}:`, tweetError.message);
        return {
          success: false,
          tweetIds,
          error: `Failed at tweet ${i + 1}: ${tweetError.message}`
        };
      }
    }

    return {
      success: true,
      tweetIds,
      error: null
    };
  } catch (err) {
    console.error('Twitter API error:', err.message);
    return {
      success: false,
      tweetIds: [],
      error: err.message
    };
  }
}

/**
 * Validate Twitter API credentials
 * @param {object} credentials - Twitter API credentials
 * @returns {Promise<object>} - {valid, error}
 */
export async function validateTwitterCredentials(credentials) {
  try {
    const client = new TwitterApi({
      appKey: credentials.apiKey,
      appSecret: credentials.apiSecret,
      accessToken: credentials.accessToken,
      accessSecret: credentials.accessTokenSecret,
    });

    // Verify credentials by fetching authenticated user
    const user = await client.v2.me();

    return {
      valid: true,
      username: user.data.username,
      error: null
    };
  } catch (err) {
    return {
      valid: false,
      username: null,
      error: err.message
    };
  }
}
