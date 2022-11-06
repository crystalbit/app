import { GearAttributeType } from '@features/gear/types';

const getGearMeta = async (url: string) => {
  try {
    const result = await fetch(url);
    const data = await result.json();
    const attributes = data.attributes;
    return {
      title: data.attributes.find(
        (attr: GearAttributeType) => attr.trait_type === 'Name'
      )?.value,
      description: data.description,
      type: attributes.find(
        (attr: GearAttributeType) => attr.trait_type === 'Type'
      )?.value,
      rarity: attributes.find(
        (attr: GearAttributeType) => attr.trait_type === 'Rarity'
      )?.value,
      buff: attributes.find(
        (attr: GearAttributeType) => attr.trait_type === 'Buff'
      )?.value,
      durability: `${
        attributes.find(
          (attr: GearAttributeType) => attr.trait_type === 'Durability'
        )?.value
      } uses`
    };
  } catch {
    return {};
  }
};

export { getGearMeta };
