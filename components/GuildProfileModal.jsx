import React, { memo, useState, useEffect } from 'react';
import { Flux, getModule } from '@vizality/webpack';
const { toHex } = require('@vizality/util/color');

import Icons from './Icons';
import GuildProfileTabBar from './GuildProfileTabBar';
import Section from '../modules/Sections';

import MemberCountStore from '../stores/memberCount';

import { GuildFeatures, Class } from '../constants';

const Modal = getModule(m => m.ModalRoot);
const UserBanner = getModule(m => m.displayName === 'UserBanner');
const { AnimatedAvatar, Sizes } = getModule(m => m.AnimatedAvatar);
const GuildIconWrapper = getModule(m => m.displayName === 'GuildIconWrapper');
const { Info: GuildInfo, GuildName, Data } = getModule(m => m.Info?.displayName === 'InviteButton.Info');

const Constants = getModule(m => m.API_HOST);
const { getPrimaryColorForAvatar } = getModule(m => m.getPrimaryColorForAvatar);

const { count } = getModule('count', 'status');
const { root, topSection, body } = Class.topSection;
const { header, avatar, nameTagNoCustomStatus, username: headerUsername } = Class.header;
const { nameTag, username } = getModule('nameTag', 'username', 'bot');

const FluxMemberCountStoreData = Flux.connectStores([ MemberCountStore ], ({ guildId }) => {
  return { members: MemberCountStore.getMemberCount(guildId), membersOnline: MemberCountStore.getOnlineMemberCount(guildId) };
})(Data);
const FluxMemberCountStoreDiv = Flux.connectStores([ MemberCountStore ], ({ guildId }) => {
  const _LEFT = MemberCountStore._getLeft(guildId);
  return _LEFT ? { color: Constants.Colors.STATUS_RED, children: `Online Count May Not Be Accurate! ${_LEFT} ${_LEFT === 1 ? 'member' : 'members'} not considered.` } : null;
})(({ color, children }) => children ? <div className={count} style={{ color }}>{children}</div> : null);

export default memo(({ transitionState, onClose, guild }) => {
  const [ section, setSection ] = useState('SERVER_INFO');
  const [ accentColor, setAccentColor ] = useState('#000000');

  useEffect(() => {
    if (guild.icon) {
      getPrimaryColorForAvatar(guild.getIconURL(null, true)).then(color => setAccentColor(parseInt(toHex(color).replace('#', ''), 16)));
    }
  }, [ guild ]);

  const guildHeader = {
    id: guild.id,
    banner: guild.banner,
    accentColor,
    getAvatarURL: () => void 0
  };

  let iconsCount = guild.features.size;
  if (guild.premiumTier) iconsCount++;
  for (const [ key, value ] of Object.entries(GuildFeatures)) {
    if (value === null) {
      if (guild.features.has(key)) iconsCount--;
    }
  }

  return <Modal.ModalRoot className={root} transitionState={transitionState} aria-label={'Guild Profile Modal'}>
    <div className={topSection}>
      <header>
        <UserBanner bannerType={1} user={guildHeader} />
        <div className={header} style={{ marginBottom: 28 + 24 * Math.ceil(iconsCount / 10) }}>
          {guild.icon
            ? <AnimatedAvatar className={avatar} src={guild.getIconURL(120, true)} size={Sizes.SIZE_120} animate={true} />
            : <GuildIconWrapper className={avatar} style={{ backgroundClip: 'unset', borderColor: accentColor }} guild={guild} size={GuildIconWrapper.Sizes.XLARGE} animate={true} />}
          <Icons premiumTier={guild.premiumTier} guildFeatures={guild.features} />
        </div>
        <div className={`${nameTagNoCustomStatus} ${nameTag}`} style={{ marginBottom: '5px' }}><span className={`${username} ${headerUsername}`}>
          <GuildInfo title={<GuildName guild={guild} />}>
            <FluxMemberCountStoreData guildId={guild.id} />
            <FluxMemberCountStoreDiv guildId={guild.id} />
          </GuildInfo>
        </span></div>
      </header>
      <GuildProfileTabBar guild={guild} section={section} setSection={setSection} />
    </div>
    <div className={body}>
      <Section selectedSection={section} guild={guild} close={onClose} />
    </div>
  </Modal.ModalRoot>;
});
