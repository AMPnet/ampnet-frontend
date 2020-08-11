import { Component, OnInit } from '@angular/core';
import { PortfolioService } from './portfolio.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { PortfolioRoot, PortfolioStats } from './portfolio.models';
import { WalletService } from '../wallet/wallet.service';
import { centsToBaseCurrencyUnit } from '../utilities/currency-util';


@Component({
    selector: 'app-my-portfolio',
    templateUrl: './my-portfolio.component.html',
    styleUrls: ['./my-portfolio.component.css']
})
export class MyPortfolioComponent implements OnInit {
    hasWallet = false;
    portfolio: PortfolioRoot[];
    stats: PortfolioStats;
    roi = 0;

    constructor(private portfolioService: PortfolioService,
                private walletService: WalletService) {
    }

    ngOnInit() {
        this.getTransactions();
    }

    getTransactions() {
        SpinnerUtil.showSpinner();

        this.walletService.getWallet().subscribe((walletRes: any) => {
            if (walletRes.hash !== undefined) { // Check if wallet was activated by admin
                this.portfolioService.getPortfolioStats().subscribe((portfolioStatsRes: any) => {
                    this.hasWallet = true;
                    this.stats = portfolioStatsRes;
                    this.stats.investments = centsToBaseCurrencyUnit(this.stats.investments);
                    if (this.stats.investments > 0) {
                        this.roi = ((this.stats.earnings + this.stats.investments) / (this.stats.investments) - 1) * 100;
                    }
                    SpinnerUtil.showSpinner();
                    this.portfolioService.getPortfolio().subscribe((portfolioRes: any) => {
                        this.portfolio = portfolioRes.portfolio;
                        SpinnerUtil.hideSpinner();
                    }, hideSpinnerAndDisplayError);
                }, hideSpinnerAndDisplayError);

            } else {
                SpinnerUtil.hideSpinner();
            }
        }, err => {
            SpinnerUtil.hideSpinner();
        });
    }
}
