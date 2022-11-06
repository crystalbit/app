import { LIGHT_GRAY, TOXIC_GREEN, WHITE } from '@global/styles/variables';
import styled from 'styled-components';

const GearCardOuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  position: relative;
`;

const EmptyGearCardWrapper = styled.div`
  width: 168px;
  height: 168px;
  background: ${LIGHT_GRAY};
  color: ${WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    height: 55px;
    width: 34px;
  }
`;

const GearCardLabel = styled.div`
  font-family: 'Helvetica', sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 16px;
`;

const ActiveGearCardWrapper = styled.div<{ bgImg?: string }>`
  width: 168px;
  height: 168px;
  border: 1px solid ${TOXIC_GREEN};
  background-image: ${({ bgImg }) => `url(${bgImg})`};
  background-size: cover;
`;

export {
  ActiveGearCardWrapper,
  EmptyGearCardWrapper,
  GearCardLabel,
  GearCardOuterWrapper
};
