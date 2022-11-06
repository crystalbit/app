import styled from 'styled-components';

const DecryptOuterWrapper = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
`;

const DecryptQuestWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const DecryptQuestTitle = styled.span`
  color: #10ff00;
  font-size: 12px;
  margin-bottom: 10px;
`;

const AttemptsIconsWrapper = styled.span`
  position: relative;
  top: 1px;
`;

const DecryptQuestCode = styled.div`
  color: #10ff00;
  font-size: 14px;
  margin-bottom: 5px;
`;

const DecryptItem = styled.span`
  line-height: 13px;
  cursor: pointer;
  &:hover {
    color: black;
    background-color: #10ff00;
  }
`;

const DecryptCodeWrapper = styled.div`
  width: 150px;
`;

export {
  AttemptsIconsWrapper,
  DecryptCodeWrapper,
  DecryptItem,
  DecryptOuterWrapper,
  DecryptQuestCode,
  DecryptQuestTitle,
  DecryptQuestWrapper
};
