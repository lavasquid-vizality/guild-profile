import { getModule, Flux, FluxDispatcher } from '@vizality/webpack';

const Constants = getModule(m => m.API_HOST);

const handleGuildMemberListUpdate = ({ id, guildId, groups, memberCount }) => {
  if (this.default._destroyed) return;

  let _LEFT = 0;
  const AllGroups = groups.reduce((total, group) => total += group.count, 0);
  const OnlineGroups = groups.reduce((total, group) => group.id === 'offline' ? total : total += group.count, 0);

  if (id !== 'everyone' && memberCount !== AllGroups && groups.some(group => group.id === 'offline')) {
    if (memberCount - AllGroups <= (this.default._getLeft(guildId) ?? Infinity)) _LEFT = memberCount - AllGroups;
    else return;
  }

  this.default._memberCounts.set(guildId, {
    _LEFT,
    ALL: memberCount,
    ONLINE: OnlineGroups
  });
};

class MemberCountStore extends Flux.Store {
  constructor () {
    super(FluxDispatcher, { [Constants.ActionTypes.GUILD_MEMBER_LIST_UPDATE]: handleGuildMemberListUpdate });
    this._destroyed = true;
    this._memberCounts = new Map();
  }

  initialize () {
    this._destroyed = false;
  }

  getStore (guildId) {
    return guildId ? this._memberCounts.get(guildId) : this._memberCounts;
  }

  _getLeft (guildId) {
    return this.getStore(guildId)?._LEFT;
  }

  getMemberCount (guildId) {
    return this.getStore(guildId)?.ALL;
  }

  getOnlineMemberCount (guildId) {
    return this.getStore(guildId)?.ONLINE;
  }

  destroy () {
    this._destroyed = true;
    this._memberCounts.clear();
  }
}
export default new MemberCountStore();
