import { Component, Input, OnInit } from '@angular/core';
import { ManagePaymentsService } from './manage-payments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletModel } from 'src/app/organizations/organization-details/organization-model';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { prettyCurrency } from 'src/app/utilities/currency-util';
import * as numeral from 'numeral';
import { ProjectService } from 'src/app/projects/project-service';
import { ProjectModel } from 'src/app/projects/create-new-project/project-model';

@Component({
    selector: 'app-manage-payments',
    templateUrl: './manage-payments.component.html',
    styleUrls: ['./manage-payments.component.css']
})
export class ManagePaymentsComponent implements OnInit {

    @Input() revenueShareAmount;
    projectWallet: WalletModel;
    projectModel: ProjectModel;

    constructor(private managePaymentsService: ManagePaymentsService,
                private route: ActivatedRoute,
                private router: Router,
                private projectService: ProjectService) {
    }

    ngOnInit() {
        const projID = this.route.snapshot.params.projectID;
        this.getProjectWallet(projID);
        this.getProject(projID);
        console.log(this.revenueShareAmount);
    }

    getProject(projectID: string) {
        SpinnerUtil.showSpinner();
        this.projectService.getProject(projectID).subscribe((res: any) => {
            SpinnerUtil.hideSpinner();
            this.projectModel = res;
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    getProjectWallet(projectID: number) {
        SpinnerUtil.showSpinner();
        this.managePaymentsService.getProjectWallet(projectID).subscribe((res: any) => {
            SpinnerUtil.hideSpinner();
            this.projectWallet = res;
            this.projectWallet.currency = prettyCurrency(res.currency);
            this.projectWallet.balance = numeral(res.balance).format('0,0');
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    startPayout() {
        const projID = this.route.snapshot.params.projectID;
        const orgID = this.route.snapshot.params.groupID;

        this.router.navigate(['/dash', 'manage_groups', orgID.toString(),
            'manage_project', projID, 'manage_payments', 'revenue_share', this.revenueShareAmount]);
    }
}
