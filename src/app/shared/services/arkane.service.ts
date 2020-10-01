import { Injectable } from '@angular/core';
import {
    ArkaneConnect,
    PopupResult,
    Profile,
    SecretType,
    SignatureRequestType,
    SignerResult,
    Wallet,
    WindowMode
} from '@arkane-network/arkane-connect';
import { combineLatest, EMPTY, from, Observable, of, throwError } from 'rxjs';
import { Account } from '@arkane-network/arkane-connect/dist/src/models/Account';
import { catchError, find, map, switchMap, take, tap, timeout } from 'rxjs/operators';
import { WalletService, WalletState } from './wallet/wallet.service';
import { PopupService } from './popup.service';
import { displayBackendErrorRx } from '../../utilities/error-handler';
import { BroadcastService } from './broadcast.service';
import { TransactionInfo } from './wallet/wallet-cooperative/wallet-cooperative-wallet.service';

@Injectable({
    providedIn: 'root'
})
export class ArkaneService {
    secretType = SecretType.AETERNITY;
    arkaneConnect = new ArkaneConnect('AMPnet', {
        environment: 'staging',
    });

    constructor(private walletService: WalletService,
                private broadcastService: BroadcastService,
                private popupService: PopupService) {
    }

    getMatchedWallet(): Observable<Wallet> {
        return combineLatest([this.getUserWalletAddress(), this.getWallets()]).pipe(
            tap(([userWalletAddress, wallets]) => console.log('user wallet address and wallets', userWalletAddress, wallets)),
            switchMap(([userWalletAddress, wallets]) => {
                return userWalletAddress === null ?
                    this.arkaneWalletNotInitializedProcedure(wallets) :
                    this.arkaneWalletInitializedProcedure(userWalletAddress, wallets);
            })
        );
    }

    private getUserWalletAddress(): Observable<string> {
        return combineLatest([this.walletService.wallet$]).pipe(
            map(([wallet]) => wallet), take(1),
            tap(wallet => console.log('wallet in arkane service (take 1)', wallet)),
            map(wallet => wallet?.state !== WalletState.EMPTY ? wallet.wallet.activation_data : null)
        );
    }

    private arkaneWalletInitializedProcedure(userWalletAddress: string, wallets: Wallet[]) {
        return of(...wallets).pipe(
            find(w => w.address === userWalletAddress),
            switchMap(wallet => wallet !== undefined ? of(wallet) : this.arkaneWrongAccountProcedure())
        );
    }

    private arkaneWalletNotInitializedProcedure(wallets: Wallet[]): Observable<Wallet> {
        return of(wallets.length === 0).pipe(
            switchMap(noWallets => noWallets ?
                this.arkaneNoWalletsAvailableProcedure() :
                this.tryToInitWalletProcedure(wallets))
        );
    }

    private tryToInitWalletProcedure(wallets: Wallet[]): Observable<Wallet> {
        return of(...wallets).pipe(
            switchMap(wallet => this.walletService.initWallet(wallet.address).pipe(
                map(res => res.activation_data),
                catchError(err => err.error?.err_code === '0504' ? of(null) : throwError(err))
            )),
            find(value => value !== null),
            switchMap(newWalletAddress => newWalletAddress !== undefined ?
                this.getMatchedWallet().pipe(tap(() => this.walletService.clearAndRefreshWallet())) :
                this.arkaneWalletsAlreadyInUseProcedure()
            )
        );
    }

    private arkaneWalletsAlreadyInUseProcedure(): Observable<Wallet> {
        return this.popupService.info('Your wallets on Arkane are already in use. Please create a new wallet.').pipe(
            switchMap(popupRes => popupRes.dismiss === undefined ? this.manageWalletsFlow() : EMPTY),
            switchMap(manageFlowsRes => manageFlowsRes.status === 'SUCCESS' ? this.getMatchedWallet() : EMPTY)
        );
    }

    private arkaneNoWalletsAvailableProcedure(): Observable<Wallet> {
        return this.popupService.info('You will be prompted to create a new wallet on Arkane.').pipe(
            switchMap(popupRes => popupRes.dismiss === undefined ? this.manageWalletsFlow() : EMPTY),
            switchMap(manageFlowsRes => manageFlowsRes.status === 'SUCCESS' ? this.getMatchedWallet() : EMPTY)
        );
    }

    private arkaneWrongAccountProcedure(): Observable<Wallet> {
        return combineLatest([this.popupService.info('You are logged in with wrong Arkane account.'), this.logout()]).pipe(
            switchMap(([popupRes, _]) => popupRes.dismiss === undefined ? this.getAccountFlow() : EMPTY),
            switchMap(account => account.isAuthenticated ? this.getMatchedWallet() : EMPTY)
        );
    }

    getProfile(): Observable<Profile> {
        return this.ensureAuthenticated().pipe(
            switchMap(() => from(this.arkaneConnect.api.getProfile())),
            catchError(() => of(null)),
            tap(profile => console.log('getProfile', profile))
        );
    }

    getWallets(): Observable<Wallet[]> {
        return this.ensureAuthenticated().pipe(
            switchMap(() => from(this.arkaneConnect.api.getWallets({secretType: this.secretType}))),
            catchError(err => {
                console.log(err);
                return of(null);
            }),
            tap(wallets => console.log('getWallets', wallets))
        );
    }

    signAndBroadcastTx(txInfo: TransactionInfo) {
        return this.signTransaction(txInfo.tx).pipe(
            displayBackendErrorRx(),
            switchMap(arkaneRes => arkaneRes.status === 'SUCCESS' ?
                this.broadcastService.broadcastSignedTx(arkaneRes.result.signedTransaction, txInfo.tx_id).pipe(
                    displayBackendErrorRx()
                ) : throwError(arkaneRes.errors))
        );
    }

    private signTransaction(txToSign: Observable<string> | string): Observable<SignerResult> {
        return this.getMatchedWallet().pipe(
            switchMap(wallet => combineLatest([of(wallet), txToSign instanceof Observable ? txToSign : of(txToSign)])),
            switchMap(([wallet, txDataToSign]) => txDataToSign !== undefined ?
                from(this.arkaneConnect.createSigner(WindowMode.POPUP).sign({
                    walletId: wallet.id,
                    data: txDataToSign,
                    type: SignatureRequestType.AETERNITY_RAW
                })) : EMPTY
            ));
    }

    logout(): Observable<void> {
        return from(this.arkaneConnect.logout()).pipe(
            tap(() => console.log('logout'))
        );
    }

    getAccountFlow(): Observable<Account> {
        return from(this.arkaneConnect.flows.getAccount(this.secretType)).pipe(
            catchError(err => {
                console.log('error in getAccountFlow', err);
                return throwError(err);
            })
        );
    }

    manageWalletsFlow(): Observable<PopupResult> {
        return from(this.arkaneConnect.flows.manageWallets(this.secretType)).pipe(
            tap(console.log)
        );
    }

    // on Chrome (Brave) returns infinite loop of warnings in browser console.
    // After arkaneConnect.flows.getAccount, method does not ever respond back and gets stuck
    // in an endless loop.
    isAuthenticated(): Observable<boolean> {
        return from(this.arkaneConnect.checkAuthenticated().then(res => res.isAuthenticated)).pipe(
            timeout(10000),
            tap(isAuthenticated => console.log('isAuthenticated', isAuthenticated))
        );
    }

    isAuthenticatedByWallets(): Observable<boolean> {
        return from(this.arkaneConnect.api.getWallets({secretType: this.secretType})).pipe(
            catchError(() => of(null)),
            tap(res => console.log('isAuthenticatedByWallets res before map', res)),
            map(wallet => wallet !== null),
            tap(res => console.log('isAuthenticatedByWallets', res)),
        );
    }

    private ensureAuthenticated(): Observable<void> {
        // TODO: set isAuthenticated() when arkaneConnect.checkAuthenticated() will work properly.
        return this.isAuthenticatedByWallets().pipe(
            switchMap(signedIn => !signedIn ? this.getAccountFlow().pipe(
                map(account => account.isAuthenticated),
                catchError(() => of(false))
            ) : of(signedIn)),
            switchMap(signedIn => signedIn ? of(null) : EMPTY),
            catchError(err => {
                console.log('error in ensureAuthenticated', err);
                return throwError(err);
            })
        );
    }
}