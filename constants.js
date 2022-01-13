import React from 'react';
import { logger } from '@vizality/util';
import { Icon as VZIcon } from '@vizality/components';
import { getModule } from '@vizality/webpack';

const { Icon } = getModule(m => m.Icon?.displayName === 'Icon');

const { iconWrapper } = getModule('iconWrapper', 'caret');

const _Icon = (filter, { ...args }) => {
  const _Icon = getModule(filter)?.bind(null);
  return _Icon
    ? <Icon icon={args => {
      const Icon = _Icon(args);

      if (!Icon.props.onMouseEnter) {
        Icon.props = {
          ...Icon.props,
          ...Object.fromEntries(Object.entries(args).filter(([ key ]) => ![ 'width', 'height', 'color' ].includes(key)))
        };
      }

      return Icon;
    }} {...args} />
    : (logger.error({ badge: `vizality://plugins/guild-profile/assets/icon.png`, labels: [ { text: 'Error' } ], message: filter }), null);
};

const _VZIcon = (name, { ...args }) => {
  return <VZIcon className={iconWrapper} name={name} tooltipPosition={'bottom'} {...args} />;
};

const OtherIcon = (SVG, { ...args }) => {
  const SVGs = {
    3: [ 'M18.68 9.3039 19.131 8.4789A3.327 3.327 0 0019.576 8.7589A4.062 4.062 0 0019.84 8.8859A1.92 1.92 0 0020.229 9.0059Q20.502 9.0619 20.836 9.0619Q21.452 9.0619 21.85 8.7889A1.33 1.33 0 0021.985 8.6829A1.227 1.227 0 0022.407 7.7919A1.554 1.554 0 0022.409 7.7199Q22.409 7.4229 22.288 7.1479A1.214 1.214 0 0021.988 6.7369A1.465 1.465 0 0021.908 6.6699A1.711 1.711 0 0021.597 6.4769Q21.447 6.4039 21.271 6.3489A2.787 2.787 0 0021.259 6.3449A2.514 2.514 0 0020.875 6.2599Q20.687 6.2329 20.475 6.2259A4.537 4.537 0 0020.33 6.2239L19.714 6.2239 19.714 5.4209 20.286 5.4209Q20.77 5.4209 21.133 5.3059A2.1 2.1 0 0021.436 5.1839Q21.603 5.0999 21.733 4.9919Q21.969 4.7939 22.084 4.5469Q22.2 4.2989 22.2 4.0349A1.108 1.108 0 0022.12 3.6069A1.036 1.036 0 0021.81 3.1989A1.403 1.403 0 0021.089 2.8949A1.858 1.858 0 0020.847 2.8799Q20.319 2.8799 19.923 3.0509Q19.584 3.1959 19.35 3.3699A1.888 1.888 0 0019.274 3.4299L18.867 2.6489A3.589 3.589 0 0119.141 2.4849Q19.391 2.3489 19.714 2.2149A2.706 2.706 0 0120.313 2.0469Q20.59 2.0009 20.904 1.9999A4.455 4.455 0 0120.924 1.9999A3.229 3.229 0 0121.434 2.0389A2.457 2.457 0 0121.886 2.1539A2.359 2.359 0 0122.316 2.3589A1.923 1.923 0 0122.602 2.5719Q22.893 2.8359 23.047 3.1829Q23.201 3.5289 23.201 3.9029Q23.201 4.5629 22.877 4.9979A2.157 2.157 0 0122.404 5.4559A2.951 2.951 0 0121.958 5.7179Q22.651 5.9819 23.042 6.4879A1.873 1.873 0 0123.428 7.5479A2.363 2.363 0 0123.432 7.6869Q23.432 8.1159 23.273 8.5289Q23.113 8.9409 22.794 9.2599A2.118 2.118 0 0122.326 9.6089A2.753 2.753 0 0121.98 9.7719Q21.485 9.9639 20.825 9.9639A4.616 4.616 0 0120.269 9.9319Q19.982 9.8969 19.736 9.8239A2.601 2.601 0 0119.577 9.7719Q19.054 9.5789 18.68 9.3039Z', 'PrivateThreadIcon', 0 ], // 11, 18.68 1.9999
    7: [ 'M20.913 9.6999 19.802 9.6999A16.138 16.138 0 0119.835 8.6479Q19.877 8.0069 19.972 7.4559A9.539 9.539 0 0120.229 6.3549A7.764 7.764 0 0120.468 5.6739Q20.792 4.8709 21.276 4.2059A11.308 11.308 0 0122.148 3.1519A12.855 12.855 0 0122.387 2.9019L18.68 2.9019 18.68 1.9999 23.564 1.9999 23.564 2.7919A13.297 13.297 0 0022.873 3.5119A9.707 9.707 0 0022.299 4.2219Q21.793 4.9149 21.485 5.7069A7.167 7.167 0 0021.169 6.7639A8.798 8.798 0 0021.045 7.4609A13.203 13.203 0 0020.955 8.3639Q20.923 8.8279 20.916 9.3469A23.413 23.413 0 0020.913 9.6999Z', 'PrivateThreadIcon', 0 ], // 11, 18.68 1.9999
    T: [ 'M17.68 2.9239 17.68 1.9999 23.455 1.9999 23.455 2.9239 21.09 2.9239 21.09 9.6999 20.045 9.6999 20.045 2.9239 17.68 2.9239Z', 'PrivateThreadIcon', 0 ], // 11, 17.68 1.9999
    Permissions: [ 'M23.4748 4.0503 19.8748 2.0503C19.7536 1.9831 19.6072 1.9831 19.486 2.0503L15.886 4.0503C15.7592 4.1207 15.6804 4.2543 15.6804 4.3995C15.6804 4.6771 15.726 11.1995 19.6804 11.1995C23.6348 11.1995 23.6804 4.6771 23.6804 4.3995C23.6804 4.2543 23.6016 4.1207 23.4748 4.0503ZM19.6804 4.3995C20.2328 4.3995 20.6804 4.8471 20.6804 5.3995C20.6804 5.9519 20.2328 6.3995 19.6804 6.3995C19.128 6.3995 18.6804 5.9519 18.6804 5.3995C18.6804 4.8471 19.128 4.3995 19.6804 4.3995ZM18.1804 8.3999C18.1804 7.4795 18.76 6.8999 19.6804 6.8999C20.6008 6.8999 21.1804 7.4795 21.1804 8.3999H18.1804Z', 'PrivateThreadIcon', 0 ], // PersonShield 0.4, 15.68 1.9999
    RoleSubscriptions: [ 'M19.487 5.126 10.487.126C10.184-.042 9.818-.042 9.515.126L.515 5.126C.198 5.302.001 5.636.001 5.999C.001 6.693.115 22.999 10.001 22.999C19.887 22.999 20.001 6.693 20.001 5.999C20.001 5.636 19.804 5.302 19.487 5.126ZM11.001 15.999V17.999H9.001V15.999H7.001V13.999H11.001C11.271 13.999 11.501 13.829 11.501 13.619C11.501 12.579 6.501 13.619 6.501 10.369C6.501 9.069 7.621 7.999 9.001 7.999V5.999H11.001V7.999H13.001V9.999H9.001C8.731 9.999 8.501 10.169 8.501 10.379C8.501 11.419 13.501 10.379 13.501 13.629C13.501 14.929 12.381 15.999 11.001 15.999Z', 'Ticket', null ], // PersonShield Ticket
    TextInVoice: [ 'M15.6233 10.5C15.4677 10.5 15.3499 10.3595 15.3771 10.2063L15.68 8.5H13.9776C13.8222 8.5 13.7045 8.3599 13.7313 8.2069L13.8188 7.7069C13.8397 7.5873 13.9436 7.5 14.0651 7.5H15.855L16.385 4.5H14.6826C14.5272 4.5 14.4095 4.3599 14.4363 4.2069L14.5238 3.7069C14.5447 3.5873 14.6486 3.5 14.7701 3.5H16.56L16.8784 1.7063C16.8996 1.587 17.0033 1.5 17.1245 1.5H17.6167C17.7722 1.5 17.89 1.6405 17.8629 1.7937L17.56 3.5H20.56L20.8784 1.7063C20.8995 1.587 21.0033 1.5 21.1245 1.5H21.6167C21.7722 1.5 21.8901 1.6405 21.8629 1.7937L21.56 3.5H23.2625C23.4177 3.5 23.5355 3.6401 23.5087 3.7931L23.4212 4.2931C23.4003 4.4127 23.2964 4.5 23.1749 4.5H21.385L20.855 7.5H22.5574C22.7127 7.5 22.8305 7.6401 22.8037 7.7931L22.7162 8.2931C22.6953 8.4127 22.5914 8.5 22.4699 8.5H20.68L20.3616 10.2937C20.3405 10.4131 20.2367 10.5 20.1154 10.5H19.6233C19.4677 10.5 19.3499 10.3595 19.3772 10.2063L19.68 8.5H16.68L16.3616 10.2937C16.3404 10.4131 16.2367 10.5 16.1155 10.5H15.6233ZM17.3852 4.5 16.8552 7.5H19.8552L20.3852 4.5H17.3852Z', 'SpeakerLimited', 1 ], // ChannelText 0.5, 12.68 0
    AnimatedBanner: [ 'M20 6.002H14V3.002C14 2.45 13.553 2.002 13 2.002H4C3.447 2.002 3 2.45 3 3.002V22.002H5V14.002H10.586L8.293 16.295C8.007 16.581 7.922 17.011 8.076 17.385C8.23 17.759 8.596 18.002 9 18.002H20C20.553 18.002 21 17.554 21 17.002V7.002C21 6.45 20.553 6.002 20 6.002ZM10.3234 9.586V12.61C9.6753 13.033 8.9103 13.267 8.0554 13.267C6.0843 13.267 4.9953 11.971 4.9953 10.054C4.9953 8.128 6.1744 6.823 8.0914 6.823C8.8563 6.823 9.4954 7.003 9.9903 7.282L9.7833 8.623C9.3154 8.326 8.7663 8.092 8.1274 8.092C7.0564 8.092 6.5343 8.884 6.5343 10.045C6.5343 11.215 7.0744 12.034 8.1454 12.034C8.4873 12.034 8.7304 11.962 8.9823 11.836V10.729H7.8213V9.586H10.3234ZM11.6611 6.94H13.2001V13.15H11.6611V6.94ZM18.3543 6.94V8.227H16.1673V9.496H17.8953V10.783H16.1673V13.15H14.6373V6.94H18.3543Z', 'Flag', null ], // InvertedGIFLabel 0.75, 3 1
    HubLink: [ 'M3.7655 6.0345C3.95 6.21 3.95 6.498 3.7655 6.6735C3.59 6.849 3.302 6.849 3.1265 6.6735A2.2514 2.2514 90 013.1265 3.492L4.7195 1.899A2.2514 2.2514 90 017.901 1.899A2.2514 2.2514 90 017.901 5.0805L7.2305 5.751C7.235 5.382 7.1765 5.013 7.0505 4.662L7.262 4.446A1.3419 1.3419 90 007.262 2.538A1.3419 1.3419 90 005.354 2.538L3.7655 4.1265A1.3419 1.3419 90 003.7655 6.0345ZM5.0345 4.1265C5.21 3.951 5.498 3.951 5.6735 4.1265A2.2514 2.2514 90 015.6735 7.308L4.0805 8.901A2.2514 2.2514 90 01.899 8.901A2.2514 2.2514 90 01.899 5.7195L1.5695 5.049C1.565 5.418 1.6235 5.787 1.7495 6.1425L1.538 6.354A1.3419 1.3419 90 001.538 8.262A1.3419 1.3419 90 003.446 8.262L5.0345 6.6735A1.3419 1.3419 90 005.0345 4.7655A.4378.4378 90 015.0345 4.1265Z', 'Hub', 'Add' ], // Link 0.45, -1 0
    ChannelBanner: [ 'M21.68 4.4008H19.28V3.2008C19.28 2.98 19.1012 2.8008 18.88 2.8008H15.28C15.0588 2.8008 14.88 2.98 14.88 3.2008V10.8008H15.68V7.6008H17.9144L16.9972 8.518C16.8828 8.6324 16.8488 8.8044 16.9104 8.954C16.972 9.1036 17.1184 9.2008 17.28 9.2008H21.68C21.9012 9.2008 22.08 9.0216 22.08 8.8008V4.8008C22.08 4.58 21.9012 4.4008 21.68 4.4008Z', 'ChannelTextLimited', 1 ] // Flag 0.4, 13.68 2
  };

  const Data = SVGs[SVG];
  if (!Data) return null;
  const [ d, displayName, child ] = Data;

  const OtherIcon = Icon({ icon: args => {
    const icon = getModule(m => m.displayName === displayName)(args);

    if (child === null) icon.props.children.props.d = d;
    else if (child === 'Add') icon.props.children.push(<path d={d} fill={args.color} />);
    else icon.props.children[child].props.d = d;

    if (!icon.props.onMouseEnter) {
      icon.props = {
        ...icon.props,
        ...Object.fromEntries(Object.entries(args).filter(([ key ]) => ![ 'width', 'height', 'color' ].includes(key)))
      };
    }

    return icon;
  }, ...args });

  return OtherIcon;
};

export const GuildFeatures = Object.freeze({
  INVITE_SPLASH: _Icon.bind(null, m => m.displayName === 'PersonAdd'),
  VIP_REGIONS: _Icon.bind(null, m => m.displayName === 'Globe'),
  VANITY_URL: _Icon.bind(null, m => m.displayName === 'Link'),
  MORE_EMOJI: _Icon.bind(null, m => m.displayName === 'EmojiSmile'),
  MORE_STICKERS: _Icon.bind(null, m => m.displayName === 'Sticker' && m.name === 'p'),
  VERIFIED: null, // _Icon.bind(null, m => m.displayName === 'Verified'),
  COMMERCE: _VZIcon.bind(null, 'Store'),
  DISCOVERABLE: _Icon.bind(null, m => m.displayName === 'Discover'),
  COMMUNITY: _Icon.bind(null, m => m.displayName === 'People'),
  FEATURABLE: _Icon.bind(null, m => m.displayName === 'Star'),
  NEWS: _Icon.bind(null, m => m.displayName === 'Mail'),
  HUB: _Icon.bind(null, m => m.displayName === 'Hub'),
  PARTNERED: null, // _Icon.bind(null, m => m.displayName === 'Partner'),
  ANIMATED_ICON: _Icon.bind(null, m => m.displayName === 'InvertedGIFLabel'),
  BANNER: _Icon.bind(null, m => m.displayName === 'Flag'),
  ENABLED_DISCOVERABLE_BEFORE: _Icon.bind(null, m => m.displayName === 'Search'),
  WELCOME_SCREEN_ENABLED: _Icon.bind(null, m => m.displayName === 'Monitor'),
  MEMBER_VERIFICATION_GATE_ENABLED: _Icon.bind(null, m => m.displayName === 'Blocked'),
  PREVIEW_ENABLED: _VZIcon.bind(null, 'ProjectorScreen'),
  MONETIZATION_ENABLED: _Icon.bind(null, m => m.displayName === 'StoreTag'),
  ROLE_SUBSCRIPTIONS_ENABLED: OtherIcon.bind(null, 'RoleSubscriptions'),
  ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE: OtherIcon.bind(null, 'RoleSubscriptions'), // Same as ROLE_SUBSCRIPTIONS_ENABLED
  THREE_DAY_THREAD_ARCHIVE: OtherIcon.bind(null, 3),
  SEVEN_DAY_THREAD_ARCHIVE: OtherIcon.bind(null, 7),
  PRIVATE_THREADS: _Icon.bind(null, m => m.displayName === 'PrivateThreadIcon'),
  THREADS_ENABLED: _Icon.bind(null, m => m.displayName === 'ThreadIcon'),
  THREADS_ENABLED_TESTING: OtherIcon.bind(null, 'T'),
  NEW_THREAD_PERMISSIONS: OtherIcon.bind(null, 'Permissions'),
  ROLE_ICONS: _Icon.bind(null, m => m.displayName === 'ImageUpload'),
  TEXT_IN_VOICE_ENABLED: OtherIcon.bind(null, 'TextInVoice'),
  HAS_DIRECTORY_ENTRY: _Icon.bind(null, m => m.displayName === 'ChannelDirectory'),
  ANIMATED_BANNER: OtherIcon.bind(null, 'AnimatedBanner'),
  LINKED_TO_HUB: OtherIcon.bind(null, 'HubLink'),
  CHANNEL_BANNER: OtherIcon.bind(null, 'ChannelBanner')
});

export const Class = {
  topSection: {
    root: 'root-8LYsGj',
    tabBarContainer: 'tabBarContainer-sCZC4w',
    tabBar: 'tabBar-2hXqzU',
    tabBarItem: 'tabBarItem-30Te4-',
    body: 'body-1Ukv50',
    topSection: 'topSection-13QKHs',
    noTabBar: 'noTabBar-2Q-iE_'
  },
  header: {
    header: 'header-S26rhB',
    headerTop: 'headerTop-1PNKck',
    badgeList: 'badgeList-2aoHPw',
    warningCircleIcon: 'warningCircleIcon-1YXIHu',
    avatar: 'avatar-3QF_VA',
    relationshipButtons: 'relationshipButtons-3ByBpj',
    nameTag: 'nameTag-2Nlmsy',
    nameTagNoCustomStatus: 'nameTagNoCustomStatus-3ocqoK nameTag-2Nlmsy',
    nameTagWithCustomStatus: 'nameTagWithCustomStatus-5c-v3- nameTag-2Nlmsy',
    customStatusActivity: 'customStatusActivity-WKWGD-',
    customStatus: 'customStatus-kFfkj5',
    customStatusEmoji: 'customStatusEmoji-3Oq9Rm',
    customStatusSoloEmoji: 'customStatusSoloEmoji-3m_35_',
    customStatusText: 'customStatusText-_4TbWr',
    username: 'username-1g6Iq1',
    discriminator: 'discriminator-1bqsd3',
    botTag: 'botTag-2Mlq3u',
    additionalActionsIcon: 'additionalActionsIcon-3Cy8UU',
    applicationInstallButton: 'applicationInstallButton-1-58qm',
    applicationInstallButtonContent: 'applicationInstallButtonContent-2GoIj7',
    applicationInstallButtonText: 'applicationInstallButtonText-28e06z',
    launchIcon: 'launchIcon-RTf7He'
  },
  infoScroller: {
    userInfoSection: 'userInfoSection-2u2hir',
    userInfoSectionHeader: 'userInfoSectionHeader-2mYYun',
    userBio: 'userBio-2-tr00',
    note: 'note-3M15gE',
    connectedAccounts: 'connectedAccounts-1YaT2t',
    connectedAccount: 'connectedAccount-1xKpli',
    connectedAccountIcon: 'connectedAccountIcon-2vls0t',
    connectedAccountNameInner: 'connectedAccountNameInner-t24B11',
    connectedAccountName: 'connectedAccountName-j0meX4',
    connectedAccountVerifiedIcon: 'connectedAccountVerifiedIcon-3XCxT8',
    connectedAccountOpenIcon: 'connectedAccountOpenIcon-1yfBsb',
    infoScroller: 'infoScroller-1QMpon'
  },
  listScroller: {
    listRow: 'listRow-2nO1T6',
    listRowContent: 'listRowContent-PEmSWj',
    listName: 'listName-PwbeHL',
    listAvatar: 'listAvatar-2bU5Uh',
    listDiscriminator: 'listDiscriminator-1HAKWY',
    empty: 'empty-2zcusz',
    emptyIcon: 'emptyIcon-uKVxYR',
    emptyText: 'emptyText-mZZyQk',
    listScroller: 'listScroller-entkMk',
    emptyIconFriends: 'emptyIconFriends-2LNxTX emptyIcon-uKVxYR',
    emptyIconGuilds: 'emptyIconGuilds-2NNSTU emptyIcon-uKVxYR',
    emptyIconStreamerMode: 'emptyIconStreamerMode-3P4I-V emptyIcon-uKVxYR'
  }
};
