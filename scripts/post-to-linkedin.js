import axios from 'axios';
import fs from 'fs';
import path from 'path';

// LinkedIn API version header (required for media uploads)
// Versions are supported for ~12 months. Update annually. See:
// https://learn.microsoft.com/en-us/linkedin/marketing/versioning
const LINKEDIN_VERSION = '202511';

/**
 * Determine media type from file path
 * @param {string} filePath - Path to media file
 * @returns {string} - 'image' or 'video'
 */
function getMediaType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const videoExts = ['.mp4', '.mov', '.avi', '.webm'];
  return videoExts.includes(ext) ? 'video' : 'image';
}

/**
 * Initialize image upload to LinkedIn
 * @param {string} personId - LinkedIn person ID
 * @param {string} accessToken - LinkedIn OAuth 2.0 access token
 * @returns {Promise<object>} - {success, uploadUrl, imageUrn, error}
 */
async function initializeImageUpload(personId, accessToken) {
  try {
    const response = await axios.post(
      'https://api.linkedin.com/rest/images?action=initializeUpload',
      {
        initializeUploadRequest: {
          owner: `urn:li:person:${personId}`
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'LinkedIn-Version': LINKEDIN_VERSION,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    const uploadUrl = response.data.value.uploadUrl;
    const imageUrn = response.data.value.image;

    return {
      success: true,
      uploadUrl,
      imageUrn,
      error: null
    };
  } catch (err) {
    console.error('Failed to initialize image upload:', err.response?.data || err.message);
    return {
      success: false,
      uploadUrl: null,
      imageUrn: null,
      error: err.response?.data?.message || err.message
    };
  }
}

/**
 * Upload image file to LinkedIn pre-signed URL
 * @param {string} uploadUrl - Pre-signed upload URL
 * @param {string} filePath - Path to image file
 * @param {string} accessToken - LinkedIn OAuth 2.0 access token
 * @returns {Promise<object>} - {success, error}
 */
async function uploadImageFile(uploadUrl, filePath, accessToken) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = getMimeType(filePath);

    await axios.put(uploadUrl, fileBuffer, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': mimeType,
        'LinkedIn-Version': LINKEDIN_VERSION
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    return { success: true, error: null };
  } catch (err) {
    console.error('Failed to upload image:', err.response?.data || err.message);
    return {
      success: false,
      error: err.response?.data?.message || err.message
    };
  }
}

/**
 * Get MIME type from file extension
 * @param {string} filePath - Path to file
 * @returns {string} - MIME type
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.webm': 'video/webm'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Upload media to LinkedIn and get the URN
 * @param {string} filePath - Path to media file
 * @param {string} personId - LinkedIn person ID
 * @param {string} accessToken - LinkedIn OAuth 2.0 access token
 * @returns {Promise<object>} - {success, mediaUrn, mediaType, error}
 */
async function uploadMediaToLinkedIn(filePath, personId, accessToken) {
  try {
    const mediaType = getMediaType(filePath);

    if (mediaType === 'video') {
      // Video upload is more complex - skip for now, return null
      console.log('⚠ Video upload not yet implemented for LinkedIn');
      return { success: false, mediaUrn: null, mediaType: 'video', error: 'Video upload not implemented' };
    }

    console.log(`Uploading image to LinkedIn: ${filePath}`);

    // Step 1: Initialize upload
    const initResult = await initializeImageUpload(personId, accessToken);
    if (!initResult.success) {
      return { success: false, mediaUrn: null, mediaType: 'image', error: initResult.error };
    }

    console.log(`✓ Upload initialized, URN: ${initResult.imageUrn}`);

    // Step 2: Upload file to pre-signed URL
    const uploadResult = await uploadImageFile(initResult.uploadUrl, filePath, accessToken);
    if (!uploadResult.success) {
      return { success: false, mediaUrn: null, mediaType: 'image', error: uploadResult.error };
    }

    console.log('✓ Image uploaded successfully');

    return {
      success: true,
      mediaUrn: initResult.imageUrn,
      mediaType: 'image',
      error: null
    };
  } catch (err) {
    console.error('Media upload error:', err.message);
    return {
      success: false,
      mediaUrn: null,
      mediaType: getMediaType(filePath),
      error: err.message
    };
  }
}

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
 * Create a LinkedIn post using the versioned Posts API
 * @param {string} content - Post content
 * @param {string} personId - LinkedIn person ID (from getLinkedInUserId)
 * @param {string} accessToken - LinkedIn OAuth 2.0 access token
 * @param {object} options - Optional parameters
 * @param {string} options.imageUrn - LinkedIn image URN (from upload)
 * @param {string} options.altText - Alt text for image
 * @returns {Promise<object>} - {success, postId, postUrl, error}
 */
async function createLinkedInPost(content, personId, accessToken, options = {}) {
  try {
    // Debug: log content length (content should already be escaped by extraction)
    console.log(`Content length: ${content.length} chars`);

    // Build post data using the versioned Posts API format
    const postData = {
      author: `urn:li:person:${personId}`,
      commentary: content,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: []
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false
    };

    // Add media content if image URN is provided
    if (options.imageUrn) {
      postData.content = {
        media: {
          id: options.imageUrn,
          ...(options.altText && { altText: options.altText })
        }
      };
    }

    const response = await axios.post('https://api.linkedin.com/rest/posts', postData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': LINKEDIN_VERSION,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    // The response header contains the post URN
    const postUrn = response.headers['x-restli-id'] || response.data.id;

    return {
      success: true,
      postId: postUrn,
      postUrl: `https://www.linkedin.com/feed/update/${postUrn}/`,
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
 * Add a comment to a LinkedIn post using the versioned Comments API
 * @param {string} postUrn - LinkedIn post URN (e.g., "urn:li:share:123456")
 * @param {string} commentText - Comment text (blog URL)
 * @param {string} personId - LinkedIn person ID
 * @param {string} accessToken - LinkedIn OAuth 2.0 access token
 * @returns {Promise<object>} - {success, commentId, error}
 */
async function addLinkedInComment(postUrn, commentText, personId, accessToken) {
  try {
    // Wait a moment for the post to be fully available
    await new Promise(resolve => setTimeout(resolve, 2000));

    const commentData = {
      actor: `urn:li:person:${personId}`,
      object: postUrn,
      message: {
        text: commentText
      }
    };

    const response = await axios.post(
      `https://api.linkedin.com/rest/socialActions/${encodeURIComponent(postUrn)}/comments`,
      commentData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'LinkedIn-Version': LINKEDIN_VERSION,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    return {
      success: true,
      commentId: response.data.id || response.headers['x-restli-id'],
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
 * @param {object} options - Optional parameters
 * @param {string} options.mediaPath - Path to media file to attach
 * @param {string} options.altText - Alt text for media
 * @returns {Promise<object>} - {success, postId, postUrl, commentId, mediaUploaded, error}
 */
export async function postToLinkedIn(content, blogUrl, accessToken, options = {}) {
  try {
    if (!content) {
      return {
        success: false,
        postId: null,
        postUrl: null,
        commentId: null,
        mediaUploaded: false,
        error: 'No content provided'
      };
    }

    if (!accessToken) {
      return {
        success: false,
        postId: null,
        postUrl: null,
        commentId: null,
        mediaUploaded: false,
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
        mediaUploaded: false,
        error: `Failed to get user ID: ${userResult.error}`
      };
    }

    const personId = userResult.personId;
    console.log(`✓ Got user ID: ${personId}`);

    // Step 2: Upload media if provided
    let imageUrn = null;
    if (options.mediaPath) {
      if (!fs.existsSync(options.mediaPath)) {
        console.warn(`⚠ Media file not found: ${options.mediaPath}`);
      } else {
        const uploadResult = await uploadMediaToLinkedIn(options.mediaPath, personId, accessToken);
        if (uploadResult.success) {
          imageUrn = uploadResult.mediaUrn;
          console.log(`✓ Media uploaded: ${imageUrn}`);
        } else {
          console.warn(`⚠ Media upload failed: ${uploadResult.error}`);
          console.log('⚠ Continuing with text-only post');
        }
      }
    }

    // Step 3: Create post (with or without media)
    console.log('Creating LinkedIn post...');
    const postResult = await createLinkedInPost(content, personId, accessToken, {
      imageUrn,
      altText: options.altText
    });
    if (!postResult.success) {
      return {
        success: false,
        postId: null,
        postUrl: null,
        commentId: null,
        mediaUploaded: false,
        error: `Failed to create post: ${postResult.error}`
      };
    }

    console.log(`✓ Post created: ${postResult.postUrl}`);

    // Step 4: Add comment with blog URL
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
        mediaUploaded: !!imageUrn,
        error: `Post succeeded but comment failed: ${commentResult.error}`
      };
    }

    console.log(`✓ Comment added with blog URL`);

    return {
      success: true,
      postId: postResult.postId,
      postUrl: postResult.postUrl,
      commentId: commentResult.commentId,
      mediaUploaded: !!imageUrn,
      error: null
    };
  } catch (err) {
    console.error('LinkedIn API error:', err.message);
    return {
      success: false,
      postId: null,
      postUrl: null,
      commentId: null,
      mediaUploaded: false,
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
