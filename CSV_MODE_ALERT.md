# CSV FALLBACK MODE ACTIVATED

Your application has been reconfigured to use CSV-based local data instead of PostgreSQL database.

## WARNING: DEVELOPMENT MODE ONLY
- No support for complex joins, filters, or transactions
- All data stored in local CSV files in ./data/ directory
- No database constraints or referential integrity
- Single-user, non-concurrent access only

## CSV Files Created:
- `./data/organizations.csv` - Organization data exported from database
- `./data/users.csv` - User accounts with authentication data
- `./data/scorecards.csv` - Scorecard configurations and settings
- `./data/simulation_results.csv` - Historical simulation results

## System Changes:
- Database routes replaced with CSV-based storage
- Authentication still functional using CSV user data
- AI scorecard generation adapted for file storage
- Dashboard metrics calculated from CSV data

## Limitations:
- No real-time data consistency
- No transaction support
- No complex query capabilities
- Manual data backup required

## Usage:
Application runs normally but reads/writes from CSV files instead of database. All existing functionality maintained but simplified for local file storage.

**DO NOT USE IN PRODUCTION ENVIRONMENTS**