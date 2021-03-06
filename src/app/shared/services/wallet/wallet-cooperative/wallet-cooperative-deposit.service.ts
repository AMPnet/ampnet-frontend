import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../../backend-http-client.service';
import { Project } from '../../project/project.service';
import { User } from '../../user/signup.service';
import { TransactionInfo } from '../wallet.service';

@Injectable({
    providedIn: 'root'
})
export class WalletCooperativeDepositService {
    private endpoint = '/api/wallet/cooperative/deposit';

    constructor(private http: BackendHttpClient) {
    }

    getDeposit(reference: string) {
        return this.http.get<DepositSearchResponse>(`${this.endpoint}/search`, {
            reference: reference
        });
    }

    approveDeposit(depositID: number, amount: number, document: File) {
        const formData = new FormData();

        formData.append('amount', String(amount));
        formData.append('file', document, document.name);

        return this.http.post<Deposit>(`${this.endpoint}/${depositID}/approve`, formData);
    }

    getUnapprovedDeposits() {
        return this.http.get<DepositListResponse>(`${this.endpoint}/unapproved`);
    }

    getApprovedDeposits() {
        return this.http.get<DepositListResponse>(`${this.endpoint}/approved`);
    }

    deleteDeposit(id: number) {
        return this.http.delete<Deposit>(`${this.endpoint}/${id}`);
    }

    generateDepositMintTx(id: number) {
        return this.http.post<TransactionInfo>(`${this.endpoint}/${id}/transaction`, {});
    }
}

export interface DepositSearchResponse {
    deposit: Deposit;
    user: User;
    project: Project;
}

interface Deposit {
    id: number;
    owner: string;
    reference: string;
    created_at: Date;
    created_by: string;
    type: string;
    approved_at?: any;
    amount: number;
    document_response?: {
        id: number;
        link: string;
        name: string;
        type: string;
        size: number;
        created_at: Date;
    };
    tx_hash?: string;
    declined_at?: Date;
    declined_comment?: string;
}

interface DepositListResponse {
    deposits: DepositSearchResponse[];
    page: number;
    total_pages: number;
}
