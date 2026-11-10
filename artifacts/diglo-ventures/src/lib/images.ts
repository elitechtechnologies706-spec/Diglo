const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

export const DIGLO_IMAGES = {
  giftPacks: unsplash("photo-1549465220-1a8b9238cd48"),
  uniforms: unsplash("photo-1521572163474-6864f9cf17ab"),
  ppe: unsplash("photo-1504307651254-35680f356dfd"),
  printing: unsplash("photo-1562654501-a0ccc0fc3b6b"),
  chefApron: unsplash("photo-1556910103-1c02745aae4d"),
  officeTeam: unsplash("photo-1521737604893-d14cc237f11d"),
} as const;
