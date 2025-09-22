import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Calendar, 
  Building2, 
  Zap,
  BarChart3,
  FileDown 
} from "lucide-react";

interface PlantData {
  name: string;
  inverterCount: number;
  modulesPerString: number;
  nominalPower: number;
}

interface UploadedFiles {
  datasheet?: File;
  csvFiles: File[];
}

interface ReportGeneratorProps {
  plantData: PlantData;
  uploadedFiles: UploadedFiles;
}

export const ReportGenerator = ({ plantData, uploadedFiles }: ReportGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGenerating(false);
    setReportGenerated(true);
    
    toast({
      title: "Relatório Gerado!",
      description: "O relatório de curvas I-V foi criado com sucesso.",
    });
  };

  const downloadReport = (format: 'pdf' | 'docx') => {
    // In a real implementation, this would generate and download the actual file
    toast({
      title: `Download ${format.toUpperCase()}`,
      description: `Relatório sendo baixado em formato ${format.toUpperCase()}.`,
    });
  };

  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="space-y-6">
      {/* Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Prévia do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Header Info */}
          <div className="border rounded-lg p-4 bg-secondary/20">
            <h3 className="text-lg font-bold text-center mb-4">
              RELATÓRIO DE ENSAIO DE CURVAS I-V
            </h3>
            <div className="text-center space-y-1">
              <p className="font-medium text-lg">{plantData.name}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Data do Ensaio: {currentDate}</span>
              </div>
            </div>
          </div>

          {/* Plant Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Inversores</p>
                <p className="font-bold">{plantData.inverterCount}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
              <Zap className="h-5 w-5 text-solar-gold" />
              <div>
                <p className="text-sm text-muted-foreground">Módulos/String</p>
                <p className="font-bold">{plantData.modulesPerString}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
              <BarChart3 className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Potência Nominal</p>
                <p className="font-bold">{plantData.nominalPower} Wp</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Files Summary */}
          <div className="space-y-3">
            <h4 className="font-medium">Arquivos Processados</h4>
            
            {uploadedFiles.datasheet && (
              <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded border border-destructive/20">
                <FileText className="h-4 w-4 text-destructive" />
                <span className="text-sm">Datasheet: {uploadedFiles.datasheet.name}</span>
                <Badge variant="outline" className="ml-auto">PDF</Badge>
              </div>
            )}
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Arquivos de Curva IV ({uploadedFiles.csvFiles.length}):</p>
              {uploadedFiles.csvFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-success/10 rounded border border-success/20">
                  <FileText className="h-4 w-4 text-success" />
                  <span className="text-sm">{file.name}</span>
                  <Badge variant="outline" className="ml-auto">CSV</Badge>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Report Sections Preview */}
          <div className="space-y-2">
            <h4 className="font-medium">Seções do Relatório</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>1. Introdução e Objetivos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>2. Equipamentos Utilizados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>3. Dados Elétricos do Módulo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>4. Resultados das Medições</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>5. Gráficos I-V e P-V</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>6. Análise Comparativa</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>7. Conclusões e Observações</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>8. Anexos (Dados Brutos)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Gerar Relatório</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!reportGenerated ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Clique no botão abaixo para gerar o relatório completo com análises, 
                gráficos e conclusões automáticas.
              </p>
              <Button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                size="lg"
                className="w-full md:w-auto"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Gerando Relatório...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar Relatório Completo
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
                <CheckCircle className="mx-auto h-8 w-8 text-success mb-2" />
                <p className="font-medium text-success">Relatório Gerado com Sucesso!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Seu relatório técnico está pronto para download
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => downloadReport('pdf')}
                  variant="default"
                  className="flex items-center gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  Download PDF
                </Button>
                
                <Button 
                  onClick={() => downloadReport('docx')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download DOCX
                </Button>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => {
                    setReportGenerated(false);
                    setIsGenerating(false);
                  }}
                  variant="ghost"
                  size="sm"
                >
                  Gerar Novo Relatório
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Equipment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Equipamento Utilizado</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p><strong>Traçador de Curva I-V:</strong> Modelo E-1500, 35A</p>
          <p><strong>Norma de Referência:</strong> IEC 61215</p>
          <p><strong>Condições STC:</strong> 1000 W/m², 25°C, AM 1.5</p>
        </CardContent>
      </Card>
    </div>
  );
};