import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api.service';
import { ProjectModel } from '../project/project-service';

@Injectable({
    providedIn: 'root'
})
export class PortfolioService {
    constructor(private http: BackendApiService) {
    }

    getPortfolioStats() {
        return this.http.get<PortfolioStats>(`/api/wallet/portfolio/stats`);
    }

    getPortfolio() {
        return this.http.get<PortfolioResponse>('/api/wallet/portfolio');
    }

    getInvestmentsInProject(projectID: string) {
        return this.http.get<InvestmentsInProject>(`/api/wallet/portfolio/project/${projectID}`);
    }

    generateCancelInvestmentTransaction(projectUUID: string) {
        return this.http.post<CancelInvestmentResponse>(`/api/wallet/invest/project/${projectUUID}/cancel`, {});
    }

    isInvestmentCancelable(projectWallet: string, userWallet: string) {
        return this.http.get<CancelableResult>(`/api/middleware/projects/${projectWallet}/investors/${userWallet}/cancelable`);
    }
}

export interface PortfolioStats {
    investments: number;
    earnings: number;
    date_of_first_investment: Date;
}

export interface PortfolioResponse {
    portfolio: Portfolio[];
}

export interface Portfolio {
    project: ProjectModel;
    investment: number;
}

export interface InvestmentsInProject {
    project: ProjectModel;
    transactions: TxData[];
}

export interface TxData {
    from_tx_hash: string;
    to_tx_hash: string;
    amount: number;
    type: string;
    date: string;
}

export interface CancelInvestmentResponse {
    tx: string;
    tx_id: number;
    info: {
        tx_type: string;
        title: string;
        description: string;
    };
}

interface CancelableResult {
    can_cancel: boolean;
}
