📝 Overview
Automated EDA Report Generator with LLM is a full-stack, AI-powered web application designed to simplify the Exploratory Data Analysis (EDA) process. Normally, data analysts spend hours manually inspecting datasets using Excel or Python to find missing values, duplicates, and correlations.

This application automates the entire workflow: users can simply upload a CSV or Excel file, and the system automatically performs deep statistical analysis, generates interactive visualizations, detects outliers, and uses a Large Language Model (LLM) to explain the findings in simple, human-readable language. Finally, users can download a professional, AI-generated PDF report of the analysis.

✨ Key Features
Secure Authentication: JWT-based Login and Registration system to keep user data and analyses private.

Dataset Upload & Validation: Drag-and-drop file upload (React Dropzone) supporting .csv, .xlsx, and .xls formats with size and type validation.

Automated EDA Engine:

Data Inspection: Automatically calculates Total Rows and Columns.

Quality Checks: Detects Missing Values and Duplicate Rows.

Statistical Summary: Calculates Mean, Median, Min, Max, and Standard Deviation for numeric columns.

Outlier Detection: Uses the Interquartile Range (IQR) method to flag unusual data points.

Interactive Visualizations: Uses Chart.js to display data distributions and missing value charts for quick insights.

AI-Powered Insights (LLM): Integrates with AI models (like Google Gemini / OpenAI) to generate plain-English summaries, data quality warnings, and actionable recommendations based on the statistical results.

Automated PDF Reports: Generates and downloads a structured PDF report containing all statistics, charts, and AI insights using PDFKit.

Analysis History: Maintains a complete history of all uploaded datasets and generated reports for future reference.

🛠️ Technology Stack
Frontend:

React.js (Vite): For a fast, component-based user interface.

React Router DOM: For seamless navigation between pages.

Axios: For handling HTTP requests to the backend.

Chart.js / React-Chartjs-2: For rendering statistical visualizations.

React Dropzone: For a smooth file upload experience.

React Icons & Custom CSS: For a modern, responsive design.

Backend:

Node.js & Express.js: For building the RESTful API and server-side logic.

MongoDB & Mongoose: NoSQL database for storing user data, dataset metadata, and reports.

Multer: Middleware for handling multipart/form-data (file uploads).

csv-parse & xlsx: For parsing uploaded CSV and Excel files into structured JSON.

simple-statistics: For performing mathematical and statistical calculations.

PDFKit: For dynamically generating downloadable PDF reports.

JWT & Bcrypt.js: For secure authentication and password hashing.

Google Gemini API / OpenAI API: For generating LLM-based data insights.

🚀 How It Works (Workflow)
Register/Login: The user creates an account and securely logs into the dashboard.

Upload Dataset: The user uploads a dataset (CSV or Excel).

Processing: The backend validates the file, parses it, and saves the metadata to MongoDB.

EDA Engine: The system runs statistical calculations (missing values, outliers, correlations).

AI Analysis: The calculated results are sent to the LLM, which generates explanations and recommendations.

Visualize & Report: The user views the results on interactive charts and can download a comprehensive PDF report.

🎯 Use Cases
This tool is highly useful for:

Data Analysts who need a quick preliminary overview of a new dataset.

Students learning data science who want automated explanations of statistical concepts.

Businesses looking to quickly generate automated reports on their sales or employee data without writing code.