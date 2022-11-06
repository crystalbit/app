export type AvatarsMetaAttributeType = {
  trait_type: string;
  value: string;
};

export type AvatarMetaType = {
  attributes: AvatarsMetaAttributeType[];
  description: string;
  image: string;
  name: string;
};

export enum AVATAR_ATTRIBUTES {
  profession = 'Profession',
  name = 'Name',
  isInChamber = 'In chamber',
  xp = 'XP',
  level = 'Level',
  background = 'Background',
  human = 'Human',
  headgear = 'Headgear',
  mask = 'Mask',
  shades = 'Shades',
  visor = 'Visor'
}

export type AvatarMetaFilter = {
  id: string;
  data: {
    attributes: AvatarsMetaAttributeType[];
    description: string;
    image: string;
    name: string;
  };
};
