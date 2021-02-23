import { Component, Input, OnInit } from '@angular/core';
import { Project, ProjectService, ProjectWallet } from '../../../../shared/services/project/project.service';
import { MiddlewareService, ProjectWalletInfo } from '../../../../shared/services/middleware/middleware.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ErrorService } from '../../../../shared/services/error.service';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../../../shared/services/router.service';
import { enterTrigger } from '../../../../shared/animations';

@Component({
    selector: 'app-single-project-item, [app-single-project-item]',
    templateUrl: './single-project-item.component.html',
    styleUrls: [
        '../manage-projects.component.scss',
        './single-project-item.component.scss'
    ],
    animations: [enterTrigger]
})
export class SingleProjectItemComponent implements OnInit {
    @Input() projectWallet: ProjectWallet;
    @Input() isPublic;
    walletInfo$: Observable<ProjectWalletInfo>;

    constructor(private middlewareService: MiddlewareService,
                private errorService: ErrorService,
                private projectService: ProjectService,
                private route: ActivatedRoute,
                private router: RouterService) {
    }

    ngOnInit() {
        this.walletInfo$ = this.middlewareService.getProjectWalletInfoCached(this.projectWallet.wallet?.hash || '');
    }

    toggleProject(project: Project) {
        return () => {
            return this.projectService.updateProject(project.uuid, {
                active: !project.active
            }).pipe(
                this.errorService.handleError,
                tap(updatedProject => this.projectWallet.project = updatedProject)
            );
        };
    }

    onClickedItem() {
        if (this.route.snapshot.data.isOverview) {
            this.router.navigate(['/offers', this.projectWallet.project.uuid]);
        } else if (this.isPublic) {
            this.router.navigate(['/dash/offers', this.projectWallet.project.uuid]);
        } else {
            this.router.navigate(['/dash/projects', this.projectWallet.project.uuid]);
        }
    }
}
