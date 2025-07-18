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
import { PeriodicTableService } from '../periodic-table-service';


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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeriodicTable implements AfterViewInit {
  protected displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  readonly tableService = inject(PeriodicTableService)
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
    this.tableService.connectFormToSearch(this.form, this.dataSource)
  }
  openDialog(element: PeriodicElement) {
    this.tableService.openDialog(element)
  }
}
