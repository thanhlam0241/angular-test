import { Injectable } from '@angular/core';
import { User } from '@app/models/user';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticateService {
  constructor() {}

  public user$ = new BehaviorSubject<User | null>(this.getUser());

  public isAuthenticated() {
    return this.user$.value !== null;
  }

  public getUser(): User | null {
    const user = localStorage.getItem('user');
    if (user) {
      const listLiked = JSON.parse(localStorage.getItem('like') || '[]');
      const listDisliked = JSON.parse(localStorage.getItem('dislike') || '[]');
      return {
        name: user,
        likes: listLiked.length,
        dislikes: listDisliked.length,
      };
    }
    return null;
  }

  public updateNumberActions({
    likes,
    dislikes,
  }: {
    likes: number;
    dislikes: number;
  }) {
    const user = this.user$.value;
    if (user) {
      user.likes = likes;
      user.dislikes = dislikes;
      this.user$.next(user);
    }
  }

  public login(): User {
    const user: User = {
      name: 'John Doe',
      likes: 0,
      dislikes: 0,
    };
    localStorage.setItem('user', user.name);
    const listLiked = JSON.parse(localStorage.getItem('like') || '[]');
    const listDisliked = JSON.parse(localStorage.getItem('dislike') || '[]');
    user.likes = listLiked.length;
    user.dislikes = listDisliked.length;

    this.user$.next(user);
    return user;
  }

  public logout() {
    localStorage.removeItem('user');
    this.user$.next(null);
  }
}
