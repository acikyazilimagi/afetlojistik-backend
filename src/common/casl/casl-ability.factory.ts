import { AbilityBuilder } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action, AppAbility, createAppAbility } from './abilities';

type RequestMetaData = {
  params: {
    userId: number;
  };
};

@Injectable()
export class CaslAbilityFactory {
  createForUser(_user: any, _jwyPayload: any, _metaData: RequestMetaData) {
    const { can, build } = new AbilityBuilder<AppAbility>(createAppAbility);

    can(Action.Manage, 'all');

    return build();
  }
}
