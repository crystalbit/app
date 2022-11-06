import { MOBILE_BREAKPOINT } from '@global/constants';
import {
  BLACK,
  CARD_BACK_BLACK,
  DARK_GREY,
  DARK_ORANGE,
  ERROR_RED,
  LIGHT_GRAY,
  LIGHT_GREY_2,
  LIGHT_ORANGE,
  ORANGE,
  TOXIC_GREEN,
  WHITE
} from '@global/styles/variables';
import styled from 'styled-components';

const PrepareModalWrapper = styled.div<{
  minHeight?: string;
  gap?: string;
  vAlign?: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ vAlign }) => vAlign ?? 'center'};
  color: ${WHITE};
  gap: ${({ gap }) => gap ?? '40px'};
  max-width: 100%;
  padding: 20px;

  min-height: ${({ minHeight }) => minHeight ?? 'unset'};
  max-height: ${({ minHeight }) => minHeight ?? 'unset'};

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    padding: unset;
  }

  @media screen and (max-width: 1245px) {
    max-height: 100%;
  }
`;

const PrepareModalMainSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;

  @media screen and (max-width: 1245px) {
    flex-direction: column;
    align-items: center;
  }

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    max-width: 100%;
  }
`;

const PrepareModalTitle = styled.h3`
  font-family: 'Play', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 36px;
  line-height: 42px;
  letter-spacing: 0.2em;
  max-width: 515px;
  text-transform: uppercase;
  margin: 0;

  @media screen and (max-width: 750px) {
    font-size: 24px;
    line-height: 28px;
    text-align: center;
    max-width: 370px;
  }

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    font-size: 24px;
    line-height: 28px;
    text-align: center;
    letter-spacing: 0.3em;
    max-width: 300px;
  }
`;

const PrepareModalSubText = styled.p`
  margin: 0;
  font-family: 'Helvetica', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
`;

const PrepareModalControlWrapper = styled.div`
  display: flex;
  align-items: center;

  button:disabled {
    color: ${LIGHT_GREY_2};
    background: rgba(151, 151, 151, 0.8);
  }

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;

    * {
      text-align: center;
    }
  }
`;

const PreparedModalTipsText = styled.span`
  font-family: 'Helvetica', sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 16px;
  margin-left: 10px;
`;

const TransportBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const TransportBlockText = styled.div`
  font-family: 'Helvetica', sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 16px;

  &.red {
    color: ${ERROR_RED};
  }
`;

const SelectedTransportControlWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  button {
    padding: unset;

    :hover:not(:disabled) span svg line {
      stroke: ${TOXIC_GREEN} !important;
    }
  }
`;

const SelectedTransportWrapper = styled.div<{
  url: string;
}>`
  width: 245px;
  height: 245px;
  border: 1px solid ${WHITE};
  background-image: ${({ url }) => `url(${url})`};
  background-size: cover;
`;

const LineProgressWrapper = styled.div`
  height: 4px;
  width: inherit;
  background: ${LIGHT_GRAY};
  position: relative;
`;

const ActiveProgressLine = styled.div<{ amount: number }>`
  height: 4px;
  width: ${({ amount }) => `${amount}%`};
  position: absolute;
  left: 0;
  bottom: 4px;
  background-color: ${({ amount }) => (amount < 100 ? TOXIC_GREEN : ERROR_RED)};
`;

const TransportRepairControlWrapper = styled.div`
  display: flex;
  gap: 18px;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    flex-direction: column;
  }

  button {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 2px;
    border: 1px solid ${WHITE};
    max-height: 35px;
    padding: 2px 0;
    min-width: 125px;

    span {
      font-family: 'Play', sans-serif;
      color: #ffffff;
    }

    span:first-child {
      font-style: normal;
      font-weight: 700;
      font-size: 12px;
      line-height: 14px;
    }

    span:nth-child(2) {
      font-style: normal;
      font-weight: 400;
      font-size: 8px;
      line-height: 10px;
      text-transform: initial;
    }

    &:disabled {
      opacity: 0.5;
    }
  }
`;

const GearSectionBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    max-width: 100%;
  }
`;

const GearSectionTitle = styled.h3`
  font-family: 'Play', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  margin: 0;
  color: ${WHITE};

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    text-align: center;
    letter-spacing: -0.02em;
  }
`;

const GearsSectionListWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    max-width: 100%;
    overflow: scroll;
    justify-content: unset;

    &::-webkit-scrollbar {
      display: none !important;
    }

    -ms-overflow-style: none !important;
  }
`;

const SelectModeModalText = styled.p`
  font-family: 'Play', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  text-align: center;
  margin: 0;
`;

const SelectModeCategoryGrid = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none !important;
  }

  -ms-overflow-style: none !important;

  @media screen and (max-width: 960px) {
    gap: 25px;
    overflow-x: scroll;
  }

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    flex-direction: column;
    gap: 40px;

    > div:last-child {
      margin-bottom: 100px;
    }
  }
`;

const CategoryGridColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const GearItemWrapper = styled.div<{ isSelected?: boolean }>`
  background: ${CARD_BACK_BLACK};
  min-height: 230px;
  min-width: 200px;
  border: ${({ isSelected }) =>
    isSelected ? `1px solid ${TOXIC_GREEN}` : `1px solid ${DARK_ORANGE}`};
  box-sizing: border-box;

  button {
    background: ${({ isSelected }) =>
      isSelected ? TOXIC_GREEN : LIGHT_ORANGE};
    border-top: ${({ isSelected }) =>
      isSelected ? 'unset' : `1px solid ${DARK_ORANGE}`};
    border-bottom: ${({ isSelected }) =>
      isSelected ? 'unset' : `1px solid ${DARK_ORANGE}`};
    height: 30px;
    width: 100%;
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    text-transform: uppercase;
    color: ${({ isSelected }) => (isSelected ? BLACK : DARK_ORANGE)};
    border-radius: 0;

    &:disabled {
      opacity: 0.75;
      color: rgba(0, 0, 0, 0.4);
      cursor: not-allowed;
    }
  }
`;

const GearItemImgWrapper = styled.div<{ bgImg: string; isLocked: boolean }>`
  height: 200px;
  min-height: 200px;
  width: 200px;
  min-width: 200px;
  background-image: ${({ bgImg }) => `url(${bgImg})`};
  background-size: cover;
  position: relative;
  filter: ${({ isLocked }) => (isLocked ? 'grayscale(1)' : 'unset')};
`;

const EmptyColumnPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: ${CARD_BACK_BLACK};
  border: 1px solid ${ORANGE};

  height: 230px;
  width: 200px;

  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: ${WHITE};

  p {
    margin: 0;
  }
`;

const BottomControlBlock = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${DARK_GREY};
  position: absolute;
  bottom: 0;
  width: 100vw;
  z-index: 999999;
`;

const TickTextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  span {
    margin: 0;
  }
`;

export {
  ActiveProgressLine,
  BottomControlBlock,
  CategoryGridColumn,
  EmptyColumnPlaceholder,
  GearItemImgWrapper,
  GearItemWrapper,
  GearSectionBlockWrapper,
  GearSectionTitle,
  GearsSectionListWrapper,
  LineProgressWrapper,
  PreparedModalTipsText,
  PrepareModalControlWrapper,
  PrepareModalMainSection,
  PrepareModalSubText,
  PrepareModalTitle,
  PrepareModalWrapper,
  SelectedTransportControlWrapper,
  SelectedTransportWrapper,
  SelectModeCategoryGrid,
  SelectModeModalText,
  TickTextWrapper,
  TransportBlockText,
  TransportBlockWrapper,
  TransportRepairControlWrapper
};
