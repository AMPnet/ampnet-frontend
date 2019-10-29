import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { WalletService } from './wallet.service';
import swal from 'sweetalert2';
import { WalletModel } from '../models/WalletModel';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { displayBackendError } from '../utilities/error-handler';
import { prettyCurrency } from '../utilities/currency-util';
import * as numeral from 'numeral';
import * as QRCode from 'qrcode';
import { API } from '../utilities/endpoint-manager';
import { ChildActivationEnd } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit, AfterViewInit {

  constructor(private walletService: WalletService) { }

  wallet: WalletModel;
  checkComplete = false;

  ngOnInit() {
    this.getUserWallet();
  }

  ngAfterViewInit() {
    

  }

  startWalletInit(addr: string, pubKey: string) {
    SpinnerUtil.showSpinner();
    this.walletService.initWallet(addr, pubKey).subscribe(res => {
      SpinnerUtil.hideSpinner();
      this.getUserWallet();
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    });
  }

  getUserWallet() {
    SpinnerUtil.showSpinner();
    this.walletService.getWallet().subscribe(res => {
      SpinnerUtil.hideSpinner();
      this.wallet = res;
      this.wallet.currency = prettyCurrency(res.currency);
      this.wallet.balance = numeral(res.balance).format('0,0');
      this.checkComplete = true;
    }, err => {
      SpinnerUtil.hideSpinner();
      this.checkComplete = true;
      setTimeout(() => {
        QRCode.toCanvas(document.getElementById("url-pairing-canvas"), API.APIURL, 
      console.log);
      }, 100)
      //displayBackendError(err);
    });
  }

}
