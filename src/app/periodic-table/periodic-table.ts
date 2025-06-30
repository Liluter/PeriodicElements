import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, debounceTime, Observable, of, tap, timeout, timer } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

import { DialogModal } from '../dialog/dialog-modal';
import { PeriodicElementSearchStore } from '../store/elements-search-store';

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
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  dialog = inject(MatDialog)
  store = inject(PeriodicElementSearchStore)
  changeRef = inject(ChangeDetectorRef)
  @ViewChild('filterForm') form!: NgForm

  ngOnInit() {
    timer(2000).subscribe(() => this.dataSource.data = this.store.elements())
  }
  ngAfterViewInit() {
    this.form?.control.valueChanges?.
      pipe(
        tap(() => this.store.loading()),
        debounceTime(2000))
      .subscribe(value => {
        this.store.updateQuery(value['searchText'])
        this.dataSource.filter = this.store.filter().query
      })
  }
  openDialog(row: PeriodicElement) {
    const dialogRef = this.dialog.open(DialogModal, {
      data: { name: row.name, position: row.position, symbol: row.symbol, weight: row.weight }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.store.updateElement(result)
        this.dataSource.data = this.store.elements()
        this.changeRef.markForCheck()
      }
    })
  }
}
