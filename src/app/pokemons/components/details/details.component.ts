import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';
import { PokemonCardComponent } from '../../../components/pokemon-card/pokemon-card.component';
import { CommonModule } from '@angular/common';

import { BackendService } from '@app/services/backend.service';
import { AuthenticateService } from '@app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SimplifiedPokemon } from '@app/models/pokemon';
import { TypeStatePokemon, StatePokemon } from '@app/enums/Pokemon';

@Component({
  selector: 'pokemon-details',
  standalone: true,
  templateUrl: './details.component.html',
  imports: [PokemonCardComponent, CommonModule],
  styles: [
    `
      :host {
        height: calc(100% - 5rem);
      }
    `,
  ],
})
export class DetailsComponent implements OnInit {
  @HostBinding('class') hostClass =
    'flex flex-col gap-4 items-center justify-center';

  public StatePokemon = StatePokemon;

  public _prevId: string | null = null;
  public _nextId: string | null = null;
  private _id: string = '';

  public detail: SimplifiedPokemon | null = null;

  public statePokemon: TypeStatePokemon = StatePokemon.NONE;

  constructor(
    private backend: BackendService,
    private auth: AuthenticateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const paramId = params.get('id');
      if (paramId) {
        this._id = paramId;
        this.statePokemon = this.backend.getStatePokemon(paramId);
        const id = parseInt(paramId, 10);
        if (id > 1) {
          this._prevId = (id - 1).toString();
        }
        this._nextId = (id + 1).toString();
        this.backend
          .getPokemonDetail(paramId)
          .subscribe((pokemon: SimplifiedPokemon) => {
            this.detail = pokemon;
          });
      }
    });
  }

  nextId() {
    // go to next id
    if (this._nextId) {
      this.router.navigate(['/pokemons', this._nextId]);
    }
  }

  prevId() {
    // go to prev id
    if (this._prevId) {
      this.router.navigate(['/pokemons', this._prevId]);
    }
  }

  like() {
    // like
    const res = this.backend.actionPokemon(this._id, 'like');
    this.auth.updateNumberActions(res);
    this.statePokemon = StatePokemon.LIKED;
  }

  dislike() {
    // dislike
    const res = this.backend.actionPokemon(this._id, 'dislike');
    this.auth.updateNumberActions(res);
    this.statePokemon = StatePokemon.DISLIKED;
  }
}
