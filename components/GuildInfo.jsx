import React, { memo } from 'react';
import { Messages } from '@vizality/i18n';
import { getModule } from '@vizality/webpack';
import { toTitleCase } from '@vizality/util/string';

const UserMention = getModule(m => m.default?.toString().includes('e.inlinePreview') && m.default.displayName !== 'RoleMention').default;
const MaskedLink = getModule(m => m.displayName === 'MaskedLink');
const { Heading } = getModule(m => m.Heading?.displayName === 'Heading');
const { Text } = getModule(m => m.Text?.displayName === 'Text');

const Constants = getModule(m => m.API_HOST);
const { parse } = getModule(m => m.parse && m.defaultRules);

export default memo(({ title, description, channelId, onClick }) => {
  let content = '';

  switch (title) {
    case 'Server Owner': {
      content = <UserMention className={'mention'} {...description} />;
      break;
    }
    case 'Vanity URL': {
      const link = `${Constants.VANITY_URL_PREFIX}/${description}`;

      content = <MaskedLink title={link} href={link}>{`discord.gg/${description}`}</MaskedLink>;
      break;
    }
    case 'Commands': {
      const ApplicationCommandType = {
        1: 'Slash',
        2: 'User (Right Click)',
        3: 'Message (Right Click)'
      };

      title += ` (${Object.values(description).reduce((total, value) => total += value, 0)})`;

      content = Object.entries(description).map(([ key, value ]) => {
        return value !== 0 ? `${ApplicationCommandType[key]}: ${value}` : null;
      }).filter(commandType => commandType).join('\n');
      break;
    }
    case 'Default Message Notification': {
      const DefaultMessageNotification = Messages[`FORM_LABEL_${Constants.UserNotificationSettings[description]}`];

      content = DefaultMessageNotification.format?.() ?? DefaultMessageNotification;
      break;
    }
    case 'Verification Level': {
      const GuildVerificationLevel = {
        0: Constants.VerificationLevels[0],
        1: Constants.VerificationLevels[1],
        2: Constants.VerificationLevels[2],
        3: Constants.VerificationLevels[3],
        4: Constants.VerificationLevels[4]
      };
      const GuildVerificationLevelCriteria = {
        0: Messages[`VERIFICATION_LEVEL_${GuildVerificationLevel[0]}_CRITERIA`],
        1: Messages[`VERIFICATION_LEVEL_${GuildVerificationLevel[1]}_CRITERIA`],
        2: Messages[`VERIFICATION_LEVEL_${GuildVerificationLevel[2]}_CRITERIA`],
        3: Messages[`VERIFICATION_LEVEL_${GuildVerificationLevel[3]}_CRITERIA`],
        4: Messages[`VERIFICATION_LEVEL_${GuildVerificationLevel[4]}_CRITERIA`]
      };
      const GuildVerificationCriteria = {
        [GuildVerificationLevel[2]]: Constants.VerificationCriteria.ACCOUNT_AGE,
        [GuildVerificationLevel[3]]: Constants.VerificationCriteria.MEMBER_AGE
      };

      title += ` (${Messages[`VERIFICATION_LEVEL_${GuildVerificationLevel[description]}`]})`;

      for (let i = 0; i <= description; i++) {
        content += `${GuildVerificationLevelCriteria[i].format?.({ min: GuildVerificationCriteria[GuildVerificationLevel[i]] }) ?? GuildVerificationLevelCriteria[i]}\n`;
      }
      content = content.substring(0, content.length - 1);
      if (content.startsWith(`${GuildVerificationLevelCriteria[0]}\n`)) content = content.substring(`${GuildVerificationLevelCriteria[0]}\n`.length, content.length);
      break;
    }
    case 'Explicit Content Filter': {
      const GuildExplicitContentLevels = {
        0: 'DISABLED',
        1: 'MEDIUM',
        2: 'HIGH'
      };

      title += ` (${toTitleCase(Constants.GuildExplicitContentFilterTypes[description])})`;

      content = `${Messages[`EXPLICIT_CONTENT_FILTER_${GuildExplicitContentLevels[description]}`]}`;
      break;
    }
    case 'MFA Level': {
      content = toTitleCase(Constants.MFALevels[description]);
      break;
    }
    case 'NSFW Level': {
      content = toTitleCase(Constants.GuildNSFWContentLevel[description]);
      break;
    }
    case 'Current User': {
      content = <UserMention className={'mention'} {...description} />;
      break;
    }
    default: {
      content = parse(description, true, { channelId });
    }
  }

  const style = title === 'Current User' ? { marginLeft: 'auto', marginRight: '20px', textAlign: '-webkit-center' } : { paddingTop: '10px', paddingRight: '20px', paddingBottom: '5px' };

  return <div style={style}><Heading style={{ paddingBottom: '5px' }} variant={'text-sm/semibold'}>{title}</Heading><Text style={{ whiteSpace: 'pre-wrap' }} onClick={onClick} variant={'text-sm/normal'}>{content}</Text></div>;
});
