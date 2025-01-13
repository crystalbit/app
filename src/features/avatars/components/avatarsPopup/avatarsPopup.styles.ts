import { RGB_BLACK } from '@features/global/styles/variables';
import { fontProperty } from '@global/styles/fonts.styles';
import styled, { css } from 'styled-components';

const AvatarsPopupOverlay = styled.div<{
  height?: string;
  width?: string;
  isMobile?: boolean;
  zIndex?: string;
}>`
  position: fixed;
  color: white;
  background-size: cover;
  z-index: ${({ zIndex }) => zIndex ?? '5'};
  height: ${({ height }) => height ?? '700px'};
  width: ${({ width }) => width ?? '734px'};

  left: calc(50% - 350px);
  top: calc(50% - 330px);
  filter: drop-shadow(0px 4px 80px ${RGB_BLACK});
  border: 3px solid;
  border-image-source: linear-gradient(
    305.26deg,
    #ffb98b 1.97%,
    #ff6c0a 11.98%,
    #752f00 26.49%,
    #421806 79.04%,
    #ff6b21 98.05%
  );
  mix-blend-mode: normal;
  border-image-slice: 1;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

  @media screen and (max-width: 848px) {
    border: none;
  }

  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        z-index: 100;
        top: 0;
        height: 100vh;
        width: 100vw;
        left: 0;
      `;
    }
  }};
  }
`;

const AvatarsBackWrapper = styled.div`
  position: relative;
  width: inherit;
  height: inherit;
  display: flex;
`;

const AvatarsBack = styled.div<{
  filter?: string;
  zIndex?: string;
}>`
  z-index: ${({ zIndex }) => zIndex ?? '1'};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.25;
  background-size: cover;
  filter: ${({ filter }) => filter ?? 'unset'};
  background-position: center;
`;

const StorageBack = styled.div<{
  zIndex?: string;
}>`
  z-index: ${({ zIndex }) => zIndex ?? '1'};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
`;

const AvatarsPopupContent = styled.div<{
  largeTopMargin?: boolean;
  boxSizing?: string;
  Display?: string;
  flexDirection?: string;
  zIndex?: string;
  Padding?: string;
  Top?: string;
}>`
  position: absolute;

  ${({ largeTopMargin, Top }) => {
    if (largeTopMargin) {
      return css`
        top: ${(largeTopMargin) => (largeTopMargin ? '130px' : '60px')};
      `;
    } else {
      return css`
        top: ${Top ?? ''};
      `;
    }
  }}
  left: 0;
  width: 100%;
  height: 100%;
  display: ${({ Display }) => Display ?? 'flex'};
  flex-direction: ${({ flexDirection }) => flexDirection ?? ''};
  justify-content: center;
  box-sizing: ${({ boxSizing }) => boxSizing ?? 'border-box'};
  z-index: ${({ zIndex }) => zIndex ?? '1'};
  padding: ${({ Padding }) => Padding ?? '0'};

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 500px) {
    left: -15px;
  }
`;

const AvatarsPopupSubtitle = styled.div<{ mb?: string }>`
  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;

  letter-spacing: 0.04em;
  text-transform: uppercase;

  color: rgba(255, 255, 255, 0.6);
  margin-bottom: ${({ mb }) => mb ?? '18px'};
  text-align: center;
`;

const AvatarPopupNewTitle = styled.p`
  ${fontProperty};
  font-size: 36px;
  line-height: 48px;
  margin-top: 0;
  text-transform: uppercase;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 8px;

  color: #ffffff;
  text-shadow: 0 0 5px #ffffff;
  white-space: nowrap;

  @media (max-width: 500px) {
    font-size: 30px;
  }
`;

const AvatarsPopupTitle = styled.div`
  font-family: 'Play', sans-serif;
  text-transform: uppercase;
  opacity: 1;
  margin-bottom: 10px;
  text-align: center;

  font-weight: 400;
  font-size: 36px;
  line-height: 48px;
  color: #ffffff;
  text-shadow: 0 0 7px #a2d1f1;
`;

const AvatarTitle = styled.p<{ flag?: boolean }>`
  display: ${(props) => (props.flag ? 'block' : 'none')};
  position: absolute;
  margin: -33px 0 17px 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);

  ${fontProperty};
  line-height: 16px;
  letter-spacing: 0.04em;
  font-size: 14px;
  font-family: 'Helvetica', sans-serif;
  font-weight: 400;
`;

const AvatarImageBody = styled.div<{ src?: string }>`
  ${fontProperty};
  height: 314px;
  position: relative;
  max-width: inherit;
  min-width: 250px;
  width: 100%;
  border: 1px solid #fe5161;
  box-sizing: border-box;
  filter: drop-shadow(0px 0px 400px #ffffff);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: ${({ src }) => {
    return css`
      linear-gradient(180deg, rgba(0, 0, 0, 0) 19.35%,
      rgba(0, 0, 0, 0.85) 80.08%,
      rgba(0, 0, 0, 1) 100%),
    url(${src});
    `;
  }};
  background-size: contain;

  p {
    text-align: center;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;

    &:first-child {
      margin-bottom: 15px;
    }
  }

  a {
    text-decoration: underline;
    color: #fe5161;
  }
`;

const InnerContentWrapper = styled.div<{
  Width?: string;
}>`
  width: ${({ Width }) => Width ?? '265px'};
`;

const LevelCounterWrapper = styled.div`
  padding: 4px 16px;
  background: ${RGB_BLACK};
  backdrop-filter: blur(4px);
  border-radius: 4px;
  position: absolute;
  top: 10px;
  left: 10px;

  font-family: 'Helvetica', sans-serif;
  font-weight: 700;
  font-size: 10px;
  line-height: 11px;
  text-align: center;
  letter-spacing: -0.01em;
  color: #fe5161;
`;

const AvatarsNickInputWrapper = styled.div`
  width: 90%;
  position: absolute;
  bottom: 28px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const AvatarsNickInput = styled.input`
  padding: 3px 0 5px 6px;
  box-sizing: border-box;
  width: 100%;
  height: 37px;
  border: 1px solid;
  border-image-source: linear-gradient(90deg, #fe5161 -3.55%, #0ed7b3 107.42%);
  border-image-slice: 1;

  outline: none;
  background: rgba(0, 0, 0, 0.5);

  ${fontProperty};
  font-family: 'Play', sans-serif;
  line-height: 21px;
  letter-spacing: -0.02em;

  color: #ffffff;
`;

const AvatarInputTitle = styled.span`
  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 400;
  font-size: 12px;

  color: #fe5161;
  opacity: 0.8;
  margin-bottom: 5px;
`;

const InputErrorText = styled.span`
  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 400;
  font-size: 12px;

  color: #ff0616;
  margin-top: 2px;
  position: absolute;
  bottom: -18px;
`;

const CompactAvatarUIWrapper = styled.div<{
  src?: string;
  isQuestsView?: boolean;
  isGamePage?: boolean;
  backgroundSize?: string;
}>`
  position: fixed;
  cursor: pointer;
  left: 5px;
  bottom: 20px;
  width: 200px;
  height: 200px;
  border: 1px solid #fe5161;
  border-bottom: none;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-size: ${({ backgroundSize }) => backgroundSize ?? 'contain'};
  background-repeat: no-repeat;
  background-color: lightslategray;
  background-image: ${({ src }) => {
    return css`
    url(${src});
    `;
  }};
  ${({ isGamePage }) => {
    if (isGamePage) {
      return css`
        left: 30px;
        border: 1px solid #fe5161;
        filter: drop-shadow(0px 0px 200px #fe5161);

        svg {
          z-index: 100;
        }
      `;
    }
  }};

  ${({ isQuestsView }) => {
    if (isQuestsView) {
      return css`
        position: absolute;
        top: 236px;
        left: 115px;
        width: 330px;
        height: 330px;
        border-radius: 15px;
        border: 1px solid grey;
      `;
    }
  }}
`;

const ShadowDropAvatar = styled.div<{ isMissionsPage?: boolean }>`
  background: linear-gradient(
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.8) 47.92%,
    rgb(0, 0, 0) 83.33%
  );
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 65px;

  ${({ isMissionsPage }) => {
    if (isMissionsPage) {
      return css`
        border-radius: 15px;
      `;
    }
  }};
`;

const NameCompactText = styled.span`
  ${fontProperty};
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  letter-spacing: -0.02em;
  text-transform: uppercase;

  position: absolute;
  bottom: 22px;
  left: 5px;
  color: white;
`;

const Rename = styled.button<{ left?: string }>`
  ${fontProperty};
  font-family: 'Play', sans-serif;
  font-size: 10px;
  line-height: 10px;
  color: #fe5161;
  position: absolute;
  text-decoration: none;
  top: 165px;
  right: 10px;
  left: ${(props) => (props.left ? props.left : '')};
  letter-spacing: -0.02em;
  text-align: center;
  background: none;
  border: none;
`;

const ModalShadowLayer = styled.div<{
  zIndex?: string;
  backgroundColor?: string;
}>`
  width: 100vw;
  height: 100vh;
  background: url(${process.env.PUBLIC_URL}'/UIParts/Noise.png'),
    ${({ backgroundColor }) => backgroundColor ?? 'rgba(0, 0, 0, 0.4)'};
  z-index: ${({ zIndex }) => zIndex ?? '1'};
  position: fixed;
  left: 0;
  top: 0;
  backdrop-filter: blur(25px);
`;

const AvatarPopupMobile = styled.div`
  box-sizing: border-box;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  padding: 35px 32px 28px;
  color: white;
  background: center
      url(${process.env.PUBLIC_URL}'/avatars/avatarPopupBack.png'),
    linear-gradient(125.3deg, #000000 0.82%, #737272 50.95%, #000000 100.05%),
    linear-gradient(125.3deg, #000000 0.82%, #737272 50.95%, #000000 100.05%),
    linear-gradient(125.3deg, #000000 0.82%, #737272 50.95%, #000000 100.05%);
  background-size: cover;
  z-index: 400;
`;

const MintNewButtonWrapper = styled.div`
  margin-bottom: 20px;
  margin-top: 10px;
`;

const AvatarsPopupSpecialityWrapper = styled.div`
  bottom: -20px;
  position: absolute;
  font-weight: 400;
  font-size: 12px;
  width: 100%;

  p {
    margin-bottom: 0 !important;
    font-weight: 400 !important;
    font-size: 12px !important;
  }
`;

const AvatarsUIMintText = styled.span`
  position: absolute;
  font-weight: 700;
  font-size: 18px;
  line-height: 21px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: white;
  bottom: 50px;
`;

const AvatarsVideoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Paragraph = styled.p<{
  marginTop?: string;
  Position?: string;
}>`
  margin-top: ${({ marginTop }) => marginTop ?? '0'};
  position: ${({ Position }) => Position ?? ''};

  a {
    text-decoration: none;
  }
`;

const AvatarsVideoTitle = styled.p<{
  fontSize?: string;
}>`
  font-weight: 700;
  font-size: ${({ fontSize }) => fontSize ?? '36px'};
  line-height: 48px;
  text-align: center;
  text-transform: uppercase;
  color: #ffffff;
  text-shadow: 0 0 5px #ffffff;
  margin-bottom: 20px;
  margin-top: -10px;
`;

const NameAvatarButton = styled.p<{ extraBottom?: string }>`
  font-weight: 700;
  font-size: 10px;
  line-height: 10px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #fe5161;
  opacity: 0.8;
  position: absolute;
  bottom: ${(props) => (props.extraBottom ? props.extraBottom : '15px')};
  right: 5px;
`;

const TabsSelectorRowWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;

const TabsSelectorWrapper = styled.div`
  background: #000000;
  border-radius: 4px;
  padding: 2.5px;
  display: flex;
  gap: 3px;
  align-items: center;
  max-width: fit-content;
`;

const TabsSelectorItem = styled.div<{
  isSelected?: boolean;
  isDisabled?: boolean;
}>`
  box-sizing: border-box;
  background: #27262d;
  border-radius: 4px;
  padding: 4px 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ isDisabled }) => (isDisabled ? 'rgba(#ffffff, 0.5)' : '#ffffff')};
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};

  outline: ${({ isSelected }) => (isSelected ? '1px solid white' : 'unset')};

  &:hover {
    background: rgba(#27262d, 0.5);
    outline: 1px solid white;
  }
`;

export {
  AvatarImageBody,
  AvatarInputTitle,
  AvatarPopupMobile,
  AvatarPopupNewTitle,
  AvatarsBack,
  AvatarsBackWrapper,
  AvatarsNickInput,
  AvatarsNickInputWrapper,
  AvatarsPopupContent,
  AvatarsPopupOverlay,
  AvatarsPopupSpecialityWrapper,
  AvatarsPopupSubtitle,
  AvatarsPopupTitle,
  AvatarsUIMintText,
  AvatarsVideoTitle,
  AvatarsVideoWrapper,
  AvatarTitle,
  CompactAvatarUIWrapper,
  InnerContentWrapper,
  InputErrorText,
  LevelCounterWrapper,
  MintNewButtonWrapper,
  ModalShadowLayer,
  NameAvatarButton,
  NameCompactText,
  Paragraph,
  Rename,
  ShadowDropAvatar,
  StorageBack,
  TabsSelectorItem,
  TabsSelectorRowWrapper,
  TabsSelectorWrapper
};
