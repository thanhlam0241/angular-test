export const StatePokemon = {
  LIKED: 'liked',
  DISLIKED: 'unliked',
  NONE: 'none',
};

export type TypeStatePokemon = (typeof StatePokemon)[keyof typeof StatePokemon];
