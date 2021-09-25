import React from 'react';
import { Plugin } from '@vizality/entities';
import { patch } from '@vizality/patcher';
import { open } from '@vizality/modal';
import { getModule } from '@vizality/webpack';

import GuildProfileModal from './components/GuildProfileModal';

import MemberCountStore from './stores/memberCount';
import GFCheck from './modules/GFCheck';

const { MenuGroup, MenuItem } = getModule(m => m.MenuItem);

export default class extends Plugin {
  start () {
    MemberCountStore.initialize();
    GFCheck.call(this);

    this.injectStyles('style.css');
    this.patch();
  }

  patch () {
    patch(getModule(m => m.default?.displayName === 'GuildContextMenu'), 'default', (args, res) => {
      const { guild } = args[0];

      res.props.children.unshift(<MenuGroup><MenuItem action={() => open(() => <GuildProfileModal guild={guild} />)} id={'guild-profile'} label={'Server Profile'} /></MenuGroup>);

      return res;
    });
  }

  stop () {
    MemberCountStore.destroy();
  }
}
