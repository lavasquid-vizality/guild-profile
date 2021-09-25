import React, { memo, createElement, useState } from 'react';
const { user } = require('@vizality/discord');
import { close } from '@vizality/modal';
import { getModule } from '@vizality/webpack';
import { findInReactTree } from '@vizality/util/react';

import Info from '../components/Info';

const { AdvancedScrollerThin } = getModule(m => m.AdvancedScrollerThin);
const SearchBar = getModule(m => m.displayName === 'SearchBar');
const FriendRow = getModule(m => m.displayName === 'FriendRow');
const BlockedRow = getModule(m => m.displayName === 'BlockedRow');

const { getChannels } = getModule(m => m._dispatchToken && m.getChannels);
const Timestamp = getModule(m => m.prototype?.toDate && m.prototype?.month);
const { extractTimestamp } = getModule(m => m.extractTimestamp);
const { parse } = getModule('parse', 'defaultRules');
const { getRelationships } = getModule(m => m._dispatchToken && m.getRelationships);
const { isMember } = getModule(m => m._dispatchToken && m.isMember);
const { getStatus } = getModule(m => m._dispatchToken && m.getStatus);

const { infoScroller } = getModule('infoScroller');
const { listScroller } = getModule('listScroller');
const { listItemContents } = getModule('listItemContents', 'actions');

const SERVER_INFO = ({ guild, name }) => {
  const channelId = getChannels(guild.id).SELECTABLE[0].channel.id;

  const Server_Info = [
    <Info title={'Server Owner'} description={{ guild, userId: guild.ownerId }} channelId={channelId} />,
    <Info title={'Server Description'} description={guild.description} />,
    <Info title={'Vanity URL'} description={guild.vanityURLCode} />,
    <Info title={'AFK Timeout'} description={Timestamp()._locale.relativeTime(guild.afkTimeout, true, 'ss', true)} />,
    <Info title={'Server Created On'} description={Timestamp(extractTimestamp(guild.id)).format('LLL')} />,
    <Info title={'Server Joined On'} description={Timestamp(guild.joinedAt).format('LLL')} />,
    <Info title={'Rules Channel'} description={`<#${guild.rulesChannelId}>`} onClick={close} />,
    <Info title={'System Channel'} description={`<#${guild.systemChannelId}>`} onClick={close} />,
    // <Section title={'Public Updates Channel'} description={`<#${guild.publicUpdatesChannelId}>`} onClick={close} />,
    <Info title={'AFK Channel'} description={`<#${guild.afkChannelId}>`} onClick={close} />,
    <Info title={'Commands'} description={Object.keys(guild.applicationCommandCounts).length ? guild.applicationCommandCounts : null} />,
    <Info title={'Premium Subscriber Count'} description={`${guild.premiumSubscriberCount}`} />,
    <Info title={'Default Message Notification'} description={`${guild.defaultMessageNotifications}`} />,
    <Info title={'Verification Level'} description={`${guild.verificationLevel}`} />,
    <Info title={'Explicit Content Filter'} description={`${guild.explicitContentFilter}`} />,
    <Info title={'MFA Level'} description={`${guild.mfaLevel}`} />,
    <Info title={'NSFW Level'} description={`${guild.nsfwLevel}`} />
  ].filter(section => {
    switch (section.props.title) {
      case 'Server Owner':
        return true;
      case 'Commands':
        return Object.values(section.props.description).reduce((total, current) => total + current, 0);
      default:
        return section.props.description && !section.props.description.includes('null');
    }
  });
  if (name) return [ `${name}`, Server_Info.length ];

  return <AdvancedScrollerThin className={infoScroller} style={{ display: 'flex', flexWrap: 'wrap' }} fade={true}>{Server_Info}</AdvancedScrollerThin>;
};

const ROLES = ({ guild, name }) => {
  const channelId = getChannels(guild.id).SELECTABLE[0].channel.id;
  let Roles = [];

  for (const { id: roleId, name } of Object.values(guild.roles)) {
    Roles.push(parse(name === '@everyone' ? '@everyone' : `<@&${roleId}>`, false, { channelId })[0]);
  }
  if (name) return [ `${name} (${Roles.length})`, Roles.length ];

  const [ query, setQuery ] = useState('');
  if (query) Roles = Roles.filter(role => findInReactTree(role, m => m.content).children[0].toLowerCase().includes(query.toLowerCase()));

  return <AdvancedScrollerThin className={infoScroller} fade={true}>{[ <SearchBar className={'GP-SearchBar'} size={SearchBar.Sizes.MEDIUM} query={query} onChange={setQuery} onClear={setQuery.bind(null, '')} />, Roles ]}</AdvancedScrollerThin>;
};

const rowClick = ({ nativeEvent }) => {
  const paths = [];
  for (const path of nativeEvent.path) {
    if (path.ariaLabel === 'Unblock') return close();
    if (path.className === listItemContents || path.ariaLabel === 'More') paths.push(path);
  }
  if (paths.length === 1) close();
};
const RELATIONS = (guild, type) => {
  const Type = {
    Friends: [],
    Blocked: []
  };

  for (const [ userId, relation ] of Object.entries(getRelationships())) {
    if (isMember(guild.id, userId)) {
      if (relation === 1) Type.Friends.push(<div onClickCapture={rowClick}><FriendRow user={user.getUser(userId)} status={getStatus(userId)} activities={[]} isFocused={true} /></div>);
      else if (relation === 2) Type.Blocked.push(<div onClickCapture={rowClick}><BlockedRow user={user.getUser(userId)} status={getStatus(userId)} isFocused={true} /></div>);
    }
  }

  return Type[type];
};
const FRIENDS = ({ guild, name }) => {
  const Friends = RELATIONS(guild, 'Friends');
  if (name) return [ `${name} (${Friends.length})`, Friends.length ];

  return <AdvancedScrollerThin className={listScroller} fade={true}>{Friends}</AdvancedScrollerThin>;
};
const BLOCKED = ({ guild, name }) => {
  const Blocked = RELATIONS(guild, 'Blocked');
  if (name) return [ `${name} (${Blocked.length})`, Blocked.length ];

  return <AdvancedScrollerThin className={listScroller} fade={true}>{Blocked}</AdvancedScrollerThin>;
};

export const AllTabs = {
  SERVER_INFO,
  ROLES,
  FRIENDS,
  BLOCKED
};

export default memo(({ selectedSection, guild }) => {
  return createElement(AllTabs[selectedSection], { guild });
});
