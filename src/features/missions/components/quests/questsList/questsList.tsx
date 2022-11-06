import React, { useCallback } from 'react';
import { FLOW_STEPS } from '@features/missions/constants';
import useQuests from '@features/missions/hooks/useQuests';
import useEventListener from '@global/hooks/useEventTriggers';

import {
  MissionsTableHeader,
  QuestsListItem,
  QuestsListWrapper
} from '../questsScreen.styles';

type QuestsListProps = {
  items: { value: any; isActive: boolean; key: string }[];
};

export const QuestsList = ({ items }: QuestsListProps) => {
  const { onQuestSelect, onStepChange, onMenuHandle, activeMenuItem } =
    useQuests();

  const onItemSelect = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!items[activeMenuItem].isActive) return;
        const quest = items[activeMenuItem].key;
        onQuestSelect(quest);
        onStepChange(FLOW_STEPS.instructions);
      }
    },
    [activeMenuItem, items, onQuestSelect, onStepChange]
  );

  useEventListener('keydown', onMenuHandle);
  useEventListener('keydown', onItemSelect);

  const onListItemClick = (key: string, isActive: boolean) => {
    if (!isActive) return;
    onQuestSelect(key);
    onStepChange(FLOW_STEPS.instructions);
  };

  return (
    <QuestsListWrapper>
      <MissionsTableHeader>
        <span>Mission</span>
        <div>
          <span>Difficulty</span>
          <span>Rewards</span>
          <span>Profession</span>
        </div>
      </MissionsTableHeader>
      <ul>
        {items.map(({ value, isActive, key }, idx) => (
          <QuestsListItem
            isActive={isActive}
            isHighlighted={activeMenuItem === idx}
            key={key}
            onClick={() => onListItemClick(key, isActive)}
          >
            <span>{value.name}</span>
            <div>
              <span>{value.difficulty}</span>
              <span>{value.reward}</span>
              <span>{value.profession}</span>
            </div>
          </QuestsListItem>
        ))}
      </ul>
    </QuestsListWrapper>
  );
};
