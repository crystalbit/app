import { useCallback, useEffect, useState } from 'react';

import { AvatarMetaType } from '../types';

const useAvatarsMeta = (metaLink?: string | number) => {
  const [metaData, setMetaData] = useState<AvatarMetaType | null>(null);

  const getMetaData = useCallback(async () => {
    if (!metaLink) return;
    try {
      const response = await fetch(metaLink.toString());
      if (response.ok) {
        return response.json();
      } else return {};
    } catch (err) {
      setMetaData(null);
      return err;
    }
  }, [metaLink]);

  useEffect(() => {
    getMetaData().then((data) => setMetaData(data));
  }, [getMetaData, metaLink]);

  // TODO: remove duplicated field from response
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [wrongValue, ...rest] = metaData?.attributes ?? [];

  const speciality = metaData
    ? rest?.find((i) => i.trait_type === 'Profession')?.value
    : null;

  return {
    metaData,
    speciality
  };
};

export default useAvatarsMeta;
