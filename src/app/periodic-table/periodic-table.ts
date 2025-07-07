import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, effect, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, takeUntil, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { DialogModal } from '../dialog/dialog-modal';
import { PeriodicElementSearchStore } from '../store/elements-search-store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-periodic-table',
  imports: [MatTableModule, FormsModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './periodic-table.html',
  styleUrl: './periodic-table.scss',
  providers: [PeriodicElementSearchStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeriodicTable implements AfterViewInit {
  protected displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  readonly dataSource = new MatTableDataSource<PeriodicElement>([]);
  readonly dialog = inject(MatDialog)
  readonly store = inject(PeriodicElementSearchStore)
  readonly changeRef = inject(ChangeDetectorRef)
  readonly destroyRef = inject(DestroyRef)
  @ViewChild('filterForm') readonly form!: NgForm


  constructor() {
    effect(() => {
      this.dataSource.data = this.store.elements();
      this.changeRef.markForCheck()
    });
  }
  ngAfterViewInit() {
    this.form?.control.valueChanges?.
      pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.store.loading()),
        debounceTime(2000),
      )
      .subscribe(value => {
        this.store.updateQuery(value['searchText'])
        this.dataSource.filter = this.store.filter().query
      })
  }
  openDialog(element: PeriodicElement) {
    const dialogRef = this.dialog.open(DialogModal, { data: element })
    dialogRef.afterClosed().subscribe((result: PeriodicElement) => {
      if (result !== undefined) {
        this.store.updateElement(result)
      }
    })
  }
}
