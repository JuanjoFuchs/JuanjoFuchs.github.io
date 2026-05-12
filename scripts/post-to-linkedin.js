import axios from 'axios';
import fs from 'fs';
import path from 'path';

// LinkedIn API version header (required for media uploads)
// Versions are supported for ~12 months. Update annually. See:
// https://learn.microsoft.com/en-us/linkedin/marketing/versioning
const LINKEDIN_VERSION = '202511';
const VIDEO_STATUS_TIMEOUT_MS = 120000;
const VIDEO_STATUS_POLL_MS = 5000;

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
 * Initialize video upload to LinkedIn.
 * @param {string} personId - LinkedIn person ID
 * @param {string} accessToken - LinkedIn OAuth 2.0 access token
 * @param {number} fileSizeBytes - Video file size in bytes
 * @returns {Promise<object>} - {success, videoUrn, uploadToken, uploadInstructions, error}
 */
async function initializeVideoUpload(personId, accessToken, fileSizeBytes) {
  try {
    const response = await axios.post(
      'https://api.linkedin.com/rest/videos?action=initializeUpload',
      {
        initializeUploadRequest: {
          owner: `urn:li:person:${personId}`,
          fileSizeBytes,
          uploadCaptions: false,
          uploadThumbnail: false
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

    const value = response.data.value;
    return {
      success: true,
      videoUrn: value.video,
      uploadToken: value.uploadToken,
      uploadInstructions: value.uploadInstructions || [],
      error: null
    };
  } catch (err) {
    console.error('Failed to initialize video upload:', err.response?.data || err.message);
    return {
      success: false,
      videoUrn: null,
      uploadToken: null,
      uploadInstructions: [],
      error: err.response?.data?.message || err.message
    };
  }
}

/**
 * Upload video chunks to LinkedIn pre-signed URLs.
 * @param {Array<object>} uploadInstructions - LinkedIn upload instructions
 * @param {string} filePath - Path to video file
 * @returns {Promise<object>} - {success, uploadedPartIds, error}
 */
async function uploadVideoParts(uploadInstructions, filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const uploadedPartIds = [];

    for (let i = 0; i < uploadInstructions.length; i++) {
      const instruction = uploadInstructions[i];
      const start = Number(instruction.firstByte);
      const end = Number(instruction.lastByte);
      const chunk = fileBuffer.subarray(start, end + 1);

      console.log(`Uploading video part ${i + 1}/${uploadInstructions.length} (${start}-${end})`);

      const response = await axios.put(instruction.uploadUrl, chunk, {
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      const etag = response.headers.etag;
      if (!etag) {
        return {
          success: false,
          uploadedPartIds,
          error: `Missing ETag for uploaded video part ${i + 1}`
        };
      }

      uploadedPartIds.push(etag.replace(/^"|"$/g, ''));
    }

    return { success: true, uploadedPartIds, error: null };
  } catch (err) {
    console.error('Failed to upload video part:', err.response?.data || err.message);
    return {
      success: false,
      uploadedPartIds: [],
      error: err.response?.data?.message || err.message
    };
  }
}

/**
 * Finalize LinkedIn video upload.
 * @param {string} videoUrn - LinkedIn video URN
 * @param {string} uploadToken - Upload token from initialize step
 * @param {Array<string>} uploadedPartIds - ETags from uploaded parts
 * @param {string} accessToken - LinkedIn OAuth 2.0 access token
 * @returns {Promise<object>} - {success, error}
 */
async function finalizeVideoUpload(videoUrn, uploadToken, uploadedPartIds, accessToken) {
  try {
    await axios.post(
      'https://api.linkedin.com/rest/videos?action=finalizeUpload',
      {
        finalizeUploadRequest: {
          video: videoUrn,
          uploadToken,
          uploadedPartIds
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

    return { success: true, error: null };
  } catch (err) {
    console.error('Failed to finalize video upload:', err.response?.data || err.message);
    return {
      success: false,
      error: err.response?.data?.message || err.message
    };
  }
}

/**
 * Wait for LinkedIn video processing to complete.
 * @param {string} videoUrn - LinkedIn video URN
 * @param {string} accessToken - LinkedIn OAuth 2.0 access token
 * @returns {Promise<object>} - {success, status, error}
 */
async function waitForVideoAvailable(videoUrn, accessToken) {
  const encodedUrn = encodeURIComponent(videoUrn);
  const deadline = Date.now() + VIDEO_STATUS_TIMEOUT_MS;

  while (Date.now() < deadline) {
    try {
      const response = await axios.get(
        `https://api.linkedin.com/rest/videos/${encodedUrn}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'LinkedIn-Version': LINKEDIN_VERSION,
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      );

      const status = response.data.status;
      console.log(`Video status: ${status}`);

      if (status === 'AVAILABLE') {
        return { success: true, status, error: null };
      }

      if (status === 'PROCESSING_FAILED') {
        return {
          success: false,
          status,
          error: response.data.processingFailureReason || 'Video processing failed'
        };
      }
    } catch (err) {
      console.warn('Failed to check video status:', err.response?.data || err.message);
    }

    await new Promise(resolve => setTimeout(resolve, VIDEO_STATUS_POLL_MS));
  }

  return {
    success: false,
    status: 'TIMEOUT',
    error: 'Timed out waiting for LinkedIn video processing'
  };
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
      const fileSizeBytes = fs.statSync(filePath).size;
      console.log(`Uploading video to LinkedIn: ${filePath} (${fileSizeBytes} bytes)`);

      const initResult = await initializeVideoUpload(personId, accessToken, fileSizeBytes);
      if (!initResult.success) {
        return { success: false, mediaUrn: null, mediaType: 'video', error: initResult.error };
      }

      console.log(`✓ Video upload initialized, URN: ${initResult.videoUrn}`);

      const uploadResult = await uploadVideoParts(initResult.uploadInstructions, filePath);
      if (!uploadResult.success) {
        return { success: false, mediaUrn: null, mediaType: 'video', error: uploadResult.error };
      }

      console.log('✓ Video parts uploaded successfully');

      const finalizeResult = await finalizeVideoUpload(
        initResult.videoUrn,
        initResult.uploadToken,
        uploadResult.uploadedPartIds,
        accessToken
      );
      if (!finalizeResult.success) {
        return { success: false, mediaUrn: null, mediaType: 'video', error: finalizeResult.error };
      }

      console.log('✓ Video upload finalized');

      const statusResult = await waitForVideoAvailable(initResult.videoUrn, accessToken);
      if (!statusResult.success) {
        return { success: false, mediaUrn: null, mediaType: 'video', error: statusResult.error };
      }

      return {
        success: true,
        mediaUrn: initResult.videoUrn,
        mediaType: 'video',
        error: null
      };
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
 * @param {string} options.mediaUrn - LinkedIn media URN (from upload)
 * @param {string} options.mediaType - LinkedIn media type ('image' or 'video')
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

    // Add media content if media URN is provided
    if (options.mediaUrn) {
      postData.content = {
        media: {
          id: options.mediaUrn,
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
 * Post to LinkedIn with content including blog URL in body
 * @param {string} content - Main post content (should include blog URL)
 * @param {string} blogUrl - Blog post URL (kept for API compatibility, URL should be in content)
 * @param {string} accessToken - LinkedIn OAuth 2.0 access token
 * @param {object} options - Optional parameters
 * @param {string} options.mediaPath - Path to media file to attach
 * @param {string} options.altText - Alt text for media
 * @returns {Promise<object>} - {success, postId, postUrl, mediaUploaded, error}
 */
export async function postToLinkedIn(content, blogUrl, accessToken, options = {}) {
  try {
    if (!content) {
      return {
        success: false,
        postId: null,
        postUrl: null,
        mediaUploaded: false,
        error: 'No content provided'
      };
    }

    if (!accessToken) {
      return {
        success: false,
        postId: null,
        postUrl: null,
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
        mediaUploaded: false,
        error: `Failed to get user ID: ${userResult.error}`
      };
    }

    const personId = userResult.personId;
    console.log(`✓ Got user ID: ${personId}`);

    // Step 2: Upload media if provided
    let mediaUrn = null;
    let mediaType = null;
    if (options.mediaPath) {
      if (!fs.existsSync(options.mediaPath)) {
        console.warn(`⚠ Media file not found: ${options.mediaPath}`);
      } else {
        const uploadResult = await uploadMediaToLinkedIn(options.mediaPath, personId, accessToken);
        if (uploadResult.success) {
          mediaUrn = uploadResult.mediaUrn;
          mediaType = uploadResult.mediaType;
          console.log(`✓ Media uploaded: ${mediaUrn}`);
        } else {
          console.warn(`⚠ Media upload failed: ${uploadResult.error}`);
          console.log('⚠ Continuing with text-only post');
        }
      }
    }

    // Step 3: Create post (with or without media)
    console.log('Creating LinkedIn post...');
    const postResult = await createLinkedInPost(content, personId, accessToken, {
      mediaUrn,
      mediaType,
      altText: options.altText
    });
    if (!postResult.success) {
      return {
        success: false,
        postId: null,
        postUrl: null,
        mediaUploaded: false,
        error: `Failed to create post: ${postResult.error}`
      };
    }

    console.log(`✓ Post created: ${postResult.postUrl}`);

    return {
      success: true,
      postId: postResult.postId,
      postUrl: postResult.postUrl,
      mediaUploaded: !!mediaUrn,
      error: null
    };
  } catch (err) {
    console.error('LinkedIn API error:', err.message);
    return {
      success: false,
      postId: null,
      postUrl: null,
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
