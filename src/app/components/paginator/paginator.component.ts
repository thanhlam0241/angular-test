import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface PaginatorState {
  page: number;
  pageCount: number;
  rows: number;
  first: number;
}

/**
 * Simplified PrimeNG Paginator component
 */

@Component({
  selector: 'paginator',
  standalone: true,
  templateUrl: './paginator.component.html',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() currentPage = 1;

  @Output() onPageChange: EventEmitter<PaginatorState> =
    new EventEmitter<PaginatorState>();

  get totalRecords() {
    return this._totalRecords;
  }

  @Input()
  set totalRecords(total: number) {
    this._totalRecords = total;
    this.lastPage = Math.ceil(total / this.rows);
  }

  get rows() {
    return this._rows;
  }

  @Input()
  set rows(rows: number) {
    this._rows = rows;
    this.lastPage = Math.ceil(this.totalRecords / rows);
  }

  @Input() rowsPerPageOptions: number[] = [];

  pageLinks: any[] | undefined;

  paginatorState: any;

  _first: number = 0;

  lastPage = this.currentPage;

  private _rows = 20;
  private _totalRecords = 0;

  @HostListener('window:keyup', ['$event'])
  private onWindowKeyUp(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.changePageToNext(event);
    } else if (event.key === 'ArrowLeft') {
      this.changePageToPrev(event);
    }
  }

  ngOnInit() {
    this.updatePaginatorState();
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    this.updatePageLinks();
    this.updatePaginatorState();

    if (simpleChange['totalRecords']) {
      this.updatePageLinks();
      this.updatePaginatorState();
    }

    if (simpleChange['first']) {
      this._first = simpleChange['first'].currentValue;
    }
  }

  @Input() get first(): number {
    return this._first;
  }

  set first(val: number) {
    this._first = val;
  }

  isFirstPage() {
    return this.getPage() === 0;
  }

  isLastPage() {
    console.log(this.getPageCount());
    return this.getPage() === this.getPageCount() - 1;
  }

  getPageCount() {
    return Math.ceil(this.totalRecords / this.rows) || 1;
  }

  calculatePageLinkBoundaries() {
    let numberOfPages = this.getPageCount(),
      visiblePages = numberOfPages;

    //calculate range, keep current in middle if necessary
    let start = Math.max(0, Math.ceil(this.getPage() - visiblePages / 2)),
      end = Math.min(numberOfPages - 1, start + visiblePages - 1);

    //check when approaching to last page
    const delta = end - start + 1;
    start = Math.max(0, start - delta);

    return [start, end];
  }

  updatePageLinks() {
    this.pageLinks = [];
    let boundaries = this.calculatePageLinkBoundaries(),
      start = boundaries[0],
      end = boundaries[1];
    let numberOfPages = this.getPageCount();

    if (end > start) this.pageLinks.push(1);
    if (this.currentPage > 3) {
      this.pageLinks.push('...');
    }
    const s1 = Math.max(2, this.currentPage - 1);
    const s2 = Math.min(numberOfPages - 1, this.currentPage + 1);
    for (let i = s1; i <= s2; i++) {
      this.pageLinks.push(i);
    }
    if (this.currentPage < numberOfPages - 1 - 1) {
      this.pageLinks.push('...');
    }
    if (numberOfPages > 1) this.pageLinks.push(numberOfPages);
  }

  changePage(p: number) {
    const pc = this.getPageCount();
    const rows = Number(this.rows);

    if (p >= 0 && p <= pc) {
      this._first = rows * p;
      const state = {
        page: p,
        first: this.first,
        rows: rows,
        pageCount: pc,
      };
      this.updatePageLinks();

      this.onPageChange.emit(state);
      this.updatePaginatorState();
    }
  }

  updateFirst() {
    const page = this.getPage();
    if (page > 0 && this.totalRecords && this.first >= this.totalRecords) {
      Promise.resolve(null).then(() => this.changePage(page - 1));
    }
  }

  getPage(): number {
    const dummy = Math.floor(this.first / this.rows);
    return dummy === 0 ? dummy + 1 : dummy;
  }

  changePageToFirst(event: Event) {
    if (!this.isFirstPage()) {
      this.changePage(1);
    }

    event.preventDefault();
  }

  changePageToPrev(event: Event) {
    this.changePage(this.getPage() - 1);
    event.preventDefault && event.preventDefault();
  }

  changePageToNext(event: Event) {
    this.changePage(this.getPage() + 1);
    event.preventDefault && event.preventDefault();
  }

  changePageToLast(event: Event) {
    if (!this.isLastPage()) {
      this.changePage(this.getPageCount());
    }

    event.preventDefault();
  }

  onPageLinkClick(event: Event, page: number | string) {
    if (typeof page === 'string') {
      return;
    }
    this.changePage(page);
    event.preventDefault();
  }

  onRppChange() {
    this.changePage(this.getPage());
  }

  updatePaginatorState() {
    this.paginatorState = {
      page: this.getPage(),
      pageCount: this.getPageCount(),
      rows: Number(this.rows),
      first: this.first,
      totalRecords: this.totalRecords,
    };
  }
}
