import { RGB_BLACK } from '@features/global/styles/variables';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  top: 164px;
`;

const Block = styled.div`
  width: 650px;
  height: 495px;
  left: 640px;
  top: 200px;
  background: ${RGB_BLACK};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export { Block, Wrapper };
