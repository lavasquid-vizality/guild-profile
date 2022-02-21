import React, { memo, createElement, useState } from 'react';
import { getModule } from '@vizality/webpack';
import { findInReactTree } from '@vizality/util/react';

import GuildInfo from '../components/GuildInfo';

import { Class } from '../constants';

const { AdvancedScrollerThin } = getModule(m => m.AdvancedScrollerThin);
const SearchBar = getModule(m => m.displayName === 'SearchBar' && m.toString().includes('onChange'));
const FriendRow = getModule(m => m.displayName === 'FriendRow');
const BlockedRow = getModule(m => m.displayName === 'BlockedRow');

const Constants = getModule(m => m.API_HOST);
const { getChannels } = getModule(m => m.getChannels);
const Timestamp = getModule(m => m.prototype?.toDate && m.prototype?.month);
const { extractTimestamp } = getModule(m => m.extractTimestamp);
const { ExperimentTypes, ExperimentStore } = getModule(m => m.ExperimentTypes);
const { parse } = getModule(m => m.parse && m.defaultRules);
const { getRelationships } = getModule(m => m.getRelationships);
const { isMember } = getModule(m => m.isMember);
const { getUser } = getModule(m => m.getUser && m.getUsers);
const { getStatus } = getModule(m => m.getStatus && m.getState);

const { infoScroller } = Class.infoScroller;
const { listScroller } = Class.listScroller;

const SERVER_INFO = ({ guild, name, close }) => {
  const channelId = getChannels(guild.id).SELECTABLE[0].channel.id;

  const Server_Info = [
    <GuildInfo title={'Server Owner'} description={{ channelId, userId: guild.ownerId }} channelId={channelId} />,
    <GuildInfo title={'Server Description'} description={guild.description} />,
    <GuildInfo title={'Vanity URL'} description={guild.vanityURLCode} />,
    <GuildInfo title={'AFK Timeout'} description={Timestamp()._locale.relativeTime(guild.afkTimeout, true, 'ss', true)} />,
    <GuildInfo title={'Server Created On'} description={Timestamp(extractTimestamp(guild.id)).format('LLL')} />,
    <GuildInfo title={'Server Joined On'} description={Timestamp(guild.joinedAt).format('LLL')} />,
    <GuildInfo title={'Rules Channel'} description={`<#${guild.rulesChannelId}>`} onClick={close} />,
    <GuildInfo title={'System Channel'} description={`<#${guild.systemChannelId}>`} onClick={close} />,
    // <Section title={'Public Updates Channel'} description={`<#${guild.publicUpdatesChannelId}>`} onClick={close} />,
    <GuildInfo title={'AFK Channel'} description={`<#${guild.afkChannelId}>`} onClick={close} />,
    <GuildInfo title={'Commands'} description={guild.applicationCommandCounts} />,
    <GuildInfo title={'Premium Subscriber Count'} description={`${guild.premiumSubscriberCount}`} />,
    <GuildInfo title={'Default Message Notification'} description={`${guild.defaultMessageNotifications}`} />,
    <GuildInfo title={'Verification Level'} description={`${guild.verificationLevel}`} />,
    <GuildInfo title={'Explicit Content Filter'} description={`${guild.explicitContentFilter}`} />,
    <GuildInfo title={'MFA Level'} description={`${guild.mfaLevel}`} />,
    <GuildInfo title={'NSFW Level'} description={`${guild.nsfwLevel}`} />
  ].filter(section => {
    switch (section.props.title) {
      case 'Server Owner':
        return true;
      case 'Commands':
        return Object.values(section.props.description).reduce((total, value) => total + value, 0);
      default:
        return section.props.description && !section.props.description.includes('null');
    }
  });
  if (name) return [ `${name}`, Server_Info.length ];

  return <AdvancedScrollerThin className={infoScroller} style={{ display: 'flex', flexWrap: 'wrap' }} fade={true}>{Server_Info}</AdvancedScrollerThin>;
};

const EXPERIMENTS = ({ guild, name }) => {
  const Experiments = [];

  for (const [ key, value ] of Object.entries(ExperimentStore.getRegisteredExperiments())) {
    if (value.type === ExperimentTypes.GUILD) {
      const guildExperimentDescriptor = ExperimentStore.getGuildExperimentDescriptor(key, guild.id);
      if (guildExperimentDescriptor) Experiments.push([ `${value.title} (${key})`, value.description[value.buckets.lastIndexOf(guildExperimentDescriptor.bucket)] ?? `Bucket ${guildExperimentDescriptor.bucket}: Description not found` ]);
    }
  }
  if (name) return [ `${name} (${Experiments.length})`, Experiments.length ];

  return <AdvancedScrollerThin className={infoScroller} fade={true}>{Experiments.map(([ title, description ]) => <GuildInfo title={title} description={description} />)}</AdvancedScrollerThin>;
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

const rowClick = (close, { nativeEvent }) => {
  for (const path of nativeEvent.path) {
    if (path.ariaLabel === 'Message' || path.ariaLabel === 'Unblock') return close();
    if (path.ariaLabel === 'More') return;
  }
  return close();
};
const RELATIONS = (guild, type, close) => {
  const Type = {
    Friends: [],
    Blocked: []
  };

  for (const [ userId, relation ] of Object.entries(getRelationships())) {
    if (isMember(guild.id, userId)) {
      if (relation === Constants.RelationshipTypes.FRIEND) Type.Friends.push(<div onClickCapture={rowClick.bind(this, close)}><FriendRow user={getUser(userId)} status={getStatus(userId)} activities={[]} isFocused={true} /></div>);
      else if (relation === Constants.RelationshipTypes.BLOCKED) Type.Blocked.push(<div onClickCapture={rowClick.bind(this, close)}><BlockedRow user={getUser(userId)} status={getStatus(userId)} isFocused={true} /></div>);
    }
  }

  return Type[type];
};
const FRIENDS = ({ guild, name, close }) => {
  const Friends = RELATIONS(guild, 'Friends', close);
  if (name) return [ `${name} (${Friends.length})`, Friends.length ];

  return <AdvancedScrollerThin className={listScroller} fade={true}>{Friends}</AdvancedScrollerThin>;
};
const BLOCKED = ({ guild, name, close }) => {
  const Blocked = RELATIONS(guild, 'Blocked', close);
  if (name) return [ `${name} (${Blocked.length})`, Blocked.length ];

  return <AdvancedScrollerThin className={listScroller} fade={true}>{Blocked}</AdvancedScrollerThin>;
};

export const AllTabs = {
  SERVER_INFO,
  EXPERIMENTS,
  ROLES,
  FRIENDS,
  BLOCKED
};

export default memo(({ selectedSection, guild, close }) => {
  return createElement(AllTabs[selectedSection], { guild, close });
});
