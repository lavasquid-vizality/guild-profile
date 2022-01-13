import React from 'react';
import { Plugin } from '@vizality/entities';
import { getModule } from '@vizality/webpack';

import GuildProfileModal from './components/GuildProfileModal';

import MemberCountStore from './stores/memberCount';
import GFCheck from './modules/GFCheck';
import patchContextMenuLazy from './modules/patchContextMenuLazy';

const { MenuGroup, MenuItem } = getModule(m => m.MenuItem);

const { openModalLazy } = getModule(m => m.openModalLazy);

export default class GuildProfile extends Plugin {
  start () {
    MemberCountStore.initialize();
    GFCheck.call(this);

    this.injectStyles('style.css');
    this.patch();
  }

  patch () {
    patchContextMenuLazy(getModule.bind(this, m => m.default?.displayName === 'GuildContextMenu'), 'default', (args, res) => {
      const { guild } = args[0];

      res.props.children.unshift(<MenuGroup><MenuItem action={() => openModalLazy(() => ModalArgs => <GuildProfileModal {...ModalArgs} guild={guild} />)} id={'guild-profile'} label={'Server Profile'} /></MenuGroup>);

      return res;
    });
  }

  stop () {
    MemberCountStore.destroy();
  }
}
