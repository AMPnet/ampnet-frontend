import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../onboarding.service';
import swal from 'sweetalert2';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { hideAuthButtons } from 'src/app/utilities/ui-utils';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';

declare var initializeIdentyum: any;
declare var $: any;

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {

  hasClientToken = false;

  constructor(
    private router: Router,
    private onboardingService: OnboardingService) { }

  ngOnInit() {
    const that = this;

    SpinnerUtil.showSpinner();
    this.onboardingService.getSessionID().subscribe((res: any) => {

      const script: any = document.createElement('idy-flow-manager');
      script.clientToken = res;
      script.startLanguage = 'en';
      document.querySelector('#identyum-target').appendChild(script);

      const loader = document.createElement('script');
      loader.type = 'text/javascript';
      loader.src = 'https://web-components.stage.identyum.com/flow-manager/component';
      loader.onload = () => {
      };
      document.getElementsByTagName('head')[0].appendChild(loader);
      SpinnerUtil.hideSpinner();

      script.addEventListener('finished', (event) => {
        SpinnerUtil.showSpinner();
        this.onboardingService.verifyUser(res.access_token).subscribe(res => {
          swal('', 'Success', 'success');
          SpinnerUtil.hideSpinner();
        }, hideSpinnerAndDisplayError);
      });

    }, hideSpinnerAndDisplayError);

  }

  initializeIdentyum() {

  }

}


