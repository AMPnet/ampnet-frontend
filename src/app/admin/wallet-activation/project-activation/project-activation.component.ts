import { Component, OnInit } from '@angular/core';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import {
    CooperativeProject,
    WalletCooperativeWalletService
} from '../../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../../shared/services/arkane.service';
import { PopupService } from '../../../shared/services/popup.service';
import { ErrorService } from '../../../shared/services/error.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-project-activation',
    templateUrl: './project-activation.component.html',
    styleUrls: ['./project-activation.component.css']
})
export class ProjectActivationComponent implements OnInit {
    projects: CooperativeProject[];

    constructor(private activationService: WalletCooperativeWalletService,
                private arkaneService: ArkaneService,
                private errorService: ErrorService,
                private translate: TranslateService,
                private popupService: PopupService) {
    }

    ngOnInit() {
        this.fetchUnactivatedProjectWallets();
    }

    fetchUnactivatedProjectWallets() {
        SpinnerUtil.showSpinner();
        this.activationService.getUnactivatedProjectWallets().pipe(
            this.errorService.handleError,
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe((res) => {
            this.projects = res.projects;
        });
    }

    activateProject(projectUUID: string) {
        SpinnerUtil.showSpinner();
        return this.activationService.activateWallet(projectUUID).pipe(
            this.errorService.handleError,
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: this.translate.instant('general.transaction_signed.title'),
                text: this.translate.instant('general.transaction_signed.description')
            })),
            tap(() => this.fetchUnactivatedProjectWallets()),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }
}
