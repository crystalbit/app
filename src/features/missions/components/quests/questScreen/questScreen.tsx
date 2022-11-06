import React, { ComponentType, useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { LootboxPopup } from '@features/lootboxes/components/lootboxPopup/lootboxPopup';
import useLootboxes from '@features/lootboxes/hooks/useLootboxes';
import { FLOW_STEPS, SCREENS_INFO } from '@features/missions/constants';
import useQuests from '@features/missions/hooks/useQuests';
import useEventListener from '@global/hooks/useEventTriggers';
import { resetHistoryRecord } from '@slices/decryptSlice';
import mixpanel from 'mixpanel-browser';

import { QuestsScreenWrapper } from '../questsScreen.styles';
import { QuestsTitle } from '../title/questsTitle';

export const QuestScreen = () => {
  const { id } = useParams();
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const { activeQuest, step, onStepChange } = useQuests();
  const { isPopupActive } = useLootboxes();

  useEffect(() => {
    if (step === FLOW_STEPS.instructions) {
      dispatch(resetHistoryRecord());
    }
  }, [step]);

  const handledKeys = useCallback(
    (e: KeyboardEvent) => {
      let handlers;
      if (step === FLOW_STEPS.selectScreen) return [];
      if (step === FLOW_STEPS.instructions) {
        handlers = [
          {
            key: 'Enter',
            callback: () => {
              onStepChange(
                activeQuest === 'coding'
                  ? FLOW_STEPS.playCoding
                  : FLOW_STEPS.playDecrypt
              );
              mixpanel.track('Play screen entered', {
                step,
                activeQuest
              });
            }
          },
          {
            key: 'q',
            callback: () => {
              onStepChange(FLOW_STEPS.selectScreen);
              mixpanel.track('Select screen entered', {
                step,
                activeQuest
              });
            }
          }
        ];

        if (
          handlers.some((key) => key.key.toLowerCase() === e.key.toLowerCase())
        ) {
          return handlers
            .find((key) => key.key.toLowerCase() === e.key.toLowerCase())
            ?.callback();
        }
      } else return [];
    },
    [activeQuest, onStepChange, step]
  );

  useEventListener('keydown', handledKeys);

  const { title, content } = useMemo(() => SCREENS_INFO[step], [step]);

  useEffect(() => {
    if (!id) {
      mixpanel.track('No land id provided error');
      return navigator('/');
    }
  }, [id, navigator]);

  const screenContent = useMemo(() => {
    if (Array.isArray(content)) {
      return content.map(
        ({
          Component,
          props,
          topGap
        }: {
          Component: ComponentType;
          props: any;
          topGap: number;
        }) => (
          <div style={{ marginTop: topGap }}>
            <Component {...props} />
          </div>
        )
      );
    } else {
      if (!activeQuest) return [];

      return content?.[activeQuest].map(
        ({
          Component,
          props,
          topGap
        }: {
          Component: ComponentType;
          props: any;
          topGap: number;
        }) => (
          <div style={{ marginTop: topGap }}>
            <Component {...props} />
          </div>
        )
      );
    }
  }, [activeQuest, content]);

  const screenTitle = useMemo(() => {
    switch (step) {
      case FLOW_STEPS.selectScreen:
        return title(id);
      case FLOW_STEPS.instructions:
        return title(activeQuest);
      default:
        return title?.();
    }
  }, [activeQuest, id, step, title]);

  return (
    <QuestsScreenWrapper>
      {screenTitle && <QuestsTitle text={screenTitle} />}
      {screenContent}
      {isPopupActive && <LootboxPopup />}
    </QuestsScreenWrapper>
  );
};
