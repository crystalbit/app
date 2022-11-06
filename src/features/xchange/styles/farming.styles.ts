import { WHITE } from '@global/styles/variables';
import styled, { css } from 'styled-components';

const LiquidityMiningApprove = styled.div`
  display: inline-block;
  width: 103px;
`;

const LiquidityMiningButton = styled.button`
  width: 100%;
  border: none;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;

  text-align: right;
  font-feature-settings: 'salt' on, 'ss01' on, 'ss02' on, 'cv02' on, 'calt' off;

  color: ${WHITE};

  max-width: 103px;
  height: 30px;

  background: #2172e5;
  border-radius: 6px;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    background-color: #7c8087;
  }

  &:not([disabled]):hover {
  }
`;

const LiquidityMiningInput = styled.input.attrs({ type: 'number' })<{
  unstake?: boolean;
}>`
  width: 100%;
  box-sizing: border-box;
  display: block;
  font-size: 28px;
  font-weight: 500;
  color: white;

  background: #212429;
  border: 1px solid #40444f;
  border-radius: 20px;
  padding: 18.5px 16px;

  :focus {
    outline: 1px solid #2172e5;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const NewPoolItemMainWrapper = styled.div`
  padding: 10px 16px 24px;
  background: #191b1f;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 35px;
`;

const NewPoolItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NewPoolStatsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 25px;
`;

const NewPoolStatsItem = styled.div<{
  minWidth?: string;
}>`
  min-width: ${({ minWidth }) => minWidth ?? '70px'};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 5px;
`;

const NewPoolStatsTitle = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
`;

const NewPoolStatsValue = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  font-feature-settings: 'salt' on, 'ss01' on, 'ss02' on, 'cv02' on, 'calt' off;
  color: ${WHITE};
  min-width: 70px;
  max-width: 70px;
  white-space: pre;
  display: block;
`;

const PoolItemHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;

  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    font-feature-settings: 'salt' on, 'ss01' on, 'ss02' on, 'cv02' on,
      'calt' off;
    color: ${WHITE};
  }

  img {
    width: 27px;
    height: 17px;
  }
`;

const PoolItemSubtitle = styled.span`
  font-size: 10px;
  line-height: 10px;
  text-align: right;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.4);
`;

const BottomMenuItemsWrapper = styled.div<{ isMobile?: boolean }>`
  display: flex;
  gap: 12px;

  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        flex-direction: column;
      `;
    }
  }}
`;

const BottomMenuItem = styled.div<{
  isActive?: boolean;
  isMobile?: boolean;
  Padding?: string;
  Gap?: string;
  flexDirection?: string;
}>`
  display: flex;
  justify-content: space-between;
  padding: ${({ Padding }) => Padding ?? '10px'};
  gap: ${({ Gap }) => Gap ?? '0'};
  flex-direction: ${({ flexDirection }) => flexDirection ?? ''};
  flex-grow: 2;
  width: ${({ isMobile }) => (isMobile ? '100%' : '48%')};
  max-width: ${({ isMobile }) => (isMobile ? 'unset' : '295px')};
  background: #202634;
  border-radius: 8px;

  ${({ isActive }) => {
    if (isActive) {
      return css`
        background: #212429;
      `;
    }
  }}
`;

const BottomMenuItemEarnedWrapp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
`;

const BottomMenuItemLabel = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  font-feature-settings: 'salt' on, 'ss01' on, 'ss02' on, 'cv02' on, 'calt' off;
  color: ${WHITE};
`;

const BottomMenuItemValue = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  font-feature-settings: 'salt' on, 'ss01' on, 'ss02' on, 'cv02' on, 'calt' off;
  color: #2172e5;
`;

const BottomMenuButton = styled.button<{
  disabled?: boolean;
  minWidth?: string;
  Height?: string;
  marginTop?: string;
}>`
  min-width: ${({ minWidth }) => minWidth ?? '71px'};
  max-width: 71px;
  height: ${({ Height }) => Height ?? '30px'};
  margin-top: ${({ marginTop }) => marginTop ?? '0'};
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2172e5;
  color: white;
  border-radius: 6px;
  border: none;
  ${BottomMenuItemValue};
  cursor: pointer;
  ${({ disabled }) => {
    if (disabled) {
      return css`
        background: #131d32;
        color: #0f4ff4;
        cursor: not-allowed;
      `;
    }
  }}
`;

const BottomMenuInfoRow = styled.div<{
  backGround?: string;
  Width?: string;
  marginTop?: string;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ backGround }) => backGround ?? ''};
  width: ${({ Width }) => Width ?? ''};
  margin-top: ${({ marginTop }) => marginTop ?? ''};
`;

const BottomMenuStatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PoolModalWrapper = styled.div<{ isMobile?: boolean }>`
  box-sizing: border-box;
  background: #191b1f;
  border: 1px solid #212429;
  max-width: 420px;
  border-radius: 20px;
  position: absolute;
  z-index: 25;
  padding: 20px;
  min-width: 415px;
  left: calc(50% - 207px);
  top: calc(50% - 224px);
  display: flex;
  flex-direction: column;

  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        background-color: transparent;
        border: none;
        max-width: 100vw;
        width: 100vw;
        min-width: unset;
        left: 0;
      `;
    }
  }};
`;

const PoolModalTitle = styled.span`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-transform: uppercase;
  font-feature-settings: 'salt' on, 'ss01' on, 'ss02' on, 'cv02' on, 'calt' off;
  margin-bottom: 20px;
  color: ${WHITE};
`;

const PoolModalText = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  font-feature-settings: 'salt' on, 'ss01' on, 'ss02' on, 'cv02' on, 'calt' off;
  color: ${WHITE};
`;

const PoolModalProcButton = styled.button<{
  isSelected?: boolean;
  isMobile?: boolean;
  Right?: string;
  Top?: string;
}>`
  position: ${({ isMobile }) => (isMobile ? 'unset' : 'absolute')};
  height: 40px;
  background: #131d32;
  border-radius: 6px;
  padding: 10px 15px;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  font-feature-settings: 'salt' on, 'ss01' on, 'ss02' on, 'cv02' on, 'calt' off;
  color: #2172e5;
  cursor: pointer;

  right: ${({ Right }) => Right ?? ''};
  top: ${({ Top }) => Top ?? ''};

  border: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border: 1px solid #2172e5;
  }

  :disabled {
    cursor: not-allowed;
    background: rgba(19, 29, 50, 0.4) !important;
    color: rgba(33, 114, 229, 0.5) !important;
  }

  ${({ isSelected }) => {
    if (isSelected) {
      return css`
        border: 1px solid #2172e5;
      `;
    }
  }}
`;

const MobilePoolBottomTab = styled.div<{ isActive?: boolean }>`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  padding: 10px 12px;
  cursor: pointer;

  ${({ isActive }) => {
    if (isActive) {
      return css`
        border-radius: 12px;
        background: #222429;
        font-weight: 700;
        color: ${WHITE};
      `;
    }
  }};
`;

const MobilePoolBottomBlock = styled.div`
  bottom: 0;
  padding: 20px;
  position: fixed;
  width: 100vw;
  height: 79px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  background: #202634;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);

  div {
    &:first-of-type {
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
    }

    &:last-of-type {
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
    }
  }
`;

export {
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
};
