import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, Zap, Sun, Thermometer } from "lucide-react";

interface IVData {
  voltage: number;
  current: number;
  voltageStc: number;
  currentStc: number;
  power: number;
  powerStc: number;
}

interface CurveData {
  fileName: string;
  data: IVData[];
  irradiance: number;
  temperature: number;
  maxPower: number;
  maxPowerStc: number;
  voc: number;
  isc: number;
  vmp: number;
  imp: number;
}

interface IVCurveChartProps {
  csvFiles: File[];
}

export const IVCurveChart = ({ csvFiles }: IVCurveChartProps) => {
  const [curveData, setCurveData] = useState<CurveData[]>([]);
  const [selectedCurve, setSelectedCurve] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (csvFiles.length > 0) {
      processCsvFiles();
    }
  }, [csvFiles]);

  const processCsvFiles = async () => {
    setLoading(true);
    const processedData: CurveData[] = [];

    for (const file of csvFiles) {
      try {
        const text = await file.text();
        const lines = text.split('\n');
        
        // Skip header and process data
        const dataLines = lines.slice(1).filter(line => line.trim());
        
        const ivData: IVData[] = [];
        let irradiance = 1000; // Default STC
        let temperature = 25; // Default STC
        
        for (const line of dataLines) {
          const values = line.split(',').map(v => v.trim());
          
          if (values.length >= 4) {
            const voltage = parseFloat(values[0]) || 0;
            const current = parseFloat(values[1]) || 0;
            const voltageStc = parseFloat(values[2]) || voltage;
            const currentStc = parseFloat(values[3]) || current;
            
            // Extract irradiance and temperature if available
            if (values.length > 4) {
              irradiance = parseFloat(values[4]) || irradiance;
            }
            if (values.length > 5) {
              temperature = parseFloat(values[5]) || temperature;
            }
            
            ivData.push({
              voltage,
              current,
              voltageStc,
              currentStc,
              power: voltage * current,
              powerStc: voltageStc * currentStc,
            });
          }
        }

        // Calculate key parameters
        const maxPowerPoint = ivData.reduce((max, curr) => 
          curr.power > max.power ? curr : max, ivData[0] || { power: 0, voltage: 0, current: 0 });
        
        const maxPowerPointStc = ivData.reduce((max, curr) => 
          curr.powerStc > max.powerStc ? curr : max, ivData[0] || { powerStc: 0, voltageStc: 0, currentStc: 0 });

        const voc = Math.max(...ivData.map(d => d.voltage));
        const isc = Math.max(...ivData.map(d => d.current));

        processedData.push({
          fileName: file.name,
          data: ivData,
          irradiance,
          temperature,
          maxPower: maxPowerPoint.power,
          maxPowerStc: maxPowerPointStc.powerStc,
          voc,
          isc,
          vmp: maxPowerPoint.voltage,
          imp: maxPowerPoint.current,
        });
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }

    setCurveData(processedData);
    if (processedData.length > 0) {
      setSelectedCurve(processedData[0].fileName);
    }
    setLoading(false);
  };

  const selectedData = curveData.find(d => d.fileName === selectedCurve);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Activity className="mx-auto h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Processando arquivos CSV...</p>
        </div>
      </div>
    );
  }

  if (curveData.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Nenhum arquivo CSV válido encontrado para análise.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* File Selection */}
      <div className="flex flex-wrap gap-2">
        {curveData.map((curve) => (
          <Badge
            key={curve.fileName}
            variant={selectedCurve === curve.fileName ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCurve(curve.fileName)}
          >
            {curve.fileName.replace('.csv', '')}
          </Badge>
        ))}
      </div>

      {selectedData && (
        <>
          {/* Key Parameters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-solar-gold" />
                  <div>
                    <p className="text-sm text-muted-foreground">Irradiância</p>
                    <p className="text-lg font-bold">{selectedData.irradiance.toFixed(0)} W/m²</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-destructive" />
                  <div>
                    <p className="text-sm text-muted-foreground">Temperatura</p>
                    <p className="text-lg font-bold">{selectedData.temperature.toFixed(1)}°C</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pmax (Medido)</p>
                    <p className="text-lg font-bold">{selectedData.maxPower.toFixed(1)} W</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pmax (STC)</p>
                    <p className="text-lg font-bold">{selectedData.maxPowerStc.toFixed(1)} W</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="iv-curve" className="w-full">
            <TabsList>
              <TabsTrigger value="iv-curve">Curva I-V</TabsTrigger>
              <TabsTrigger value="pv-curve">Curva P-V</TabsTrigger>
            </TabsList>

            <TabsContent value="iv-curve">
              <Card>
                <CardHeader>
                  <CardTitle>Curva Corrente vs Tensão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedData.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="voltage" 
                          label={{ value: 'Tensão (V)', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          label={{ value: 'Corrente (A)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            `${value.toFixed(2)} ${name.includes('current') ? 'A' : 'V'}`,
                            name.includes('Stc') ? 'STC' : 'Medido'
                          ]}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="current" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          name="Corrente Medida"
                          dot={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="currentStc" 
                          stroke="hsl(var(--success-green))" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Corrente STC"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pv-curve">
              <Card>
                <CardHeader>
                  <CardTitle>Curva Potência vs Tensão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedData.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="voltage" 
                          label={{ value: 'Tensão (V)', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          label={{ value: 'Potência (W)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            `${value.toFixed(2)} W`,
                            name.includes('Stc') ? 'STC' : 'Medido'
                          ]}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="power" 
                          stroke="hsl(var(--solar-gold))" 
                          strokeWidth={2}
                          name="Potência Medida"
                          dot={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="powerStc" 
                          stroke="hsl(var(--success-green))" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Potência STC"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros Elétricos Extraídos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">Voc (V)</p>
                  <p>{selectedData.voc.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Isc (A)</p>
                  <p>{selectedData.isc.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Vmp (V)</p>
                  <p>{selectedData.vmp.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Imp (A)</p>
                  <p>{selectedData.imp.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};