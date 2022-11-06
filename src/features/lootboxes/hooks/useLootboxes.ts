import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import useContracts from '@global/hooks/useContracts';
import useMetamask from '@global/hooks/useMetamask';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { CONTRACT_METHODS, METAMASK_EVENTS } from '@global/types';
import {
  clnyPriceSelector,
  collectionItemToDisplaySelector,
  lootboxPopupStateSelector,
  userLootboxesListSelector
} from '@selectors/lootboxesSliceSelectors';
import {
  selectCollectionItemToDisplay,
  setCollectionLoader,
  setLastOwnedLootbox,
  setLootboxesList,
  toggleLootboxPopup
} from '@slices/lootboxesSlice';

const useLootboxes = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const isPopupActive = useSelector(lootboxPopupStateSelector);
  const userLootboxes = useSelector(userLootboxesListSelector);
  const selectedCollectionItem = useSelector(collectionItemToDisplaySelector);
  const clnyPrice = useSelector(clnyPriceSelector);

  const { makeRequest, makeCallRequest } = useMetamask();
  const { address } = usePersonalInfo();
  const { lootboxesManager, getLootboxesManager, oracle, getOracle } =
    useContracts();

  const togglePopup = (value: boolean) => dispatch(toggleLootboxPopup(value));
  const dropSelectedCollectionItem = () =>
    dispatch(
      selectCollectionItemToDisplay({
        type: '',
        id: '',
        rarity: ''
      })
    );

  const getLastMintedLootbox = () => {
    makeCallRequest({
      contract: window.LB,
      method: 'lastOwnedTokenURI',
      address: address ?? window.address
    }).then((data) => {
      dispatch(setLastOwnedLootbox(data));
    });
  };

  const getOracleCLNYPrice = async (
    callback?: (price: { valid: boolean; rate: number }) => unknown
  ) => {
    await makeRequest({
      address: address,
      type: METAMASK_EVENTS.call,
      errorText: 'Error getting CLNY price',
      method: CONTRACT_METHODS.clnyInUsd,
      params: [],
      contract: oracle ?? getOracle(),
      onError: () => {},
      onSuccess: (price) => {
        if (!price.valid) {
          return addToast('Oracle not available, CLNY price fetch failed', {
            appearance: 'error'
          });
        }
        callback?.(price);
      }
    });
  };

  const getLootboxes = async () => {
    let start = 0;
    let end = 99;
    let gearsRequestArray: [string[], string[]] = [[], []];
    let done: boolean = false;

    dispatch(setCollectionLoader(true));
    while (!done) {
      await makeRequest({
        address: address,
        type: METAMASK_EVENTS.call,
        errorText: 'Error getting owned lootboxes list',
        method: CONTRACT_METHODS.allMyTokensPaginate,
        params: [start, end],
        contract: lootboxesManager ?? getLootboxesManager(),
        // eslint-disable-next-line no-loop-func
        onSuccess: (lootboxes) => {
          if (lootboxes[0].length > 0) {
            dispatch(setCollectionLoader(true));
            gearsRequestArray[0].push(...lootboxes[0]);
            gearsRequestArray[1].push(...lootboxes[1]);
          } else {
            dispatch(setCollectionLoader(false));
            done = true;
          }
          start = end + 1;
          end = end + 100;
        }
      });

      if (done) {
        break;
      }
    }
    dispatch(setLootboxesList(gearsRequestArray));
  };

  return {
    togglePopup,
    isPopupActive,
    getLastMintedLootbox,
    getLootboxes,
    userLootboxes,
    selectedCollectionItem,
    dropSelectedCollectionItem,
    getOracleCLNYPrice,
    clnyPrice
  };
};

export default useLootboxes;
