import { fontProperty } from '@global/styles/fonts.styles';
import styled, { css } from 'styled-components';

const MusicalBlock = styled.div<{ path?: string; flag?: boolean }>`
  ${({ path }) => {
    if (path === '' || path === 'xchange' || path === 'lands') {
      return css`
        position: fixed;
        height: 20px;
        width: 40px;
        bottom: 25px;
        right: 25px;

        div:first-child {
          margin: 0;
        }

        span {
          margin: 0;
          right: 0;
        }
      `;
    } else {
      return css`
        display: none;
      `;
    }
  }}
`;

const MusicIcon = styled.div`
  position: absolute;
  margin: 140px 0 0 70px;
`;

const MusicSlider = styled.input`
  position: absolute;
  left: -55px;
  bottom: 75px;
  transform: rotate(-90deg);

  -webkit-appearance: none;
  -moz-appearance: none;

  outline: 0;
  height: 4px;
  border-radius: 7px;
  background: ${(props) =>
    `linear-gradient(to right, #34FF61 0%, #34FF61 ${props.value}%, #2E2E34 ${props.value}%, #2E2E34 100%);`};

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    background: #34ff61;
    border-radius: 7px;
    border: none;
    box-shadow: none;
  }

  ::-moz-range-thumb {
    width: 15px;
    height: 15px;
    -moz-appearance: none;
    background-image: radial-gradient(circle, #f7f7fc 40%, #ff9800 45%);
    border-radius: 7px;
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.5);
  }
`;

const Content = styled.div`
  display: none;
  left: -480px;
  top: -85px;
  padding: 10px 20px;
  font-size: 10px;
  position: absolute;
  width: 422px;
  height: 76px;
  background: #2e2e34;
  z-index: 10;
`;

const Info = styled.span`
  position: absolute;
  margin: 140px 0 0 100px;
  :hover ~ ${Content} {
    display: block;
  }
`;

const Text = styled.p`
  margin: 0;
  padding-top: 5px;

  ${fontProperty};
  font-family: 'Helvetica', serif;
  font-weight: 400;
  font-size: 12px;
  color: #fff;
`;

const AttrLink = styled.a`
  ${fontProperty};
  font-family: 'Helvetica', serif;
  font-weight: 400;
  font-size: 12px;

  color: #34ff61;
`;

const AudioComponent = styled.audio``;

export {
  AttrLink,
  AudioComponent,
  Content,
  Info,
  MusicalBlock,
  MusicIcon,
  MusicSlider,
  Text
};
