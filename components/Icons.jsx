import React, { memo } from 'react';
import { Messages } from '@vizality/i18n';
import { getModule } from '@vizality/webpack';
import { toTitleCase } from '@vizality/util/string';

import { GuildFeatures, Class } from '../constants';

const { Icon } = getModule(m => m.Icon?.displayName === 'Icon');
const BoostedGuildTier = {
  1: getModule(m => m.displayName === 'BoostedGuildTier1'),
  2: getModule(m => m.displayName === 'BoostedGuildTier2'),
  3: getModule(m => m.displayName === 'BoostedGuildTier3')
};
const ApplicationPlaceholder = getModule(m => m.displayName === 'ApplicationPlaceholder');

const Constants = getModule(m => m.API_HOST);

const { headerTop, badgeList } = Class.header;
const { container } = getModule('container', 'profileBadge');

const debug = false;
const nameReplace = {
  VIP_REGIONS: 'VIP Regions',
  VANITY_URL: 'Vanity URL',
  EXPOSED_TO_ACTIVITIES_WTP_EXPERIMENT: 'Exposed To Activities WTP Experiment'
};

export default memo(({ premiumTier, guildFeatures }) => {
  // eslint-disable-next-line no-sequences
  const SortedGuildFeatures = Object.values(Constants.GuildFeatures).reduce((prev, curr) => (prev[curr] = null, prev), {});
  const Icons = [];

  if (debug) guildFeatures = new Set(Object.values(Constants.GuildFeatures));
  if (premiumTier) Icons.push(<Icon icon={BoostedGuildTier[premiumTier]} tooltip={`Server Boost ${Messages[`PREMIUM_GUILD_TIER_${premiumTier}`]}`} tooltipPosition={'top'} color={'white'} />);

  for (const guildFeature of guildFeatures) {
    const tooltip = nameReplace[guildFeature] ?? toTitleCase(guildFeature);
    const _Icon = GuildFeatures[guildFeature];

    SortedGuildFeatures[guildFeature] = _Icon
      ? <_Icon tooltip={tooltip} tooltipPosition={'top'} color={'white'} />
      : _Icon === undefined
        ? <Icon icon={ApplicationPlaceholder} tooltip={tooltip} tooltipPosition={'top'} color={'red'} />
        : null;
  }
  Icons.push(Object.values(SortedGuildFeatures).filter(sortedGuildFeature => sortedGuildFeature));

  return Icons.length ? <div className={headerTop}><div className={`${badgeList} ${container}`}>{Icons}</div></div> : null;
});
