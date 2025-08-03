// JWT Utility functions for debugging and validation

/**
 * Decode JWT token to extract user information
 * @param {string} token - JWT token
 * @returns {object} - Decoded token payload
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;
    
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }
    
    // Decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Get user ID from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} - User ID from token
 */
export const getUserIdFromToken = (token) => {
  const decoded = decodeJWT(token);
  return decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
         decoded?.sub || 
         decoded?.userId || 
         null;
};

/**
 * Get user role from JWT token
 * @param {string} token - JWT token  
 * @returns {string|null} - User role from token
 */
export const getUserRoleFromToken = (token) => {
  const decoded = decodeJWT(token);
  return decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
         decoded?.role || 
         null;
};

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is expired
 */
export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Validate JWT token and user data consistency
 * @param {string} token - JWT token
 * @param {object} userData - User data from localStorage
 * @returns {boolean} - True if data is consistent
 */
export const validateTokenUserData = (token, userData) => {
  try {
    const tokenUserId = getUserIdFromToken(token);
    const tokenRole = getUserRoleFromToken(token);
    
    console.log('=== Token Validation ===');
    console.log('Token User ID:', tokenUserId);
    console.log('Token Role:', tokenRole);
    console.log('Stored User ID:', userData?.userId);
    console.log('Stored Role:', userData?.role);
    
    // Check if token data matches stored user data
    const userIdMatch = tokenUserId && userData?.userId && 
                       tokenUserId.toString() === userData.userId.toString();
    const roleMatch = tokenRole === userData?.role;
    
    if (!userIdMatch) {
      console.warn('🚨 USER ID MISMATCH - Potential security issue!');
    }
    if (!roleMatch) {
      console.warn('🚨 ROLE MISMATCH - Potential security issue!');
    }
    
    return userIdMatch && roleMatch;
  } catch (error) {
    console.error('Error validating token and user data:', error);
    return false;
  }
};

/**
 * Log detailed token information for debugging
 * @param {string} token - JWT token
 */
export const debugToken = (token) => {
  console.log('=== JWT Token Debug ===');
  
  if (!token) {
    console.log('❌ No token found');
    return;
  }
  
  const decoded = decodeJWT(token);
  if (!decoded) {
    console.log('❌ Failed to decode token');
    return;
  }
  
  console.log('✅ Token decoded successfully');
  console.log('User ID:', getUserIdFromToken(token));
  console.log('Role:', getUserRoleFromToken(token));
  console.log('Username:', decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.name);
  console.log('Issued At:', new Date(decoded.iat * 1000).toLocaleString());
  console.log('Expires At:', new Date(decoded.exp * 1000).toLocaleString());
  console.log('Is Expired:', isTokenExpired(token));
  console.log('Full payload:', decoded);
};