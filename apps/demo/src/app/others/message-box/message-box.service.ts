import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MessageBoxComponent } from './message-box.component';

@Injectable()
export class MessageBoxService {
  constructor(public dialog: MatDialog) {}

  async infoSync(message: string, title: string = 'Info', width: string = '300px') {
    return await this.info(message, title, width);
  }
  info(message: string, title: string = 'Info', width: string = '300px') {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(MessageBoxComponent, {
        width: width,
        data: null
      });
      dialogRef.componentInstance.title = title;
      dialogRef.componentInstance.message = message;
      dialogRef.componentInstance.isInfo = true;
      dialogRef.componentInstance.yes.subscribe((modal: MessageBoxComponent) => {
        dialogRef.close();
        resolve(true);
      });
      dialogRef.componentInstance.no.subscribe((modal: MessageBoxComponent) => {
        dialogRef.close();
        reject();
      });
    });
  }
  async errorSync(message: string, title: string = 'Error', width: string = '300px') {
    return await this.error(message, title, width);
  }
  error(message: string, title: string = 'Error', width: string = '300px') {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(MessageBoxComponent, {
        width: width,
        data: null
      });
      dialogRef.componentInstance.title = title;
      dialogRef.componentInstance.message = message;
      dialogRef.componentInstance.isError = true;
      dialogRef.componentInstance.yes.subscribe((modal: MessageBoxComponent) => {
        dialogRef.close();
        resolve(true);
      });
      dialogRef.componentInstance.no.subscribe((modal: MessageBoxComponent) => {
        dialogRef.close();
        reject();
      });
    });
  }
}
