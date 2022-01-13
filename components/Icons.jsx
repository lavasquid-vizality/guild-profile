import React, { memo } from 'react';
import { Messages } from '@vizality/i18n';
import { Constants } from '@vizality/discord/constants';
import { getModule } from '@vizality/webpack';
import { toTitleCase } from '@vizality/util/string';

import { GuildFeatures, Class } from '../constants';

const { Icon } = getModule(m => m.Icon?.displayName === 'Icon');

const { container } = getModule('container', 'profileBadge');

const debug = false;
const nameReplace = {
  VIP_REGIONS: 'VIP Regions',
  VANITY_URL: 'Vanity URL'
};

export default memo(({ premiumTier, guildFeatures }) => {
  const { headerTop, badgeList } = getModule('header', 'avatar', 'nameTag') ?? Class.header;

  const Icons = [];

  if (debug) guildFeatures = new Set(Object.values(Constants.GuildFeatures));
  if (premiumTier) Icons.push(<Icon icon={getModule(m => m.displayName === `BoostedGuildTier${premiumTier}`)} tooltip={`Server Boost ${Messages[`PREMIUM_GUILD_TIER_${premiumTier}`]}`} color={'white'} />);

  for (const guildFeature of Object.values(Constants.GuildFeatures)) {
    if (guildFeatures.has(guildFeature)) {
      const tooltip = nameReplace[guildFeature] ?? toTitleCase(guildFeature);
      const _Icon = GuildFeatures[guildFeature];
      if (_Icon) {
        Icons.push(<_Icon tooltip={tooltip} color={'white'} />);
      } else if (_Icon === undefined) {
        Icons.push(<Icon icon={getModule(m => m.displayName === 'ApplicationPlaceholder')} tooltip={tooltip} color={'red'} />);
      }
    }
  }

  return Icons.length ? <div className={headerTop}><div className={`${badgeList} ${container}`}>{Icons}</div></div> : null;
});
