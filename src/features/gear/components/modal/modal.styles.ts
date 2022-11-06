import { commonFlexLine } from '@global/styles/app.styles';
import { fontProperty } from '@global/styles/fonts.styles';
import { WHITE } from '@global/styles/variables';
import styled from 'styled-components';

const GearModalContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 762px;
`;

const GearModalTitle = styled.h3`
  ${fontProperty};
  font-weight: 700;
  font-size: 36px;
  line-height: 42px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${WHITE};
  margin-bottom: 10px;
  margin-top: 0;
`;

const GearModalText = styled.p<{ limit?: string }>`
  margin: 0 0 30px 0;
  font-family: 'Helvetica', sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: ${WHITE};
  max-width: ${({ limit }) => limit ?? '290px'};
`;

const ItemFrame = styled.div<{ url?: string }>`
  width: 396px;
  height: 396px;
  border: 1px solid ${WHITE};
  background-size: cover;
  background-image: ${({ url }) => `url(${url})`};
`;

const ItemStat = styled.div<{ url?: string }>`
  width: 396px;
  padding: 10px 28px;
  border: 1px solid ${WHITE};
  border-top: none;
  margin-bottom: 45px;
`;

const StatsText = styled.p<{ fs?: string }>`
  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: ${({ fs }) => fs ?? '14px'};
  line-height: 16px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${WHITE};
  margin: 0;

  text-align: center;
`;

const StatsHeader = styled.div<{ align?: string }>`
  ${commonFlexLine};
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 30px;
  gap: 10px;
  align-items: ${({ align }) => align ?? 'center'};
`;

const ModalButtonWrapper = styled.div`
  margin-top: 45px;
`;

const ModalPriceTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StatColumWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
`;

export {
  GearModalContent,
  GearModalText,
  GearModalTitle,
  ItemFrame,
  ItemStat,
  ModalButtonWrapper,
  ModalPriceTextWrapper,
  StatColumWrapper,
  StatsHeader,
  StatsText
};
