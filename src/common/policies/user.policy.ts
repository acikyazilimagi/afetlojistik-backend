import { IPolicyHandler } from '../casl';
import { Action, AppAbility } from '../casl/abilities';

// naming convention: <Command|Query><Domain><functionality of class>
//                    <Domain><Event><functionality of class>
// Commands and Queries are present tense
// Events are past tense
// Example: <Create><User><PolicyHandler>

export class CreateUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Create, 'User');
  }
}

export class ReadUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, 'User');
  }
}

export class UpdateUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Update, 'User');
  }
}

export class DeleteUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Delete, 'User');
  }
}
