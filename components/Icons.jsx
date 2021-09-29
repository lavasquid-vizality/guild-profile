import React, { memo } from 'react';
import { Messages } from '@vizality/i18n';
import { getModule } from '@vizality/webpack';
import { toTitleCase } from '@vizality/util/string';

import { GuildFeatures } from '../constants';

const { Icon } = getModule(m => m.Icon?.displayName === 'Icon');

const { headerTop, badgeList } = getModule('header', 'avatar', 'nameTag');
const { container } = getModule('container', 'profileBadge');

const debug = false;
const nameReplace = {
  VIP_REGIONS: 'VIP Regions',
  VANITY_URL: 'Vanity URL'
};

export default memo(({ premiumTier, guildFeatures }) => {
  const Icons = [];

  if (premiumTier) Icons.push(<Icon icon={getModule(m => m.displayName === `PremiumGuildTier${premiumTier}`)} tooltip={`Server Boost ${Messages[`PREMIUM_GUILD_TIER_${premiumTier}`]}`} color={'white'} />);

  if (debug) guildFeatures = new Set(Object.keys(GuildFeatures));
  for (const [ name, _Icon ] of Object.entries(GuildFeatures).filter(([ key ]) => guildFeatures.has(key))) {
    if (_Icon) {
      const tooltip = nameReplace[name] ?? toTitleCase(name);
      Icons.push(<_Icon tooltip={tooltip} color={'white'} />);
    }
  }
  for (const guildFeature of [ ...guildFeatures ].filter(guildFeature => !GuildFeatures.hasOwnProperty(guildFeature))) {
    const tooltip = nameReplace[guildFeature] ?? toTitleCase(guildFeature);
    Icons.push(<Icon icon={getModule(m => m.displayName === 'ApplicationPlaceholder')} tooltip={tooltip} color={'red'} />);
  }

  return Icons.length ? <div className={headerTop}><div className={`${badgeList} ${container}`}>{Icons}</div></div> : null;
});
