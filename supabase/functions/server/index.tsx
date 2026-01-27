import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
};

// Health check endpoint
app.get("/make-server-5af427a5/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== VAGAS (JOBS) ====================

// Criar nova vaga
app.post("/make-server-5af427a5/jobs", async (c) => {
  try {
    const body = await c.req.json();
    const { companyId, title, description, area, type, location, salary, requirements } = body;

    if (!companyId || !title || !area || !type) {
      return c.json({ error: "Campos obrigatórios faltando" }, 400);
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const job = {
      id: jobId,
      companyId,
      title,
      description: description || "",
      area,
      type,
      location: location || "",
      salary: salary || "",
      requirements: requirements || [],
      active: true,
      applicants: 0,
      createdAt: new Date().toISOString(),
    };

    await kv.set(jobId, job);
    
    console.log(`Job created successfully: ${jobId} by company ${companyId}`);
    return c.json({ success: true, job });
  } catch (error) {
    console.error("Error creating job:", error);
    return c.json({ error: "Erro ao criar vaga: " + error.message }, 500);
  }
});

// Listar vagas de uma empresa
app.get("/make-server-5af427a5/jobs/company/:companyId", async (c) => {
  try {
    const companyId = c.req.param("companyId");
    const allJobs = await kv.getByPrefix("job_");
    
    const companyJobs = allJobs
      .filter(job => job.companyId === companyId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ jobs: companyJobs });
  } catch (error) {
    console.error("Error fetching company jobs:", error);
    return c.json({ error: "Erro ao buscar vagas: " + error.message }, 500);
  }
});

// Listar todas as vagas ativas (para estudantes)
app.get("/make-server-5af427a5/jobs", async (c) => {
  try {
    const allJobs = await kv.getByPrefix("job_");
    
    const activeJobs = allJobs
      .filter(job => job.active === true)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ jobs: activeJobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return c.json({ error: "Erro ao buscar vagas: " + error.message }, 500);
  }
});

// Atualizar vaga
app.put("/make-server-5af427a5/jobs/:jobId", async (c) => {
  try {
    const jobId = c.req.param("jobId");
    const body = await c.req.json();
    
    const existingJob = await kv.get(jobId);
    if (!existingJob) {
      return c.json({ error: "Vaga não encontrada" }, 404);
    }

    const updatedJob = {
      ...existingJob,
      ...body,
      id: jobId, // Garantir que o ID não mude
      createdAt: existingJob.createdAt, // Manter data de criação
    };

    await kv.set(jobId, updatedJob);
    
    console.log(`Job updated successfully: ${jobId}`);
    return c.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error("Error updating job:", error);
    return c.json({ error: "Erro ao atualizar vaga: " + error.message }, 500);
  }
});

// Deletar vaga
app.delete("/make-server-5af427a5/jobs/:jobId", async (c) => {
  try {
    const jobId = c.req.param("jobId");
    
    const existingJob = await kv.get(jobId);
    if (!existingJob) {
      return c.json({ error: "Vaga não encontrada" }, 404);
    }

    await kv.del(jobId);
    
    console.log(`Job deleted successfully: ${jobId}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting job:", error);
    return c.json({ error: "Erro ao deletar vaga: " + error.message }, 500);
  }
});

// ==================== CANDIDATURAS (APPLICATIONS) ====================

// Candidatar-se a uma vaga
app.post("/make-server-5af427a5/applications", async (c) => {
  try {
    const body = await c.req.json();
    const { jobId, candidateId, candidateData } = body;

    if (!jobId || !candidateId || !candidateData) {
      return c.json({ error: "Campos obrigatórios faltando" }, 400);
    }

    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const application = {
      id: applicationId,
      jobId,
      candidateId,
      ...candidateData,
      status: "pending",
      appliedDate: new Date().toISOString(),
    };

    await kv.set(applicationId, application);

    // Atualizar contador de candidatos na vaga
    const job = await kv.get(jobId);
    if (job) {
      job.applicants = (job.applicants || 0) + 1;
      await kv.set(jobId, job);
    }
    
    console.log(`Application created successfully: ${applicationId} for job ${jobId}`);
    return c.json({ success: true, application });
  } catch (error) {
    console.error("Error creating application:", error);
    return c.json({ error: "Erro ao candidatar-se: " + error.message }, 500);
  }
});

// Listar candidatos de uma empresa
app.get("/make-server-5af427a5/applications/company/:companyId", async (c) => {
  try {
    const companyId = c.req.param("companyId");
    
    // Buscar todas as vagas da empresa
    const allJobs = await kv.getByPrefix("job_");
    const companyJobIds = allJobs
      .filter(job => job.companyId === companyId)
      .map(job => job.id);

    // Buscar todas as candidaturas
    const allApplications = await kv.getByPrefix("app_");
    
    // Filtrar candidaturas das vagas da empresa
    const companyApplications = allApplications
      .filter(app => companyJobIds.includes(app.jobId))
      .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());

    return c.json({ applications: companyApplications });
  } catch (error) {
    console.error("Error fetching company applications:", error);
    return c.json({ error: "Erro ao buscar candidatos: " + error.message }, 500);
  }
});

// Atualizar status de candidatura (aprovar/rejeitar)
app.put("/make-server-5af427a5/applications/:applicationId", async (c) => {
  try {
    const applicationId = c.req.param("applicationId");
    const body = await c.req.json();
    const { status } = body;

    const existingApp = await kv.get(applicationId);
    if (!existingApp) {
      return c.json({ error: "Candidatura não encontrada" }, 404);
    }

    const updatedApp = {
      ...existingApp,
      status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(applicationId, updatedApp);
    
    console.log(`Application updated successfully: ${applicationId} - status: ${status}`);
    return c.json({ success: true, application: updatedApp });
  } catch (error) {
    console.error("Error updating application:", error);
    return c.json({ error: "Erro ao atualizar candidatura: " + error.message }, 500);
  }
});

// Deletar candidatura (remover da lista de rejeitados)
app.delete("/make-server-5af427a5/applications/:applicationId", async (c) => {
  try {
    const applicationId = c.req.param("applicationId");
    
    const existingApp = await kv.get(applicationId);
    if (!existingApp) {
      return c.json({ error: "Candidatura não encontrada" }, 404);
    }

    await kv.del(applicationId);
    
    console.log(`Application deleted successfully: ${applicationId}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting application:", error);
    return c.json({ error: "Erro ao deletar candidatura: " + error.message }, 500);
  }
});

// ==================== STORAGE (CURRÍCULOS) ====================

// Criar bucket de currículos se não existir
const initStorage = async () => {
  try {
    const supabase = getSupabaseClient();
    const bucketName = 'make-5af427a5-resumes';
    
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 5242880, // 5MB
      });
      console.log(`Storage bucket created: ${bucketName}`);
    }
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
};

// Inicializar storage ao iniciar o servidor
initStorage();

// Upload de currículo
app.post("/make-server-5af427a5/upload-resume", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const body = await c.req.parseBody();
    const file = body['file'] as File;
    const userId = body['userId'] as string;

    if (!file || !userId) {
      return c.json({ error: "Arquivo ou userId faltando" }, 400);
    }

    const bucketName = 'make-5af427a5-resumes';
    const fileName = `${userId}_${Date.now()}_${file.name}`;
    
    const fileBuffer = await file.arrayBuffer();
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Error uploading resume:", error);
      return c.json({ error: "Erro ao fazer upload: " + error.message }, 500);
    }

    // Criar URL assinada (válida por 1 ano)
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000); // 1 ano em segundos

    console.log(`Resume uploaded successfully: ${fileName}`);
    return c.json({ 
      success: true, 
      fileName,
      resumeUrl: signedUrlData?.signedUrl || '',
    });
  } catch (error) {
    console.error("Error in upload-resume endpoint:", error);
    return c.json({ error: "Erro ao processar upload: " + error.message }, 500);
  }
});

Deno.serve(app.fetch);