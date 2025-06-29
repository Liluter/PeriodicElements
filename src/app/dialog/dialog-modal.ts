import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
export interface DialogData {
  name: string,
  weight: number,
  symbol: string,
  position: number
}
@Component({
  selector: 'app-dialog',
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,],
  templateUrl: './dialog-modal.html',
  styleUrl: './dialog-modal.scss'
})
export class DialogModal {
  readonly dialogRef = inject(MatDialogRef<DialogModal>)
  readonly data = inject<DialogData>(MAT_DIALOG_DATA)
  readonly name = model(this.data.name)
  readonly weight = model(this.data.weight)
  readonly symbol = model(this.data.symbol)
  readonly position = model(this.data.position)

  onNoClick(): void {
    this.dialogRef.close()
  }
}
