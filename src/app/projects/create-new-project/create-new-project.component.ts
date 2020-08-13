import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ProjectService } from '../../shared/services/project/project-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { autonumericCurrency, baseCurrencyUnitToCents, stripCurrencyData } from 'src/app/utilities/currency-util';

declare var $: any;

@Component({
    selector: 'app-create-new-project',
    templateUrl: './create-new-project.component.html',
    styleUrls: ['./create-new-project.component.css']
})
export class CreateNewProjectComponent implements OnInit, AfterViewInit {
    createProjectForm: FormGroup;

    constructor(private projectService: ProjectService,
                private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
        this.createProjectForm = this.fb.group({
            'name': [' ', Validators.required],
            'description': [' ', Validators.required],
            'colloqual': [' ', Validators.required],
            'startDate': [' ', Validators.required],
            'endDate': [' ', Validators.required],
            'expectedFunding': [' ', Validators.required],
            'minPerUser': [' ', Validators.required],
            'maxPerUser': [' ', Validators.required]
        });
    }

    submitForm() {
        if (!this.createProjectForm.valid) {
            return;
        }
        const formValue = this.createProjectForm.value;
        const date = moment(formValue.startDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        formValue.startDate = date;
        formValue.endDate = moment(formValue.endDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        formValue.location = 'abc';
        const orgID = this.activatedRoute.snapshot.params.orgId;

        SpinnerUtil.showSpinner();

        this.projectService.createProject(
            orgID,
            formValue.name,
            formValue.description,
            {
                'lat': 0,
                'long': 0
            },
            formValue.colloqual,
            {
                'from': 2.1,
                'to': 5.3
            },
            formValue.startDate,
            formValue.endDate,
            baseCurrencyUnitToCents(parseInt(stripCurrencyData(formValue.expectedFunding), 10)),
            'EUR',
            baseCurrencyUnitToCents(parseInt(stripCurrencyData(formValue.minPerUser), 10)),
            baseCurrencyUnitToCents(parseInt(stripCurrencyData(formValue.maxPerUser), 10)),
            false
        ).subscribe((res: any) => {
            SpinnerUtil.hideSpinner();
            this.router.navigate(['/dash', 'manage_groups', orgID.toString(), 'manage_project', res.uuid]);
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    ngOnInit() {
        $(document).ready(() => {
            autonumericCurrency('#min-per-user-input');
            autonumericCurrency('#max-per-user-input');
            autonumericCurrency('#expected-funding-input');
        });
    }

    ngAfterViewInit() {
    }

    submitButtonClicked() {
    }
}
