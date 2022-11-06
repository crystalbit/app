import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AVATAR_SPECIALITY_FALLBACK } from '@avatars/constants';
import { AVATAR_ATTRIBUTES, AvatarMetaType } from '@avatars/types';
import useMetamask from '@features/global/hooks/useMetamask';
import { CONTRACT_METHODS } from '@features/global/types';
import { LOCAL_STORAGE_KEYS } from '@global/constants';
import useFlags from '@global/hooks/useFlags';
import { formatRequestWrapperPayload } from '@global/utils/gas';
import { NETWORK_DATA } from '@root/settings';
import { selectedAvatarSelector } from '@selectors/avatarsSelectors';
import {
  setAvatarsNamesList,
  setFirstVisitFlow,
  setSelectedAvatar,
  setUserAvatarsList
} from '@slices/avatarsSlice';

export const useAvatars = (metaLink?: string) => {
  const dispatch = useDispatch();
  const { isAvatarsMintingAvailable } = useFlags();

  const { makeCallRequest } = useMetamask();

  const selectedAvatar = useSelector(selectedAvatarSelector);

  const [avatarsMetaData, setAvatarsMetaData] = useState<AvatarMetaType | null>(
    null
  );

  const mintAvatar = async () => {
    const payload = await formatRequestWrapperPayload(address);
    if (!window.web3 || !address || !window.GM) return;
    return window.GM.methods.mintAvatar().send({
      ...payload
    });
  };

  const getUserAvatars = async (): Promise<string[]> => {
    if (!window.web3 || !address || !window.AM) return [];
    const userAvatars = await makeCallRequest<string[]>({
      contract: window.AM,
      method: CONTRACT_METHODS.allMyTokens,
      address
    });
    return userAvatars ?? [];
  };

  const getMyLastMintedAvatar = async (): Promise<number | undefined> => {
    if (!window.web3 || !address || !window.AM) return;
    const lastAvatar = await makeCallRequest<string>({
      contract: window.AM,
      method: CONTRACT_METHODS.lastMintedByUser,
      address
    });
    if (lastAvatar !== undefined) {
      return +lastAvatar;
    }
  };

  const getAvatarsNames = async (
    tokens: string[]
  ): Promise<string[] | undefined> => {
    if (!window.web3 || !address || !window.AM) return;
    const avatarsNames = await makeCallRequest<string[]>({
      contract: window.AM,
      method: CONTRACT_METHODS.getNames,
      params: [tokens],
      address
    });
    return avatarsNames ?? [];
  };

  const getAvatarsXP = async (tokens: string[]) => {
    if (!window.web3 || !address || !window.AM) return;
    const avatarsNames = await window.AM.methods
      .getXP(tokens)
      .call({ from: address });
    return avatarsNames ?? [];
  };

  const assignNameToAvatar = async (tokenId: string, name: string) => {
    if (!window.web3 || !address || !window.AM) return;
    const payload = await formatRequestWrapperPayload(address);

    const nameValue = await window.AM.methods
      .setName(tokenId, name)
      .send({ ...payload });
    return nameValue ?? '';
  };

  const renameAvatar = async (tokenId: string, name: string) => {
    if (!window.web3 || !address || !window.GM) return;
    const payload = await formatRequestWrapperPayload(address);

    return await window.GM.methods
      .renameAvatar(tokenId, name)
      .send({ ...payload });
  };

  const isAbleToMint = async () => {
    if (!window.web3 || !address || !window.AM) return;
    try {
      const value = await window.AM.methods
        .ableToMint()
        .call({ from: address });
      return value ?? false;
    } catch {
      return false;
    }
  };

  const getMetaData = useCallback(async () => {
    if (!metaLink) return;
    try {
      const response = await fetch(metaLink.toString());
      if (response.ok) {
        return response.json();
      } else return {};
    } catch (err) {
      setAvatarsMetaData(null);
      return err;
    }
  }, [metaLink]);

  useEffect(() => {
    getMetaData().then((data) => setAvatarsMetaData(data));
  }, [getMetaData, metaLink]);

  const availableAttributes = avatarsMetaData?.attributes ?? [];

  const speciality = avatarsMetaData
    ? availableAttributes.find(
        (i) => i.trait_type === AVATAR_ATTRIBUTES.profession
      )?.value ?? AVATAR_SPECIALITY_FALLBACK
    : null;

  const calculateAvatarsXP = <T>(
    avatars: string[],
    xp: Record<string, T>
  ): Record<string, T> => {
    return avatars.reduce(
      (acc: Record<string, any>, i: string, idx: number) => {
        acc[i] = xp[idx];
        return acc;
      },
      {}
    );
  };

  const initializeUserAvatar = async (address: string) => {
    const userAvatars = await getUserAvatars();
    const avatarsNames = await getAvatarsNames(userAvatars);
    dispatch(setUserAvatarsList(userAvatars));
    dispatch(setAvatarsNamesList(avatarsNames));
    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.selectedAvatar)) {
      const lastMinted = userAvatars[userAvatars?.length - 1] ?? '';
      dispatch(setSelectedAvatar(lastMinted));
      localStorage.setItem(LOCAL_STORAGE_KEYS.selectedAvatar, lastMinted);
    }

    const isAvatarMintingNeeded =
      !userAvatars.length &&
      !localStorage.getItem(LOCAL_STORAGE_KEYS.avatarSuggested) &&
      isAvatarsMintingAvailable;

    if (isAvatarMintingNeeded) dispatch(setFirstVisitFlow(true));

    return;
  };

  const generateAvatarUrl = (token: string) =>
    `${NETWORK_DATA.AVATAR_META}${parseInt(token)}.jpg`;

  return {
    getUserAvatars,
    mintAvatar,
    getMyLastMintedAvatar,
    getAvatarsNames,
    assignNameToAvatar,
    isAbleToMint,
    getAvatarsXP,
    renameAvatar,
    calculateAvatarsXP,
    initializeUserAvatar,
    selectedAvatar,
    generateAvatarUrl,
    metaData: { info: avatarsMetaData, speciality }
  };
};
