#!/usr/bin/env node

import axios from 'axios';
import fs from 'fs';

const TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';

function getEnv(name) {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : null;
}

function setGitHubEnv(name, value) {
  if (!process.env.GITHUB_ENV) {
    return false;
  }

  fs.appendFileSync(process.env.GITHUB_ENV, `${name}=${value}\n`, { encoding: 'utf8' });
  return true;
}

function mask(value) {
  if (value) {
    console.log(`::add-mask::${value}`);
  }
}

export async function refreshLinkedInAccessToken({ clientId, clientSecret, refreshToken }) {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret
  });

  const response = await axios.post(TOKEN_URL, params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return {
    accessToken: response.data.access_token,
    expiresIn: response.data.expires_in,
    refreshTokenExpiresIn: response.data.refresh_token_expires_in,
    scope: response.data.scope
  };
}

async function main() {
  const existingAccessToken = getEnv('LINKEDIN_ACCESS_TOKEN');
  const refreshToken = getEnv('LINKEDIN_REFRESH_TOKEN');
  const clientId = getEnv('LINKEDIN_CLIENT_ID');
  const clientSecret = getEnv('LINKEDIN_CLIENT_SECRET');

  const hasRefreshCredentials = Boolean(refreshToken && clientId && clientSecret);

  if (!hasRefreshCredentials) {
    if (existingAccessToken) {
      mask(existingAccessToken);
      setGitHubEnv('LINKEDIN_ACCESS_TOKEN', existingAccessToken);
      console.log('LinkedIn refresh credentials not configured; using LINKEDIN_ACCESS_TOKEN secret.');
      return;
    }

    console.log('LinkedIn credentials not configured; LinkedIn publishing will fail if enabled.');
    return;
  }

  try {
    const token = await refreshLinkedInAccessToken({ clientId, clientSecret, refreshToken });
    mask(token.accessToken);
    setGitHubEnv('LINKEDIN_ACCESS_TOKEN', token.accessToken);

    console.log(`Refreshed LinkedIn access token. Expires in ${token.expiresIn} seconds.`);
    if (token.refreshTokenExpiresIn) {
      console.log(`LinkedIn refresh token expires in ${token.refreshTokenExpiresIn} seconds.`);
    }
  } catch (err) {
    const detail = err.response?.data || err.message;
    console.error('Failed to refresh LinkedIn access token:', detail);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
