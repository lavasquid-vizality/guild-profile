import React, { memo, useState, useEffect } from 'react';
import { user } from '@vizality/discord';
import { getModule } from '@vizality/webpack';
import { toTitleCase } from '@vizality/util/string';

import GuildInfo from './GuildInfo';

import { AllTabs } from '../modules/Sections';

import { Class } from '../constants';

const TabBar = getModule(m => m.displayName === 'TabBar');

const { getChannels } = getModule(m => m.getChannels);

const TABS = (guild) => {
  const { tabBarItem } = getModule('topSection') ?? Class.topSection;

  const Tabs = [];

  for (const [ key, value ] of Object.entries(AllTabs)) {
    const [ name, length ] = value({ guild, name: toTitleCase(key) });
    if (length) Tabs.push(<TabBar.Item className={`${tabBarItem} GP-TabBarItem`} id={key}>{name}</TabBar.Item>);
  }

  return Tabs;
};

export default memo(({ guild, section, setSection }) => {
  const { tabBar, tabBarContainer } = getModule('topSection') ?? Class.topSection;

  const [ tabs, setTabs ] = useState(null);

  useEffect(() => {
    setTabs(TABS(guild));
  }, [ guild ]);

  return <div className={tabBarContainer}><TabBar className={tabBar} type={TabBar.Types.TOP} selectedItem={section} onItemSelect={setSection}>
    {tabs}
    <GuildInfo title={'Current User'} description={{ channelId: getChannels(guild.id).SELECTABLE[0].channel.id, userId: user.getCurrentUser().id }} />
  </TabBar></div>;
});
