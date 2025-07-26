import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/surveyMonkeyAPI';
import dayjs from 'dayjs';
import {
  Container, Typography, Skeleton, Snackbar, Alert, Button, Paper,
  AppBar, Toolbar, IconButton, Grid, Select, MenuItem,
  InputLabel, FormControl, ButtonGroup, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Fade, Chip, Box, Card, CardContent
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import CachedIcon from '@mui/icons-material/Cached';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LabelList, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import html2canvas from 'html2canvas';

// Enhanced color palette for better visualization
const COLORS = [
  '#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0', '#607D8B', 
  '#8BC34A', '#00BCD4', '#FF9800', '#E91E63', '#3F51B5', '#795548', 
  '#CDDC39', '#009688', '#673AB7', '#F44336'
];

// Enhanced Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, chartType }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#fff',
        border: '2px solid #1976d2',
        borderRadius: '12px',
        padding: '12px',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
        minWidth: '200px',
        maxWidth: '300px'
      }}>
        <p style={{ fontWeight: 'bold', marginBottom: '8px', color: '#1976d2', wordWrap: 'break-word' }}>
          {label}
        </p>
        <p style={{ color: '#333', margin: '4px 0' }}>
          <strong>Count:</strong> {payload[0].value}
        </p>
        <p style={{ color: '#333', margin: '4px 0' }}>
          <strong>Percentage:</strong> {payload[0].payload.percent}%
        </p>
        {chartType === 'Trend' && payload[0].payload.date && (
          <p style={{ color: '#333', margin: '4px 0' }}>
            <strong>Date:</strong> {payload[0].payload.date}
          </p>
        )}
      </div>
    );
  }
  return null;
};

// Enhanced Bar Chart - Cleaned up
const EnhancedBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart
      data={data}
      layout="vertical"
      margin={{ top: 20, right: 60, bottom: 20, left: 200 }}
    >
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1976d2" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#42a5f5" stopOpacity={0.8} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
      <XAxis 
        type="number" 
        tick={{ fontSize: 12, fill: '#333' }} 
        allowDecimals={false} 
        axisLine={{ stroke: '#ccc' }} 
      />
      <YAxis
        type="category"
        dataKey="label"
        tick={{ fontSize: 10, fill: '#333' }}
        interval={0}
        width={180}
        axisLine={{ stroke: '#ccc' }}
        tickFormatter={(value) => {
          return value.length > 25 ? `${value.substring(0, 25)}...` : value;
        }}
      />
      <Tooltip content={<CustomTooltip chartType="Bar" />} />
      <Bar
        dataKey="count"
        fill="url(#barGradient)"
        barSize={25}
        radius={[0, 8, 8, 0]}
        animationDuration={1000}
      >
        <LabelList
          dataKey="percent"
          position="right"
          formatter={(v) => `${v}%`}
          style={{ fontSize: 10, fill: '#333' }}
        />
        {data.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={COLORS[index % COLORS.length]} 
            opacity={0.8}
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

// Enhanced Pie Chart - Cleaned up
const EnhancedPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie
        data={data}
        dataKey="count"
        nameKey="label"
        cx="50%"
        cy="50%"
        outerRadius={120}
        innerRadius={60}
        paddingAngle={2}
        animationDuration={1000}
        label={({ label, percent }) => `${percent}%`}
        labelLine={false}
      >
        {data.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={COLORS[index % COLORS.length]}
            stroke="#fff"
            strokeWidth={2}
          />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip chartType="Pie" />} />
      
      {/* Custom legend */}
      <g>
        {data.map((entry, index) => (
          <g key={`legend-${index}`}>
            <rect
              x={20}
              y={20 + index * 25}
              width={15}
              height={15}
              fill={COLORS[index % COLORS.length]}
              stroke="#ccc"
              strokeWidth={1}
              rx={2}
            />
            <text
              x={45}
              y={32 + index * 25}
              fontSize={12}
              fill="#333"
              textAnchor="start"
              dominantBaseline="middle"
            >
              {entry.label.length > 25 ? `${entry.label.substring(0, 25)}...` : entry.label} ({entry.count})
            </text>
          </g>
        ))}
      </g>
    </PieChart>
  </ResponsiveContainer>
);

// Enhanced Line Chart for rating scales
const EnhancedLineChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <AreaChart data={data} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
      <defs>
        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
      <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#333' }} />
      <YAxis tick={{ fontSize: 12, fill: '#333' }} />
      <Tooltip content={<CustomTooltip chartType="Line" />} />
      <Area
        type="monotone"
        dataKey="count"
        stroke="#1976d2"
        strokeWidth={3}
        fill="url(#colorGradient)"
        dot={{ r: 6, fill: '#1976d2' }}
        activeDot={{ r: 8, fill: '#ff5722' }}
        animationDuration={1000}
      />
    </AreaChart>
  </ResponsiveContainer>
);

// Enhanced Trend Analysis Chart
const TrendAnalysisChart = ({ data, timeRange = '7d' }) => {
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const groupedData = data.reduce((acc, entry) => {
      let dateKey;
      const date = dayjs(entry.date_modified || entry.date_created);
      
      switch (timeRange) {
        case '1d':
          dateKey = date.format('YYYY-MM-DD HH:00');
          break;
        case '7d':
          dateKey = date.format('YYYY-MM-DD');
          break;
        case '30d':
          dateKey = date.format('YYYY-MM-DD');
          break;
        case '1y':
          dateKey = date.format('YYYY-MM');
          break;
        default:
          dateKey = date.format('YYYY-MM-DD');
      }
      
      acc[dateKey] = (acc[dateKey] || 0) + (entry.count || 1);
      return acc;
    }, {});

    return Object.entries(groupedData)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
  }, [data, timeRange]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={processedData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#333' }} />
        <YAxis tick={{ fontSize: 12, fill: '#333' }} />
        <Tooltip content={<CustomTooltip chartType="Trend" />} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#1976d2"
          strokeWidth={3}
          dot={{ r: 4, fill: '#1976d2' }}
          activeDot={{ r: 6, fill: '#ff5722' }}
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Main Component
const SurveyDetails = ({ toggleMode }) => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionData, setQuestionData] = useState([]);
  const [rawResponses, setRawResponses] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [responseThreshold, setResponseThreshold] = useState(0);
  const [chartType, setChartType] = useState('Table');
  const [timeRange, setTimeRange] = useState('7d');
  const [cacheStatus, setCacheStatus] = useState('idle');

  // Add time range filtering function
  const filterResponsesByTimeRange = useCallback((responses, timeRange) => {
    if (!responses || responses.length === 0) return responses;
    
    const now = dayjs();
    let cutoffDate;
    
    switch (timeRange) {
      case '1d':
        cutoffDate = now.subtract(1, 'day');
        break;
      case '7d':
        cutoffDate = now.subtract(7, 'day');
        break;
      case '30d':
        cutoffDate = now.subtract(30, 'day');
        break;
      case '1y':
        cutoffDate = now.subtract(1, 'year');
        break;
      default:
        return responses;
    }
    
    return responses.filter(response => {
      const responseDate = dayjs(response.date_modified || response.date_created);
      return responseDate.isAfter(cutoffDate);
    });
  }, []);

  // Enhanced data fetching with caching
  const fetchSurveyData = useCallback(async () => {
    setCacheStatus('loading');
    try {
      // Check cache first - include timeRange in cache key
      const cacheKey = `survey_${id}_${responseThreshold}_${timeRange}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (dayjs().diff(dayjs(parsed.timestamp), 'minute') < 30) {
          setQuestionData(parsed.data);
          setTitle(parsed.title);
          setRawResponses(parsed.rawResponses);
          setLoading(false);
          setCacheStatus('cached');
          return;
        }
      }

      // Fetch fresh data
      const [surveyRes, responseRes] = await Promise.all([
        API.get(`/surveys/${id}/details`),
        API.get(`/surveys/${id}/responses/bulk`, {
          params: {
            per_page: 1000,
            sort_order: 'DESC',
            sort_by: 'date_modified'
          }
        })
      ]);

      setTitle(surveyRes.data.title);
      let resData = responseRes.data.data || [];
      
      // Apply time range filter to responses
      const filteredByTime = filterResponsesByTimeRange(resData, timeRange);
      setRawResponses(filteredByTime);

      // Create question mapping from survey structure
      const questionMapping = {};
      const choiceMapping = {};
      let questionCounter = 1;

      // Process survey structure to get proper question titles and choice texts
      surveyRes.data.pages?.forEach((page) => {
        page.questions?.forEach((question) => {
          const questionId = question.id;
          const questionText = question.headings?.[0]?.heading || `Question ${questionCounter}`;
          
          questionMapping[questionId] = {
            text: questionText,
            number: questionCounter,
            family: question.family || 'single_choice'
          };
          
          // Map choice IDs to choice text
          question.answers?.choices?.forEach((choice) => {
            choiceMapping[choice.id] = choice.text;
          });
          
          questionCounter++;
        });
      });

      // Enhanced data processing using filtered responses
      const questionMap = {};
      const questionTypes = {};
      
      filteredByTime.forEach((response) => {
        response.pages?.forEach((page) => {
          page.questions?.forEach((q) => {
            const questionId = q.id;
            
            // Get proper question title from mapping
            const questionInfo = questionMapping[questionId];
            const questionText = questionInfo ? 
              (questionInfo.text !== `Question ${questionInfo.number}` ? 
                questionInfo.text : 
                `Question ${questionInfo.number}`) :
              `Question ${Object.keys(questionMap).length + 1}`;
            
            // Store question type
            questionTypes[questionId] = questionInfo?.family || q.family || 'single_choice';
            
            if (!questionMap[questionText]) questionMap[questionText] = {};
            
            q.answers?.forEach((answer) => {
              let label = 'No answer';
              
              // Priority order for getting actual answer text:
              if (answer.text && answer.text.trim() !== '') {
                label = answer.text.trim();
              } else if (answer.other_text && answer.other_text.trim() !== '') {
                label = answer.other_text.trim();
              } else if (answer.choice_id && choiceMapping[answer.choice_id]) {
                label = choiceMapping[answer.choice_id];
              } else if (answer.choice_text && answer.choice_text.trim() !== '') {
                label = answer.choice_text.trim();
              } else if (answer.row_id && answer.choice_id) {
                const rowText = choiceMapping[answer.row_id] || `Row ${answer.row_id}`;
                const choiceText = choiceMapping[answer.choice_id] || `Option ${answer.choice_id}`;
                label = `${rowText}: ${choiceText}`;
              } else if (answer.choice_id) {
                label = `Option ${answer.choice_id}`;
              }
              
              // Clean up the label
              label = label.replace(/^Choice\s+/i, '').trim();
              if (label === '' || label === 'undefined' || label === 'null') {
                label = 'No answer provided';
              }
              
              questionMap[questionText][label] = (questionMap[questionText][label] || 0) + 1;
            });
          });
        });
      });

      // Process data for visualization with proper labeling
      const structured = Object.entries(questionMap).map(([question, answersObj]) => {
        const total = Object.values(answersObj).reduce((sum, v) => sum + v, 0);
        const answers = Object.entries(answersObj)
          .map(([label, count]) => ({
            label: label || 'Unknown Answer',
            count,
            percent: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
          }))
          .sort((a, b) => b.count - a.count);
      
        // Get question type for this specific question
        const questionId = Object.keys(questionMapping).find(id => 
          questionMapping[id].text === question || 
          `Question ${questionMapping[id].number}` === question
        );
        const questionType = questionId ? questionTypes[questionId] : 'single_choice';
        
        return { 
          question: question || 'Untitled Question',
          answers,
          totalResponses: total,
          questionType
        };
      }).filter(q => q.totalResponses >= responseThreshold);

      setQuestionData(structured);

      // Cache the processed data with timeRange in cache
      const dataToCache = {
        data: structured,
        title: surveyRes.data.title,
        rawResponses: filteredByTime,
        timestamp: dayjs().toISOString()
      };
      localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
      setCacheStatus('fresh');

    } catch (err) {
      console.error('Error fetching survey data:', err);
      
      // If the detailed endpoint fails, try the basic endpoint with improved processing
      try {
        const [surveyRes, responseRes] = await Promise.all([
          API.get(`/surveys/${id}`),
          API.get(`/surveys/${id}/responses/bulk`, {
            params: {
              per_page: 1000,
              sort_order: 'DESC',
              sort_by: 'date_modified'
            }
          })
        ]);

        setTitle(surveyRes.data.title);
        let resData = responseRes.data.data || [];
        
        // Apply time range filter in fallback too
        const filteredByTime = filterResponsesByTimeRange(resData, timeRange);
        setRawResponses(filteredByTime);

        // Fallback processing with question numbering
        const questionMap = {};
        const questionTypes = {};
        const seenQuestions = new Set();
        let questionCounter = 1;
      
        filteredByTime.forEach((response) => {
          response.pages?.forEach((page) => {
            page.questions?.forEach((q) => {
              const questionId = q.id;
              let questionText = q.headings?.[0]?.heading;
            
              // If no proper question text, use Question 1, Question 2, etc.
              if (!questionText || questionText.trim() === '') {
                if (!seenQuestions.has(questionId)) {
                  questionText = `Question ${questionCounter}`;
                  seenQuestions.add(questionId);
                  questionCounter++;
                } else {
                  // Find existing question text for this ID
                  questionText = Object.keys(questionMap).find(key => 
                    questionMap[key].questionId === questionId
                  ) || `Question ${questionCounter}`;
                }
              }
            
              questionTypes[questionId] = q.family || 'single_choice';
            
              if (!questionMap[questionText]) {
                questionMap[questionText] = { questionId };
              }
            
              q.answers?.forEach((answer) => {
                let label = 'No answer';
              
                if (answer.text && answer.text.trim() !== '') {
                  label = answer.text.trim();
                } else if (answer.other_text && answer.other_text.trim() !== '') {
                  label = answer.other_text.trim();
                } else if (answer.choice_text && answer.choice_text.trim() !== '') {
                  label = answer.choice_text.trim();
                } else if (answer.choice_id) {
                  label = `Option ${answer.choice_id}`;
                }
              
                // Clean up choice ID formatting
                label = label.replace(/^Choice\s+\d+$/, 'Option');
              
                questionMap[questionText][label] = (questionMap[questionText][label] || 0) + 1;
              });
            });
          });
        });

        // Process the fallback data
        const structured = Object.entries(questionMap).map(([question, answersObj]) => {
          const { questionId, ...answers } = answersObj;
          const total = Object.values(answers).reduce((sum, v) => sum + v, 0);
          const answersList = Object.entries(answers)
            .map(([label, count]) => ({
              label: label || 'Unknown Answer',
              count,
              percent: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
            }))
            .sort((a, b) => b.count - a.count);
        
          return { 
            question: question || 'Untitled Question',
            answers: answersList,
            totalResponses: total,
            questionType: questionTypes[questionId] || 'single_choice'
          };
        }).filter(q => q.totalResponses >= responseThreshold);

        setQuestionData(structured);
        setCacheStatus('fallback');

      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
        setError('Failed to load survey details.');
        setCacheStatus('error');
      }
    } finally {
      setLoading(false);
    }
  }, [id, responseThreshold, timeRange, filterResponsesByTimeRange]);

  // Refresh data function
  const refreshData = useCallback(() => {
    // Clear all cache entries for this survey
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(`survey_${id}_`)) {
        localStorage.removeItem(key);
      }
    });
    
    setCacheStatus('loading');
    setLoading(true);
    
    // Force re-fetch
    fetchSurveyData();
  }, [id, fetchSurveyData]);

  // Enhanced filter handlers
  const handleResponseThresholdChange = (value) => {
    setResponseThreshold(value);
  };

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };

  const handleChartTypeChange = (value) => {
    setChartType(value);
  };

  // Simplified chart type selection
  const getChartType = () => {
    return chartType;
  };

  // Export functionality
  const exportToCSV = () => {
    const rows = ['Question,Answer,Count,Percent,Total Responses'];
    questionData.forEach((q) => {
      q.answers.forEach((a) => {
        rows.push(`"${q.question}","${a.label}",${a.count},${a.percent}%,${q.totalResponses}`);
      });
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}-responses-${dayjs().format('YYYY-MM-DD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setSnackOpen(true);
  };

  // Export charts to image functionality
  const exportToImage = async () => {
    try {
      // Check if we're in table mode
      if (chartType === 'Table') {
        // Export tables instead of charts
        const tableElements = document.querySelectorAll('[data-question-container]');
        
        if (tableElements.length === 0) {
          alert('No data found to export');
          return;
        }

        // Create a temporary container for all tables
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.top = '-9999px';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '1200px';
        tempContainer.style.backgroundColor = '#fff';
        tempContainer.style.padding = '20px';
        tempContainer.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(tempContainer);

        // Add survey title at the top
        const surveyTitle = document.createElement('h1');
        surveyTitle.textContent = `${title} - Survey Analytics (Table View)`;
        surveyTitle.style.textAlign = 'center';
        surveyTitle.style.marginBottom = '30px';
        surveyTitle.style.color = '#1976d2';
        surveyTitle.style.fontFamily = 'Arial, sans-serif';
        tempContainer.appendChild(surveyTitle);

        // Clone all question containers (including tables)
        tableElements.forEach((element, index) => {
          const clone = element.cloneNode(true);
          clone.style.marginBottom = '40px';
          clone.style.backgroundColor = '#fff';
          clone.style.padding = '20px';
          clone.style.borderRadius = '8px';
          clone.style.border = '1px solid #ddd';
          tempContainer.appendChild(clone);
        });

        // Convert to canvas and download
        const canvas = await html2canvas(tempContainer, {
          width: 1200,
          height: tempContainer.scrollHeight,
          backgroundColor: '#ffffff',
          scale: 1.5,
          useCORS: true,
          logging: false
        });

        // Create download link
        const link = document.createElement('a');
        link.download = `${title}-tables-${dayjs().format('YYYY-MM-DD')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Clean up
        document.body.removeChild(tempContainer);
        setSnackOpen(true);
        return;
      }

      // For chart modes, look for chart containers
      const chartElements = document.querySelectorAll('[data-chart-container]');
      
      if (chartElements.length === 0) {
        alert('No charts found to export. Please switch to a chart view (Bar, Pie, Line, or Trend) first.');
        return;
      }

      // Create a temporary container for all charts
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '1200px';
      tempContainer.style.backgroundColor = '#fff';
      tempContainer.style.padding = '20px';
      document.body.appendChild(tempContainer);

      // Add survey title at the top
      const surveyTitle = document.createElement('h1');
      surveyTitle.textContent = `${title} - Survey Analytics (${chartType} Charts)`;
      surveyTitle.style.textAlign = 'center';
      surveyTitle.style.marginBottom = '30px';
      surveyTitle.style.color = '#1976d2';
      surveyTitle.style.fontFamily = 'Arial, sans-serif';
      tempContainer.appendChild(surveyTitle);

      // Clone all chart containers
      chartElements.forEach((element, index) => {
        const clone = element.cloneNode(true);
        clone.style.marginBottom = '30px';
        
        // Add question title above each chart
        const questionTitle = element.closest('[data-question-container]')?.querySelector('h6')?.textContent;
        if (questionTitle) {
          const titleElement = document.createElement('h3');
          titleElement.textContent = questionTitle;
          titleElement.style.marginBottom = '15px';
          titleElement.style.color = '#333';
          titleElement.style.fontFamily = 'Arial, sans-serif';
          tempContainer.appendChild(titleElement);
        }
        
        tempContainer.appendChild(clone);
      });

      // Convert to canvas and download
      const canvas = await html2canvas(tempContainer, {
        width: 1200,
        height: tempContainer.scrollHeight,
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality for charts
        useCORS: true,
        logging: false
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${title}-charts-${dayjs().format('YYYY-MM-DD')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Clean up
      document.body.removeChild(tempContainer);
      setSnackOpen(true);

    } catch (error) {
      console.error('Error exporting to image:', error);
      alert('Failed to export as image. Please try again.');
    }
  };

  // Clear filters
  const clearFilters = () => {
    setResponseThreshold(0);
    setTimeRange('7d');
  };

  const handleCloseSnackbar = () => setSnackOpen(false);

  // Statistics summary
  const calculateStats = () => ({
    averageResponseRate: questionData.reduce((sum, q) => sum + q.totalResponses, 0) / questionData.length,
    mostPopularAnswer: questionData.flatMap(q => q.answers).sort((a, b) => b.count - a.count)[0],
    completionRate: (rawResponses.filter(r => r.response_status === 'completed').length / rawResponses.length) * 100
  });
  const stats = calculateStats();

  // Render chart based on type
  const renderChart = (question) => {
    const selectedChartType = getChartType();
    
    switch (selectedChartType) {
      case 'Bar':
        return <EnhancedBarChart data={question.answers} />;
      case 'Pie':
        return <EnhancedPieChart data={question.answers} />;
      case 'Line':
        return <EnhancedLineChart data={question.answers} />;
      case 'Trend':
        return <TrendAnalysisChart data={rawResponses} timeRange={timeRange} />;
      case 'Table':
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchSurveyData();
  }, [fetchSurveyData]);

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="rectangular" height={300} sx={{ my: 4 }} />
        <Skeleton variant="rectangular" height={300} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error" sx={{ textAlign: 'center', mt: 4 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={refreshData} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Container>
    );
  }

  if (!questionData || questionData.length === 0) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        {/* AppBar - Keep the same header */}
        <AppBar position="static" color="primary" elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1, color: '#fff' }}>
              {title || 'Survey Analytics'} - No Data Found
            </Typography>
            {cacheStatus === 'cached' && (
              <Chip 
                icon={<CachedIcon />} 
                label="Cached" 
                color="success" 
                variant="outlined" 
                sx={{ mr: 2, color: '#fff', borderColor: '#fff' }} 
              />
            )}
            <IconButton onClick={toggleMode} color="inherit">
              <DarkModeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* No Data Message with Actions */}
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, boxShadow: 4 }}>
          <Typography variant="h4" sx={{ mb: 3, color: '#666', fontWeight: 'bold' }}>
            📊 No Survey Data Available
          </Typography>
          
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
            No responses found matching your current filters. This could be because:
          </Typography>

          <Box sx={{ mb: 4 }}>
            <ul style={{ textAlign: 'left', display: 'inline-block', color: '#666' }}>
              <li>The survey has no responses yet</li>
              <li>Response threshold ({responseThreshold > 0 ? `${responseThreshold}+` : 'All'}) is too high</li>
              <li>Time range filter ({timeRange}) is too restrictive</li>
              <li>Survey responses are outside the selected time period</li>
            </ul>
          </Box>

          {/* Current Filter Status */}
          <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
              Current Filters:
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Chip 
                  label={`Min Responses: ${responseThreshold > 0 ? `${responseThreshold}+` : 'All'}`}
                  color="primary" 
                  variant="outlined" 
                />
              </Grid>
              <Grid item>
                <Chip 
                  label={`Time Range: ${
                    timeRange === '1d' ? 'Last 24 Hours' :
                    timeRange === '7d' ? 'Last 7 Days' :
                    timeRange === '30d' ? 'Last 30 Days' :
                    timeRange === '1y' ? 'Last Year' : timeRange
                  }`}
                  color="secondary" 
                  variant="outlined" 
                />
              </Grid>
              <Grid item>
                <Chip 
                  label={`Total Raw Responses: ${rawResponses.length}`}
                  color="info" 
                  variant="outlined" 
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Action Buttons */}
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {
                  setResponseThreshold(0);
                  setTimeRange('1y');
                }}
                startIcon={<RefreshIcon />}
                sx={{ 
                  fontWeight: 'bold', 
                  borderRadius: 2, 
                  height: '56px',
                  fontSize: '1rem'
                }}
              >
                Reset All Filters
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                size="large"
                onClick={refreshData}
                startIcon={<CachedIcon />}
                sx={{ 
                  fontWeight: 'bold', 
                  borderRadius: 2, 
                  height: '56px',
                  fontSize: '1rem'
                }}
              >
                Refresh Data
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="text"
                color="primary"
                size="large"
                onClick={() => window.history.back()}
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  fontWeight: 'bold', 
                  borderRadius: 2, 
                  height: '56px',
                  fontSize: '1rem'
                }}
              >
                Go Back
              </Button>
            </Grid>
          </Grid>

          {/* Quick Filter Suggestions */}
          <Paper sx={{ p: 3, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
              💡 Quick Suggestions:
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setResponseThreshold(0);
                    setTimeRange('1y');
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Reset to "All Time, All Responses"
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setTimeRange('1y')}
                  sx={{ borderRadius: 2 }}
                >
                  Expand to "Last Year"
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setResponseThreshold(1)}
                  sx={{ borderRadius: 2 }}
                >
                  Show "1+ Responses"
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <Paper sx={{ p: 2, mt: 3, backgroundColor: '#fff3e0', borderRadius: 2 }}>
              <Typography variant="caption" color="textSecondary">
                Debug Info: Raw Responses: {rawResponses.length} | 
                Cache Status: {cacheStatus} | 
                Threshold: {responseThreshold} | 
                Time Range: {timeRange}
              </Typography>
            </Paper>
          )}
        </Paper>

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', marginTop: '20px', borderRadius: '8px' }}>
          <Typography variant="body2" color="textSecondary">
            © 2025 Survey Management Platform. All rights reserved.
          </Typography>
        </footer>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      {/* AppBar */}
      <AppBar position="static" color="primary" elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1, color: '#fff' }}>
            {title} - Survey Analytics
          </Typography>
          {cacheStatus === 'cached' && (
            <Chip 
              icon={<CachedIcon />} 
              label="Cached" 
              color="success" 
              variant="outlined" 
              sx={{ mr: 2, color: '#fff', borderColor: '#fff' }} 
            />
          )}
          <IconButton onClick={toggleMode} color="inherit">
            <DarkModeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Filters Section */}
      <Fade in timeout={500}>
        <Paper sx={{ p: 4, mb: 4, borderRadius: 4, boxShadow: 4, backgroundColor: '#f9f9f9' }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item>
              <FilterListIcon color="primary" />
            </Grid>
            <Grid item>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                Filters & Controls
              </Typography>
            </Grid>
          </Grid>
          
          <Grid container spacing={2} alignItems="center">
            {/* Min Responses */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Min Responses</InputLabel>
                <Select
                  value={responseThreshold}
                  onChange={(e) => handleResponseThresholdChange(Number(e.target.value))}
                  label="Min Responses"
                  sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                >
                  <MenuItem value={0}>All</MenuItem>
                  <MenuItem value={5}>5+</MenuItem>
                  <MenuItem value={10}>10+</MenuItem>
                  <MenuItem value={20}>20+</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Time Range */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => handleTimeRangeChange(e.target.value)}
                  label="Time Range"
                  sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                >
                  <MenuItem value="1d">Last 24 Hours</MenuItem>
                  <MenuItem value="7d">Last 7 Days</MenuItem>
                  <MenuItem value="30d">Last 30 Days</MenuItem>
                  <MenuItem value="1y">Last Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Clear Filters */}
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={clearFilters}
                sx={{ height: '56px', fontWeight: 'bold', borderRadius: 2 }}
              >
                Clear Filters
              </Button>
            </Grid>

            {/* Refresh */}
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={refreshData}
                startIcon={<CachedIcon />}
                sx={{ height: '56px', fontWeight: 'bold', borderRadius: 2 }}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {/* Export and Chart Controls */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 4, boxShadow: 4, backgroundColor: '#f9f9f9' }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={exportToCSV}
              fullWidth
              sx={{ fontWeight: 'bold', letterSpacing: 0.5, borderRadius: 2, height: '48px' }}
            >
              Export to CSV
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={exportToImage}
              fullWidth
              sx={{ fontWeight: 'bold', letterSpacing: 0.5, borderRadius: 2, height: '48px' }}
            >
              Export {chartType === 'Table' ? 'Tables' : 'Charts'} as Image
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Total Questions: {questionData.length} | 
              Total Responses: {rawResponses.length} |
              Cache Status: {cacheStatus}
            </Typography>
          </Grid>
        </Grid>
        
        <ButtonGroup fullWidth variant="outlined" sx={{ mb: 2 }}>
          <Button 
            onClick={() => handleChartTypeChange('Table')}
            variant={chartType === 'Table' ? 'contained' : 'outlined'}
            sx={{ fontWeight: 'bold', borderRadius: 2 }}
          >
            Table
          </Button>
          <Button 
            onClick={() => handleChartTypeChange('Bar')}
            variant={chartType === 'Bar' ? 'contained' : 'outlined'}
            sx={{ fontWeight: 'bold', borderRadius: 2 }}
          >
            Bar Chart
          </Button>
          <Button 
            onClick={() => handleChartTypeChange('Pie')}
            variant={chartType === 'Pie' ? 'contained' : 'outlined'}
            sx={{ fontWeight: 'bold', borderRadius: 2 }}
          >
            Pie Chart
          </Button>
          <Button 
            onClick={() => handleChartTypeChange('Line')}
            variant={chartType === 'Line' ? 'contained' : 'outlined'}
            sx={{ fontWeight: 'bold', borderRadius: 2 }}
          >
            Line Chart
          </Button>
          <Button 
            onClick={() => handleChartTypeChange('Trend')}
            variant={chartType === 'Trend' ? 'contained' : 'outlined'}
            sx={{ fontWeight: 'bold', borderRadius: 2 }}
          >
            Trend Analysis
          </Button>
        </ButtonGroup>
      </Paper>

      {/* Statistics Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4">{stats.averageResponseRate.toFixed(1)}</Typography>
                <Typography color="textSecondary">Avg. Responses</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4">{stats.completionRate.toFixed(1)}%</Typography>
                <Typography color="textSecondary">Completion Rate</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4">{stats.mostPopularAnswer?.label || 'N/A'}</Typography>
                <Typography color="textSecondary">Most Popular Answer</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Question Data Section */}
      {questionData.map((q, index) => (
        <Fade in timeout={500 + index * 100} key={index}>
          <Paper 
            sx={{ p: 4, mb: 4, borderRadius: 4, boxShadow: 4 }}
            data-question-container
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', flex: 1 }}>
                {q.question}
              </Typography>
              <Chip 
                label={`${q.totalResponses} responses`} 
                color="primary" 
                variant="outlined" 
                sx={{ ml: 2 }}
              />
            </Box>
            
            {q.answers && q.answers.length > 0 ? (
              <>
                {chartType === 'Table' && (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>Answer</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>Count</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>Percent</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {q.answers.map((a, i) => (
                          <TableRow key={i}>
                            <TableCell>{a.label}</TableCell>
                            <TableCell>{a.count}</TableCell>
                            <TableCell>{a.percent}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                {chartType !== 'Table' && (
                  <div data-chart-container>
                    {renderChart(q)}
                  </div>
                )}
              </>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
                No data available for this question.
              </Typography>
            )}
          </Paper>
        </Fade>
      ))}

      {/* Success Snackbar */}
      <Snackbar open={snackOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
          icon={<CheckCircleIcon />}
        >
          Export Completed Successfully!
        </Alert>
      </Snackbar>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', marginTop: '20px', borderRadius: '8px' }}>
        <Typography variant="body2" color="textSecondary">
          © 2025 Survey Management Platform. All rights reserved.
        </Typography>
      </footer>
    </Container>
  );
};

export default SurveyDetails;