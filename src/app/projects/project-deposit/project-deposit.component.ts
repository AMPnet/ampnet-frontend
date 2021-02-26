import { Component } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { Deposit, DepositServiceService } from '../../shared/services/wallet/deposit-service.service';
import { PlatformBankAccount, PlatformBankAccountService } from '../../shared/services/wallet/platform-bank-account.service';
import { AppConfigService } from '../../shared/services/app-config.service';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../shared/services/router.service';
import { PopupService } from '../../shared/services/popup.service';
import { ErrorService, WalletError } from '../../shared/services/error.service';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-project-deposit',
    templateUrl: './project-deposit.component.html',
    styleUrls: ['./project-deposit.component.scss']
})
export class ProjectDepositComponent {
    deposit$: Observable<Deposit>;
    bankAccount$: Observable<PlatformBankAccount>;

    constructor(public appConfig: AppConfigService,
                private depositService: DepositServiceService,
                private route: ActivatedRoute,
                private router: RouterService,
                private popupService: PopupService,
                private errorService: ErrorService,
                private translate: TranslateService,
                private bankAccountService: PlatformBankAccountService) {
        const projectUUID = this.route.snapshot.params.id;

        this.deposit$ = this.depositService.getProjectPendingDeposit(projectUUID).pipe(
            this.errorService.handleError,
            catchError(err => err.status === 404 ? this.generateDepositInfo(projectUUID) : this.recoverBack())
        );

        this.bankAccount$ = this.bankAccountService.bankAccounts$.pipe(
            this.errorService.handleError,
            map(res => res.bank_accounts[0]),
            shareReplay(1)
        );
    }

    generateDepositInfo(projectUUID: string) {
        return this.depositService.createProjectDeposit(projectUUID).pipe(
            catchError(err =>
                err.error.err_code === WalletError.UNAPPROVED_DEPOSIT_EXISTS ? this.popupService.info(
                    this.translate.instant('projects.deposit.existing_deposit')
                ).pipe(switchMap(() => this.recoverBack())) : this.recoverBack()),
            this.errorService.handleError,
        );
    }

    private recoverBack(): Observable<never> {
        this.router.navigate(['../'], {relativeTo: this.route});
        return EMPTY;
    }
}
