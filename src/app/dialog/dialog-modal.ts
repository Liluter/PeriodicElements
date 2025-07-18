import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PeriodicElement } from '../periodic-table/periodic-table';

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
  readonly data: PeriodicElement = inject<PeriodicElement>(MAT_DIALOG_DATA)
  readonly modelData = model({ ...this.data })

  onNoClick(): void {
    this.dialogRef.close()
  }
}
