# Survey Management System

A comprehensive **Survey Analytics and Management Platform** that integrates with SurveyMonkey's API to provide advanced data visualization and analytics capabilities.

## 🚀 Project Overview

This full-stack application transforms raw survey data into actionable insights through interactive charts, advanced filtering, and comprehensive export capabilities.

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI with functional components and hooks
- **Material-UI (MUI)** - Responsive, professional UI components
- **Recharts** - Interactive data visualizations
- **Day.js** - Efficient date manipulation
- **React Router** - Client-side navigation
- **html2canvas** - Chart export functionality

### Backend
- **Node.js & Express** - RESTful API server
- **SurveyMonkey API** - Real-time data integration
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## ✨ Key Features

### 📊 Advanced Data Visualization
- **Multiple Chart Types**: Bar, Pie, Line, and Trend Analysis charts
- **Interactive Tooltips**: Detailed hover information with percentages
- **Responsive Design**: Charts adapt to different screen sizes
- **Custom Styling**: Professional gradients and color schemes

### 🔍 Smart Data Processing
- **Intelligent Response Mapping**: Converts SurveyMonkey IDs to readable text
- **Question Auto-numbering**: Handles surveys with missing titles
- **Data Cleaning**: Filters out invalid/empty responses
- **Real-time Processing**: Dynamic data transformation

### ⚡ Performance Optimizations
- **Local Storage Caching**: 30-minute cache for processed data
- **Memoized Calculations**: Efficient re-rendering with React hooks
- **Debounced Filtering**: Smooth filter updates
- **Progressive Loading**: Skeleton loaders during data fetching

### 🎛️ Advanced Filtering System
- **Time Range Filters**: Last 24 hours, 7 days, 30 days, 1 year
- **Response Threshold**: Show questions with minimum response counts
- **Real-time Updates**: Instant chart updates on filter changes
- **Smart Suggestions**: Helpful filter recommendations

### 📤 Export Capabilities
- **CSV Export**: Structured data for further analysis
- **High-Quality Image Export**: PNG export of charts and tables
- **Multiple View Modes**: Export tables or visualizations
- **Professional Formatting**: Ready for presentations and reports

## 🏗️ Project Structure

```
smm/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/        # OAuth and authentication
│   │   │   ├── Dashboard/   # Main dashboard interface
│   │   │   ├── Login/       # Login and authentication UI
│   │   │   ├── SurveyDetails/ # Advanced analytics components
│   │   │   └── NotFound/    # 404 error handling
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API integration services
│   │   └── theme.js         # MUI theme configuration
│   ├── public/              # Static assets
│   └── build/               # Production build files
└── backend/                 # Node.js backend server
    ├── index.js             # Main server file
    ├── exchangeToken.js     # OAuth token handling
    └── package.json         # Backend dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- SurveyMonkey API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/var-13/survey-management-system.git
   cd survey-management-system
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file with your SurveyMonkey credentials
   echo "SURVEYMONKEY_CLIENT_ID=your_client_id" > .env
   echo "SURVEYMONKEY_CLIENT_SECRET=your_client_secret" >> .env
   echo "SURVEYMONKEY_REDIRECT_URI=your_redirect_uri" >> .env
   
   # Start the backend server
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Start the frontend development server
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 Usage

### Dashboard Features
1. **Connect SurveyMonkey Account**: OAuth integration for secure access
2. **View Survey List**: Browse all available surveys
3. **Detailed Analytics**: Click on any survey for advanced insights
4. **Filter Data**: Use time range and response threshold filters
5. **Visualize Data**: Switch between Table, Bar, Pie, Line, and Trend views
6. **Export Results**: Download CSV data or high-quality chart images

### Analytics Capabilities
- **Response Patterns**: Identify trends in survey responses
- **Completion Rates**: Track survey completion statistics
- **Time-based Analysis**: View response patterns over time
- **Question Performance**: Analyze individual question effectiveness

## 🔧 API Integration

### SurveyMonkey Endpoints Used
- `/surveys` - Fetch survey list
- `/surveys/{id}` - Get survey details
- `/surveys/{id}/responses/bulk` - Fetch response data
- `/surveys/{id}/details` - Advanced survey structure

### Error Handling
- **Graceful Degradation**: Fallback endpoints for API failures
- **User-Friendly Messages**: Clear error communication
- **Retry Mechanisms**: Automatic retry for failed requests

## 🎨 UI/UX Features

### Professional Design
- **Material Design**: Consistent, modern interface
- **Dark/Light Mode**: Theme switching capability
- **Responsive Layout**: Mobile and desktop optimized
- **Loading States**: Skeleton loaders and progress indicators

### User Experience
- **Intuitive Navigation**: Clear routing and breadcrumbs
- **Real-time Feedback**: Snackbar notifications for actions
- **Empty States**: Helpful guidance when no data available
- **Filter Suggestions**: Smart recommendations for users

## 🔄 Development Workflow

### Code Quality
- **Component Architecture**: Modular, reusable components
- **State Management**: Efficient React hooks usage
- **Error Boundaries**: Graceful error handling
- **Performance Monitoring**: Debug information in development

### Build & Deployment
```bash
# Frontend production build
cd frontend
npm run build

# Backend production setup
cd backend
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📊 Project Statistics

- **Frontend Components**: 15+ reusable React components
- **Chart Types**: 5 different visualization options
- **API Endpoints**: 4+ SurveyMonkey API integrations
- **Filter Options**: Multiple time and threshold filters
- **Export Formats**: CSV and high-resolution PNG support

## 🔮 Future Enhancements

- **Real-time Data**: WebSocket integration for live updates
- **Advanced Analytics**: Statistical analysis and correlations
- **Custom Dashboards**: User-defined chart layouts
- **Collaboration Features**: Team sharing and commenting
- **Mobile App**: React Native mobile application
- **AI Insights**: Machine learning-powered analytics

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- SurveyMonkey API for data integration
- Material-UI team for excellent React components
- Recharts for beautiful data visualizations
- React team for the amazing framework

## 📞 Contact

**Developer**: Varsh  
**GitHub**: [@var-13](https://github.com/var-13)  
**Project Link**: [https://github.com/var-13/survey-management-system](https://github.com/var-13/survey-management-system)

---
**Built with ❤️ using React, Node.js, and SurveyMonkey API**
