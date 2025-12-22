# RetentionAI: Employee Attrition Predictor & HR Assistant

## Overview

RetentionAI is an AI-powered HR assistant designed to predict employee attrition and provide insights to help organizations retain talent. The application combines machine learning models with a user-friendly web interface to analyze employee data and generate actionable recommendations.

## Features

- **Employee Attrition Prediction**: Machine learning model to predict which employees are at risk of leaving
- **Interactive Dashboard**: Web-based interface for HR managers to view predictions and insights
- **User Authentication**: Secure login and signup system
- **AI-Powered Recommendations**: Integration with Google Gemini for personalized retention strategies
- **Data Visualization**: Exploratory data analysis with graphs and charts
- **RESTful API**: Backend API for seamless integration

## Tech Stack

### Backend
- **FastAPI**: High-performance web framework for building APIs
- **SQLAlchemy**: ORM for database interactions
- **JWT Authentication**: Secure user authentication with bcrypt hashing
- **Google Gemini AI**: For generating HR insights and recommendations
- **Scikit-learn**: Machine learning library for prediction models
- **Pandas & NumPy**: Data processing and analysis

### Frontend
- **Next.js**: React framework for server-side rendering and static site generation
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library

### Machine Learning
- **Python**: Programming language for data science
- **Jupyter Notebook**: For exploratory data analysis
- **Scikit-learn**: Machine learning algorithms
- **Imbalanced-learn**: Handling imbalanced datasets
- **Seaborn & Matplotlib**: Data visualization

### Infrastructure
- **Docker**: Containerization for consistent deployment
- **Docker Compose**: Orchestrating multi-container applications

## Project Structure

```
RetentionAI-Employee-Attrition-Predictor-HR-Assistant/
├── docker-compose.yml          # Docker Compose configuration
├── backend/                    # FastAPI backend application
│   ├── main.py                 # Main application entry point
│   ├── requirements.txt        # Python dependencies
│   ├── dockerfile              # Docker configuration for backend
│   ├── api/                    # API endpoints
│   │   ├── autho.py            # Authentication routes
│   │   └── test.py             # Test endpoints
│   ├── generateback/           # Database models and schemas
│   │   ├── base.py             # Database base configuration
│   │   ├── models.py           # SQLAlchemy models
│   │   └── schemas.py          # Pydantic schemas
│   └── services/               # Business logic services
│       ├── gemini_client.py    # Google Gemini AI integration
│       └── test_mock.py        # Mock services for testing
├── frontend/                   # Next.js frontend application
│   ├── package.json            # Node.js dependencies
│   ├── next.config.ts          # Next.js configuration
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── dashboard/          # Dashboard page
│   │   ├── login/              # Login page
│   │   └── Signup/             # Signup page
│   └── public/                 # Static assets
├── ml/                         # Machine learning components
│   ├── EDA.ipynb               # Exploratory Data Analysis notebook
│   ├── requirements.txt        # Python dependencies for ML
│   ├── test_model.py           # Model testing script
│   ├── data/                   # Dataset directory
│   │   └── data.csv            # Employee dataset
│   └── graphs/                 # Generated visualizations
└── venv1/                      # Python virtual environment
```

## Prerequisites

Before running this application, ensure you have the following installed:

- **Docker**: Version 20.10 or later
- **Docker Compose**: Version 2.0 or later
- **Git**: For cloning the repository

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/RetentionAI-Employee-Attrition-Predictor-HR-Assistant.git
   cd RetentionAI-Employee-Attrition-Predictor-HR-Assistant
   ```

2. **Environment Setup:**
   - Create a `.env` file in the root directory with necessary environment variables (API keys, database URLs, etc.)
   - Create `frontend/.env.local` for frontend-specific environment variables

3. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

   This will start:
   - Backend API on `http://localhost:8000`
   - Frontend application on `http://localhost:3000`

## Usage

1. **Access the Application:**
   - Open your browser and navigate to `http://localhost:3000`
   - Create an account or log in

2. **Dashboard:**
   - View employee attrition predictions
   - Analyze risk factors
   - Get AI-powered retention recommendations

3. **API Usage:**
   - Backend API documentation available at `http://localhost:8000/docs` (Swagger UI)

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### Predictions
- `POST /predict` - Get attrition prediction for employee data

## Machine Learning Model

The ML component includes:

- **Exploratory Data Analysis**: Jupyter notebook for data exploration and visualization
- **Model Training**: Script to train attrition prediction model using employee data
- **Model Evaluation**: Testing and validation of the trained model

To run the ML pipeline locally:

1. Navigate to the `ml/` directory
2. Activate the virtual environment: `source venv1/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Run the EDA notebook: `jupyter notebook EDA.ipynb`
5. Test the model: `python test_model.py`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please open an issue on GitHub or contact the development team.