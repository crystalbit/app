import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import Ethereum from '@api/etheriumWeb3';
import { ModalShadowLayer } from '@features/avatars/components/avatarsPopup/avatarsPopup.styles';
import { LandPlotCollapseButtonWrapper } from '@features/lands/styles/landPlot.styles';
import {
  BottomMenuButton,
  BottomMenuInfoRow,
  BottomMenuItem,
  BottomMenuItemEarnedWrapp,
  BottomMenuItemLabel,
  BottomMenuItemsWrapper,
  BottomMenuItemValue,
  BottomMenuStatItem,
  LiquidityMiningApprove,
  LiquidityMiningButton,
  LiquidityMiningInput,
  MobilePoolBottomBlock,
  MobilePoolBottomTab,
  NewPoolItemMainWrapper,
  NewPoolItemWrapper,
  NewPoolStatsItem,
  NewPoolStatsTitle,
  NewPoolStatsValue,
  NewPoolStatsWrapper,
  PoolItemHead,
  PoolItemSubtitle,
  PoolModalProcButton,
  PoolModalText,
  PoolModalTitle,
  PoolModalWrapper
} from '@features/xchange/styles/farming.styles';
import { Loader } from '@global/components/loader/loader';
import useOutsideClick from '@global/hooks/useOutsideClick';
import { MarsNavMyLandClose } from '@global/styles/app.styles';
import { halfUint256, maxUint256 } from '@global/utils/max-uint256';
import { txWrapper } from '@global/utils/tx-wrapper';
import { weiToJsNum } from '@global/utils/wei-to-js-num';
import { ArrowDown } from '@images/icons/ArrowDown';
import { CloseIcon } from '@images/icons/CloseIcon';
import { TABS } from '@pages/XChange';
import { NoiseOverlay } from '@root/legacy/voteModal/voteModal.styles';
import { NETWORK_DATA } from '@root/settings';
import { ChainData } from '@root/settings/chains';
import BN from 'bn.js';
import mixpanel from 'mixpanel-browser';

type Props = {
  address: string;
  chainData: ChainData;
  onCLNYBalanceUpdate: (address: string) => Promise<void>;
  isXChangePage?: boolean;
  bottomBorder?: boolean;
  miningIndex: number;
  isMobileView?: boolean;
  selectedTab?: string | null;
  setTab?: (val: TABS) => void;
};

export const OnePool: React.FC<Props> = ({
  address,
  chainData,
  onCLNYBalanceUpdate,
  miningIndex,
  isMobileView,
  selectedTab
}) => {
  const navigator = useNavigate();
  const [opened, setOpened] = React.useState<boolean>(false);

  const getLPStats = React.useCallback(
    () => Ethereum.getLPStats(miningIndex),
    [miningIndex]
  );
  const getSLP = React.useCallback(
    () => Ethereum.getSLP(miningIndex),
    [miningIndex]
  );
  const getLM = React.useCallback(
    () => Ethereum.getLM(miningIndex),
    [miningIndex]
  );

  const [allowed, setAllowed] = React.useState<
    'allowed' | 'no' | 'pending' | object
  >({}); // {} == loading
  const [staked, setStaked] = React.useState<number>(-1);
  const [slpBalance, setSlpBalance] = React.useState<number>(-1);
  const [toStake, setToStake] = React.useState<number>(0);
  const [toUnstake, setToUnstake] = React.useState<number>(0);
  const { addToast } = useToasts();
  const [pendingTimer, setPendingTimer] = React.useState<NodeJS.Timeout>();
  const [pendingColony, setPendingColony] = React.useState<number>(-1);
  const [tvl, setTvl] = React.useState<string>('...');
  const [rewards, setRewards] = React.useState<string>('...');
  const [apr, setApr] = React.useState<string>('...');
  const [retryFetchParams, setRetryFetchParams] = React.useState<{}>({});
  const [isClaiming, setIsClaiming] = React.useState<boolean>(false);
  const [modalState, setModalState] = React.useState<string>('');
  const [transferMode, setTransferMode] = React.useState<string>('');
  const multiplier = React.useMemo(
    () => NETWORK_DATA.MINING_POOLS[miningIndex].multiplier ?? 1,
    []
  );
  const threshold = React.useMemo(() => 0.000001 / multiplier, [multiplier]);

  const modalRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(modalRef, () => {
    if (modalState) {
      setModalState('');
      setToStake(0);
      setToUnstake(0);
    }
  });

  // get TVL, rewards and APR once
  React.useEffect(() => {
    if (!address) {
      return;
    }
    (async () => {
      try {
        const LPStats = getLPStats();
        const tvl = await LPStats.methods
          .getDollarTVL()
          .call({ from: address });
        setTvl('$' + ((tvl * 1e-18) / 1000).toFixed(1) + 'k');

        const rewards = await LPStats.methods
          .getDailyClnyRewards()
          .call({ from: address });
        setRewards(
          (rewards * 1e-18).toFixed(0) + ` ${NETWORK_DATA.TOKEN_NAME}`
        );

        const apr = await LPStats.methods.getAPR().call({ from: address });

        setApr((apr * 100 * 1e-18).toFixed(2) + '%');
      } catch {
        await new Promise((rs) => setTimeout(rs, 2000));
        setRetryFetchParams({}); // retry
      }
    })();
  }, [address, getLPStats, retryFetchParams]);

  useEffect(() => {
    if (pendingTimer) {
      return;
    }
    const fetchPending = () => {
      getLM()
        .methods.pendingClny(address)
        .call({ from: address })
        .then((colonyCount: string) => {
          setPendingColony(parseInt(colonyCount) * 1e-18);
        })
        .catch((error: Error) => {
          console.log(error.message);
        });
    };
    fetchPending();
    const timer = setInterval(fetchPending, 5000);
    setPendingTimer(timer);
  }, [address, getLM, pendingTimer]);

  useEffect(() => {
    if (typeof allowed === 'string') {
      return;
    }
    getSLP()
      .methods.allowance(
        address,
        NETWORK_DATA.MINING_POOLS[miningIndex].contract
      )
      .call({ from: address })
      .then((result: string) => {
        if (new BN(result).gte(halfUint256)) {
          setAllowed('allowed');
        } else {
          setAllowed('no');
        }
      })
      .catch((error: Error) => {
        console.log('Error getting allowance', error.message);
        setTimeout(() => setAllowed({}), 1000);
      });
  }, [address, allowed, setAllowed, getSLP, miningIndex]);

  React.useEffect(() => {
    getLM()
      .methods.userInfo(address)
      .call({ from: address })
      .then((result: { amount: string | BN }) => {
        setStaked(
          multiplier
            ? weiToJsNum(result.amount.toString()) * multiplier
            : weiToJsNum(result.amount.toString())
        );
      })
      .catch((error: Error) => {
        console.log('Error getting staked balance', error.message);
      });

    getSLP()
      .methods.balanceOf(address)
      .call({ from: address })
      .then((result: string | BN) => {
        setSlpBalance(
          multiplier
            ? weiToJsNum(result.toString()) * multiplier
            : weiToJsNum(result.toString())
        );
      })
      .catch((error: Error) => {
        console.log(
          `Error getting ${NETWORK_DATA.MINING_POOLS[miningIndex].lpTicker} balance`,
          error.message
        );
      });
  }, [address, getLM, getSLP, miningIndex, setSlpBalance, multiplier]);

  const approve = React.useCallback(async () => {
    txWrapper(
      getSLP()
        .methods.approve(
          NETWORK_DATA.MINING_POOLS[miningIndex].contract,
          maxUint256
        )
        .send({ from: address }),
      {
        addToast,
        eventName: `Approve for ${NETWORK_DATA.MINING_POOLS[miningIndex].lpTicker}`,
        chainData,
        onConfirm: () => setAllowed('allowed'),
        onFail: () => setAllowed('no'),
        onPending: () => setAllowed('pending')
      }
    );
  }, [getSLP, miningIndex, address, addToast, chainData]);

  const stake = React.useCallback(
    async (amount: number | string) => {
      mixpanel.track('LM Stake clicked', { amount });
      setTransferMode('stake');
      if (typeof amount === 'string') {
        amount = parseFloat(amount);
      }
      const valueToSet = amount / (multiplier ?? 1);

      const _amount =
        valueToSet > 10
          ? new BN((valueToSet * 1e6).toFixed(0)).mul(new BN((1e12).toString()))
          : new BN((1e18 * valueToSet).toFixed(0));

      txWrapper(getLM().methods.deposit(_amount).send({ from: address }), {
        addToast,
        eventName: `Stake ${amount} ${NETWORK_DATA.MINING_POOLS[miningIndex].lpTicker}`,
        chainData,
        onConfirm() {
          mixpanel.track('LM Stake succeed', { amount });
          setSlpBalance((val) => val - (amount as number));
          setStaked((val) => val + (amount as number));
          setToStake(0);
          setRetryFetchParams({}); // update data
          setModalState('');
          setTransferMode('');
          setIsClaiming(false);
        },
        onFail() {
          mixpanel.track('LM Stake failed', { amount });
          setModalState('');
          setTransferMode('');
          setToStake(0);
        },
        onPending() {
          setIsClaiming(true);
        }
      });
    },
    [addToast, chainData, getLM, miningIndex, multiplier]
  );

  const unstake = React.useCallback(
    async (amount: number | string) => {
      setTransferMode('unstake');
      amount === 0
        ? mixpanel.track('LM Collect clicked', { amount })
        : mixpanel.track('LM Unstake clicked', { amount });
      if (typeof amount === 'string') {
        amount = parseFloat(amount);
      }
      const amountValue = amount / (multiplier ?? 1);
      const _amount =
        amountValue > 10
          ? new BN((amountValue * 1e6).toFixed(0)).mul(
              new BN((1e12).toString())
            )
          : new BN((1e18 * amountValue).toFixed(0));
      txWrapper(getLM().methods.withdraw(_amount).send({ from: address }), {
        addToast,
        eventName:
          amount === 0
            ? 'Claim from Liquidity Mining'
            : `Unstake ${amount} ${NETWORK_DATA.MINING_POOLS[miningIndex].lpTicker}`,
        chainData,
        onConfirm() {
          setSlpBalance((val) => val + (amount as number));
          setStaked((val) => val - (amount as number));
          setToUnstake(0);
          onCLNYBalanceUpdate(address); // user receives clny
          setRetryFetchParams({}); // update data
          setIsClaiming(false);
          amount === 0
            ? mixpanel.track('LM Collect succeed', { amount })
            : mixpanel.track('LM Unstake succeed', { amount });
          setModalState('');
          setTransferMode('');
        },
        onFail() {
          setToUnstake(0);
          setIsClaiming(false);
          amount === 0
            ? mixpanel.track('LM Collect failed', { amount })
            : mixpanel.track('LM Unstake failed', { amount });
          setModalState('');
          setTransferMode('');
          setToUnstake(0);
        },
        onPending() {
          setIsClaiming(true);
        }
      });
    },
    [addToast, chainData, getLM, miningIndex, onCLNYBalanceUpdate, multiplier]
  );

  const onUnstakeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToUnstake(parseFloat(value));
  };

  const onStakeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToStake(parseFloat(value));
  };

  const onStakePartChange = (value: string) => {
    setToStake(parseFloat(value));
  };

  const onUnstakePartChange = (value: string) => {
    setToUnstake(parseFloat(value));
  };

  window.unapprove = React.useCallback(async () => {
    await getSLP()
      .methods.approve(NETWORK_DATA.MINING_POOLS[miningIndex].contract, 0)
      .send({ from: address });
  }, [getSLP, miningIndex]);

  const isStake = modalState === 'stake';

  const onPartSelect = (type: 'quarter' | 'half' | 'almostFull' | 'full') => {
    if (isStake) {
      switch (type) {
        case 'almostFull':
          return onStakePartChange(((slpBalance / 4) * 3).toFixed(10));
        case 'full':
          return onStakePartChange(slpBalance.toFixed(10));
        case 'half':
          return onStakePartChange((slpBalance / 2).toFixed(10));
        case 'quarter':
          return onStakePartChange((slpBalance / 4).toFixed(10));
        default:
          return;
      }
    }

    switch (type) {
      case 'almostFull':
        return onUnstakePartChange(((staked / 4) * 3).toFixed(10));
      case 'full':
        return onUnstakePartChange(staked.toFixed(10));
      case 'half':
        return onUnstakePartChange((staked / 2).toFixed(10));
      case 'quarter':
        return onUnstakePartChange((staked / 4).toFixed(10));
      default:
        return;
    }
  };

  return (
    <>
      <NewPoolItemMainWrapper>
        <NewPoolItemWrapper>
          <NewPoolStatsWrapper>
            <NewPoolStatsItem minWidth={'110px'}>
              <PoolItemHead>
                <img
                  src={`./pools/${NETWORK_DATA.MINING_POOLS[miningIndex].imgKey}.png`}
                  alt="pair logo"
                />
                <span>{NETWORK_DATA.MINING_POOLS[miningIndex].pair}</span>
              </PoolItemHead>
              <PoolItemSubtitle>
                {NETWORK_DATA.MINING_POOLS[miningIndex].dex}
              </PoolItemSubtitle>
            </NewPoolStatsItem>
            {!isMobileView && (
              <>
                <NewPoolStatsItem>
                  <NewPoolStatsTitle>Earned</NewPoolStatsTitle>
                  <NewPoolStatsValue>
                    {pendingColony === -1
                      ? '...'
                      : `${pendingColony.toFixed(2)} ${
                          NETWORK_DATA.TOKEN_NAME
                        }`}
                  </NewPoolStatsValue>
                </NewPoolStatsItem>
                <NewPoolStatsItem>
                  <NewPoolStatsTitle>Pool rewards</NewPoolStatsTitle>
                  <NewPoolStatsValue>{rewards}</NewPoolStatsValue>
                </NewPoolStatsItem>
                <NewPoolStatsItem>
                  <NewPoolStatsTitle>TVL</NewPoolStatsTitle>
                  <NewPoolStatsValue>{tvl}</NewPoolStatsValue>
                </NewPoolStatsItem>
                <NewPoolStatsItem>
                  <NewPoolStatsTitle>APR</NewPoolStatsTitle>
                  <NewPoolStatsValue>{apr}</NewPoolStatsValue>
                </NewPoolStatsItem>
              </>
            )}
          </NewPoolStatsWrapper>

          <LandPlotCollapseButtonWrapper
            onClick={() => setOpened((opened) => !opened)}
          >
            <ArrowDown upside={opened} />
          </LandPlotCollapseButtonWrapper>
        </NewPoolItemWrapper>
        {isMobileView && (
          <BottomMenuInfoRow>
            <NewPoolStatsItem>
              <NewPoolStatsTitle>Earned</NewPoolStatsTitle>
              <NewPoolStatsValue>
                {pendingColony === -1
                  ? '...'
                  : `${pendingColony.toFixed(2)} ${NETWORK_DATA.TOKEN_NAME}`}
              </NewPoolStatsValue>
            </NewPoolStatsItem>
            <NewPoolStatsItem>
              <NewPoolStatsTitle>Pool rewards</NewPoolStatsTitle>
              <NewPoolStatsValue>{rewards}</NewPoolStatsValue>
            </NewPoolStatsItem>
            <NewPoolStatsItem>
              <NewPoolStatsTitle>TVL</NewPoolStatsTitle>
              <NewPoolStatsValue>{tvl}</NewPoolStatsValue>
            </NewPoolStatsItem>
            <NewPoolStatsItem>
              <NewPoolStatsTitle>APR</NewPoolStatsTitle>
              <NewPoolStatsValue>{apr}</NewPoolStatsValue>
            </NewPoolStatsItem>
          </BottomMenuInfoRow>
        )}
        {opened && (
          <div>
            {allowed !== 'allowed' && (
              <LiquidityMiningApprove>
                {allowed === 'no' && (
                  <LiquidityMiningButton onClick={() => approve()}>
                    Approve {NETWORK_DATA.MINING_POOLS[miningIndex].lpTicker}
                  </LiquidityMiningButton>
                )}
                {allowed === 'pending' && (
                  <LiquidityMiningButton disabled>
                    Approving...
                  </LiquidityMiningButton>
                )}
                {typeof allowed !== 'string' && <>Checking approve...</>}
              </LiquidityMiningApprove>
            )}
            {allowed === 'allowed' && (
              <BottomMenuItemsWrapper isMobile={isMobileView}>
                <BottomMenuItem isMobile={isMobileView}>
                  <BottomMenuItemEarnedWrapp>
                    <BottomMenuItemLabel>Earned:</BottomMenuItemLabel>
                    <BottomMenuItemValue>
                      {pendingColony === -1
                        ? '...'
                        : `${pendingColony.toFixed(2)} ${
                            NETWORK_DATA.TOKEN_NAME
                          }`}
                    </BottomMenuItemValue>
                  </BottomMenuItemEarnedWrapp>
                  <BottomMenuButton
                    disabled={pendingColony.toFixed(2) === '0.00' || isClaiming}
                    onClick={() => unstake(0)}
                  >
                    {isClaiming ? 'Pending...' : 'Collect'}
                  </BottomMenuButton>
                </BottomMenuItem>
                <BottomMenuItem
                  isMobile={isMobileView}
                  Padding={'10px 10px 16px 10px'}
                  flexDirection={'column'}
                  Gap={'20px'}
                >
                  <BottomMenuInfoRow>
                    <BottomMenuStatItem>
                      <BottomMenuItemLabel>Balance:</BottomMenuItemLabel>
                      <BottomMenuItemValue>
                        {slpBalance.toFixed(2)}{' '}
                        {NETWORK_DATA.MINING_POOLS[miningIndex].lpTicker}
                      </BottomMenuItemValue>
                    </BottomMenuStatItem>
                    <BottomMenuButton
                      disabled={slpBalance <= threshold}
                      minWidth={'72px'}
                      onClick={() => setModalState('stake')}
                    >
                      Stake
                    </BottomMenuButton>
                  </BottomMenuInfoRow>
                  <BottomMenuInfoRow>
                    <BottomMenuStatItem>
                      <BottomMenuItemLabel>Staked:</BottomMenuItemLabel>
                      <BottomMenuItemValue>
                        {staked.toFixed(2)}{' '}
                        {NETWORK_DATA.MINING_POOLS[miningIndex].lpTicker}
                      </BottomMenuItemValue>
                    </BottomMenuStatItem>
                    <BottomMenuButton
                      disabled={staked <= threshold}
                      minWidth={'72px'}
                      onClick={() => setModalState('unstake')}
                    >
                      Unstake
                    </BottomMenuButton>
                  </BottomMenuInfoRow>
                </BottomMenuItem>
              </BottomMenuItemsWrapper>
            )}
          </div>
        )}
        {isMobileView && (
          <MobilePoolBottomBlock>
            <BottomMenuInfoRow backGround={'#191b1f'} Width={'200px'}>
              <MobilePoolBottomTab
                isActive={selectedTab === TABS.swap}
                onClick={() => navigator('/xchange?type=swap')}
              >
                Swap
              </MobilePoolBottomTab>
              <MobilePoolBottomTab
                isActive={selectedTab === TABS.pool}
                onClick={() => navigator('/xchange?type=pool')}
              >
                Pool
              </MobilePoolBottomTab>
              <MobilePoolBottomTab
                isActive={selectedTab === TABS.mining}
                onClick={() => navigator('/xchange?type=mining')}
              >
                Farming
              </MobilePoolBottomTab>
            </BottomMenuInfoRow>
          </MobilePoolBottomBlock>
        )}
      </NewPoolItemMainWrapper>
      {Boolean(modalState.length) && (
        <>
          <ModalShadowLayer
            backgroundColor={
              isMobileView ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.65)'
            }
          />
          <NoiseOverlay
            zIndex={'11'}
            Width={'100vw'}
            Height={'100vh'}
            Top={'0'}
            Position={'fixed'}
            Opacity={isMobileView ? '0.65' : '0.45'}
          />
          <PoolModalWrapper ref={modalRef} isMobile={isMobileView}>
            <MarsNavMyLandClose
              Position={'absolute'}
              Right={'10px'}
              Top={'10px'}
              zIndex={'20'}
              onClick={() => {
                setModalState('');
                setToStake(0);
                setToUnstake(0);
                setTransferMode('');
              }}
            >
              <CloseIcon />
            </MarsNavMyLandClose>
            {isClaiming || Boolean(transferMode.length) ? (
              <>
                <Loader />
              </>
            ) : (
              <>
                <PoolModalTitle>
                  {isStake
                    ? `Stake ${NETWORK_DATA.MINING_POOLS[miningIndex].lpTicker} tokens`
                    : `UnStake ${NETWORK_DATA.MINING_POOLS[miningIndex].lpTicker} tokens`}
                </PoolModalTitle>
                <PoolModalText>
                  {isStake
                    ? `Balance: ${slpBalance.toFixed(2)} ${
                        NETWORK_DATA.MINING_POOLS[miningIndex].lpTicker
                      }`
                    : `Staked: ${staked.toFixed(2)} ${
                        NETWORK_DATA.MINING_POOLS[miningIndex].lpTicker
                      }`}
                </PoolModalText>
                <div className="mt-15">
                  <div style={{ position: 'relative' }}>
                    {!isMobileView && (
                      <>
                        <PoolModalProcButton
                          Right={'100px'}
                          Top={'15px'}
                          onClick={() => onPartSelect('half')}
                          disabled={
                            isStake
                              ? slpBalance < threshold
                              : staked <= threshold
                          }
                        >
                          50 %
                        </PoolModalProcButton>
                        <PoolModalProcButton
                          Right={'20px'}
                          Top={'15px'}
                          onClick={() => onPartSelect('full')}
                          disabled={
                            isStake
                              ? slpBalance < threshold
                              : staked <= threshold
                          }
                        >
                          100 %
                        </PoolModalProcButton>
                      </>
                    )}
                    <LiquidityMiningInput
                      value={isStake ? toStake : toUnstake}
                      onChange={
                        isStake ? onStakeInputChange : onUnstakeInputChange
                      }
                    />
                    {isMobileView && (
                      <BottomMenuInfoRow marginTop={'10px'}>
                        <>
                          <PoolModalProcButton
                            isMobile={isMobileView}
                            onClick={() => onPartSelect('quarter')}
                            disabled={
                              isStake
                                ? slpBalance < threshold
                                : staked <= threshold
                            }
                          >
                            25 %
                          </PoolModalProcButton>
                          <PoolModalProcButton
                            isMobile={isMobileView}
                            onClick={() => onPartSelect('half')}
                            disabled={
                              isStake
                                ? slpBalance < threshold
                                : staked <= threshold
                            }
                          >
                            50 %
                          </PoolModalProcButton>
                          <PoolModalProcButton
                            isMobile={isMobileView}
                            onClick={() => onPartSelect('almostFull')}
                            disabled={
                              isStake
                                ? slpBalance < threshold
                                : staked <= threshold
                            }
                          >
                            75 %
                          </PoolModalProcButton>
                          <PoolModalProcButton
                            isMobile={isMobileView}
                            onClick={() => onPartSelect('full')}
                            disabled={
                              isStake
                                ? slpBalance < threshold
                                : staked <= threshold
                            }
                          >
                            100 %
                          </PoolModalProcButton>
                        </>
                      </BottomMenuInfoRow>
                    )}
                  </div>
                </div>
                <BottomMenuButton
                  disabled={
                    (isStake ? slpBalance <= 0 : staked <= 0) || isClaiming
                  }
                  minWidth={'100%'}
                  Height={'45px'}
                  marginTop={'20px'}
                  onClick={() =>
                    isStake ? stake(toStake) : unstake(toUnstake)
                  }
                >
                  {isStake ? 'Stake' : 'Unstake'}
                </BottomMenuButton>
              </>
            )}
          </PoolModalWrapper>
        </>
      )}
    </>
  );
};
