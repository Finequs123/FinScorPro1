# FinScoreIQ CSV Version - Download Package

## Package Contents
This downloadable package contains the complete CSV-based version of FinScoreIQ with the following features:

### Included Files
- **Source Code**: Complete application with CSV storage implementation
- **Authentic Data**: Exported from original database to CSV files
- **CSV Storage Engine**: Custom-built file-based storage system
- **Documentation**: Complete setup and usage instructions

### CSV Data Files (./data/)
- `organizations.csv` - 1 organization record
- `users.csv` - 1 admin user with authentication
- `scorecards.csv` - 5 complete scorecard configurations
- `simulation_results.csv` - 4 simulation result records

### Key Features Maintained
- User authentication and authorization
- AI scorecard generation
- Dashboard metrics calculation
- Organization management
- Complete admin interface

### Installation Instructions
1. Extract the zip file
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the application
4. Login with: admin@demo.com / password

### System Architecture
- **Storage**: CSV files instead of PostgreSQL
- **Authentication**: JWT-based with CSV user lookup
- **Data Persistence**: File-based with automatic CSV read/write
- **API**: RESTful endpoints adapted for CSV storage

### Limitations
- Single-user concurrent access
- No database transactions
- Manual data backup required
- No complex query capabilities
- Development mode only

### File Structure
```
./data/                 # CSV data files
./server/csv-storage.ts # CSV storage engine
./server/routes-csv.ts  # CSV-adapted API routes
./CSV_MODE_ALERT.md     # Important usage warnings
```

### Ready for Download
Package size: ~2-3MB (excluding node_modules)
All authentic data preserved from original database.