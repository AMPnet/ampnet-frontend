import { Component, OnInit } from '@angular/core';
import { Project, ProjectService } from '../../shared/services/project/project.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { EMPTY, Observable, throwError } from 'rxjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'app-create-new-project',
    templateUrl: './create-new-project.component.html',
    styleUrls: ['./create-new-project.component.css'],
})
export class CreateNewProjectComponent {
    createForm: FormGroup;
    mapLat: number;
    mapLong: number;
    projectCoords = [];
    bsConfig: Partial<BsDatepickerConfig>;

    constructor(private projectService: ProjectService,
                private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private router: Router) {

        this.createForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            startDate: [null, Validators.required],
            endDate: [null, Validators.required],
            expectedFunding: ['', Validators.required],
            minPerUser: [null, Validators.required],
            maxPerUser: [null, Validators.required]
        }, {
            validator: Validators.compose([
                DateValidators.dateLessThan('startDate', 'endDate', {'start-date': true}),
                DateValidators.dateLessThan('startDate', 'endDate', {'end-date': true}),
                MinInvestUserValidator.investLessThan('minPerUser', {'min-invest-invalid': true}),
                MaxInvestUserValidator.investLessThan('minPerUser', 'maxPerUser', {'max-invest-invalid': true}),
                MaxInvestProjectValidator.investLessThan('maxPerUser', {'max-project-invest-invalid': true})
            ])
        });
    }

    submitForm() {
        const formValue = this.createForm.value;
        formValue.startDate = moment(formValue.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        formValue.endDate = moment(formValue.endDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        const orgID = this.activatedRoute.snapshot.params.orgId;

        return this.projectService.createProject({
            organization_uuid: orgID,
            name: formValue.name,
            description: formValue.description,
            location: {lat: this.mapLat, long: this.mapLong},
            roi: {from: 2.1, to: 5.3},
            start_date: formValue.startDate,
            end_date: formValue.endDate,
            expected_funding: formValue.expectedFunding,
            currency: 'EUR',
            min_per_user: formValue.minPerUser,
            max_per_user: formValue.maxPerUser,
            active: false
        }).pipe(
            tap(project => {
                this.router.navigate([`/dash/manage_groups/${orgID}/manage_project/${project.uuid}`]);
            }),
            catchError(err => {
                displayBackendError(err);
                return throwError(err);
            })
        );
    }

    setDatepickerOptions() {
        this.bsConfig = Object.assign({}, {
            showTodayButton: true,
            todayPosition: 'right',
            containerClass: 'theme-default',
            isAnimated: true,
            dateInputFormat: 'DD-MM-YYYY'
        });
    }
}

export class MaxInvestUserValidator {
    static investLessThan(minPerUserField: string, maxPerUserField: string, validatorField: { [key: string]: boolean }): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const minPerUser = c.get(minPerUserField).value;
            const maxPerUser = c.get(maxPerUserField).value;

            if (minPerUser > maxPerUser) {
                return validatorField;
            }

            return null;
        };
    }
}

export class MinInvestUserValidator {
    static investLessThan(minPerUserField: string, validatorField: { [key: string]: boolean }): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const minPerUser = c.get(minPerUserField).value;

            if (minPerUser <= 0) {
                return validatorField;
            }

            return null;
        };
    }
}

export class MaxInvestProjectValidator {
    static investLessThan(minPerUserField: string, validatorField: { [key: string]: boolean }): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const minPerUser = c.get(minPerUserField).value;

            // max investment per user <= investment cap

            if (minPerUser <= 0) {
                return validatorField;
            }

            return null;
        };
    }
}

export class DateValidators {
    static dateLessThan(dateFieldStart: string, dateFieldEnd: string, validatorField: { [key: string]: boolean }): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const startDate = c.get(dateFieldStart).value;
            const endDate = c.get(dateFieldEnd).value;
            if ((startDate !== null && endDate !== null) && startDate > endDate) {
                return validatorField;
            }
            return null;
        };
    }
}
