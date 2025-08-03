// Authentication utility functions

/**
 * Validate user authentication data with token consistency check
 * @param {string} token - JWT token from localStorage
 * @param {string} userData - User data JSON string from localStorage
 * @returns {object} - { isValid: boolean, user: object|null, error: string|null }
 */
export const validateAuthentication = (token, userData) => {
  try {
    if (!token || !userData) {
      return { isValid: false, user: null, error: 'No authentication data found' };
    }

    // Parse user data
    let parsedUser;
    try {
      parsedUser = JSON.parse(userData);
    } catch (parseError) {
      return { isValid: false, user: null, error: 'Invalid user data format' };
    }

    // ✅ Check required user fields
    if (!parsedUser.userId || !parsedUser.username || !parsedUser.role) {
      return { 
        isValid: false, 
        user: null, 
        error: 'Missing required user fields',
        details: {
          hasUserId: !!parsedUser.userId,
          hasUsername: !!parsedUser.username,
          hasRole: !!parsedUser.role
        }
      };
    }

    // ✅ Validate token-user consistency
    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      const tokenUserId = tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      
      if (!tokenUserId || tokenUserId.toString() !== parsedUser.userId.toString()) {
        return { 
          isValid: false, 
          user: null, 
          error: 'Token and user data mismatch',
          details: {
            tokenUserId: tokenUserId,
            storedUserId: parsedUser.userId
          }
        };
      }

      // ✅ Check token expiration
      const currentTime = Date.now() / 1000;
      if (tokenData.exp && tokenData.exp < currentTime) {
        return { 
          isValid: false, 
          user: null, 
          error: 'Token expired'
        };
      }

      // ✅ All validations passed
      return { 
        isValid: true, 
        user: parsedUser, 
        error: null 
      };

    } catch (tokenError) {
      return { 
        isValid: false, 
        user: null, 
        error: 'Token validation failed',
        details: tokenError.message
      };
    }

  } catch (error) {
    return { 
      isValid: false, 
      user: null, 
      error: 'Authentication validation error',
      details: error.message
    };
  }
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuthentication = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('🧹 Authentication data cleared');
};

/**
 * Get current user data with validation
 * @returns {object|null} - Validated user object or null
 */
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  const validation = validateAuthentication(token, userData);
  
  if (!validation.isValid) {
    console.error('🚨 Authentication validation failed:', validation.error);
    if (validation.details) {
      console.log('Validation details:', validation.details);
    }
    clearAuthentication();
    return null;
  }

  return validation.user;
};

/**
 * Check if user has specific role
 * @param {string} requiredRole - Required role
 * @param {object} user - User object (optional, gets current user if not provided)
 * @returns {boolean}
 */
export const hasRole = (requiredRole, user = null) => {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;
  
  return currentUser.role === requiredRole;
};

/**
 * Check if user has any of the specified roles
 * @param {string[]} allowedRoles - Array of allowed roles
 * @param {object} user - User object (optional, gets current user if not provided)
 * @returns {boolean}
 */
export const hasAnyRole = (allowedRoles, user = null) => {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;
  
  return allowedRoles.includes(currentUser.role);
};

/**
 * Get user-specific identifier for API calls
 * @param {object} user - User object (optional, gets current user if not provided)
 * @returns {object} - { userId, docGiaId } or null
 */
export const getUserIds = (user = null) => {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return null;
  
  return {
    userId: currentUser.userId,
    docGiaId: currentUser.docGiaId || null,
    username: currentUser.username
  };
};