import { TwitterApi } from 'twitter-api-v2';
import fs from 'fs';

/**
 * Upload media to Twitter
 * @param {TwitterApi} client - Authenticated Twitter client
 * @param {string} filePath - Path to media file
 * @param {string} altText - Alt text for accessibility (optional)
 * @returns {Promise<string|null>} - Media ID or null if upload fails
 */
async function uploadMedia(client, filePath, altText = null) {
  try {
    console.log(`Uploading media: ${filePath}`);

    // Check file exists
    if (!fs.existsSync(filePath)) {
      console.error(`Media file not found: ${filePath}`);
      return null;
    }

    // Upload media using v1 API (handles chunked upload automatically)
    const mediaId = await client.v1.uploadMedia(filePath);
    console.log(`✓ Media uploaded, ID: ${mediaId}`);

    // Add alt text if provided
    if (altText) {
      try {
        await client.v1.createMediaMetadata(mediaId, { alt_text: { text: altText } });
        console.log(`✓ Alt text added: "${altText.substring(0, 50)}..."`);
      } catch (altError) {
        console.warn(`⚠ Failed to add alt text: ${altError.message}`);
        // Continue anyway - alt text is optional
      }
    }

    return mediaId;
  } catch (err) {
    console.error(`✗ Media upload failed: ${err.message}`);
    return null;
  }
}

/**
 * Post a thread to X (Twitter)
 * @param {Array<string>} tweets - Array of tweet contents (in order)
 * @param {object} credentials - Twitter API credentials
 * @param {string} credentials.apiKey - API Key
 * @param {string} credentials.apiSecret - API Secret
 * @param {string} credentials.accessToken - Access Token
 * @param {string} credentials.accessTokenSecret - Access Token Secret
 * @param {object} options - Optional parameters
 * @param {string} options.mediaPath - Path to media file to attach to first tweet
 * @param {string} options.altText - Alt text for the media
 * @returns {Promise<object>} - {success, tweetIds, error}
 */
export async function postTwitterThread(tweets, credentials, options = {}) {
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

    // Upload media if provided (for first tweet only)
    let mediaId = null;
    if (options.mediaPath) {
      mediaId = await uploadMedia(client, options.mediaPath, options.altText);
      if (!mediaId) {
        console.log('⚠ Continuing with text-only (media upload failed)');
      }
    }

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
        let response;
        const isFirstTweet = i === 0;

        if (previousTweetId) {
          // Reply to previous tweet
          response = await client.v2.reply(truncatedText, previousTweetId);
        } else if (isFirstTweet && mediaId) {
          // First tweet with media
          response = await client.v2.tweet({
            text: truncatedText,
            media: { media_ids: [mediaId] }
          });
        } else {
          // First tweet without media
          response = await client.v2.tweet(truncatedText);
        }

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
      mediaUploaded: !!mediaId,
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
