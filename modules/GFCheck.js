import { logger } from '@vizality/util';
import { Constants } from '@vizality/discord/constants';

import { GuildFeatures } from '../constants';

export default function () {
  const CONSTGFKeys = Object.values(Constants.GuildFeatures);
  const GFKeys = Object.keys(GuildFeatures);

  const GFAdd = CONSTGFKeys.filter(GuildFeature => !GuildFeatures.hasOwnProperty(GuildFeature));
  const GFRemove = GFKeys.filter(GuildFeature => !Constants.GuildFeatures.hasOwnProperty(GuildFeature));
  const GFOrder = GFKeys.filter((GuildFeature, index) => CONSTGFKeys[index] !== GuildFeature).map(GuildFeature => `${GuildFeature}: ${CONSTGFKeys.indexOf(GuildFeature) - GFKeys.indexOf(GuildFeature)}`);

  if (GFAdd.length) logger.warn({ badge: `vizality://plugins/${this.addonId}/assets/icon.png`, labels: [ ...this._labels, { text: 'Add', color: Constants.HEXColors.STATUS_GREEN_600 } ], message: GFAdd.join(', ') });
  if (GFRemove.length) logger.warn({ badge: `vizality://plugins/${this.addonId}/assets/icon.png`, labels: [ ...this._labels, { text: 'Remove', color: Constants.HEXColors.STATUS_RED } ], message: GFRemove.join(', ') });
  if (GFOrder.length && !(GFAdd.length || GFRemove.length)) logger.warn({ badge: `vizality://plugins/${this.addonId}/assets/icon.png`, labels: [ ...this._labels, { text: 'Order', color: Constants.HEXColors.STATUS_RED } ], message: GFOrder.join(', ') });
}
