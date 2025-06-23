import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import createCsvWriter from 'csv-writer';

const DATA_DIR = './data';

export interface CsvRecord {
  [key: string]: any;
}

class CsvStorage {
  private async readCsv(filename: string): Promise<CsvRecord[]> {
    const filePath = path.join(DATA_DIR, filename);
    const results: CsvRecord[] = [];
    
    if (!fs.existsSync(filePath)) {
      return [];
    }

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  private async writeCsv(filename: string, records: CsvRecord[]): Promise<void> {
    if (records.length === 0) return;
    
    const filePath = path.join(DATA_DIR, filename);
    const headers = Object.keys(records[0]).map(key => ({ id: key, title: key }));
    
    const csvWriter = createCsvWriter.createObjectCsvWriter({
      path: filePath,
      header: headers
    });

    await csvWriter.writeRecords(records);
  }

  // Organizations
  async getOrganizations(): Promise<CsvRecord[]> {
    return this.readCsv('organizations.csv');
  }

  async getOrganization(id: number): Promise<CsvRecord | undefined> {
    const orgs = await this.getOrganizations();
    return orgs.find(org => parseInt(org.id) === id);
  }

  async createOrganization(org: CsvRecord): Promise<CsvRecord> {
    const orgs = await this.getOrganizations();
    const maxId = orgs.length > 0 ? Math.max(...orgs.map(o => parseInt(o.id))) : 0;
    const newOrg = { ...org, id: (maxId + 1).toString() };
    orgs.push(newOrg);
    await this.writeCsv('organizations.csv', orgs);
    return newOrg;
  }

  // Users
  async getUsers(): Promise<CsvRecord[]> {
    return this.readCsv('users.csv');
  }

  async getUser(id: number | string): Promise<CsvRecord | undefined> {
    const users = await this.getUsers();
    const user = users.find(user => user.id == id);
    if (user) {
      return {
        ...user,
        id: parseInt(user.id),
        organization_id: parseInt(user.organization_id),
        is_active: user.is_active === 'true' || user.is_active === 't'
      };
    }
    return undefined;
  }

  async getUserByEmail(email: string): Promise<CsvRecord | undefined> {
    const users = await this.getUsers();
    return users.find(user => user.email === email);
  }

  async createUser(user: CsvRecord): Promise<CsvRecord> {
    const users = await this.getUsers();
    const maxId = users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) : 0;
    
    const newUser = {
      id: (maxId + 1).toString(),
      name: user.name,
      email: user.email,
      password_hash: user.password_hash,
      role: user.role,
      organization_id: user.organization_id.toString(),
      is_active: 't',
      default_module: user.default_module || 'Dashboard',
      access_matrix: user.access_matrix || '',
      last_login_at: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    users.push(newUser);
    await this.writeCsv('users.csv', users);
    
    return {
      ...newUser,
      id: parseInt(newUser.id),
      organization_id: parseInt(newUser.organization_id),
      is_active: true
    };
  }

  // Scorecards
  async getScorecards(): Promise<CsvRecord[]> {
    const scorecards = await this.readCsv('scorecards.csv');
    return scorecards.map(sc => ({
      ...sc,
      id: parseInt(sc.id),
      organization_id: parseInt(sc.organization_id),
      created_by: parseInt(sc.created_by),
      approved_by: sc.approved_by ? parseInt(sc.approved_by) : null,
      config_json: typeof sc.config_json === 'string' && sc.config_json !== '[object Object]' ? 
        (() => {
          try {
            return JSON.parse(sc.config_json);
          } catch (e) {
            return {};
          }
        })() : {},
      created_at: sc.created_at || new Date().toISOString(),
      updated_at: sc.updated_at || sc.created_at || new Date().toISOString(),
      approved_at: sc.approved_at || null
    }));
  }

  async getScorecard(id: number): Promise<CsvRecord | undefined> {
    const scorecards = await this.getScorecards();
    return scorecards.find(sc => sc.id === id);
  }

  async createScorecard(scorecard: CsvRecord): Promise<CsvRecord> {
    const scorecards = await this.getScorecards();
    const maxId = scorecards.length > 0 ? Math.max(...scorecards.map(sc => parseInt(sc.id))) : 0;
    const newScorecard = { ...scorecard, id: (maxId + 1).toString() };
    scorecards.push(newScorecard);
    await this.writeCsv('scorecards.csv', scorecards);
    return newScorecard;
  }

  // Simulation Results
  async getSimulationResults(): Promise<CsvRecord[]> {
    return this.readCsv('simulation_results.csv');
  }

  async createSimulationResult(result: CsvRecord): Promise<CsvRecord> {
    const results = await this.getSimulationResults();
    const maxId = results.length > 0 ? Math.max(...results.map(r => parseInt(r.id))) : 0;
    const newResult = { ...result, id: (maxId + 1).toString() };
    results.push(newResult);
    await this.writeCsv('simulation_results.csv', results);
    return newResult;
  }

  // Dashboard metrics
  async getDashboardMetrics(): Promise<any> {
    const [scorecards, simResults] = await Promise.all([
      this.getScorecards(),
      this.getSimulationResults()
    ]);

    const activeScoreCards = scorecards.filter(sc => sc.status === 'Active').length;
    const applicationsScored = simResults.length;
    const approvedApps = simResults.filter(r => ['A', 'B'].includes(r.bucket)).length;
    const approvalRate = applicationsScored > 0 ? (approvedApps / applicationsScored) * 100 : 0;

    return {
      activeScoreCards,
      applicationsScored,
      approvalRate: parseFloat(approvalRate.toFixed(1)),
      abTests: 0
    };
  }
}

export const csvStorage = new CsvStorage();