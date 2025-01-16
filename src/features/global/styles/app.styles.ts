import { MOBILE_BREAKPOINT } from '@global/constants';
import { RGB_BLACK, RGB_GREEN, WHITE } from '@global/styles/variables';
import styled, { css } from 'styled-components';

import { fontProperty } from './fonts.styles';

const MainAppContainer = styled.div`
  position: relative;
`;

const MarsNavConnectedModal = styled.div`
  width: 388px;
  height: 133px;
  background: ${RGB_BLACK};
  border: 1px solid ${WHITE};
  backdrop-filter: blur(20px);
  padding: 16px 20px;

  position: absolute;
  top: 60px;
  text-align: left;

  @media screen and (max-width: 630px) {
    top: 40px;
    width: 253px;
    height: 101px;
    right: -10px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

const MarsNavConnectedModalTitle = styled.div`
  ${fontProperty};
  font-size: 24px;
  line-height: 28px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${WHITE};
  margin: 8px;

  @media screen and (max-width: 630px) {
    margin: 0;
  }
`;

const MarsNavConnectedWallet = styled.div`
  font-family: 'Helvetica', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: ${WHITE};
  margin: 0 10px 20px 10px;

  a {
    color: ${WHITE};
    text-decoration: none;

    @media screen and (max-width: 630px) {
      font-size: 10px;
      line-height: 11px;
    }
  }

  &:hover {
    a {
      color: ${RGB_GREEN};
    }
    path {
      stroke: ${RGB_GREEN};
    }
  }

  @media screen and (max-width: 630px) {
    margin: 0;
    width: 263px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const BlockButton = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px;
  align-items: flex-end;

  @media screen and (max-width: 630px) {
    margin: 0;
  }
`;

const MarsNavConnectedModalLink = styled.a`
  ${fontProperty};

  display: flex;
  border: 1px solid #f55b5d;

  font-size: 12px;

  text-align: center;
  text-transform: uppercase;
  text-decoration: none;

  color: #f55b5d;
  padding: 0;
  gap: 40px;
  width: 155px;
  height: 30px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 630px) {
    font-size: 12px;
    width: 155px;
    height: 30px;
    padding: 8px 40px;
  }
`;

const MarsNavDisconnectButton = styled.button<{ isGamePage?: boolean }>`
  height: 50px;
  width: 196px;
  background: #ff3943;
  border-radius: 175px;
  border: 0;
  font-size: 18px;
  font-weight: bold;
  line-height: 22px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${WHITE};
  cursor: pointer;

  ${({ isGamePage }) => {
    if (isGamePage) {
      return css`
        position: fixed;
        top: 8px;
        right: 30px;
        display: flex;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;
        padding: 14px 50px 15px;
        width: 270px;
        height: 50px;
        background: #fe5161;
        font-weight: 700;
        font-size: 16px;
        line-height: 21px;
        border-radius: unset;
        text-align: center;
        text-transform: uppercase;
        color: #000000;
      `;
    }
  }}
`;

const MarsNavMyLandClose = styled.div<{
  isGamePage?: boolean;
  isMobileView?: boolean;
  Position?: string;
  Right?: string;
  Top?: string;
  zIndex?: string;
}>`
  flex: 53px 0;
  text-align: center;
  cursor: pointer;

  position: ${({ Position }) => Position ?? ''};
  right: ${({ Right }) => Right ?? ''};
  top: ${({ Top }) => Top ?? ''};
  z-index: ${({ zIndex }) => zIndex ?? '1'};

  ${({ isGamePage, isMobileView }) => {
    if (isGamePage) {
      return css`
        flex: unset;
        position: absolute;
        right: ${isMobileView ? 'unset' : '5px'};
        left: ${isMobileView ? '15px' : 'unset'};
        top: 5px;
      `;
    }
  }}
`;

const MarsNavPanelItemFlexed = styled.div`
  flex: 0.2;

  a {
    color: ${RGB_GREEN};
    text-decoration: none;
  }

  @media screen and (max-width: 630px) {
    font-weight: 400;
    font-size: 10px;
    line-height: 11px;
  }
`;

const TokensWrapper = styled.div`
  display: flex;
  align-content: space-around;
  align-items: center;
  text-align: center;
  color: ${WHITE};
`;

const NoAddressChangeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  width: 100vw;
  height: 100vh;
`;

const ParagraphQuests = styled.p<{
  fontSize?: string;
}>`
  font-size: ${({ fontSize }) => `${fontSize}` ?? ''};
`;

const GameRootWrapper = styled.div`
  position: relative;
`;

const GameRootLoaderWrapper = styled.div`
  > div {
    margin-top: 35%;
  }
`;

const GameZoomWrapper = styled.div`
  position: absolute;
  top: 46vh;
  right: 0;
  display: flex;
  gap: 5px;
  flex-direction: column;
  cursor: url('/objects/cursorActive.cur'), pointer;

  button {
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: url('/objects/cursorActive.cur'), pointer;
    font-size: 24px;
  }
`;

const NewHeaderInfoWrapper = styled.div`
  padding: 8px 20px;
  box-sizing: border-box;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  gap: 30px;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: white;
  cursor: pointer;
  background: #2e2e34;
  border-radius: 4px;
  align-items: center;

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    flex-direction: column;
    gap: 10px;
    align-items: baseline;
    padding: 10px 0 0;
  }
`;

const NewHeaderAddressText = styled.div`
  color: #fe5161;
`;

const NewHeaderStatWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  &:not(:nth-child(3)) {
    @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
      position: relative;
      left: 8px;
    }
  }
`;

const NewHeaderStatInnerWrapper = styled.div`
  background: #1c1c1f;
  border-radius: 4px 3px 3px 4px;
  display: flex;
  gap: 8px;
  padding: 7px 20px 7px 30px;

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    padding: 5px 20px 5px;
  }
`;

const GamePageBackButton = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
`;

const MiningPageBackButton = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
`;

const commonFlexLine = css`
  display: flex;
  align-items: center;
`;

const commonFlexColumn = css`
  display: flex;
  flex-direction: column;
`;

const MobileTableWrapperWallet = styled.div<{
  content?: string;
}>`
  display: flex;
  width: 170px;
  height: 24px;
  background: #2e2e34;
  padding: 6px 10px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(5px);

  gap: 8px;

  border-radius: 4px;
  align-items: center;
  justify-content: ${({ content }) => content};
`;

const MobileTableBlockBalance = styled.div`
  display: flex;
  gap: 9px;
`;

const MobileTableText = styled.p`
  ${fontProperty};
  font-size: 10px;
  line-height: 12px;

  text-transform: uppercase;

  color: ${WHITE};
  margin: 0;
`;

const MobileTableBlock = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const MobileTableWalletBlock = styled.div`
  padding: 6px 10px;
  gap: 8px;
  width: 13px;
  height: 12px;
  background: #1c1c1f;
  border-radius: 4px 3px 3px 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StatsBarWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding: 5px 0 10px 0;
  backdrop-filter: blur(10px);
  width: calc(100% - 32px);
  max-width: 460px;
  box-sizing: border-box;

  @media screen and (max-width: 480px) {
    width: calc(100% - 16px);
    padding: 12px;
    gap: 12px;
  }
`;

const StatsItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-family: 'Play', sans-serif;
  min-width: 120px;
  justify-content: center;

  &:nth-child(2) {
    grid-row: 2;
    grid-column: 1;
  }

  &:nth-child(4) {
    grid-row: 2;
    grid-column: 2;
  }

  @media screen and (max-width: 480px) {
    min-width: 100px;
  }
`;

const StatsIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StatsText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const StatsValue = styled.span`
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatsLabel = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export {
  BlockButton,
  commonFlexColumn,
  commonFlexLine,
  GamePageBackButton,
  GameRootLoaderWrapper,
  GameRootWrapper,
  GameZoomWrapper,
  MainAppContainer,
  MarsNavConnectedModal,
  MarsNavConnectedModalLink,
  MarsNavConnectedModalTitle,
  MarsNavConnectedWallet,
  MarsNavDisconnectButton,
  MarsNavMyLandClose,
  MarsNavPanelItemFlexed,
  MiningPageBackButton,
  MobileTableBlock,
  MobileTableBlockBalance,
  MobileTableText,
  MobileTableWalletBlock,
  MobileTableWrapperWallet,
  NewHeaderAddressText,
  NewHeaderInfoWrapper,
  NewHeaderStatInnerWrapper,
  NewHeaderStatWrapper,
  NoAddressChangeWrapper,
  ParagraphQuests,
  TokensWrapper,
  StatsBarWrapper,
  StatsItem,
  StatsIcon,
  StatsText,
  StatsValue,
  StatsLabel
};
