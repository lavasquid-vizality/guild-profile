import React, { memo, useState } from 'react';
import { user } from '@vizality/discord';
import { getModule } from '@vizality/webpack';

const Popout = getModule(m => m.displayName === 'Popout');
const UserPopoutContainer = getModule(m => m.type?.displayName === 'UserPopoutContainer');
const Mention = getModule(m => m.displayName === 'Mention');
const { openContextMenu } = getModule(m => m.openContextMenu);
const GuildChannelUserContextMenu = getModule(m => m.displayName === 'GuildChannelUserContextMenu');

const { getChannels } = getModule(m => m.getChannels);

export const OpenPopouts = {};

export default memo(({ userId, guild }) => {
  const [ shouldShow, setShouldShow ] = useState(false);

  const User = userId ? user.getUser(userId) : user.getCurrentUser();
  const channelId = getChannels(guild.id).SELECTABLE[0].channel.id;
  userId = userId ?? User.id;
  const mention = User?.username ? `@${User.username}` : `<@${userId}>`;

  return <Popout shouldShow={shouldShow} renderPopout={args => <UserPopoutContainer {...args} guildId={guild.id} channelId={channelId} userId={userId} />}>{args => {
    args['aria-expanded'] ? OpenPopouts[args['aria-controls']] = setShouldShow : delete OpenPopouts[args['aria-controls']];
    return <Mention {...args} className={'mention'} onClick={() => setShouldShow(!shouldShow)} onContextMenu={args => {
      if (User) return openContextMenu(args, args => <GuildChannelUserContextMenu {...args} guildId={guild.id} channelId={channelId} user={User} />);
    }} channelId={channelId} userId={userId}>{mention}</Mention>;
  }}</Popout>;
});
