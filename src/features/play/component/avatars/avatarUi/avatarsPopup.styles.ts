import { fontProperty } from '@global/styles/fonts.styles';
import { WHITE } from '@global/styles/variables';
import styled, { css } from 'styled-components';

const CompactAvatarUIWrapper = styled.div<{
  src?: string;
  isQuestsView?: boolean;
  isGamePage?: boolean;
  backgroundSize?: string;
}>`
  cursor: pointer;
  bottom: 144px;
  width: 250px;
  height: 315px;
  border: 1px solid ${WHITE};
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
        border: 1px solid #34ff61;
        filter: drop-shadow(0px 0px 200px #34ff61);

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

const AvatarLvlXp = styled.span`
  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-size: 10px;
  line-height: 11px;
  text-align: center;
  letter-spacing: -0.01em;
  color: ${WHITE};
  border-radius: 2px;
  padding: 4px 14px;
  top: 20%;
  left: 44%;
`;

const Speciality = styled.span`
  position: relative;
  bottom: -140px;
  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 400;
  font-size: 12px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  opacity: 0.8;
  z-index: 1;
`;

const ShadowDropAvatar = styled.div<{ isMissionsPage?: boolean }>`
  background: linear-gradient(
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.8) 47.92%,
    rgb(0, 0, 0) 83.33%
  );
  position: relative;
  bottom: -248px;
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

const NameCompactText = styled.p`
  ${fontProperty};
  font-size: 24px;
  line-height: 28px;
  display: flex;
  letter-spacing: -0.02em;
  color: ${WHITE};
`;

const Rename = styled.button<{ left?: string }>`
  ${fontProperty};
  font-size: 10px;
  line-height: 10px;
  color: #34ff61;
  position: absolute;
  text-decoration: none;
  top: 165px;
  right: 10px;
  left: ${(props) => (props.left ? props.left : '')};
  letter-spacing: -0.02em;
  text-align: center;
  background: none;
  border: none;
  cursor: pointer;
`;

const AvatarsUIMintText = styled.span`
  position: relative;
  font-weight: 700;
  font-size: 18px;
  line-height: 21px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: white;
  bottom: -52px;
`;

const AvatarMintButton = styled.button<{
  mt?: string;
}>`
  margin-top: ${({ mt }) => mt ?? '16px'};
  width: 174px;
  height: 30px;
  border-radius: 4px;
  text-align: center;
  text-transform: uppercase;
  ${fontProperty};
  font-size: 12px;
  position: relative;
  bottom: -200px;
  background: #34ff61;
  outline: none;
  border: none;
  cursor: pointer;
`;

const ParagraphAvatar = styled.p`
  margin: 0;
  color: ${WHITE};
  padding-bottom: 16px;
  ${fontProperty};
  font-size: 24px;
  line-height: 28px;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  a {
    text-decoration: none;
  }
`;

const AvatarBlock = styled.div<{
  src?: string;
}>`
  width: 234px;
  height: 234px;

  background-image: ${({ src }) => {
    return css`
      url(${src});
      `;
  }};
  background-size: 233px;
`;

const NameSpecialityBlock = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  bottom: -15px;
`;

export {
  AvatarBlock,
  AvatarLvlXp,
  AvatarMintButton,
  AvatarsUIMintText,
  CompactAvatarUIWrapper,
  NameCompactText,
  NameSpecialityBlock,
  ParagraphAvatar,
  Rename,
  ShadowDropAvatar,
  Speciality
};
