import styled, { css } from 'styled-components';

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

  @media (max-width: 600px) {
    height: 350px;
    width: 350px;
  }
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

  @media (max-width: 600px) {
    right: 2px;
    top: 40px;

    div {
      width: 109px;
    }

    span {
      font-size: 40px;
    }
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

  @media (max-width: 600px) {
    right: 2px;
    top: 130px;
  }

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

const CryoChamberBlock = styled.div<{
  flag?: boolean;
}>`
  display: flex;
  justify-content: center;
  top: ${({ flag }) => (flag ? '0px' : '116px')};
  position: relative;
`;

const CryochamberLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;

  div {
    padding: 0;
    height: 100px;
    width: 100px;
    position: fixed;
    margin: 150px 0 0 0;
  }
`;

const CryochamberBackNavButton = styled.button`
  position: absolute;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  left: -50px;
  top: 72px;
`;

export {
  AvatarsSelectEmptyCard,
  CryochamberBackNavButton,
  CryoChamberBlock,
  CryochamberContentWrapper,
  CryochamberControlButton,
  CryochamberControlWrapper,
  CryochamberImgWrapper,
  CryochamberLoaderWrapper,
  CryochamberLockOverlay,
  CryochamberStatsWrapper,
  CryochamberUIMobile
};
