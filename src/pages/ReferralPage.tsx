import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { MarsNavDisconnectButton } from '@features/global/styles/app.styles';
import { RGB_BLACK } from '@features/global/styles/variables';
import { trackUserEvent } from '@global/utils/analytics';
import { fromWeiValue } from '@global/utils/fromWei';
import { callWrapper } from '@global/utils/tx-wrapper';
import { ArrowRight } from '@root/images/icons/ArrowDown';
import { userGameManagerSelector } from '@selectors/commonAppSelectors';
import { addressSelector } from '@selectors/userStatsSelectors';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';

import { CURRENT_CHAIN } from '../settings/chains';

const ReferralPageWrapper = styled.div`
  background: linear-gradient(90.41deg, #433e80 -22.62%, #000000 115.56%);
  height: 100%;
  min-height: 100vh;
  width: 100%;
  min-width: 100vw;
  box-sizing: border-box;
  z-index: 9999999999999999999999;

  * {
    box-sizing: border-box;
  }
`;

const SimpleHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: fixed;
  left: 0;
  top: 0;
  padding-left: 20px;
  padding-top: 20px;
  width: 100%;
  background: linear-gradient(90.41deg, #433e80 -22.62%, #000000 115.56%);
`;

const SimpleHeaderName = styled.span`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
`;

const SimpleHeaderButton = styled.button`
  padding: 8px 40px;
  height: 30px;
  background: ${RGB_BLACK};
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  cursor: pointer;
`;

const SimpleConnectButton = styled.div`
  color: white;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  cursor: pointer;
  flex-grow: 1;
  text-align: right;
  margin-right: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 80px;
  padding-bottom: 40px;
`;

const ContentTitle = styled.h1`
  font-weight: 700;
  font-size: 36px;
  line-height: 42px;
  text-transform: uppercase;
  color: #ffffff;
  margin-bottom: 20px;

  @media screen and (max-width: 750px) {
    font-weight: 700;
    font-size: 23px;
    line-height: 28px;
  }
`;

const ContentSectionTab = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 40px;
  border: 0.5px solid #ffffff;
  border-radius: 10px;
  flex-grow: 1;
  max-width: 50%;
  min-width: 400px;

  @media screen and (max-width: 860px) {
    width: 100%;
    max-width: 100%;
    min-width: unset;
  }
`;

const ContentSectionTitle = styled.span<{ mb?: string }>`
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin-bottom: ${({ mb }) => mb ?? '30px'};
`;

const ContentSectionTitleSecondary = styled.span<{ mb?: string }>`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin-bottom: ${({ mb }) => mb ?? 'unset'};
`;

const ContentRow = styled.div<{ mb?: string }>`
  display: flex;
  justify-content: space-around;
  margin-bottom: ${({ mb }) => mb ?? 'unset'};
  gap: 30px;
  width: 80%;

  @media screen and (max-width: 860px) {
    flex-direction: column;
    width: 90%;
  }
`;

const ContentRowMain = styled(ContentRow)`
  justify-content: center;
  flex-grow: 1;
  width: 60%;
  margin-bottom: ${({ mb }) => mb ?? 'unset'};

  @media screen and (max-width: 860px) {
    width: 90%;
  }
`;

const ContentSectionText = styled.p`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  text-transform: uppercase;
  color: #c4c4c4;
  margin: 0;
`;

const ContentSectionSecondary = styled.div`
  padding: 20px 40px;
  gap: 30px;
  border: 0.5px solid #ffffff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const NavigationArrow = styled.div`
  height: 30px;
  width: 30px;
  min-width: 30px;
  min-height: 30px;
  border-radius: 50%;
  border: 1px solid #c5c5c6;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;

  > span {
    position: relative;
    left: 1.5px;
    top: -1px;
  }
`;

const ContentCommonText = styled.span`
  display: block;
  font-weight: 700;
  font-size: 14px;
  line-height: 32px;
  margin-bottom: 15px;
  font-family: 'Helvetica', sans-serif;
  color: white;
`;

const CurrencyValueWrapper = styled.span`
  font-weight: 400;
  font-size: 10px;
  line-height: 10px;
  text-align: center;
  letter-spacing: -0.02em;
  padding: 2px 6px 3px;
  background: #1c1c1f;
  border-radius: 3px;
  color: white;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100px;
  overflow: hidden;
  cursor: pointer;

  @media screen and (max-width: 860px) {
    max-width: unset;
  }
`;

const SimpleTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const CopyInputWrapper = styled.div`
  border: 1px solid #fe5161;
  background: rgba(0, 0, 0, 0.5);
  font-family: 'Helvetica', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  padding: 6px 9px;
  display: flex;
  align-items: center;
  color: white;
  gap: 10px;
  cursor: pointer;
  width: 300px;

  @media screen and (max-width: 700px) {
    width: 220px;
  }

  p {
    margin: 0;
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    @media screen and (max-width: 700px) {
      max-width: 180px;
    }
  }

  span {
    font-weight: 400;
    font-size: 10px;
    line-height: 10px;
    letter-spacing: -0.02em;
    cursor: pointer;
    color: #fe5161;
  }
`;

const TwitterText = styled.p`
  font-family: 'Helvetica', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  margin: 10px 0 0;
  color: white;

  span {
    cursor: pointer;
    color: #fe5161;
  }
`;

export const ReferralPage = () => {
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const gm = useSelector(userGameManagerSelector) ?? window.GM;
  const [referrals, setReferrals] = useState<string | number>('...');
  const [earned, setEarned] = useState<string | number>('...');
  const address = useSelector(addressSelector);
  const [copiedState, setCopiedState] = useState<boolean>(false);

  const { ref: wrapperRef, width } = useResizeObserver();
  const isMobileView = width && width <= 540;
  const isMobileViewText = width && width <= 425;

  useEffect(() => {
    if (!gm || !address) return;

    callWrapper<string>(gm, {
      method: 'referralsCount',
      params: [address],
      from: address ?? window.address,
      addToast,
      type: CURRENT_CHAIN.x2,
      onFail() {
        console.log('Referrals count fetch failed', address);
      }
    }).then((result) => {
      if (result !== undefined) {
        setReferrals(parseInt(result));
      }
    });
    callWrapper<string>(gm, {
      method: 'referrerEarned',
      params: [address],
      from: address ?? window.address,
      type: CURRENT_CHAIN.x2,
      addToast,
      onFail() {
        console.log('Earned count fetch failed', address);
      }
    }).then((result) => {
      if (result !== undefined) {
        setEarned(parseInt(result));
      }
    });
  }, [address, gm]);

  const transformAddress = useMemo(() => {
    if (!address && !address?.length) return;

    const perChunk = 10;
    const arr: string[] = address.slice(2).split('');

    const arrayInChunks = arr.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / perChunk);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, [] as Array<string>[]);

    return arrayInChunks
      .map((i) => {
        return parseInt(`0x${i.join('')}`)
          .toString(36)
          .padStart(8, '0');
      })
      .join('');
  }, [address]);

  const referralAddress = `https://polygon.marscolony.io?from=${transformAddress}`;

  const onTwitterShare = (personalRef: string) => {
    return window.open(
      `https://twitter.com/intent/tweet?text=My%20referral%20link%20at%20marscolony.io%20that%20will%20give%20you%2010%25%20discount%20for%20lands%20claiming%3A%0A${personalRef}%0ALet%27s%20create%20a%20meta-society%21%F0%9F%91%BD%F0%9F%91%BD%F0%9F%91%BD`,
      '_blank'
    );
  };

  return (
    <ReferralPageWrapper ref={wrapperRef}>
      <SimpleHeaderWrapper>
        <SimpleHeaderName>marscolony</SimpleHeaderName>
        <SimpleHeaderButton onClick={() => navigate('/')}>
          BACK
        </SimpleHeaderButton>
        {!address && !isMobileView && (
          <MarsNavDisconnectButton
            onClick={window.connect}
            isGamePage
            style={{ top: '15px' }}
          >
            Connect wallet
          </MarsNavDisconnectButton>
        )}
        {!address && isMobileView && (
          <SimpleConnectButton onClick={window.connect}>
            CONNECT WALLET
          </SimpleConnectButton>
        )}
      </SimpleHeaderWrapper>
      <ContentWrapper>
        <ContentTitle>EARN 20% FROM EVERY SALE</ContentTitle>
        <ContentRowMain mb="80px">
          <ContentSectionTab>
            <ContentSectionTitle>Referral link</ContentSectionTitle>
            <CopyInputWrapper>
              <p>{!address ? 'Connect your wallet first' : referralAddress}</p>
              {address && (
                <span
                  onClick={async () => {
                    if (!address) return;
                    setCopiedState(true);
                    await navigator.clipboard.writeText(referralAddress);
                    trackUserEvent('Copy address clicked', { address });
                    setTimeout(() => setCopiedState(false), 2000);
                  }}
                >
                  {copiedState ? 'Copied' : 'Copy link'}
                </span>
              )}
            </CopyInputWrapper>
            {address && (
              <TwitterText>
                Share referral{' '}
                <span
                  onClick={() => {
                    window.Gleam.push(['referralok', address]);
                    trackUserEvent('Share on twitter clicked', { address });
                    onTwitterShare(referralAddress);
                  }}
                >
                  link on Twitter
                </span>
              </TwitterText>
            )}
          </ContentSectionTab>
          <ContentSectionTab>
            <ContentSectionTitle>Earn</ContentSectionTitle>
            <ContentSectionText>{`Your referrals: ${referrals}`}</ContentSectionText>
            <SimpleTextWrapper>
              <ContentSectionText>{`Earned ${
                isMobileViewText ? '' : 'from referrals'
              }`}</ContentSectionText>
              <CurrencyValueWrapper
                title={`Earned from referrals: ${fromWeiValue(
                  earned as string,
                  1
                )} MATIC`}
              >{`${fromWeiValue(
                earned as string,
                1
              )} MATIC`}</CurrencyValueWrapper>
            </SimpleTextWrapper>
          </ContentSectionTab>
        </ContentRowMain>
        <ContentTitle>How it works</ContentTitle>
        <ContentRow mb="80px">
          <ContentSectionSecondary>
            <ContentSectionTitleSecondary>
              1. Share your referral link
            </ContentSectionTitleSecondary>
          </ContentSectionSecondary>
          <NavigationArrow>
            <ArrowRight />
          </NavigationArrow>
          <ContentSectionSecondary>
            <ContentSectionTitleSecondary>
              2. User claims lands
              <br />
              with your link
            </ContentSectionTitleSecondary>
          </ContentSectionSecondary>
          <NavigationArrow>
            <ArrowRight />
          </NavigationArrow>
          <ContentSectionSecondary>
            <ContentSectionTitleSecondary>
              3. You automatically
              <br />
              receive rewards
            </ContentSectionTitleSecondary>
          </ContentSectionSecondary>
        </ContentRow>
        <ContentTitle>What you get</ContentTitle>
        <ContentCommonText>
          20% rewards in MATIC from lands claimed with your referral link
        </ContentCommonText>
        <ContentCommonText>
          10% discount for lands claiming with your link
        </ContentCommonText>
      </ContentWrapper>
    </ReferralPageWrapper>
  );
};
