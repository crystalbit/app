import { fontProperty } from '@global/styles/fonts.styles';
import { WHITE } from '@global/styles/variables';
import styled, { css } from 'styled-components';

const AvatarCardWrapper = styled.div<{
  isSelected?: boolean;
  backgroundImg?: string;
  isFrozenCard?: boolean;
}>`
  width: 190px;
  height: 237px;
  min-height: 237px;
  border: ${({ isSelected }) =>
    isSelected ? '1px solid #34FF61' : '1px solid rgba(255, 124, 37, 1)'};
  box-sizing: border-box;
  position: relative;
  background-image: ${({ backgroundImg }) => `url(${backgroundImg})` ?? ''};
  background-size: contain;
  background-color: lightslategray;
  cursor: pointer;
  filter: ${({ isFrozenCard }) => (isFrozenCard ? 'grayscale(1)' : 'unset')};
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
    top: 14px;
    right: 2px;
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
  color: white;
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
    color: #34ff61;
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
  color: ${WHITE};
`;

export {
  AvatarBlock,
  AvatarCardWrapper,
  AvatarMetaBlock,
  AvatarNameText,
  AvatarSpeciality,
  AvatarStatsTopPanel,
  MissionsSpan,
  XPBonusWrapper
};
