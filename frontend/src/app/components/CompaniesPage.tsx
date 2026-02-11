import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { mockCompanies } from '@/app/data/mockData';
import { Briefcase, Users, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/app/components/ui/progress';
import techImage from '@/assets/partners/partner-1.png';
import marketingImage from '@/assets/partners/partner-2.jpg';
import designImage from '@/assets/partners/partner-3.jpg';

const companyTypeImages: Record<string, string> = {
  Tecnologia: techImage,
  Marketing: marketingImage,
  Design: designImage,
};

export function CompaniesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Empresas Parceiras</h1>
        <p className="text-muted-foreground">Conheça as empresas que contratam pela nossa plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCompanies.map((company) => (
          <Card key={company.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-lg border bg-muted">
                    <img
                      className="h-full w-full object-cover"
                      src={companyTypeImages[company.type] || techImage}
                      alt={`Logo ${company.name}`}
                    />
                  </div>
                  <div>
                    <CardTitle>{company.name}</CardTitle>
                    <CardDescription>{company.type}</CardDescription>
                    {company.verified && (
                      <Badge variant="secondary" className="mt-1">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verificada
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{company.openPositions} vagas abertas</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{company.hires} contratações realizadas</span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-muted-foreground">Confiabilidade</span>
                  <span className="font-medium">95%</span>
                </div>
                <Progress value={95} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
