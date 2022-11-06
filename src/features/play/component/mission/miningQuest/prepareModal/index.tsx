import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAvatars } from '@avatars/hooks/useAvatars';
import { useGears } from '@features/gear/hooks/useGears';
import { ActiveGearCard } from '@features/play/component/mission/miningQuest/activeGearCard';
import {
  ActiveProgressLine,
  BottomControlBlock,
  GearSectionBlockWrapper,
  GearSectionTitle,
  GearsSectionListWrapper,
  LineProgressWrapper,
  PreparedModalTipsText,
  PrepareModalControlWrapper,
  PrepareModalMainSection,
  PrepareModalTitle,
  PrepareModalWrapper,
  SelectedTransportControlWrapper,
  SelectedTransportWrapper,
  TransportBlockText,
  TransportBlockWrapper,
  TransportRepairControlWrapper
} from '@features/play/component/mission/miningQuest/prepareModal/prepareModal.styles';
import { PrepareSelectView } from '@features/play/component/mission/miningQuest/prepareModal/selectView';
import {
  MINING_PREPARE_BORDER,
  MINING_PREPARE_MOBILE_BP,
  MINING_PREPARE_WIDTH,
  REPAIR_VARIANTS,
  SELECT_GEAR_BUTTON_ID
} from '@features/play/constants';
import useMining from '@features/play/hooks/useMining';
import { getTransportName } from '@features/play/services';
import { RepairVariantsTypes } from '@features/play/types';
import { filterUserGears, mapNumberToCategory } from '@features/play/utils';
import Button from '@global/components/button';
import CommonModal from '@global/components/commonModal';
import { MOBILE_BREAKPOINT } from '@global/constants';
import useAppParts from '@global/hooks/useAppParts';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { logDevInfo } from '@global/utils/analytics';
import { ArrowLeft, ArrowRight } from '@images/icons/ArrowDown';
import { NETWORK_DATA } from '@root/settings';
import {
  equipMiningGear,
  resetEquippedGear,
  setActualTransportState,
  setMiningGameRewards
} from '@slices/questSlice';

export const PrepareModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isMiningPrepareScreen,
    toggleMiningPrepare,
    vehicleRepairPrice,
    selectedMiningGear
  } = useMining();

  const {
    getUserGears,
    userGears,
    lockItemGears,
    getLockedGears,
    getTransportCondition,
    repairTransport
  } = useGears();
  const { isInitialized } = usePersonalInfo();
  const { isGearModalOpened } = useAppParts();
  const { selectedAvatar } = useAvatars();

  const [isGearSelectMode, setGearSelectMode] = useState(false);
  const [isConfirmNeeded, setIsConfirmNeeded] = useState(false);
  const [lockedItems, setLockedItems] = useState<Record<string, any> | null>(
    null
  );
  const [isLoadingActiveRes, setLoadingActiveRes] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [transportCondition, setTransportCondition] =
    useState<string>('Loading...');
  const [selectedTransportIdx, setSelectedTransportIdx] = useState(0);
  const [isPending, setPending] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState({
    name: '',
    loading: false
  });

  const isVehicleBroken = useMemo(() => {
    if (transportCondition === 'Loading...') return false;
    return parseInt(transportCondition) / 10 === 0;
  }, [transportCondition]);

  const isVehicleFull = useMemo(() => {
    if (transportCondition === 'Loading...') return false;
    return parseInt(transportCondition) / 10 === 100;
  }, [transportCondition]);

  useEffect(() => {
    if (!isInitialized) return;
    getTransportCondition((data) => {
      setTransportCondition(data);
      dispatch(setActualTransportState(parseInt(data) / 10));
    }).then(() => {});
    dispatch(setMiningGameRewards(null));
    getUserGears().then(() => setIsInitialLoad(false));
    getLockedGears((data) => {
      setLoadingActiveRes(false);
      setLockedItems(
        data?.[1].map((i: any, idx: number) => ({ ...i, src: data?.[0][idx] }))
      );
    }).then(() => {});
  }, [isInitialized]);

  const filteredGears = useMemo(() => {
    return filterUserGears(userGears);
  }, [userGears]);

  useEffect(() => {
    if (
      lockedItems?.length &&
      filteredGears?.transports?.length &&
      !isInitialLoad
    ) {
      const transport = lockedItems.slice(0, 1);

      const userTransports = filteredGears?.transports;
      const gearArr = lockedItems.slice(1);
      let correctIdx = userTransports.findIndex(
        (i) => i?.id === transport?.[0].src
      );

      if (correctIdx >= 0) {
        setSelectedTransportIdx(correctIdx);
      } else {
        correctIdx = 0;
        setSelectedTransportIdx(0);
      }

      gearArr.forEach((i: Record<string, any>) => {
        if (i.src === '0') return;
        const category = mapNumberToCategory(i.category);
        const maxCount =
          filteredGears.transports[correctIdx].gearType === '12' ? 3 : 2;
        if (category) {
          dispatch(
            equipMiningGear({
              category,
              item: {
                src: `${NETWORK_DATA.GEAR_META_LINK}/${i.src}`,
                rarity: i.rarity,
                id: i.src
              },
              // @ts-ignore
              maxCount
            })
          );
        }
      });
    }
  }, [lockedItems, filteredGears, isInitialLoad]);

  useEffect(() => {
    if (!userGears) return;

    if (filteredGears.transports[selectedTransportIdx].default) {
      if (
        filteredGears.transports[selectedTransportIdx].default &&
        Object.values(selectedMiningGear).filter((i) => !!i).length === 3
      ) {
        const keys = Object.keys(selectedMiningGear);
        dispatch(
          equipMiningGear({
            // @ts-ignore
            category: keys[2],
            item: null
          })
        );
      }
    }

    setSelectedTransport((data) => ({ ...data, loading: true }));
    getTransportName({
      gears: filteredGears,
      callback: setSelectedTransport,
      selectedGearIdx: selectedTransportIdx
    }).then(() => {});
  }, [selectedTransportIdx, userGears, filteredGears]);

  const closePopup = () => {
    if (isPending) return;
    if (isGearModalOpened) return;
    if (isGearSelectMode) return setGearSelectMode(false);
    toggleMiningPrepare(false);
    dispatch(resetEquippedGear());
  };

  const onRepair = async (amount: number) => {
    await repairTransport(amount, (data) => setTransportCondition(data));
  };

  const isSetChanged = useMemo(() => {
    if (!lockedItems) return false;

    const transportId = filteredGears.transports?.[selectedTransportIdx]?.id;

    const selectedGearValues = Object.values(selectedMiningGear)
      .filter((i) => !!i)
      .map((i) => i?.id)
      .concat(transportId);

    const lockedGearsValues = lockedItems
      .map((i: Record<string, string>, idx: number) =>
        idx === 0 && i.src === '0' ? '-1' : i.src
      )
      .filter((i: string) => i !== '0');

    let intersection = selectedGearValues.filter((x) =>
      lockedGearsValues.includes(x)
    );

    return intersection.length !== selectedGearValues.length;
  }, [lockedItems, selectedMiningGear, selectedTransportIdx, filteredGears]);

  const reselectTransport = useCallback(
    (idx: number) => {
      setIsConfirmNeeded(true);
      if (idx < 0) setSelectedTransportIdx((idx) => (idx === 0 ? 0 : idx - 1));
      else {
        const transportsCount = filteredGears.transports.length - 1;
        setSelectedTransportIdx((idx) =>
          idx === transportsCount ? transportsCount : idx + 1
        );
      }
    },
    [filteredGears]
  );

  const transportBlock = useMemo(() => {
    const textClassNames = () => {
      const classes: string[] = [];
      if (isVehicleBroken) classes.push('red');
      return classes.join('');
    };

    const getCorrectButtonLabel = (val: RepairVariantsTypes) => (
      <>
        <span>{`Repair ${val}%`}</span>
        <span>{`for ${vehicleRepairPrice[val]} ${NETWORK_DATA.TOKEN_NAME}`}</span>
      </>
    );

    const transportInfo = filteredGears.transports[selectedTransportIdx];

    const transportName = () => {
      if (filteredGears.transports[selectedTransportIdx].default)
        return 'Default transport';
      if (selectedTransport.loading) return 'Loading...';
      return selectedTransport.name;
    };

    if (!lockedItems) return;

    return (
      <TransportBlockWrapper>
        <TransportBlockText>{transportName()}</TransportBlockText>
        <SelectedTransportControlWrapper>
          <Button
            disabled={selectedTransportIdx === 0}
            disabledText={<ArrowLeft />}
            onClick={() => reselectTransport(-1)}
            text={<ArrowLeft />}
            variant="ghost"
          />
          <div>
            <SelectedTransportWrapper
              url={
                transportInfo.default
                  ? transportInfo.src
                  : `${transportInfo.src}.jpg`
              }
            />
            <LineProgressWrapper>
              {transportCondition !== 'Loading...' && (
                <ActiveProgressLine
                  amount={parseInt(transportCondition) / 10}
                />
              )}
            </LineProgressWrapper>
          </div>
          <Button
            disabled={
              selectedTransportIdx === filteredGears.transports.length - 1
            }
            disabledText={<ArrowRight />}
            onClick={() => reselectTransport(1)}
            text={<ArrowRight />}
            variant="ghost"
          />
        </SelectedTransportControlWrapper>
        <TransportBlockText className={textClassNames()}>
          {`Transport condition ${
            transportCondition === 'Loading...'
              ? transportCondition
              : parseInt(transportCondition) / 10
          }%`}
        </TransportBlockText>
        <TransportRepairControlWrapper>
          {REPAIR_VARIANTS.map((val) => (
            <Button
              disabled={isVehicleFull}
              disabledText={getCorrectButtonLabel(val)}
              key={val}
              onClick={() => onRepair(parseInt(val))}
              text={getCorrectButtonLabel(val)}
              variant="common"
            />
          ))}
        </TransportRepairControlWrapper>
      </TransportBlockWrapper>
    );
  }, [
    isVehicleBroken,
    isVehicleFull,
    vehicleRepairPrice,
    selectedTransportIdx,
    reselectTransport,
    filteredGears,
    selectedTransport,
    lockedItems,
    isSetChanged,
    transportCondition
  ]);

  const gearBlock = useMemo(() => {
    return (
      <GearSectionBlockWrapper>
        <GearSectionTitle>Choose gear for your transport:</GearSectionTitle>
        <GearsSectionListWrapper>
          {new Array(3).fill('').map((_, idx) => (
            <ActiveGearCard
              isLoading={isLoadingActiveRes}
              key={`${Object.values(selectedMiningGear)[idx]}-${idx}`}
              gearData={
                Object.values(selectedMiningGear).filter((i) => !!i)[idx]
              }
              idx={idx}
              onModeChange={setGearSelectMode}
              onConfirmStatusChange={setIsConfirmNeeded}
              isCommonTransport={
                filteredGears.transports[selectedTransportIdx].gearType !== '12'
              }
            />
          ))}
        </GearsSectionListWrapper>
      </GearSectionBlockWrapper>
    );
  }, [
    filteredGears,
    selectedTransportIdx,
    lockedItems,
    isLoadingActiveRes,
    isGearSelectMode,
    filteredGears,
    selectedMiningGear,
    isPending,
    userGears,
    isConfirmNeeded,
    isSetChanged
  ]);

  const content = useMemo(() => {
    if (isGearSelectMode)
      return (
        <PrepareSelectView
          gears={filteredGears.utilities}
          isDefaultTransport={
            filteredGears.transports[selectedTransportIdx].gearType !== '12'
          }
        />
      );

    return (
      <PrepareModalWrapper>
        <PrepareModalTitle>choose transport for the mission:</PrepareModalTitle>
        <PrepareModalMainSection>
          {transportBlock}
          {gearBlock}
        </PrepareModalMainSection>
        <PrepareModalControlWrapper>
          <Button onClick={closePopup} text="return" variant="ghost" />
          <Button
            onClick={async () => {
              const selectedTransportId =
                filteredGears.transports[selectedTransportIdx];

              const valueToPush =
                selectedTransportId.id === '-1'
                  ? 0
                  : parseInt(selectedTransportId.id);

              const gearTypeToPush =
                selectedTransportId.gearType === '-1'
                  ? 0
                  : parseInt(selectedTransportId.gearType);

              if (isSetChanged) {
                setPending(true);
                const selectedGears = Object.values(selectedMiningGear)
                  .map((i) => (i?.id ? parseInt(i.id) : null))
                  .filter((i) => !!i);

                await lockItemGears(
                  valueToPush,
                  selectedGears[0] ?? 0,
                  selectedGears[1] ?? 0,
                  selectedGears[2] ?? 0,
                  () => {
                    setPending(false);
                    setIsConfirmNeeded(false);
                    getLockedGears((data) => {
                      setLockedItems(
                        data?.[1].map((i: any, idx: number) => ({
                          ...i,
                          src: data?.[0][idx]
                        }))
                      );
                    }).then(() => {});
                  },
                  () => {
                    setPending(false);
                  }
                );
              } else {
                logDevInfo('Mining mission started');

                const query = lockedItems
                  ?.filter((i: Record<string, string>) => i.src !== '0')
                  ?.map((i: Record<string, string>) => ({
                    type: i?.gearType,
                    field: mapNumberToCategory(i?.category as any)
                  }));

                const formatQuery = () => {
                  if (!lockedItems?.length) return '';
                  let finalString = '';

                  query.forEach((i: { type: string; field: string }) => {
                    if (i?.field?.length) {
                      finalString += `&${i.field}=${i.type}`;
                    }
                  });

                  return finalString;
                };

                navigate(
                  `/mining?transportId=${gearTypeToPush}&avatarId=${selectedAvatar}${formatQuery()}`
                );
              }
            }}
            text={isSetChanged ? 'confirm' : 'start mission'}
            variant="common"
            disabled={isVehicleBroken || isPending}
            disabledText="start mission"
          />
          {isVehicleBroken && (
            <PreparedModalTipsText>
              Repair your
              <br /> transport to play
            </PreparedModalTipsText>
          )}
        </PrepareModalControlWrapper>
      </PrepareModalWrapper>
    );
  }, [
    gearBlock,
    transportBlock,
    isVehicleBroken,
    isGearSelectMode,
    filteredGears,
    selectedMiningGear,
    isPending,
    userGears,
    isConfirmNeeded,
    lockedItems,
    isSetChanged
  ]);

  if (!isMiningPrepareScreen) return null;

  return (
    <>
      <CommonModal
        mobileClose
        isCloseButton={!isGearSelectMode}
        onClose={closePopup}
        mobileBreakpoint={MINING_PREPARE_MOBILE_BP}
        width={`${MINING_PREPARE_WIDTH}px`}
        border={MINING_PREPARE_BORDER}
        scrollBP={MOBILE_BREAKPOINT}
      >
        {content}
      </CommonModal>
      {isGearSelectMode && (
        <BottomControlBlock>
          <Button
            id={SELECT_GEAR_BUTTON_ID}
            onClick={() => setGearSelectMode(false)}
            text="Select"
            variant="common"
          />
        </BottomControlBlock>
      )}
    </>
  );
};
