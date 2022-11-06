import { fontProperty } from '@global/styles/fonts.styles';
import { RGB_BLACK, TOXIC_GREEN, WHITE } from '@global/styles/variables';
import styled from 'styled-components';

export const UserBlock = styled.div<{
  active?: boolean;
}>`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url(${process.env.PUBLIC_URL}'/UIParts/Noise.png');
  backdrop-filter: blur(12.5px);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ active }) => (active ? 1 : 0)};
  pointer-events: ${({ active }) => (active ? 'all' : 'none')};
  z-index: ${({ active }) => (active ? 10000 : 0)};
  transition: 0.5s;

  @media screen and (max-width: 1020px) {
    left: 40px;
  }
  @media screen and (max-width: 629px) {
    left: 0;
  }
`;

export const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  width: 824px;
  height: 556px;

  padding: 40px 0;
  gap: 40px;

  background-color: ${RGB_BLACK};
  border: 1px solid ${WHITE};
  backdrop-filter: blur(10px);

  @media screen and (max-width: 425px) {
    width: 360px;
  }

  @media screen and (max-height: 800px) {
    padding: 0;
    top: 50px;
    position: relative;
  }
`;

export const UserBlockTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const UserTitle = styled.p`
  ${fontProperty};
  font-size: 36px;
  line-height: 42px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  color: ${WHITE};
`;

export const UserText = styled.p`
  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 16px;
  text-align: center;

  color: ${WHITE};
`;

export const UserForm = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

export const UserEditBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;

  @media screen and (max-width: 1020px) {
    align-items: center;
  }
`;

export const UserEditBlockName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 2px;
`;

export const UserEditName = styled.p<{
  flagError?: boolean;
}>`
  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 16px;

  text-align: center;

  color: ${({ flagError }) =>
    flagError ? 'rgba(255, 255, 255, 0.5)' : `${TOXIC_GREEN}`};
`;

export const UserEditInputName = styled.input<{
  flagError?: boolean;
}>`
  padding: 3px 0 5px 6px;
  width: 660px;
  height: 48px;
  background: ${RGB_BLACK};

  border: 1px solid;
  border-image-source: ${({ flagError }) => `
    linear-gradient(
        89.76deg,
   ${flagError ? '#c71458' : `${TOXIC_GREEN}`}  1.03%,
#bd9600 99.79%
)
`};

  border-image-slice: 1;

  ${fontProperty};
  font-size: 24px;
  line-height: 28px;
  text-transform: uppercase;

  color: ${WHITE};
  caret-color: ${TOXIC_GREEN};

  &:focus {
    outline: none;
  }

  @media screen and (max-width: 1020px) {
    width: 400px;
  }

  @media screen and (max-width: 425px) {
    width: 300px;
  }
`;

export const UserEditBlockSocial = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 20px;

  width: 661px;
  height: 152px;

  @media screen and (max-width: 1020px) {
    align-items: center;
  }
`;

export const UserEditTextInputBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 2px;

  height: 66px;
`;

export const UserEditSocialText = styled.p`
  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 16px;
  text-align: center;

  color: ${WHITE};
`;

export const InputICon = styled.div`
  svg {
    position: absolute;
    padding-left: 10px;
    padding-top: 18px;
    text-align: center;
  }
`;

export const UserEditSocialInput = styled.input<{
  padding?: string;
}>`
  width: 614px;
  padding: ${({ padding }) => `16px 2px 16px ${padding}`};
  gap: 20px;

  background-color: ${RGB_BLACK};
  border: 1px solid ${WHITE};

  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;

  color: ${WHITE};

  &:focus {
    outline: none;
  }

  @media screen and (max-width: 1020px) {
    width: 354px;
  }

  @media screen and (max-width: 425px) {
    width: 254px;
  }
`;

export const PlaceHolderAt = styled.div`
  font-family: 'Helvetica', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;

  position: relative;
  pointer-events: none;
  top: -33px;
  bottom: 2px;
  left: 36px;
  margin: auto;
  color: ${WHITE};
`;

export const UserButtonBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0;
  gap: 44px;
`;

export const ButtonSave = styled.button<{
  disable?: boolean;
}>`
  ${fontProperty};
  font-size: 12px;
  line-height: 14px;
  text-align: center;

  padding: 8px 40px;
  gap: 10px;

  background: ${TOXIC_GREEN};
  border: none;
  border-radius: 6px;

  text-transform: uppercase;
  cursor: pointer;

  color: #36363d;

  &:disabled {
    cursor: not-allowed;
    background: linear-gradient(90deg, #f5f0f0 -3.55%, #a4a5b2 107.42%);
  }
`;

export const CancelText = styled.p`
  ${fontProperty};
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  text-transform: uppercase;

  cursor: pointer;

  color: ${TOXIC_GREEN};
`;

export const ErrorText = styled.p`
  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;

  color: #ff0616;
  opacity: 0.8;

  position: absolute;
  top: 250px;
`;
