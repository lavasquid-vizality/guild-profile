import React from 'react';
import { Plugin } from '@vizality/entities';
import { patch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

import GuildProfileModal from './components/GuildProfileModal';

import MemberCountStore from './stores/memberCount';
import GFCheck from './modules/GFCheck';
import getContextMenuLazy from './modules/getContextMenuLazy';

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
    getContextMenuLazy(getModule.bind(this, m => m.default?.displayName === 'GuildContextMenu')).then(module => patch(module, 'default', (args, res) => {
      const { guild } = args[0];

      res.props.children.unshift(<MenuGroup><MenuItem action={() => openModalLazy(() => ModalArgs => <GuildProfileModal {...ModalArgs} guild={guild} />)} id={'guild-profile'} label={'Server Profile'} /></MenuGroup>);

      return res;
    }));
  }

  stop () {
    MemberCountStore.destroy();
  }
}
