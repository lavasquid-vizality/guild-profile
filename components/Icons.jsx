import React, { memo } from 'react';
import { Icon as VZIcon } from '@vizality/components';
import { Messages } from '@vizality/i18n';
import { getModule } from '@vizality/webpack';
import { toTitleCase } from '@vizality/util/string';

import { GuildFeatures } from '../constants';

const { Icon } = getModule(m => m.Icon?.displayName === 'Icon');

const { iconWrapper } = getModule('iconWrapper', 'caret');
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
  for (const [ name, icon ] of Object.entries(GuildFeatures).filter(([ key ]) => guildFeatures.has(key))) {
    if (icon) {
      const tooltip = nameReplace[name] ?? toTitleCase(name);
      typeof icon === 'object'
        ? icon.name
          ? Icons.push(<VZIcon name={icon.name} tooltip={tooltip} tooltipPosition={'bottom'} color={'white'} className={iconWrapper} />)
          : Icons.push(<Icon icon={icon.icon} tooltip={tooltip} color={'white'} />)
        : typeof icon === 'function'
          ? Icons.push(<Icon icon={icon} tooltip={tooltip} color={'white'} />)
          : Icons.push(<Icon icon={getModule(m => m.displayName === 'ApplicationPlaceholder')} tooltip={tooltip} color={'red'} />);
    }
  }

  return Icons.length ? <div className={headerTop}><div className={`${badgeList} ${container}`}>{Icons}</div></div> : null;
});
