import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals'
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { PeriodicElement } from '../periodic-table/periodic-table'
import { delay, pipe, tap, timeout, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


type PeriodicElementSearchState = {
  elements: PeriodicElement[],
  isLoading: boolean,
  filter: { query: string }
}

const initialState: PeriodicElementSearchState = {
  elements: [],
  isLoading: false,
  filter: { query: '' }
}
const initialElements: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
]
export const PeriodicElementSearchStore = signalStore(
  withState(() => initialState),
  withMethods((store) => ({
    updateQuery(query: string): void {
      patchState(store, { filter: { query }, isLoading: false })
    },
    loading(): void {
      patchState(store, { isLoading: true })
    },
    updateElement(updatedElement: PeriodicElement) {
      patchState(store, (state) => {
        const elements = [...state.elements]
        const currentElement = elements.find(element => element.position === updatedElement.position)
        if (currentElement) {
          currentElement.name = updatedElement.name
          currentElement.symbol = updatedElement.symbol
          currentElement.weight = updatedElement.weight
          currentElement.position = updatedElement.position
        }
        return { elements }
      })
    }
  })),
  withHooks({
    onInit(store) {
      timer(2000).pipe(
        takeUntilDestroyed()
      ).subscribe(() => {
        patchState(store, { elements: initialElements })
      })
    }
  })
)