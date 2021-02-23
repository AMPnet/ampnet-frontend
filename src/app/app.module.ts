// tslint:disable:max-line-length
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { WalletComponent } from './wallet/wallet.component';
import { OffersComponent } from './offers/offers.component';
import { SingleOfferItemComponent } from './offers/single-offer-item/single-offer-item.component';
import { OfferComponent } from './offers/offer/offer.component';
import { MyPortfolioComponent } from './my-portfolio/my-portfolio.component';
import { SingleInvestItemComponent } from './my-portfolio/single-invest-item/single-invest-item.component';
import { PaymentOptionsComponent } from './payment-options/payment-options.component';
import { FooterComponent } from './footer/footer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { SecureLayoutComponent } from './secure-layout/secure-layout.component';
import { HeaderComponent } from './public-layout/header/header.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { NewPaymentOptionComponent } from './payment-options/new-payment-option/new-payment-option.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SocialLoginModule } from 'angularx-social-login';
import { CreateNewProjectComponent } from './organizations/organization-details/manage-projects/create-new-project/create-new-project.component';
import { ManageProjectsComponent } from './organizations/organization-details/manage-projects/manage-projects.component';
import { ManageSingleProjectComponent } from './organizations/organization-details/manage-projects/manage-single-project/manage-single-project.component';
import { ManagePaymentsComponent } from './organizations/organization-details/manage-projects/manage-single-project/manage-payments/manage-payments.component';
import { ManageWithdrawalsComponent } from './admin/manage-withdrawals/manage-withdrawals.component';
import { SingleWithdrawalComponent } from './admin/manage-withdrawals/single-withdrawal/single-withdrawal.component';
import { DepositComponent } from './deposit/deposit.component';
import { ManageDepositsComponent } from './admin/manage-deposits/manage-deposits.component';
import { ManageSingleDepositComponent } from './admin/manage-deposits/manage-single-deposit/manage-single-deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { WalletActivationComponent } from './admin/wallet-activation/wallet-activation.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PlatformBankAccountComponent } from './admin/platform-bank-account/platform-bank-account.component';
import { NewPlatformBankAccountComponent } from './admin/platform-bank-account/new-platform-bank-account/new-platform-bank-account.component';
import { ExchangeComponent } from './exchange/exchange.component';
import { OwnershipComponent } from './admin/ownership/ownership.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TxAmountSign } from './wallet/wallet.pipe';
import { UserStateReminderComponent } from './user-state-reminder/user-state-reminder.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LocationMapComponent } from './location-map/location-map.component';
import { MapModalComponent } from './location-map/map-modal/map-modal.component';
import { environment } from '../environments/environment.prod';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ManageSingleDepositModalComponent } from './admin/manage-deposits/manage-single-deposit/manage-single-deposit-modal/manage-single-deposit-modal.component';
import { RevenueShareComponent } from './organizations/organization-details/manage-projects/manage-single-project/manage-payments/revenue-share/revenue-share.component';
import { RevenueShareConfirmModalComponent } from './organizations/organization-details/manage-projects/manage-single-project/manage-payments/revenue-share/revenue-share-confirm-modal/revenue-share-confirm-modal.component';
import { ProjectDepositComponent } from './organizations/organization-details/manage-projects/manage-single-project/project-deposit/project-deposit.component';
import { ProjectWithdrawComponent } from './organizations/organization-details/manage-projects/manage-single-project/project-withdraw/project-withdraw.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { APP_BASE_HREF } from '@angular/common';
import { SignInAutoComponent } from './authentication/sign-in-auto/sign-in-auto.component';
import { AppConfigService } from './shared/services/app-config.service';
import { ClickOutsideDirective } from './navbar/directives/click-outside.directive';
import { UserComponent } from './settings/user/user.component';
import { IdentityComponent } from './settings/user/identity/identity.component';
import { SingleProjectItemComponent } from './organizations/organization-details/manage-projects/single-project-item/single-project-item.component';
import { AuthLayoutComponent } from './authentication/auth-layout/auth-layout.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NewInstanceComponent } from './authentication/new-instance/new-instance.component';
import { PlatformConfigComponent } from './admin/platform-config/platform-config.component';
import { QuillModule } from 'ngx-quill';
import { DynamicLocaleProvider } from './shared/providers/locale.provider';
import { SentryProvider } from './shared/providers/sentry.provider';
import { VeriffComponent } from './settings/user/identity/veriff/veriff.component';
import { AcceptTermsComponent } from './settings/user/identity/accept-terms/accept-terms.component';
import { IdentyumComponent } from './settings/user/identity/identyum/identyum.component';
import { StaticPageComponent } from './static-page/static-page.component';
import { FaIconsService } from './shared/services/fa-icons.service';
import { LanguageService } from './shared/services/language.service';
import { SharedModule } from './shared/shared.module';
import { OfferInvestComponent } from './offers/offer-invest/offer-invest.component';
import { OfferInvestVerifyComponent } from './offers/offer-invest-verify/offer-invest-verify.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectNewComponent } from './projects/project-new/project-new.component';
import { ProjectEditComponent } from './projects/project-edit/project-edit.component';
import { GroupComponent } from './groups/group/group.component';
import { GroupNewComponent } from './groups/group-new/group-new.component';
import { GroupEditComponent } from './groups/group-edit/group-edit.component';

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        NavbarComponent,
        WalletComponent,
        OffersComponent,
        SingleOfferItemComponent,
        OfferComponent,
        OfferInvestComponent,
        OfferInvestVerifyComponent,
        MyPortfolioComponent,
        SingleInvestItemComponent,
        ProjectsComponent,
        ProjectNewComponent,
        ProjectEditComponent,
        GroupComponent,
        GroupNewComponent,
        GroupEditComponent,
        PaymentOptionsComponent,
        FooterComponent,
        LandingPageComponent,
        PublicLayoutComponent,
        SecureLayoutComponent,
        HeaderComponent,
        SignUpComponent,
        NewPaymentOptionComponent,
        CreateNewProjectComponent,
        AcceptTermsComponent,
        VeriffComponent,
        IdentyumComponent,
        ManageProjectsComponent,
        ManageSingleProjectComponent,
        SingleProjectItemComponent,
        ManagePaymentsComponent,
        ManageWithdrawalsComponent,
        SingleWithdrawalComponent,
        DepositComponent,
        ManageDepositsComponent,
        ManageSingleDepositComponent,
        WithdrawComponent,
        WalletActivationComponent,
        PlatformBankAccountComponent,
        NewPlatformBankAccountComponent,
        ExchangeComponent,
        OwnershipComponent,
        RevenueShareComponent,
        UserStateReminderComponent,
        RevenueShareConfirmModalComponent,
        LocationMapComponent,
        MapModalComponent,
        ManageSingleDepositModalComponent,
        TxAmountSign,
        ProjectDepositComponent,
        ProjectWithdrawComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        SignInAutoComponent,
        ClickOutsideDirective,
        SignInAutoComponent,
        UserComponent,
        IdentityComponent,
        AuthLayoutComponent,
        SignInComponent,
        NewInstanceComponent,
        PlatformConfigComponent,
        StaticPageComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        SharedModule,
        SocialLoginModule,
        NgbModule,
        ModalModule.forRoot(),
        QuillModule.forRoot(),
        BsDatepickerModule.forRoot(),
        NgxCaptchaModule
    ],
    providers: [
        AppConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: (config: AppConfigService, lang: LanguageService) =>
                () => Promise.resolve()
                    .then(() => config.load().toPromise())
                    .then(() => lang.setLanguage().toPromise()),
            multi: true,
            deps: [AppConfigService, LanguageService]
        },
        {
            provide: APP_BASE_HREF,
            useValue: environment.baseHref,
        },
        {
            provide: DEFAULT_CURRENCY_CODE,
            useValue: 'EUR', // TODO: Set this from app config service.
        },
        DynamicLocaleProvider,
        SentryProvider,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(faIconsService: FaIconsService) {
        faIconsService.addIcons();
    }
}
