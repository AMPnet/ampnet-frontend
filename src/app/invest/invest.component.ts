import { Component, OnInit } from '@angular/core';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { displayBackendError, displayBackendErrorRx } from '../utilities/error-handler';
import { Project, ProjectService } from '../shared/services/project/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { catchError, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { DetailsResult, PortfolioService } from '../shared/services/wallet/portfolio.service';
import { MiddlewareService, ProjectWalletInfo } from '../shared/services/middleware/middleware.service';
import { CurrencyDefaultPipe } from '../shared/pipes/currency-default.pipe';

@Component({
    selector: 'app-invest',
    templateUrl: './invest.component.html',
    styleUrls: ['./invest.component.scss'],
})
export class InvestComponent implements OnInit {
    project$: Observable<Project>;
    projectWalletMW$: Observable<ProjectWalletInfo>;
    investment$: Observable<DetailsResult>;

    maxInvestReached = false;
    minUserInvest: number;
    maxUserInvest: number;
    totalInvestment: number;

    oneYearReturn: string;
    fiveYearsReturn: string;
    tenYearsReturn: string;

    investForm: FormGroup;

    constructor(private walletService: WalletService,
                private projectService: ProjectService,
                private portfolioService: PortfolioService,
                private middlewareService: MiddlewareService,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private router: Router,
                private currencyPipe: CurrencyDefaultPipe) {
        const projectID = this.route.snapshot.params.id;
        this.project$ = this.projectService.getProject(projectID).pipe(this.handleError, shareReplay(1));
        this.projectWalletMW$ = this.walletService.getProjectWallet(projectID).pipe(
            displayBackendErrorRx(),
            switchMap(projectWallet => {
                return this.middlewareService.getProjectWalletInfoCached(projectWallet.hash).pipe(
                    displayBackendErrorRx(),
                );
            }),
        );

        this.investment$ = combineLatest([this.projectWalletMW$, this.walletService.wallet$]).pipe(take(1),
            switchMap(([projectWallet, wallet]) => {
                return this.portfolioService.investmentDetails(projectWallet.projectHash, wallet.wallet.hash).pipe(
                    displayBackendErrorRx()).pipe(
                    tap(res => {
                            const maxInvest = projectWallet.maxPerUserInvestment;
                            const minInvest = projectWallet.minPerUserInvestment;
                            const amountInvested = res.amountInvested;

                            if (amountInvested > minInvest && amountInvested < maxInvest) {
                                this.minUserInvest = 0;
                                this.maxUserInvest = maxInvest - amountInvested;
                            } else {
                                this.minUserInvest = minInvest;
                                this.maxUserInvest = maxInvest;
                            }

                            if (amountInvested === maxInvest) {
                                this.maxInvestReached = true;
                            }
                        }
                    ));
            })
        );
    }

    ngOnInit() {
        this.investForm = this.fb.group({
            amount: ['', [Validators.required], this.validAmount.bind(this)]
        });
    }

    private validAmount(control: AbstractControl): Observable<ValidationErrors> {
        return combineLatest([this.project$, this.investment$]).pipe(
            map(([project, investment]) => {
                    const amount = control.value;
                    const amountInvested = investment.amountInvested;

                    if (project.roi === null || project.roi === undefined) {
                        return null;
                    }

                    if (amount < this.minUserInvest) {
                        return {amountBelowMin: true};
                    } else if (amount > this.maxUserInvest) {
                        return {amountAboveMax: true};
                    } else if (amount > project.expected_funding) {
                        return {amountAboveExpFunding: true};
                    } else if (amount > investment.walletBalance) {
                        return {amountAboveBalance: true};
                    } else {
                        this.totalInvestment = amountInvested + amount;
                        this.oneYearReturn = this.calculateReturn(this.totalInvestment, 1, project.roi.from, project.roi.to);
                        this.fiveYearsReturn = this.calculateReturn(this.totalInvestment, 5, project.roi.from, project.roi.to);
                        this.tenYearsReturn = this.calculateReturn(this.totalInvestment, 10, project.roi.from, project.roi.to);
                        return null;
                    }
                }
            )
        );
    }

    calculateReturn(totalInvestment: number, year: number, roiFrom: number, roiTo: number) {
        return (this.currencyPipe.transform(Math.floor(totalInvestment * (roiFrom * year)))) + ' - '
            + (this.currencyPipe.transform(Math.trunc(totalInvestment * (roiTo * year))));
    }

    investButtonClicked() {
        this.router.navigate(['./',
                this.investForm.controls['amount'].value,
                'verify_sign'],
            {relativeTo: this.route});
    }

    private handleError<T>(source: Observable<T>) {
        return source.pipe(
            catchError(err => {
                displayBackendError(err);
                return EMPTY;
            })
        );
    }

    backToSingleOfferScreen(uuid: string) {
        this.router.navigate([`/dash/offers/${uuid}`]);
    }
}
