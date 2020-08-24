import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { TransactionInfo } from './wallet-cooperative/wallet-cooperative-wallet.service';

@Injectable({
    providedIn: 'root'
})
export class WithdrawService {
    endpoint = '/api/wallet/withdraw';
    coopEndpoint = '/api/wallet/cooperative/withdraw';

    constructor(private http: BackendHttpClient) {
    }

    createWithdrawRequest(amount: number, iban: string) {
        return this.http.post<Withdraw>(this.endpoint, {
            amount: amount.toString(),
            bank_account: iban
        });
    }

    generateApproveWithdrawTx(withdrawID: number) {
        return this.http.post<TransactionInfo>(`${this.endpoint}/${withdrawID}/transaction/approve`, {});
    }

    generateBurnWithdrawTx(withdrawID: number) {
        return this.http.post<TransactionInfo>(`${this.coopEndpoint}/${withdrawID}/transaction/burn`, {});
    }

    getMyPendingWithdraw() {
        return this.http.get<Withdraw>(this.endpoint);
    }

    deleteWithdrawal(id: any) {
        return this.http.delete<void>(`${this.endpoint}/${id}`);
    }
}

export interface Withdraw {
    id: number;
    owner: string;
    amount: number;
    approved_tx_hash?: string;
    approved_at?: Date;
    burned_tx_hash?: any;
    burned_by?: any;
    burned_at?: any;
    bank_account: string;
    created_at: Date;
    document_response?: WithdrawDocument;
}

export interface WithdrawDocument {
    id: number;
    link: string;
    name: string;
    type: string;
    size: number;
    created_at: Date;
}