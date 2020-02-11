import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageBoxComponent implements OnInit {
  @Input()
  isInfo?: boolean;

  @Input()
  isError?: boolean;

  @Input()
  hideOnNo = true;

  @Input()
  hideOnYes = false;

  @Input()
  title: string;

  @Input()
  message: string;

  @Input()
  noTitle = 'Cancel';

  @Input()
  yesTitle = 'OK';

  @Output()
  no = new EventEmitter<MessageBoxComponent>();

  @Output()
  yes = new EventEmitter<MessageBoxComponent>();

  constructor(public dialogRef: MatDialogRef<MessageBoxComponent>, public changeDetectorRef: ChangeDetectorRef) {}
  ngOnInit() {
    this.changeDetectorRef.detectChanges();
  }
  onYesClick(): void {
    this.yes.emit(this);
    if (this.hideOnYes) {
      this.dialogRef.close();
    }
  }
  onNoClick(): void {
    this.no.emit(this);
    if (this.hideOnNo) {
      this.dialogRef.close();
    }
  }
}
