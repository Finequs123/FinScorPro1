# FinScoreIQ CSV Version - Downloadable Package

## Overview
Complete CSV-based version of FinScoreIQ with authentic data exported from the original database. This package removes PostgreSQL dependency and uses local file storage.

## Package Contents
- Complete source code with CSV storage implementation
- Authentic data exported to CSV files (organizations, users, scorecards, simulation results)
- Custom CSV storage engine
- All original functionality maintained

## Quick Start
1. Extract package
2. Run `npm install`
3. Run `npm run dev`
4. Login: admin@demo.com / password

## System Changes
- Database replaced with CSV file storage in `./data/` directory
- Authentication and API endpoints adapted for file-based operations
- All original features preserved: AI scorecard generation, dashboard metrics, user management

## Data Files
- `data/organizations.csv` - 1 organization record
- `data/users.csv` - 1 admin user with authentication
- `data/scorecards.csv` - 5 complete scorecard configurations  
- `data/simulation_results.csv` - 4 simulation results

## Verified Functionality
- User authentication working (JWT-based)
- Dashboard metrics calculated from CSV data
- AI scorecard generation functional
- All API endpoints operational

## Package Status
- **FIXED VERSION**: finscoreiq-csv-fixed.tar.gz 
- Authentication issues resolved
- Data type conversion corrected
- Frontend runtime errors eliminated

## Important Notes
- Development/testing use only
- Single-user access recommended
- No database transactions or complex queries
- Manual backup of CSV files required