import { Component, OnInit } from '@angular/core';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { ManageWithdrawModel } from './manage-withdraw-model';
import { WithdrawCooperativeService } from '../shared/services/wallet/withdraw.cooperative.service';

@Component({
    selector: 'app-manage-withdrawals',
    templateUrl: './manage-withdrawals.component.html',
    styleUrls: ['./manage-withdrawals.component.css']
})
export class ManageWithdrawalsComponent implements OnInit {

    withdrawals: ManageWithdrawModel[];

    constructor(private withdrawCooperativeService: WithdrawCooperativeService) {
    }

    ngOnInit() {
        this.getApprovedWithdrawals();
    }

    getApprovedWithdrawals() {
        SpinnerUtil.showSpinner();
        return this.withdrawCooperativeService.getApprovedWithdrawals().subscribe((res: any) => {
            SpinnerUtil.hideSpinner();
            this.withdrawals = res.withdraws;
        }, hideSpinnerAndDisplayError);
    }

}
