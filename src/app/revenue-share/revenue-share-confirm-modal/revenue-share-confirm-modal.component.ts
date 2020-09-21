import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SpinnerUtil } from '../../utilities/spinner-utilities';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import swal from 'sweetalert2';
import { hideSpinnerAndDisplayError } from '../../utilities/error-handler';
import { RevenueShareService } from '../../shared/services/wallet/revenue-share.service';
import { BroadcastService } from '../../shared/services/broadcast.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-revenue-share-confirm-modal',
    templateUrl: './revenue-share-confirm-modal.component.html',
    styleUrls: ['./revenue-share-confirm-modal.component.css']
})

export class RevenueShareConfirmModalComponent implements OnInit {
    orgID: string;
    projectID: string;
    amountInvestedConfirm: string;

    confirmForm: FormGroup;

    constructor(private router: Router,
                private bsModalRef: BsModalRef,
                private formBuilder: FormBuilder,
                private revenueShareService: RevenueShareService,
                private broadcastService: BroadcastService) {
    }

    ngOnInit(): void {
        this.confirmForm = this.formBuilder.group({
            amount: ['', [Validators.required, Validators.pattern(this.amountInvestedConfirm)]]
        });
    }

    generateTransaction(amountInvested: number) {
        SpinnerUtil.showSpinner();
        this.revenueShareService.generateRevenueShareTx(this.projectID, amountInvested)
            .subscribe(async (res) => {
                const arkaneConnect = new ArkaneConnect('AMPnet', {environment: 'staging'});
                const acc = await arkaneConnect.flows.getAccount(SecretType.AETERNITY);
                const sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
                    walletId: acc.wallets[0].id,
                    data: res.tx,
                    type: SignatureRequestType.AETERNITY_RAW
                });
                this.broadcastService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
                    .subscribe(_ => {
                        swal('', 'Successful revenue payout!', 'success').then(() => {
                            SpinnerUtil.hideSpinner();
                            this.router.navigate([`/dash/manage_groups/${this.orgID}/manage_project/${this.projectID}`]);
                        });
                    }, err => {
                        hideSpinnerAndDisplayError(err);
                    });
            }, err => {
                hideSpinnerAndDisplayError(err);
            });
    }

    onConfirm(): void {
        this.bsModalRef.hide();
        this.generateTransaction(this.confirmForm.controls['amount'].value);
    }

    onCancel(): void {
        this.bsModalRef.hide();
    }
}
