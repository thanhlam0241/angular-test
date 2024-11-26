import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import {
  PaginatedPokemon,
  PokemonDetail,
  SimplifiedPokemon,
} from '../models/pokemon';
import { TypeStatePokemon, StatePokemon } from '@app/enums/Pokemon';
import { LoadingService } from '@app/components/loading/loading.service';

@Injectable({ providedIn: 'root' })
export class BackendService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly loadingService: LoadingService
  ) {}

  getPokemons(limit = 20, offset = 0): Observable<PaginatedPokemon> {
    this.loadingService.loadingOn();
    return this.httpClient
      .get<PaginatedPokemon>(this.baseUrl, {
        params: { limit, offset },
      })
      .pipe(
        delay(1500),
        catchError(() => {
          this.loadingService.loadingOff();
          return of({
            count: 0,
            next: '',
            previous: '',
            results: [],
          });
        }),
        map((paginatedPokemon: PaginatedPokemon) => {
          this.loadingService.loadingOff();
          return {
            ...paginatedPokemon,
            results: paginatedPokemon.results.map((pokemon) => ({
              ...pokemon,
              id: pokemon.url.split('/').filter(Boolean).pop(),
            })),
          };
        })
      );
  }

  // getPokemonDetail(id: string): Observable<SimplifiedPokemon> {
  //   return this.httpClient
  //     .get<SimplifiedPokemon>(`${this.baseUrl}/${id}`)
  //     .pipe(
  //       delay(1500),
  //       map((pokemon: PokemonDetail) => BackendService.getSimplifiedPokemon(pokemon))
  //     );
  // }

  getPokemonDetail(id: string): Observable<SimplifiedPokemon> {
    this.loadingService.loadingOn();
    return this.httpClient
      .get<PokemonDetail>(`${this.baseUrl}/${id}`) // Type is PokemonDetail
      .pipe(
        delay(1500), // Applies delay to PokemonDetail
        catchError(() => {
          this.loadingService.loadingOff();
          return of(null);
        }),
        map((pokemon: PokemonDetail | null) => {
          this.loadingService.loadingOff();
          return BackendService.getSimplifiedPokemon(pokemon);
        }) // Transform to SimplifiedPokemon
      );
  }

  private static getSimplifiedPokemon(
    pokemon: PokemonDetail | null
  ): SimplifiedPokemon {
    return {
      name: pokemon?.name || '',
      ability:
        pokemon?.abilities?.find((ability) => !ability.is_hidden)?.ability
          ?.name || '',
      hiddenAbility:
        pokemon?.abilities?.find((ability) => ability.is_hidden)?.ability
          ?.name || '',
      image: pokemon?.sprites?.other?.['official-artwork']?.front_default || '',
      stats: pokemon?.stats || [],
      type: pokemon?.types[0].type?.name || '',
    };
  }

  // Get the state of a pokemon
  getStatePokemon(id: string): TypeStatePokemon {
    const likePokemons = this.getListActionPokemons('like');
    if (likePokemons.has(id)) {
      return StatePokemon.LIKED;
    }
    const dislikePokemons = this.getListActionPokemons('dislike');
    if (dislikePokemons.has(id)) {
      return StatePokemon.DISLIKED;
    }
    return StatePokemon.NONE;
  }

  // Get the list of liked or disliked pokemons
  getListActionPokemons(type: 'like' | 'dislike' = 'like'): Set<string> {
    let pokemons = new Set<string>();
    const pokemonsString = localStorage.getItem(type);
    if (pokemonsString) {
      pokemons = new Set(JSON.parse(pokemonsString));
    }
    return pokemons;
  }

  // Remove a pokemon from the list of liked or disliked pokemons
  removeActionPokemon(id: string, type: 'like' | 'dislike' = 'like'): number {
    const pokemons = this.getListActionPokemons(type);
    if (pokemons.has(id)) {
      pokemons.delete(id);
      localStorage.setItem(type, JSON.stringify([...pokemons]));
    }
    return pokemons.size;
  }

  // Add a pokemon to the list of liked or disliked pokemons
  actionPokemon(id: string, type: 'like' | 'dislike' = 'like') {
    const typeOther = type === 'like' ? 'dislike' : 'like';
    const numberAfterRemove = this.removeActionPokemon(id, typeOther);
    const pokemons: string[] = JSON.parse(localStorage.getItem(type) || '[]');
    pokemons.push(id);
    localStorage.setItem(type, JSON.stringify([...pokemons]));
    return {
      likes: type === 'like' ? pokemons.length : numberAfterRemove,
      dislikes: type === 'dislike' ? pokemons.length : numberAfterRemove,
    };
  }
}
