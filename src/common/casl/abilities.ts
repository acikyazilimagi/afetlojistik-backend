import {
  CreateAbility,
  createMongoAbility,
  ForcedSubject,
  MongoAbility,
} from '@casl/ability';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

const actions = [
  Action.Manage,
  Action.Create,
  Action.Delete,
  Action.Read,
  Action.Update,
] as const;

const subjects = ['User', 'all'] as const;

type PossibleAbilities = [
  (typeof actions)[number],
  (
    | (typeof subjects)[number]
    | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>
  )
];

export type AppAbility = MongoAbility<PossibleAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;
