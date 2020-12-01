// order is important!\
import { featureGetId } from './get-id';
import { featureSpamHammer } from './spam-hammer';
import { featureBanHammer } from './ban-hammer';
import { featureBotParticipation } from './bot-participation';
import { featureReadonlyMode } from './readonly-mode';
import { featurePrivateGreetings } from './private-greetings';
import { status } from './status';

function applyBot(bot) {
  featureGetId(bot);
  featureSpamHammer(bot);
  featureBanHammer(bot);
  featureBotParticipation(bot);
  featureReadonlyMode(bot);
  featurePrivateGreetings(bot);
  status(bot);
}

export { applyBot };
