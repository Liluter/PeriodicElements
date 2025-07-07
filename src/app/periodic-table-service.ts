import { DestroyRef, inject, Injectable } from '@angular/core';
import { PeriodicElementSearchStore } from './store/elements-search-store';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, debounceTime, map } from 'rxjs';
import { PeriodicElement } from './periodic-table/periodic-table';
import { MatDialog } from '@angular/material/dialog';
import { DialogModal } from './dialog/dialog-modal';

@Injectable({
  providedIn: 'root',
})
export class PeriodicTableService {
  private readonly destroyRef = inject(DestroyRef)
  private readonly store = inject(PeriodicElementSearchStore)
  private dialog = inject(MatDialog)
  connectFormToSearch(form: NgForm, dataSource: MatTableDataSource<any>) {
    form.control.valueChanges?.pipe(
      tap(() => this.store.loading()),
      debounceTime(2000),
      takeUntilDestroyed(this.destroyRef),
      map(value => value['searchText'])
    ).subscribe(query => {
      this.store.updateQuery(query),
        dataSource.filter = this.store.filter().query;
    }
    )
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
