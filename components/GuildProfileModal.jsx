import React, { memo, useState, useEffect } from 'react';
import { Modal } from '@vizality/components';
import { Constants } from '@vizality/discord/constants';
import { Flux, getModule } from '@vizality/webpack';
const { object: { isEmptyObject }, color: { toHex } } = require('@vizality/util');

import Icons from './Icons';
import GuildProfileTabBar from './GuildProfileTabBar';
import Section from '../modules/Sections';

import MemberCountStore from '../stores/memberCount';
import { OpenPopouts } from './MentionPopout';

const UserBanner = getModule(m => m.displayName === 'UserBanner');
const { AnimatedAvatar, Sizes } = getModule(m => m.AnimatedAvatar);
const GuildIconWrapper = getModule(m => m.displayName === 'GuildIconWrapper');
const { Info: GuildInfo, GuildName, Data } = getModule(m => m.Info?.displayName === 'InviteInfo');

const { count } = getModule('count', 'status');
const { topSection, body } = getModule('topSection');
const { header, avatar, nameTagNoCustomStatus, username: headerUsername } = getModule('header', 'avatar', 'nameTag');
const { nameTag, username } = getModule('nameTag', 'username', 'bot');

const FluxMemberCountStoreData = Flux.connectStores([ MemberCountStore ], ({ guildId }) => {
  return { members: MemberCountStore.getMemberCount(guildId), membersOnline: MemberCountStore.getOnlineMemberCount(guildId) };
})(Data);
const FluxMemberCountStoreDiv = Flux.connectStores([ MemberCountStore ], ({ guildId }) => {
  const _LEFT = MemberCountStore._getLeft(guildId);
  return _LEFT ? { color: Constants.HEXColors.STATUS_RED, children: `Online Count May Not Be Accurate! ${_LEFT} ${_LEFT === 1 ? 'member' : 'members'} not considered.` } : null;
})(({ color, children }) => children ? <div className={count} style={{ color }}>{children}</div> : null);

export default memo(({ guild }) => {
  const [ section, setSection ] = useState('SERVER_INFO');
  const [ accentColor, setAccentColor ] = useState('#000000');

  useEffect(() => {
    (async () => {
      if (guild.icon) {
        const color = `rgb(${await getModule(m => m.getPrimaryColorForAvatar).getPrimaryColorForAvatar(guild.getIconURL(null, true))})`;
        setAccentColor(parseInt(toHex(color).replace('#', ''), 16));
      }
    })();
  }, [ guild ]);

  const guildHeader = {
    id: guild.id,
    banner: guild.banner,
    accentColor,
    getAvatarURL: () => void 0
  };

  return <Modal size={Modal.Sizes.MEDIUM} onClick={() => {
    if (!isEmptyObject(OpenPopouts)) Object.values(OpenPopouts).forEach(setShouldShow => setShouldShow(false));
  }}>
    <>
      <div className={topSection}>
        <header>
          <UserBanner bannerType={1} user={guildHeader} />
          <div className={header}>
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
        <Section selectedSection={section} guild={guild} />
      </div>
    </>
  </Modal>;
});
