// Use the same local backend used by UserContext for auth
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') + '/api'
  : 'http://localhost:4000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

// ==================== VAGAS (JOBS) ====================

export const createJob = async (jobData) => {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(jobData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar vaga');
  }
  
  return response.json();
};

export const getCompanyJobs = async (companyId) => {
  const response = await fetch(`${API_BASE_URL}/jobs/company/${companyId}`, {
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar vagas');
  }
  
  return response.json();
};

export const getAllJobs = async () => {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar vagas');
  }
  
  return response.json();
};

export const updateJob = async (jobId, jobData) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(jobData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao atualizar vaga');
  }
  
  return response.json();
};

export const deleteJob = async (jobId) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao deletar vaga');
  }
  
  return response.json();
};

// ==================== CANDIDATURAS (APPLICATIONS) ====================

export const applyToJob = async (applicationData) => {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(applicationData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao candidatar-se');
  }
  
  return response.json();
};

export const getCompanyApplications = async (companyId) => {
  const response = await fetch(`${API_BASE_URL}/applications/company/${companyId}`, {
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar candidatos');
  }
  
  return response.json();
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao atualizar candidatura');
  }
  
  return response.json();
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
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao deletar candidatura');
  }
  
  return response.json();
};

// ==================== UPLOAD DE CURRÍCULO ====================

export const uploadResume = async (file, userId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);

  const response = await fetch(`${API_BASE_URL}/upload-resume`, {
    method: 'POST',
    // No auth header for local backend; content-type is set automatically for FormData
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao fazer upload do currículo');
  }
  
  return response.json();
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