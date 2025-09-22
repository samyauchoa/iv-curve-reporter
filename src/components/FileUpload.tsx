import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X, CheckCircle, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFiles {
  datasheet?: File;
  csvFiles: File[];
}

interface FileUploadProps {
  uploadedFiles: UploadedFiles;
  setUploadedFiles: (files: UploadedFiles) => void;
}

export const FileUpload = ({ uploadedFiles, setUploadedFiles }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  }, []);

  const processFiles = (files: File[]) => {
    const pdfFiles = files.filter(file => file.type === "application/pdf");
    const csvFiles = files.filter(file => 
      file.type === "text/csv" || 
      file.name.endsWith('.csv') ||
      file.type === "application/vnd.ms-excel" ||
      file.name.endsWith('.xlsx')
    );

    if (pdfFiles.length > 1) {
      toast({
        title: "Aviso",
        description: "Apenas um arquivo PDF de datasheet é permitido. Usando o primeiro arquivo.",
        variant: "default",
      });
    }

    setUploadedFiles({
      datasheet: pdfFiles[0] || uploadedFiles.datasheet,
      csvFiles: [...uploadedFiles.csvFiles, ...csvFiles],
    });

    if (pdfFiles.length > 0 || csvFiles.length > 0) {
      toast({
        title: "Arquivos carregados!",
        description: `${pdfFiles.length} datasheet(s) e ${csvFiles.length} arquivo(s) CSV carregados.`,
      });
    }
  };

  const removeFile = (type: 'datasheet' | 'csv', index?: number) => {
    if (type === 'datasheet') {
      setUploadedFiles({
        ...uploadedFiles,
        datasheet: undefined,
      });
    } else if (type === 'csv' && index !== undefined) {
      const newCsvFiles = uploadedFiles.csvFiles.filter((_, i) => i !== index);
      setUploadedFiles({
        ...uploadedFiles,
        csvFiles: newCsvFiles,
      });
    }
  };

  const handleDatasheetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter(file => file.type === "application/pdf");
    
    if (pdfFiles.length > 0) {
      setUploadedFiles({
        ...uploadedFiles,
        datasheet: pdfFiles[0],
      });
      
      toast({
        title: "Datasheet carregado!",
        description: `Arquivo ${pdfFiles[0].name} carregado com sucesso.`,
      });
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const csvFiles = files.filter(file => 
      file.type === "text/csv" || 
      file.name.endsWith('.csv') ||
      file.type === "application/vnd.ms-excel" ||
      file.name.endsWith('.xlsx')
    );
    
    if (csvFiles.length > 0) {
      setUploadedFiles({
        ...uploadedFiles,
        csvFiles: [...uploadedFiles.csvFiles, ...csvFiles],
      });
      
      toast({
        title: "Arquivos CSV carregados!",
        description: `${csvFiles.length} arquivo(s) de curva IV carregados.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Datasheet Upload */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Datasheet do Módulo Fotovoltaico
            </h3>
            <p className="text-muted-foreground mb-4">
              Faça upload do arquivo PDF com as especificações técnicas do módulo
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleDatasheetUpload}
              className="hidden"
              id="datasheet-upload"
            />
            <label htmlFor="datasheet-upload">
              <Button variant="outline" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Selecionar Datasheet (PDF)
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* CSV Upload */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-success mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Arquivos de Curva I-V
            </h3>
            <p className="text-muted-foreground mb-4">
              Faça upload dos arquivos CSV/Excel gerados pelo traçador de curva I-V
            </p>
            <input
              type="file"
              multiple
              accept=".csv,.xlsx,.xls"
              onChange={handleCsvUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button variant="outline" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Selecionar Arquivos CSV/Excel
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files Display */}
      <div className="space-y-4">
        {/* Datasheet */}
        {uploadedFiles.datasheet && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium">Datasheet</p>
                    <p className="text-sm text-muted-foreground">
                      {uploadedFiles.datasheet.name}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    PDF
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile('datasheet')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CSV Files */}
        {uploadedFiles.csvFiles.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">
                Arquivos de Curva IV ({uploadedFiles.csvFiles.length})
              </h4>
              <div className="space-y-2">
                {uploadedFiles.csvFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-success" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="outline" className="text-xs">
                        CSV
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile('csv', index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Summary */}
        {(uploadedFiles.datasheet || uploadedFiles.csvFiles.length > 0) && (
          <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
            <CheckCircle className="mx-auto h-6 w-6 text-success mb-2" />
            <p className="text-sm text-success">
              Arquivos carregados com sucesso! 
              {uploadedFiles.datasheet && " ✓ Datasheet"}
              {uploadedFiles.csvFiles.length > 0 && ` ✓ ${uploadedFiles.csvFiles.length} arquivo(s) CSV`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};