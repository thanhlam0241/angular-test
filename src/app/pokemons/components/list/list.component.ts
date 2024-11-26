import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  PaginatorComponent,
  type PaginatorState,
} from '@app/components/paginator/paginator.component';
import { TableComponent } from '@app/components/table/table.component';
import { BackendService } from '@app/services/backend.service';
import { CommonModule } from '@angular/common';

import { Pokemon, PaginatedPokemon } from '@app/models/pokemon';

@Component({
  selector: 'pokemon-list',
  standalone: true,
  template: `
    <paginator
      [currentPage]="currentPage"
      [rowsPerPageOptions]="[10, 20, 40, 80]"
      [rows]="pageSize"
      [totalRecords]="totalRecords"
      (onPageChange)="onPageChanged($event)"
    ></paginator>
    <input
      type="text"
      class="w-2/4 p-2 rounded border border-gray-600"
      placeholder="Filter by pokemon name..."
      [formControl]="query"
    />
    <input
      type="number"
      class="w-2/4 p-2 rounded border border-gray-600"
      placeholder="Go to page..."
      [formControl]="query"
    />
    <data-table [isLoading]="false" [data]="filteredResults"></data-table>
  `,
  imports: [
    PaginatorComponent,
    TableComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class ListComponent implements OnInit {
  query = new FormControl('');

  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  isLoading: boolean = false;

  data: PaginatedPokemon = {
    count: 0,
    next: '',
    previous: '',
    results: [],
  };

  constructor(private readonly backendService: BackendService) {}

  ngOnInit() {
    this.getListPokemons();
  }

  // Fetch pokemons from the backend
  getListPokemons() {
    this.backendService
      .getPokemons(this.pageSize, (this.currentPage - 1) * this.pageSize)
      .subscribe((data) => {
        this.data = data;
        this.totalRecords = data.count;
      });
  }

  // Computed-like getter for filtered results
  get filteredResults(): Pokemon[] {
    const searchText = this.query.value?.toLowerCase().trim() || '';
    if (!searchText) {
      return this.data.results;
    }
    return this.data.results.filter((pokemon: Pokemon) =>
      pokemon.name.toLowerCase().includes(searchText)
    );
  }

  // Event handler for paginator state change
  onPageChanged(paginatorState: PaginatorState) {
    this.currentPage = paginatorState.page;
    this.pageSize = paginatorState.rows;
    this.getListPokemons();
  }
}
