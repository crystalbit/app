import { RGB_BLACK } from '@features/global/styles/variables';
import { fontProperty } from '@global/styles/fonts.styles';
import styled, { css } from 'styled-components';

const AvatarCardWrapper = styled.div<{
  isSelected?: boolean;
  backgroundImg?: string;
  isFrozenCard?: boolean;
}>`
  width: 190px;
  height: 236px;
  min-height: 236px;
  border: ${({ isSelected }) =>
    isSelected ? '1px solid #fe5161' : '1px solid rgba(255, 124, 37, 1)'};
  box-sizing: border-box;
  position: relative;
  background-image: ${({ backgroundImg }) => `url(${backgroundImg})` ?? ''};
  background-size: contain;
  background-color: lightslategray;
  cursor: pointer;
  filter: ${({ isFrozenCard }) => (isFrozenCard ? 'grayscale(1)' : 'unset')};
`;

const AvatarStats = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background: ${RGB_BLACK};
  backdrop-filter: blur(4px);
  border-radius: 4px;
  box-sizing: border-box;
  padding: 2px 6px;

  font-weight: 700;
  font-size: 10px;
  line-height: 11px;
  letter-spacing: -0.01em;
  color: #fe5161;
`;

const AvatarMetaBlock = styled.div`
  position: absolute;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.8) 19.27%,
    #000000 83.33%
  );
  padding-top: 14px;
  padding-bottom: 2px;
  text-align: center;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  button {
    ${fontProperty};
    font-size: 12px;
    text-align: center;
    letter-spacing: -0.02em;
    position: relative;
    top: 3px;
    border: none;
  }

  button.not-selected {
    background: #ffe0cb;
    border: 1px solid #ff7c25;
    color: #ff7c25;
  }
`;

const AvatarNameText = styled.p`
  ${fontProperty};
  font-size: 14px;
  letter-spacing: -0.02em;
  margin: 0 0 0 5px;
  text-transform: uppercase;
  text-align: start;
`;

const AvatarSpeciality = styled.p`
  margin: 0 0 0 5px;
  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 400;
  font-size: 10px;
  text-align: center;

  color: rgba(255, 255, 255, 0.7);

  opacity: 0.8;
`;

const AvatarBlock = styled.div`
  display: flex;
`;

const MissionsCounterHolder = styled.div`
  position: absolute;
  top: 6px;
  left: 6px;
  display: flex;
  gap: 4px;
  align-items: center;

  p {
    font-weight: 400;
    font-size: 10px;
    line-height: 10px;
    letter-spacing: -0.02em;
    color: white;
    margin: 0;
  }
`;

const MissionsCounterWrapper = styled.div<{
  isDisabled?: boolean;
  isFreeVariant?: boolean;
  Width?: string;
  borderRadius?: string;
  paddingLeft?: string;
  paddingRight?: string;
}>`
  width: ${({ Width }) => Width ?? '22px'};
  padding-left: ${({ paddingLeft }) => paddingLeft ?? '10px'};
  padding-right: ${({ paddingRight }) => paddingRight ?? '10px'};

  height: 22px;
  display: grid;
  place-items: center;
  background-color: #fe5161;
  color: black;
  border-radius: ${({ borderRadius }) => borderRadius ?? '50%'};

  ${({ isDisabled, isFreeVariant }) => {
    if (isDisabled && !isFreeVariant) {
      return css`
        background-color: #c4c4c4;
      `;
    }

    if (isFreeVariant)
      return css`
        width: unset;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 300px;
        background-color: ${isDisabled ? '#c4c4c4' : '#fe5161'};

        span {
          position: relative;
          left: -1px;
          top: -1px;
        }
      `;
  }}
`;

const MissionsSpan = styled.span<{ pl?: string }>`
  padding-left: ${({ pl }) => `${pl}` ?? ''};
`;

const AvatarStatsTopPanel = styled.div<{
  isMissionsPage?: boolean;
  justifyContent?: string;
  bg?: string;
}>`
  box-sizing: border-box;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: ${({ justifyContent }) =>
    `${justifyContent}` ?? 'space-between'};
  background: ${({ bg }) => `${bg}` ?? ''};
  height: 20px;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;

  div {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  span {
    font-weight: 400;
    font-size: 10px;
    line-height: 10px;
    letter-spacing: -0.02em;
    color: rgba(255, 255, 255, 0.7);
    opacity: 0.8;
  }

  span.main-green {
    font-weight: 400;
    font-size: 10px;
    line-height: 10px;
    letter-spacing: -0.02em;
    color: #fe5161;
    opacity: 0.8;
  }

  ${({ isMissionsPage }) => {
    if (isMissionsPage) {
      return css`
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
      `;
    }
  }};
`;

const XPBonusWrapper = styled.span`
  ${fontProperty};
  line-height: 21px;
  min-height: 85%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export {
  AvatarBlock,
  AvatarCardWrapper,
  AvatarMetaBlock,
  AvatarNameText,
  AvatarSpeciality,
  AvatarStats,
  AvatarStatsTopPanel,
  MissionsCounterHolder,
  MissionsCounterWrapper,
  MissionsSpan,
  XPBonusWrapper
};
