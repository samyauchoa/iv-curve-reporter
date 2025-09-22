import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/FileUpload";
import { IVCurveChart } from "@/components/IVCurveChart";
import { ReportGenerator } from "@/components/ReportGenerator";
import { Zap, Upload, BarChart3, FileText } from "lucide-react";

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

const Index = () => {
  const [plantData, setPlantData] = useState<PlantData>({
    name: "",
    inverterCount: 0,
    modulesPerString: 0,
    nominalPower: 0,
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    csvFiles: [],
  });
  
  const [activeTab, setActiveTab] = useState("plant-data");
  const { toast } = useToast();

  const handlePlantDataChange = (field: keyof PlantData, value: string | number) => {
    setPlantData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canProceedToAnalysis = () => {
    return plantData.name && 
           plantData.inverterCount > 0 && 
           plantData.modulesPerString > 0 && 
           plantData.nominalPower > 0 &&
           uploadedFiles.datasheet &&
           uploadedFiles.csvFiles.length > 0;
  };

  const handleGenerateReport = () => {
    if (canProceedToAnalysis()) {
      toast({
        title: "Relatório Gerado!",
        description: "O relatório de curvas IV foi gerado com sucesso.",
      });
    } else {
      toast({
        title: "Dados Incompletos",
        description: "Preencha todos os campos e faça upload dos arquivos necessários.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-solar-blue to-solar-gold rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Gerador de Relatórios IV
              </h1>
              <p className="text-muted-foreground">
                Sistema automatizado para análise de curvas I-V em módulos fotovoltaicos
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="plant-data" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Dados da Usina
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Análise
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Relatório
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plant-data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Instalação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plant-name">Nome da Usina</Label>
                    <Input
                      id="plant-name"
                      value={plantData.name}
                      onChange={(e) => handlePlantDataChange("name", e.target.value)}
                      placeholder="Ex: Usina Solar Brasília"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="inverter-count">Quantidade de Inversores</Label>
                    <Input
                      id="inverter-count"
                      type="number"
                      value={plantData.inverterCount || ""}
                      onChange={(e) => handlePlantDataChange("inverterCount", parseInt(e.target.value) || 0)}
                      placeholder="Ex: 10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="modules-per-string">Módulos por String</Label>
                    <Input
                      id="modules-per-string"
                      type="number"
                      value={plantData.modulesPerString || ""}
                      onChange={(e) => handlePlantDataChange("modulesPerString", parseInt(e.target.value) || 0)}
                      placeholder="Ex: 24"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nominal-power">Potência Nominal (Wp)</Label>
                    <Input
                      id="nominal-power"
                      type="number"
                      value={plantData.nominalPower || ""}
                      onChange={(e) => handlePlantDataChange("nominalPower", parseInt(e.target.value) || 0)}
                      placeholder="Ex: 540"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload de Arquivos</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload 
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise das Curvas I-V</CardTitle>
              </CardHeader>
              <CardContent>
                {canProceedToAnalysis() ? (
                  <IVCurveChart csvFiles={uploadedFiles.csvFiles} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Complete o upload dos arquivos e os dados da usina para visualizar a análise.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Geração do Relatório</CardTitle>
              </CardHeader>
              <CardContent>
                {canProceedToAnalysis() ? (
                  <ReportGenerator 
                    plantData={plantData}
                    uploadedFiles={uploadedFiles}
                  />
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <p className="text-muted-foreground">
                      Complete todas as etapas anteriores para gerar o relatório.
                    </p>
                    <Button 
                      onClick={() => setActiveTab("plant-data")}
                      variant="outline"
                    >
                      Voltar aos Dados da Usina
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;