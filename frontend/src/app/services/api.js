// Use the same local backend used by UserContext for auth
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') + '/api'
  : 'http://localhost:4000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

const parseJsonResponse = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (error) {
    return { error: text };
  }
};

// ==================== VAGAS (JOBS) ====================

export const createJob = async (jobData) => {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(jobData),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao criar vaga');
  }

  return data;
};

export const getCompanyJobs = async (companyId) => {
  const response = await fetch(`${API_BASE_URL}/jobs/company/${companyId}`, {
    headers: getHeaders(),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao buscar vagas');
  }

  return data;
};

export const getAllJobs = async () => {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    headers: getHeaders(),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao buscar vagas');
  }

  return data;
};

export const updateJob = async (jobId, jobData) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(jobData),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao atualizar vaga');
  }

  return data;
};

export const deleteJob = async (jobId) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao deletar vaga');
  }

  return data;
};

// ==================== CANDIDATURAS (APPLICATIONS) ====================

export const applyToJob = async (applicationData) => {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(applicationData),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao candidatar-se');
  }

  return data;
};

export const getCompanyApplications = async (companyId) => {
  const response = await fetch(`${API_BASE_URL}/applications/company/${companyId}`, {
    headers: getHeaders(),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao buscar candidatos');
  }

  return data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao atualizar candidatura');
  }

  return data;
};

export const approveApplication = async (applicationId) => {
  return updateApplicationStatus(applicationId, 'approved');
};

export const rejectApplication = async (applicationId) => {
  return updateApplicationStatus(applicationId, 'rejected');
};

export const deleteApplication = async (applicationId) => {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao deletar candidatura');
  }

  return data;
};

// ==================== UPLOAD DE CURRÍCULO ====================

export const uploadResume = async (file, userId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);

  const response = await fetch(`${API_BASE_URL}/upload-resume`, {
    method: 'POST',
    headers: {
      'x-filename': file?.name || 'curriculum.pdf',
    },
    // No auth header for local backend; content-type is set automatically for FormData
    body: formData,
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao fazer upload do currículo');
  }

  return data;
};

// ==================== AUTH / PASSWORD RESET ====================
export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });

    // If endpoint not implemented, still return ok to avoid blocking UX
    if (!response.ok) {
      // Try to parse error, but return false to indicate failure
      try {
        const err = await response.json();
        console.warn('Password reset request failed:', err);
      } catch (e) {
        console.warn('Password reset request failed');
      }
      return false;
    }

    return true;
  } catch (err) {
    console.error('requestPasswordReset error:', err);
    return false;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ token, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao redefinir senha');
    }

    return true;
  } catch (err) {
    console.error('resetPassword error:', err);
    throw err;
  }
};

// ==================== PERFIL / SEGURANÇA ====================

export const getUserProfile = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    headers: getHeaders(),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao buscar perfil');
  }

  return data;
};

export const updateUserProfile = async (userId, payload) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao atualizar perfil');
  }

  return data;
};

export const getSecurityStatus = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/auth/security/${userId}`, {
    headers: getHeaders(),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao carregar segurança');
  }

  return data;
};

export const requestEmailVerification = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/auth/request-email-verification`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao enviar verificação');
  }

  return data;
};

export const verifyEmail = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao verificar e-mail');
  }

  return data;
};

export const setupTwoFactor = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/auth/2fa/setup`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao configurar 2FA');
  }

  return data;
};

export const verifyTwoFactor = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/auth/2fa/verify`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao verificar 2FA');
  }

  return data;
};

export const disableTwoFactor = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/auth/2fa/disable`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao desativar 2FA');
  }

  return data;
};