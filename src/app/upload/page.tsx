'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Upload,
    FileSpreadsheet,
    BarChart3,
    PieChart,
    TrendingUp,
    Table2,
    AlertCircle,
    Check,
    X,
    Loader2,
    Download,
    Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sampleDataset } from '@/lib/mockData';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface DatasetRow {
    [key: string]: string | number;
}

interface ColumnStats {
    name: string;
    type: 'number' | 'string';
    count: number;
    nullCount: number;
    uniqueCount: number;
    mean?: number;
    median?: number;
    min?: number;
    max?: number;
    std?: number;
}

export default function UploadPage() {
    const [data, setData] = useState<DatasetRow[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [activeChart, setActiveChart] = useState<'histogram' | 'boxplot' | 'scatter' | 'line' | 'correlation'>('histogram');
    const [selectedColumn, setSelectedColumn] = useState<string>('');
    const [selectedXColumn, setSelectedXColumn] = useState<string>('');
    const [selectedYColumn, setSelectedYColumn] = useState<string>('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsLoading(true);
        setFileName(file.name);

        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                const parsedData = results.data as DatasetRow[];
                const validData = parsedData.filter((row) =>
                    Object.values(row).some((val) => val !== null && val !== '')
                );
                const cols = results.meta.fields || [];

                setData(validData);
                setColumns(cols);
                setSelectedColumn(cols[0] || '');
                setSelectedXColumn(cols[0] || '');
                setSelectedYColumn(cols[1] || cols[0] || '');
                setIsLoading(false);
            },
            error: () => {
                setIsLoading(false);
            },
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
        },
        maxFiles: 1,
    });

    // Load sample dataset
    const loadSampleData = () => {
        setIsLoading(true);
        setFileName('sample_data.csv');

        setTimeout(() => {
            const cols = Object.keys(sampleDataset[0]);
            setData(sampleDataset as DatasetRow[]);
            setColumns(cols);
            setSelectedColumn(cols[0] || '');
            setSelectedXColumn(cols[0] || '');
            setSelectedYColumn(cols[1] || cols[0] || '');
            setIsLoading(false);
        }, 500);
    };

    // Calculate column statistics
    const columnStats: ColumnStats[] = useMemo(() => {
        if (data.length === 0) return [];

        return columns.map((col) => {
            const values = data.map((row) => row[col]);
            const numericValues = values.filter((v) => typeof v === 'number' && !isNaN(v as number)) as number[];
            const isNumeric = numericValues.length > values.length * 0.5;

            const stats: ColumnStats = {
                name: col,
                type: isNumeric ? 'number' : 'string',
                count: values.length,
                nullCount: values.filter((v) => v === null || v === '' || v === undefined).length,
                uniqueCount: new Set(values).size,
            };

            if (isNumeric && numericValues.length > 0) {
                const sorted = [...numericValues].sort((a, b) => a - b);
                stats.mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
                stats.median = sorted[Math.floor(sorted.length / 2)];
                stats.min = Math.min(...numericValues);
                stats.max = Math.max(...numericValues);

                const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - stats.mean!, 2), 0) / numericValues.length;
                stats.std = Math.sqrt(variance);
            }

            return stats;
        });
    }, [data, columns]);

    const numericColumns = columnStats.filter((c) => c.type === 'number').map((c) => c.name);

    const clearData = () => {
        setData([]);
        setColumns([]);
        setFileName('');
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-x-hidden">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold mb-2">
                        <span className="text-gradient">Dataset Analysis</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Upload a CSV file to explore, analyze, and visualize your data
                    </p>
                </motion.div>

                {data.length === 0 ? (
                    /* Upload Area */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div
                            {...getRootProps()}
                            className={cn(
                                "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all",
                                isDragActive
                                    ? "border-primary bg-primary/10"
                                    : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                            )}
                        >
                            <input {...getInputProps()} />
                            <motion.div
                                animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 glow">
                                    {isLoading ? (
                                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                                    ) : (
                                        <Upload className="w-10 h-10 text-white" />
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {isDragActive ? 'Drop your file here' : 'Drag & drop your CSV file'}
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    or click to browse your files
                                </p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <FileSpreadsheet className="w-4 h-4" />
                                    Supports CSV files
                                </div>
                            </motion.div>
                        </div>

                        <div className="flex items-center justify-center gap-4 mt-6">
                            <span className="text-muted-foreground">or</span>
                            <Button variant="outline" onClick={loadSampleData} disabled={isLoading}>
                                <Download className="w-4 h-4 mr-2" />
                                Load Sample Dataset
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    /* Analysis View */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* File Info Bar */}
                        <div className="flex items-center justify-between glass-card p-4">
                            <div className="flex items-center gap-3">
                                <FileSpreadsheet className="w-8 h-8 text-primary" />
                                <div>
                                    <h3 className="font-semibold">{fileName}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {data.length} rows × {columns.length} columns
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={clearData}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="overview" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                                <TabsTrigger value="overview">
                                    <Table2 className="w-4 h-4 mr-2 hidden sm:inline" />
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger value="stats">
                                    <BarChart3 className="w-4 h-4 mr-2 hidden sm:inline" />
                                    Statistics
                                </TabsTrigger>
                                <TabsTrigger value="visualize">
                                    <PieChart className="w-4 h-4 mr-2 hidden sm:inline" />
                                    Visualize
                                </TabsTrigger>
                                <TabsTrigger value="quality">
                                    <AlertCircle className="w-4 h-4 mr-2 hidden sm:inline" />
                                    Quality
                                </TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Data Preview</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="w-full whitespace-nowrap rounded-md">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        {columns.map((col) => (
                                                            <TableHead key={col} className="font-semibold">
                                                                {col}
                                                            </TableHead>
                                                        ))}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {data.slice(0, 10).map((row, i) => (
                                                        <TableRow key={i}>
                                                            {columns.map((col) => (
                                                                <TableCell key={col}>
                                                                    {String(row[col] ?? '-')}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                            <ScrollBar orientation="horizontal" />
                                        </ScrollArea>
                                        {data.length > 10 && (
                                            <p className="text-sm text-muted-foreground mt-4 text-center">
                                                Showing first 10 of {data.length} rows
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Statistics Tab */}
                            <TabsContent value="stats">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {columnStats.map((stat) => (
                                        <Card key={stat.name}>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base flex items-center justify-between">
                                                    {stat.name}
                                                    <span className={cn(
                                                        "text-xs px-2 py-0.5 rounded-full",
                                                        stat.type === 'number'
                                                            ? "bg-primary/20 text-primary"
                                                            : "bg-accent/20 text-accent"
                                                    )}>
                                                        {stat.type}
                                                    </span>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Count:</span>
                                                        <span className="ml-2 font-medium">{stat.count}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Unique:</span>
                                                        <span className="ml-2 font-medium">{stat.uniqueCount}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Nulls:</span>
                                                        <span className={cn(
                                                            "ml-2 font-medium",
                                                            stat.nullCount > 0 && "text-amber-500"
                                                        )}>
                                                            {stat.nullCount}
                                                        </span>
                                                    </div>
                                                    {stat.type === 'number' && (
                                                        <>
                                                            <div>
                                                                <span className="text-muted-foreground">Mean:</span>
                                                                <span className="ml-2 font-medium">{stat.mean?.toFixed(2)}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Min:</span>
                                                                <span className="ml-2 font-medium">{stat.min?.toFixed(2)}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Max:</span>
                                                                <span className="ml-2 font-medium">{stat.max?.toFixed(2)}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Std:</span>
                                                                <span className="ml-2 font-medium">{stat.std?.toFixed(2)}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Median:</span>
                                                                <span className="ml-2 font-medium">{stat.median?.toFixed(2)}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Visualize Tab */}
                            <TabsContent value="visualize">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Data Visualization</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Chart Type Selection */}
                                        <div className="flex flex-wrap items-center gap-4 mb-6">
                                            <div className="flex gap-2">
                                                {[
                                                    { id: 'histogram', label: 'Histogram', icon: BarChart3 },
                                                    { id: 'boxplot', label: 'Box Plot', icon: TrendingUp },
                                                    { id: 'scatter', label: 'Scatter', icon: PieChart },
                                                    { id: 'correlation', label: 'Correlation', icon: Table2 },
                                                ].map((chart) => (
                                                    <Button
                                                        key={chart.id}
                                                        variant={activeChart === chart.id ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => setActiveChart(chart.id as typeof activeChart)}
                                                        className={activeChart === chart.id ? 'bg-gradient-primary' : ''}
                                                    >
                                                        <chart.icon className="w-4 h-4 mr-1" />
                                                        {chart.label}
                                                    </Button>
                                                ))}
                                            </div>

                                            {/* Column Selectors */}
                                            {(activeChart === 'histogram' || activeChart === 'boxplot') && (
                                                <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                                                    <SelectTrigger className="w-40">
                                                        <SelectValue placeholder="Select column" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {numericColumns.map((col) => (
                                                            <SelectItem key={col} value={col}>{col}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}

                                            {activeChart === 'scatter' && (
                                                <>
                                                    <Select value={selectedXColumn} onValueChange={setSelectedXColumn}>
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue placeholder="X axis" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {numericColumns.map((col) => (
                                                                <SelectItem key={col} value={col}>{col}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <span className="text-muted-foreground">vs</span>
                                                    <Select value={selectedYColumn} onValueChange={setSelectedYColumn}>
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue placeholder="Y axis" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {numericColumns.map((col) => (
                                                                <SelectItem key={col} value={col}>{col}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </>
                                            )}
                                        </div>

                                        {/* Charts */}
                                        <div className="rounded-xl overflow-hidden bg-card/50 border border-border/50">
                                            {activeChart === 'histogram' && selectedColumn && (
                                                <HistogramChart data={data} column={selectedColumn} />
                                            )}
                                            {activeChart === 'boxplot' && selectedColumn && (
                                                <BoxPlotChart data={data} column={selectedColumn} />
                                            )}
                                            {activeChart === 'scatter' && selectedXColumn && selectedYColumn && (
                                                <ScatterChart data={data} xColumn={selectedXColumn} yColumn={selectedYColumn} />
                                            )}
                                            {activeChart === 'correlation' && (
                                                <CorrelationHeatmap data={data} columns={numericColumns} />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Quality Tab */}
                            <TabsContent value="quality">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Missing Values */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Missing Values</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <MissingValuesChart stats={columnStats} />
                                        </CardContent>
                                    </Card>

                                    {/* Data Quality Summary */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Quality Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {columnStats.map((stat) => {
                                                    const qualityScore = ((stat.count - stat.nullCount) / stat.count) * 100;
                                                    return (
                                                        <div key={stat.name} className="flex items-center gap-4">
                                                            <div className="w-32 truncate font-medium">{stat.name}</div>
                                                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                                <div
                                                                    className={cn(
                                                                        "h-full rounded-full transition-all",
                                                                        qualityScore >= 90 ? "bg-emerald-500" :
                                                                            qualityScore >= 70 ? "bg-amber-500" :
                                                                                "bg-red-500"
                                                                    )}
                                                                    style={{ width: `${qualityScore}%` }}
                                                                />
                                                            </div>
                                                            <div className="w-12 text-right text-sm">
                                                                {qualityScore.toFixed(0)}%
                                                            </div>
                                                            {qualityScore === 100 ? (
                                                                <Check className="w-4 h-4 text-emerald-500" />
                                                            ) : (
                                                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                )}
            </main>
        </div>
    );
}

// Chart Components
function HistogramChart({ data, column }: { data: DatasetRow[]; column: string }) {
    const values = data.map((row) => row[column]).filter((v) => typeof v === 'number') as number[];

    return (
        <Plot
            data={[
                {
                    x: values,
                    type: 'histogram',
                    marker: {
                        color: 'rgb(139, 92, 246)',
                    },
                },
            ]}
            layout={{
                title: { text: `Distribution of ${column}`, font: { color: '#e5e5e5' } },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'rgba(0,0,0,0.2)',
                xaxis: { title: column, gridcolor: 'rgba(255,255,255,0.1)', color: '#a3a3a3' },
                yaxis: { title: 'Frequency', gridcolor: 'rgba(255,255,255,0.1)', color: '#a3a3a3' },
                margin: { t: 50, b: 50, l: 60, r: 30 },
            } as any}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: '400px' }}
        />
    );
}

function BoxPlotChart({ data, column }: { data: DatasetRow[]; column: string }) {
    const values = data.map((row) => row[column]).filter((v) => typeof v === 'number') as number[];

    return (
        <Plot
            data={[
                {
                    y: values,
                    type: 'box',
                    name: column,
                    marker: { color: 'rgb(34, 211, 238)' },
                    boxmean: true,
                },
            ]}
            layout={{
                title: { text: `Box Plot of ${column}`, font: { color: '#e5e5e5' } },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'rgba(0,0,0,0.2)',
                yaxis: { title: column, gridcolor: 'rgba(255,255,255,0.1)', color: '#a3a3a3' },
                margin: { t: 50, b: 50, l: 60, r: 30 },
            } as any}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: '400px' }}
        />
    );
}

function ScatterChart({ data, xColumn, yColumn }: { data: DatasetRow[]; xColumn: string; yColumn: string }) {
    const xValues = data.map((row) => row[xColumn]).filter((v) => typeof v === 'number') as number[];
    const yValues = data.map((row) => row[yColumn]).filter((v) => typeof v === 'number') as number[];

    return (
        <Plot
            data={[
                {
                    x: xValues,
                    y: yValues,
                    mode: 'markers',
                    type: 'scatter',
                    marker: {
                        color: 'rgb(139, 92, 246)',
                        size: 10,
                        opacity: 0.7,
                    },
                },
            ]}
            layout={{
                title: { text: `${xColumn} vs ${yColumn}`, font: { color: '#e5e5e5' } },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'rgba(0,0,0,0.2)',
                xaxis: { title: xColumn, gridcolor: 'rgba(255,255,255,0.1)', color: '#a3a3a3' },
                yaxis: { title: yColumn, gridcolor: 'rgba(255,255,255,0.1)', color: '#a3a3a3' },
                margin: { t: 50, b: 50, l: 60, r: 30 },
            } as any}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: '400px' }}
        />
    );
}

function CorrelationHeatmap({ data, columns }: { data: DatasetRow[]; columns: string[] }) {
    // Calculate correlation matrix
    const correlationMatrix: number[][] = [];

    for (let i = 0; i < columns.length; i++) {
        correlationMatrix[i] = [];
        for (let j = 0; j < columns.length; j++) {
            const xValues = data.map((row) => row[columns[i]]).filter((v) => typeof v === 'number') as number[];
            const yValues = data.map((row) => row[columns[j]]).filter((v) => typeof v === 'number') as number[];

            if (xValues.length === 0 || yValues.length === 0) {
                correlationMatrix[i][j] = 0;
                continue;
            }

            const n = Math.min(xValues.length, yValues.length);
            const meanX = xValues.reduce((a, b) => a + b, 0) / n;
            const meanY = yValues.reduce((a, b) => a + b, 0) / n;

            let numerator = 0;
            let denomX = 0;
            let denomY = 0;

            for (let k = 0; k < n; k++) {
                const dx = xValues[k] - meanX;
                const dy = yValues[k] - meanY;
                numerator += dx * dy;
                denomX += dx * dx;
                denomY += dy * dy;
            }

            correlationMatrix[i][j] = numerator / Math.sqrt(denomX * denomY) || 0;
        }
    }

    return (
        <Plot
            data={[
                {
                    z: correlationMatrix,
                    x: columns,
                    y: columns,
                    type: 'heatmap',
                    colorscale: [
                        [0, 'rgb(34, 211, 238)'],
                        [0.5, 'rgb(24, 24, 27)'],
                        [1, 'rgb(139, 92, 246)'],
                    ],
                    zmin: -1,
                    zmax: 1,
                },
            ]}
            layout={{
                title: { text: 'Correlation Heatmap', font: { color: '#e5e5e5' } },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'rgba(0,0,0,0.2)',
                xaxis: { color: '#a3a3a3' },
                yaxis: { color: '#a3a3a3' },
                margin: { t: 50, b: 80, l: 80, r: 30 },
            } as any}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: '400px' }}
        />
    );
}

function MissingValuesChart({ stats }: { stats: ColumnStats[] }) {
    const colsWithMissing = stats.filter((s) => s.nullCount > 0);

    if (colsWithMissing.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Check className="w-12 h-12 text-emerald-500 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Missing Values!</h3>
                <p className="text-muted-foreground">Your dataset is complete.</p>
            </div>
        );
    }

    return (
        <Plot
            data={[
                {
                    x: colsWithMissing.map((s) => s.name),
                    y: colsWithMissing.map((s) => s.nullCount),
                    type: 'bar',
                    marker: {
                        color: 'rgb(251, 146, 60)',
                    },
                },
            ]}
            layout={{
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'rgba(0,0,0,0.2)',
                xaxis: { color: '#a3a3a3' },
                yaxis: { title: 'Missing Count', gridcolor: 'rgba(255,255,255,0.1)', color: '#a3a3a3' },
                margin: { t: 20, b: 80, l: 60, r: 20 },
            } as any}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: '300px' }}
        />
    );
}
