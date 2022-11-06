import { LOCAL_STORAGE_KEYS } from '@global/constants';
import { NETWORK_DATA } from '@root/settings';

const useFlags = () => {
  const networkConfig = NETWORK_DATA;

  const isAvatarsAvailable = networkConfig.AVATARS;

  const isMissionsAvailable = networkConfig.MISSIONS;

  const isAvatarsMintingAvailable = networkConfig.AVATAR_MINTING;

  const isMissionsPopupNeeded = networkConfig.MISSIONS_POPUP;

  const isLootboxesAvailable = networkConfig.LOOTBOXES;

  const isLootboxesMintingAvailable = networkConfig.LOOTBOXES_AVAILABLE;

  const isSelectedAvatar = () =>
    localStorage.getItem(LOCAL_STORAGE_KEYS.selectedAvatar);

  const isQuestsActivated = (address: string) =>
    localStorage.getItem(LOCAL_STORAGE_KEYS.activatedQuest(address));

  const isBalanceCheckerTick = process.env.REACT_APP_BALANCE_CHECK_AVAILABLE;

  const isLightAppVersion = process.env.REACT_APP_LIGHT;

  const isPolygonSaleBanner = NETWORK_DATA.STATS_HEADER;

  const isGameFunctionality = NETWORK_DATA.IN_GAME_LAND;

  const isHarmonyDesign = NETWORK_DATA.UI_DESIGN_VARIANT === 'Harmony';

  const isChangePageAvailable = NETWORK_DATA.DEX;

  const isRefPageAvailable = NETWORK_DATA.REF_PAGE;

  const isRevShareAvailable = NETWORK_DATA.REVSHARE;

  const isCryochamberAvailable = NETWORK_DATA.CRYOCHAMBERS;

  const isHarmonyChains =
    networkConfig.CHAIN === 'Harmony' ||
    networkConfig.CHAIN === 'Avalanche Fuji Testnet';

  const isFixedEconomy = NETWORK_DATA.ECONOMY === 'fixed';

  const isPlaySection =
    NETWORK_DATA.CRYOCHAMBERS ||
    NETWORK_DATA.MISSIONS ||
    NETWORK_DATA.LOOTBOXES ||
    NETWORK_DATA.AVATARS;

  const isProfile = NETWORK_DATA.PROFILE;

  const cryoGasPrice = (amount: number) =>
    (NETWORK_DATA.CRYO_GAS_PRICE ?? 1) * amount;

  return {
    isAvatarsAvailable,
    isMissionsAvailable,
    isLootboxesAvailable,
    networkConfig,
    isSelectedAvatar,
    isQuestsActivated,
    isMissionsPopupNeeded,
    isAvatarsMintingAvailable,
    isBalanceCheckerTick,
    isLightAppVersion,
    isPolygonSaleBanner,
    isGameFunctionality,
    isHarmonyDesign,
    isChangePageAvailable,
    isRefPageAvailable,
    isHarmonyChains,
    isRevShareAvailable,
    isFixedEconomy,
    isPlaySection,
    isCryochamberAvailable,
    isLootboxesMintingAvailable,
    isProfile,
    cryoGasPrice
  };
};

export default useFlags;
