export default {
  // Skipped so applications can use 0 as fallback
  SKIP: 1 << 0,

  CREATE_MESSAGE: 1 << 1,
  VIEW_CHANNELS: 1 << 2,
  READ_MESSAGE_HISTORY: 1 << 3,
  CREATE_INVITE: 1 << 4,
  ADD_REACTIONS: 1 << 5,
  EMBED_LINKS: 1 << 6,
  ATTACH_FILES: 1 << 7,
  MASS_MENTIONS: 1 << 8,
  CHANGE_NICKNAME: 1 << 9,

  ADMINISTRATOR: 1 << 10,
  MANAGE_MESSAGES: 1 << 11,
  MANAGE_CHANNELS: 1 << 12,
  MANAGE_SERVER: 1 << 13,
}