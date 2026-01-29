import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5af427a5`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
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
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao fazer upload do currículo');
  }
  
  return response.json();
};