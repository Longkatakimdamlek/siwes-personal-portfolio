export const DEFAULT_AVATAR_URL = '/images/developer_avatar_portrait_1790252834755.jpg';

const LEGACY_AVATAR_URLS = new Set([
  '/assets/avatar-placeholder.png',
  '/images/avatar.jpg',
]);

export function resolveAvatarUrl(profileAvatarUrl, heroImageUrl) {
  if (profileAvatarUrl && !LEGACY_AVATAR_URLS.has(profileAvatarUrl)) {
    return profileAvatarUrl;
  }

  if (heroImageUrl && !LEGACY_AVATAR_URLS.has(heroImageUrl)) {
    return heroImageUrl;
  }

  return DEFAULT_AVATAR_URL;
}