import { useDispatch, useSelector } from 'react-redux';
import { NETWORK_DATA } from '@root/settings';
import {
  equippedMiningGearSelector,
  isMiningPrepareScreenOpened
} from '@selectors/questsSelectors';
import { toggleMiningPrepareScreenState } from '@slices/questSlice';

const useMining = () => {
  const dispatch = useDispatch();
  const isMiningPrepareScreen = useSelector(isMiningPrepareScreenOpened);
  const selectedMiningGear = useSelector(equippedMiningGearSelector);

  const toggleMiningPrepare = (val: boolean) =>
    dispatch(toggleMiningPrepareScreenState(val));

  const MOCK_VEHICLE_INFO = {
    broken: false,
    brokeLevel: 40
  };

  const vehicleRepairPrice = NETWORK_DATA.TRANSPORT_REPAIR_PRICE;

  return {
    isMiningPrepareScreen,
    toggleMiningPrepare,
    transportData: MOCK_VEHICLE_INFO,
    vehicleRepairPrice,
    selectedMiningGear
  };
};

export default useMining;
