import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../../services/surveyMonkeyAPI';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  AppBar,
  Toolbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Popper,
  Fade,
  Chip,
  Divider
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import debounce from 'lodash.debounce';

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Enhanced search functionality states
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Load search history and popular searches from localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const savedPopular = JSON.parse(localStorage.getItem('popularSearches') || '[]');
    setSearchHistory(savedHistory.slice(0, 5)); // Last 5 searches
    setPopularSearches(savedPopular.slice(0, 3)); // Top 3 popular
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    API.get(`/surveys?per_page=${perPage}&page=${page}`)
      .then((res) => {
        setSurveys(res.data.data);
        setFilteredSurveys(res.data.data);
        setTotalCount(res.data.total);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load surveys.");
        setLoading(false);
      });
  }, [page, perPage, navigate]);

  // Enhanced debounced filter with suggestions
  const debouncedFilter = useMemo(() => {
    return debounce((query) => {
      const lowerQuery = query.toLowerCase();
      const result = surveys.filter((survey) =>
        survey.title.toLowerCase().includes(lowerQuery)
      );
      setFilteredSurveys(result);

      // Generate suggestions based on survey titles
      if (query.length > 0) {
        const suggestions = surveys
          .filter((survey) =>
            survey.title.toLowerCase().includes(lowerQuery)
          )
          .map((survey) => ({
            id: survey.id,
            title: survey.title,
            type: 'survey',
            status: survey.status
          }))
          .slice(0, 8); // Limit to 8 suggestions

        // Add search history suggestions if query matches
        const historySuggestions = searchHistory
          .filter((item) => item.toLowerCase().includes(lowerQuery))
          .map((item) => ({
            id: `history-${item}`,
            title: item,
            type: 'history'
          }));

        setSearchSuggestions([...suggestions, ...historySuggestions]);
        setShowSuggestions(true);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 200);
  }, [surveys, searchHistory]);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
    if (query) {
      debouncedFilter(query);
    }
  }, [searchParams, debouncedFilter]);

  // Save search to history
  const saveSearchToHistory = (query) => {
    if (query.trim() === '') return;
    
    const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // Update popular searches (simple frequency count)
    const popular = JSON.parse(localStorage.getItem('popularSearches') || '[]');
    const existingIndex = popular.findIndex(item => item.query === query);
    
    if (existingIndex >= 0) {
      popular[existingIndex].count += 1;
    } else {
      popular.push({ query, count: 1 });
    }
    
    const sortedPopular = popular
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    setPopularSearches(sortedPopular);
    localStorage.setItem('popularSearches', JSON.stringify(sortedPopular));
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchParams({ q: query });
    debouncedFilter(query);
  };

  const handleSearchSubmit = (query = searchQuery) => {
    if (query.trim()) {
      saveSearchToHistory(query.trim());
      setShowSuggestions(false);
      setSearchQuery(query);
      debouncedFilter(query);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'survey') {
      navigate(`/survey/${suggestion.id}`);
    } else {
      setSearchQuery(suggestion.title);
      handleSearchSubmit(suggestion.title);
    }
    setShowSuggestions(false);
  };

  const handleSearchFocus = () => {
    if (searchQuery.length === 0) {
      // Show search history and popular searches when focused with empty query
      const suggestions = [
        ...searchHistory.slice(0, 3).map(item => ({
          id: `history-${item}`,
          title: item,
          type: 'history'
        })),
        ...popularSearches.slice(0, 3).map(item => ({
          id: `popular-${item.query}`,
          title: item.query,
          type: 'popular',
          count: item.count
        }))
      ];
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredSurveys(surveys);
    setSearchParams({});
    setShowSuggestions(false);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
    setShowSuggestions(false);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    if (e.target.value === 'All') {
      setFilteredSurveys(surveys);
    } else {
      setFilteredSurveys(surveys.filter((survey) => survey.status === e.target.value));
    }
  };

  const handlePerPageChange = (e) => {
    setPerPage(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Highlight matching text in suggestions
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={{ backgroundColor: '#fff3cd', fontWeight: 'bold' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error" sx={{ textAlign: 'center', mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <>
      {/* AppBar Section */}
      <AppBar position="sticky" color="primary" elevation={3}>
        <Toolbar>
          <AssignmentIcon sx={{ mr: 1 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
            Survey Dashboard
          </Typography>
          {/* SurveyMonkey Reference */}
          <a href="https://www.surveymonkey.com" target="_blank" rel="noopener noreferrer">
            <img
              src="data:image/png;base64,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"
              alt="SurveyMonkey"
              style={{ height: '40px', marginRight: '16px' }}
            />
          </a>
          <Button
            color="inherit"
            endIcon={<ExitToAppIcon />}
            onClick={() => {
              localStorage.removeItem("access_token");
              navigate("/login");
            }}
            sx={{ fontWeight: 'bold' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 4 }}>
        {/* Enhanced Search and Filter Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 4, backgroundColor: '#f5f5f5' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            {/* Enhanced Search Field with Suggestions */}
            <Box sx={{ position: 'relative', width: '100%' }} ref={searchContainerRef}>
              <TextField
                ref={searchInputRef}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
                placeholder="Search surveys... (try typing a survey name)"
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton onClick={clearSearch}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  backgroundColor: '#fff', 
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: 2,
                    },
                  }
                }}
              />

              {/* Search Suggestions Dropdown */}
              <Popper
                open={showSuggestions && searchSuggestions.length > 0}
                anchorEl={searchInputRef.current}
                placement="bottom-start"
                style={{ width: searchInputRef.current?.offsetWidth, zIndex: 1300 }}
                transition
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={200}>
                    <Paper
                      elevation={8}
                      sx={{
                        mt: 1,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid #e0e0e0',
                        maxHeight: '400px',
                        overflowY: 'auto'
                      }}
                    >
                      <List sx={{ py: 0 }}>
                        {/* Search History Section */}
                        {searchQuery.length === 0 && searchHistory.length > 0 && (
                          <>
                            <ListItem sx={{ py: 1, px: 2, backgroundColor: '#f5f5f5' }}>
                              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                RECENT SEARCHES
                              </Typography>
                              <Box sx={{ flexGrow: 1 }} />
                              <Button
                                size="small"
                                onClick={clearSearchHistory}
                                sx={{ fontSize: '0.75rem', minWidth: 'auto', p: 0.5 }}
                              >
                                Clear
                              </Button>
                            </ListItem>
                            {searchHistory.slice(0, 3).map((item, index) => (
                              <ListItem
                                key={`history-${index}`}
                                button
                                onClick={() => handleSuggestionClick({ title: item, type: 'history' })}
                                sx={{ py: 1, '&:hover': { backgroundColor: '#f0f7ff' } }}
                              >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  <HistoryIcon fontSize="small" color="action" />
                                </ListItemIcon>
                                <ListItemText
                                  primary={item}
                                  primaryTypographyProps={{ fontSize: '0.9rem' }}
                                />
                              </ListItem>
                            ))}
                          </>
                        )}

                        {/* Popular Searches Section */}
                        {searchQuery.length === 0 && popularSearches.length > 0 && (
                          <>
                            {searchHistory.length > 0 && <Divider />}
                            <ListItem sx={{ py: 1, px: 2, backgroundColor: '#f5f5f5' }}>
                              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                POPULAR SEARCHES
                              </Typography>
                            </ListItem>
                            {popularSearches.slice(0, 3).map((item, index) => (
                              <ListItem
                                key={`popular-${index}`}
                                button
                                onClick={() => handleSuggestionClick({ title: item.query, type: 'popular' })}
                                sx={{ py: 1, '&:hover': { backgroundColor: '#f0f7ff' } }}
                              >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  <TrendingUpIcon fontSize="small" color="action" />
                                </ListItemIcon>
                                <ListItemText
                                  primary={item.query}
                                  secondary={`${item.count} searches`}
                                  primaryTypographyProps={{ fontSize: '0.9rem' }}
                                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                                />
                              </ListItem>
                            ))}
                          </>
                        )}

                        {/* Survey Suggestions */}
                        {searchQuery.length > 0 && searchSuggestions.filter(s => s.type === 'survey').length > 0 && (
                          <>
                            <ListItem sx={{ py: 1, px: 2, backgroundColor: '#f5f5f5' }}>
                              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                SURVEYS
                              </Typography>
                            </ListItem>
                            {searchSuggestions
                              .filter(suggestion => suggestion.type === 'survey')
                              .map((suggestion) => (
                                <ListItem
                                  key={suggestion.id}
                                  button
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  sx={{ 
                                    py: 1.5, 
                                    borderLeft: '4px solid transparent',
                                    '&:hover': {
                                      backgroundColor: '#f0f7ff',
                                      borderLeftColor: '#1976d2'
                                    }
                                  }}
                                >
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <AssignmentIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={highlightMatch(suggestion.title, searchQuery)}
                                    secondary={
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Chip
                                          label={suggestion.status}
                                          size="small"
                                          color={suggestion.status === 'Open' ? 'success' : 'default'}
                                          sx={{ fontSize: '0.7rem', height: '20px' }}
                                        />
                                        <Typography variant="caption" color="textSecondary">
                                          ID: {suggestion.id}
                                        </Typography>
                                      </Box>
                                    }
                                    primaryTypographyProps={{ fontSize: '0.9rem' }}
                                  />
                                </ListItem>
                              ))}
                          </>
                        )}

                        {/* History Suggestions for current query */}
                        {searchQuery.length > 0 && searchSuggestions.filter(s => s.type === 'history').length > 0 && (
                          <>
                            {searchSuggestions.filter(s => s.type === 'survey').length > 0 && <Divider />}
                            <ListItem sx={{ py: 1, px: 2, backgroundColor: '#f5f5f5' }}>
                              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                FROM HISTORY
                              </Typography>
                            </ListItem>
                            {searchSuggestions
                              .filter(suggestion => suggestion.type === 'history')
                              .map((suggestion, index) => (
                                <ListItem
                                  key={suggestion.id}
                                  button
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  sx={{ py: 1, '&:hover': { backgroundColor: '#f0f7ff' } }}
                                >
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <HistoryIcon fontSize="small" color="action" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={highlightMatch(suggestion.title, searchQuery)}
                                    primaryTypographyProps={{ fontSize: '0.9rem' }}
                                  />
                                </ListItem>
                              ))}
                          </>
                        )}

                        {/* No results message */}
                        {searchQuery.length > 0 && searchSuggestions.length === 0 && (
                          <ListItem sx={{ py: 2 }}>
                            <ListItemText
                              primary="No surveys found"
                              secondary={`Try searching for "${searchQuery}" or check your spelling`}
                              primaryTypographyProps={{ fontSize: '0.9rem', color: 'textSecondary' }}
                              secondaryTypographyProps={{ fontSize: '0.8rem' }}
                            />
                          </ListItem>
                        )}
                      </List>
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </Box>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              variant="outlined"
              sx={{ width: 200, backgroundColor: '#fff', borderRadius: 1 }}
            >
              <MenuItem value="All">Status: All</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
            </Select>
          </Stack>

          {/* Search Info */}
          {searchQuery && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="textSecondary">
                {filteredSurveys.length} surveys found for "{searchQuery}"
              </Typography>
              {filteredSurveys.length > 0 && (
                <Chip
                  label={`${filteredSurveys.length} results`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </Paper>

        {/* Survey List Section */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 4, backgroundColor: '#fff' }}>
          {filteredSurveys.length === 0 && searchQuery ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No surveys found for "{searchQuery}"
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Try adjusting your search terms or browse all surveys
              </Typography>
              <Button variant="outlined" onClick={clearSearch}>
                Show All Surveys
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSurveys.map((survey) => (
                    <TableRow key={survey.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                      <TableCell>
                        {searchQuery ? highlightMatch(survey.title, searchQuery) : survey.title}
                      </TableCell>
                      <TableCell>{survey.id}</TableCell>
                      <TableCell>
                        <Chip
                          label={survey.status}
                          size="small"
                          color={survey.status === 'Open' ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => navigate(`/survey/${survey.id}`)}
                          sx={{ fontWeight: 'bold' }}
                        >
                          View Responses
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Pagination Section */}
        {filteredSurveys.length > 0 && (
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mt={5}>
            <Button
              variant="outlined"
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              sx={{
                fontWeight: 'bold',
                width: 100,
                textTransform: 'uppercase',
              }}
            >
              First
            </Button>
            <Button
              variant="outlined"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              sx={{
                fontWeight: 'bold',
                width: 100,
                textTransform: 'uppercase',
              }}
            >
              Previous
            </Button>
            <Typography
              variant="body1"
              align="center"
              sx={{
                fontWeight: 'bold',
                minWidth: 120,
                textAlign: 'center',
              }}
            >
              Page {page} of {Math.ceil(totalCount / perPage)}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === Math.ceil(totalCount / perPage)}
              sx={{
                fontWeight: 'bold',
                width: 100,
                textTransform: 'uppercase',
              }}
            >
              Next
            </Button>
            <Button
              variant="outlined"
              onClick={() => handlePageChange(Math.ceil(totalCount / perPage))}
              disabled={page === Math.ceil(totalCount / perPage)}
              sx={{
                fontWeight: 'bold',
                width: 100,
                textTransform: 'uppercase',
              }}
            >
              Last
            </Button>
            <Select
              value={perPage}
              onChange={handlePerPageChange}
              variant="outlined"
              sx={{
                width: 120,
                backgroundColor: '#fff',
                borderRadius: 1,
                textAlign: 'center',
              }}
            >
              <MenuItem value={10}>10 per page</MenuItem>
              <MenuItem value={25}>25 per page</MenuItem>
              <MenuItem value={50}>50 per page</MenuItem>
            </Select>
          </Stack>
        )}
      </Container>
    </>
  );
};

export default Dashboard;