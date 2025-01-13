import { fontProperty } from '@features/global/styles/fonts.styles';
import styled, { css } from 'styled-components';

const CompactAvatarUIWrapper = styled.div<{
  src?: string;
  isQuestsView?: boolean;
  isGamePage?: boolean;
  backgroundSize?: string;
}>`
  position: relative;
  cursor: pointer;
  width: 234px;
  height: 234px;
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
  bottom: -19px;
  left: 5px;
  color: white;
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

export {
  AvatarsUIMintText,
  CompactAvatarUIWrapper,
  NameCompactText,
  ShadowDropAvatar
};
