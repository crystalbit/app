import React from 'react';
import useQuests from '@features/missions/hooks/useQuests';

import { SimpleText } from '../simpleText/simpleText';
import { QuestsTitle } from '../title/questsTitle';

export const LeaveScreen = () => {
  const { activeQuest } = useQuests();

  return (
    <>
      <QuestsTitle text="Warning!" bgColor="#F55B5D" textColor="white" />
      <div className="mt-20">
        <SimpleText>
          <span>
            {activeQuest === 'coding' &&
              'If you quit the mission before the timer ends all progress will be lost.'}
            {activeQuest === 'decrypt' &&
              'If you quit the mission before successful decrypt all your progress will be lost.'}
          </span>
        </SimpleText>
      </div>
    </>
  );
};
