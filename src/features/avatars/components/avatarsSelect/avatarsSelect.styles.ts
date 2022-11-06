import { fontProperty } from '@global/styles/fonts.styles';
import styled, { css } from 'styled-components';

const AvatarsSelectContent = styled.div<{
  paddingBottom?: string;
}>`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-height: 100%;
  box-sizing: border-box;
  position: relative;
  padding-bottom: ${({ paddingBottom }) => paddingBottom ?? '0px'};
`;

const AvatarPopupContent = styled.div<{
  marginBottom?: string;
}>`
  margin-bottom: ${({ marginBottom }) => marginBottom ?? '0'};
`;

const AvatarsListWrapper = styled.div`
  padding-bottom: 60px;
  overflow-y: scroll;
  height: 80%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  row-gap: 11px;
  column-gap: 10px;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const AvatarsSelectEmptyCard = styled.div<{
  minHeight?: string;
}>`
  min-height: ${({ minHeight }) => minHeight ?? ''};
  width: 190px;
  height: 236px;
  background: #1b0068;
  mix-blend-mode: normal;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  backdrop-filter: blur(60px);
  opacity: 0.4;
`;

const AvatarsSelectBackButton = styled.span<{
  renameTopBtn?: string;
  flagTop?: boolean;
  smallerTopMargin?: string;
  disableBtn?: boolean;
  leftAvatarsBtn?: string;
}>`
  display: ${(props) => (props.flagTop ? 'none' : 'block')};

  ${fontProperty};
  font-weight: 400;
  text-align: center;
  text-transform: uppercase;

  color: #34ff61;
  cursor: pointer;
  position: absolute;
  left: ${(props) => props.leftAvatarsBtn};
  top: ${(props) =>
    props.flagTop ? props.renameTopBtn : props.smallerTopMargin};
  ${(props) => (props.disableBtn ? 'pointer-events: none;' : null)}

  &:hover {
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))
      drop-shadow(0px 0px 20px #34ff61);
  }
`;

const AvatarsSelectGhostButton = styled.button<{
  Top?: string;
}>`
  border: 2px solid #34ff61;
  box-sizing: border-box;

  ${fontProperty};
  position: absolute;
  top: ${({ Top }) => Top ?? '5px'};
  right: 23px;

  cursor: pointer;
  padding: 8px 32px;
  background-color: transparent;
  font-size: 12px;
  text-align: center;
  letter-spacing: -0.02em;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))
    drop-shadow(0px 0px 20px #34ff61);
  color: #34ff61;

  &:hover {
    filter: drop-shadow(0px 6px 6px rgba(0, 0, 0, 0.2))
      drop-shadow(0px 0px 15px #34ff61);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const AvatarSelectMobileList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
  height: 85%;
  overflow: hidden;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const CryochamberContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const CryochamberImgWrapper = styled.div`
  width: 472px;
  height: 467px;
  position: relative;
  background-image: url('/UIParts/cryochamber.png');
  background-size: contain;
`;

const CryochamberStatsWrapper = styled.div`
  position: absolute;
  width: 175px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  right: 33px;
  top: 60px;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 135px;
    font-weight: 400;
    font-size: 10px;
    color: black;
    background-color: #34ff61;
    padding-bottom: 2px;
    padding-top: 2px;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
  }

  span {
    font-weight: 700;
    font-size: 52px;
    color: #34ff61;
  }
`;

const CryochamberControlWrapper = styled.div<{
  isBlurred?: boolean;
  Position?: string;
}>`
  position: ${({ Position }) => Position ?? 'absolute'};
  width: 175px;
  display: flex;
  flex-direction: column;
  right: 34px;
  top: 165px;

  ${({ isBlurred }) => {
    if (isBlurred) {
      return css`
        filter: blur(5px);
      `;
    }
  }}
`;

const CryochamberControlButton = styled.button`
  outline: 1px solid white;
  border: none;
  padding: 2px 30px;
  min-height: 30px;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
  margin-bottom: 15px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;

  &:disabled {
    cursor: not-allowed;
  }

  &:hover {
    outline: 2px solid white;
    background: rgba(255, 255, 255, 0.15);
  }

  span:first-child {
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;
  }

  span:nth-child(2) {
    font-weight: 400;
    font-size: 10px;
    line-height: 14px;
  }
`;

const CryochamberLockOverlay = styled.div`
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  z-index: 10;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const CryochamberUIMobile = styled.div<{ isBlurred?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: transparent;
  background-image: url('/UIParts/cryochamberMobile.jpeg');
  width: 174px;
  height: 116px;
  background-size: contain;

  font-weight: 700;
  font-size: 52px;
  color: #34ff61;
  span {
    position: relative;
    top: 6px;
  }

  ${({ isBlurred }) => {
    if (isBlurred) {
      return css`
        filter: blur(5px);
      `;
    }
  }}
`;

export {
  AvatarPopupContent,
  AvatarSelectMobileList,
  AvatarsListWrapper,
  AvatarsSelectBackButton,
  AvatarsSelectContent,
  AvatarsSelectEmptyCard,
  AvatarsSelectGhostButton,
  CryochamberContentWrapper,
  CryochamberControlButton,
  CryochamberControlWrapper,
  CryochamberImgWrapper,
  CryochamberLockOverlay,
  CryochamberStatsWrapper,
  CryochamberUIMobile
};
