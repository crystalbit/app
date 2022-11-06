import { useSelector } from 'react-redux';
import {
  DecryptDataSelector,
  DecryptHistorySelector,
  UserAttemptsSelector
} from '@selectors/decryptQuestSelector';

const useDecrypt = () => {
  const attempts = useSelector(UserAttemptsSelector);
  let words = useSelector(DecryptDataSelector)?.words ?? [];
  let history = useSelector(DecryptHistorySelector) ?? [];
  const textLinesCount = 23;
  const lettersPerLine = 55;

  return {
    attempts,
    words,
    textLinesCount,
    lettersPerLine,
    history
  };
};

export default useDecrypt;
