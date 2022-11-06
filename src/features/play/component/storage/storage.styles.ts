import { fontProperty } from '@global/styles/fonts.styles';
import { BLACK, RGB_BLACK, WHITE } from '@global/styles/variables';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-bottom: 43px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  @media (max-width: 630px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const StorageWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  top: 60px;
`;

const StorageBlock = styled.div`
  padding-top: 30px;
  background: ${RGB_BLACK};
  width: 824px;
  height: 657px;

  @media (max-width: 800px) {
    flex-direction: column;
    width: 497px;
  }

  @media (max-width: 570px) {
    width: 570px;
  }
`;

const Title = styled.span`
  ${fontProperty};
  font-size: 36px;
  line-height: 48px;
  color: ${WHITE};
  text-align: center;
  text-transform: uppercase;

  @media (max-width: 800px) {
    font-size: 24px;
    line-height: 28px;
  }
`;

const StorageContentBlock = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  column-gap: 16px;
  row-gap: 16px;
  overflow-y: scroll;
  height: 74%;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Select = styled.select`
  width: 152px;
  height: 30px;
  background: ${BLACK};
  border: none;
  border-radius: 4px;
  color: white;
  padding: 4px 10px;

  &:focus-visible {
    outline: none;
  }
`;

const Option = styled.option`
  padding: 0.5rem;

  &::part(listbox) {
    padding: 10px;
    margin-top: 5px;
    border: 1px solid red;
    border-radius: 5px;
  }
`;

const EmptyListText = styled.span`
  ${fontProperty};
  color: ${WHITE};
`;

export {
  EmptyListText,
  Option,
  Select,
  StorageBlock,
  StorageContentBlock,
  StorageWrapper,
  Title,
  Wrapper
};
