import axios from 'axios';

/**
 * Get LinkedIn user profile ID
 * @param {string} accessToken - LinkedIn OAuth 2.0 access token
 * @returns {Promise<object>} - {success, personId, error}
 */
async function getLinkedInUserId(accessToken) {
  try {
    const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      personId: response.data.sub,
      error: null
    };
  } catch (err) {
    console.error('Failed to get LinkedIn user ID:', err.response?.data || err.message);
    return {
      success: false,
      personId: null,
      error: err.response?.data?.message || err.message
    };
  }
}

/**
 * Create a LinkedIn post
 * @param {string} content - Post content
 * @param {string} personId - LinkedIn person ID (from getLinkedInUserId)
 * @param {string} accessToken - LinkedIn OAuth 2.0 access token
 * @returns {Promise<object>} - {success, postId, postUrl, error}
 */
async function createLinkedInPost(content, personId, accessToken) {
  try {
    const postData = {
      author: `urn:li:person:${personId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    const response = await axios.post('https://api.linkedin.com/v2/ugcPosts', postData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    const postId = response.data.id;
    // Extract the numeric ID from the URN for the URL
    const numericId = postId.split(':').pop();

    return {
      success: true,
      postId: postId,
      postUrl: `https://www.linkedin.com/feed/update/${postId}/`,
      error: null
    };
  } catch (err) {
    console.error('Failed to create LinkedIn post:', err.response?.data || err.message);
    return {
      success: false,
      postId: null,
      postUrl: null,
      error: err.response?.data?.message || err.message
    };
  }
}

/**
 * Add a comment to a LinkedIn post
 * @param {string} postId - LinkedIn post URN (e.g., "urn:li:ugcPost:123456")
 * @param {string} commentText - Comment text (blog URL)
 * @param {string} personId - LinkedIn person ID
 * @param {string} accessToken - LinkedIn OAuth 2.0 access token
 * @returns {Promise<object>} - {success, commentId, error}
 */
async function addLinkedInComment(postId, commentText, personId, accessToken) {
  try {
    const commentData = {
      actor: `urn:li:person:${personId}`,
      object: postId,
      message: {
        text: commentText
      }
    };

    const response = await axios.post(
      `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(postId)}/comments`,
      commentData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    return {
      success: true,
      commentId: response.data.id,
      error: null
    };
  } catch (err) {
    console.error('Failed to add LinkedIn comment:', err.response?.data || err.message);
    return {
      success: false,
      commentId: null,
      error: err.response?.data?.message || err.message
    };
  }
}

/**
 * Post to LinkedIn with main content and first comment containing blog URL
 * @param {string} content - Main post content
 * @param {string} blogUrl - Blog post URL (will be posted as first comment)
 * @param {string} accessToken - LinkedIn OAuth 2.0 access token
 * @returns {Promise<object>} - {success, postId, postUrl, commentId, error}
 */
export async function postToLinkedIn(content, blogUrl, accessToken) {
  try {
    if (!content) {
      return {
        success: false,
        postId: null,
        postUrl: null,
        commentId: null,
        error: 'No content provided'
      };
    }

    if (!accessToken) {
      return {
        success: false,
        postId: null,
        postUrl: null,
        commentId: null,
        error: 'Missing LinkedIn access token'
      };
    }

    // Step 1: Get user ID
    console.log('Getting LinkedIn user ID...');
    const userResult = await getLinkedInUserId(accessToken);
    if (!userResult.success) {
      return {
        success: false,
        postId: null,
        postUrl: null,
        commentId: null,
        error: `Failed to get user ID: ${userResult.error}`
      };
    }

    const personId = userResult.personId;
    console.log(`✓ Got user ID: ${personId}`);

    // Step 2: Create post
    console.log('Creating LinkedIn post...');
    const postResult = await createLinkedInPost(content, personId, accessToken);
    if (!postResult.success) {
      return {
        success: false,
        postId: null,
        postUrl: null,
        commentId: null,
        error: `Failed to create post: ${postResult.error}`
      };
    }

    console.log(`✓ Post created: ${postResult.postUrl}`);

    // Step 3: Add comment with blog URL
    console.log('Adding first comment with blog URL...');
    const commentResult = await addLinkedInComment(
      postResult.postId,
      `Read the full post: ${blogUrl}`,
      personId,
      accessToken
    );

    if (!commentResult.success) {
      // Post succeeded but comment failed - still return success
      console.warn(`⚠ Post succeeded but failed to add comment: ${commentResult.error}`);
      return {
        success: true,
        postId: postResult.postId,
        postUrl: postResult.postUrl,
        commentId: null,
        error: `Post succeeded but comment failed: ${commentResult.error}`
      };
    }

    console.log(`✓ Comment added with blog URL`);

    return {
      success: true,
      postId: postResult.postId,
      postUrl: postResult.postUrl,
      commentId: commentResult.commentId,
      error: null
    };
  } catch (err) {
    console.error('LinkedIn API error:', err.message);
    return {
      success: false,
      postId: null,
      postUrl: null,
      commentId: null,
      error: err.message
    };
  }
}

/**
 * Validate LinkedIn access token
 * @param {string} accessToken - LinkedIn OAuth 2.0 access token
 * @returns {Promise<object>} - {valid, error}
 */
export async function validateLinkedInToken(accessToken) {
  try {
    const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return {
      valid: true,
      name: response.data.name,
      error: null
    };
  } catch (err) {
    return {
      valid: false,
      name: null,
      error: err.response?.data?.message || err.message
    };
  }
}
