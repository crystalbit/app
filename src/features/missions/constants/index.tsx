import { DecryptScreen } from '@features/missions/components/decrypt';
import { CodingQuest } from '@features/missions/components/quests/codingQuest/codingQuest';
import { QuestAdditionalText } from '@features/missions/components/quests/questAdditionalText/questAdditionalText';
import { QuestsList } from '@features/missions/components/quests/questsList/questsList';
import { SimpleText } from '@features/missions/components/quests/simpleText/simpleText';
import { capitalizeFirstLetter } from '@features/missions/utils/helpers';

const QUEST_TYPES = {
  decrypt: 'decrypt',
  coding: 'coding',
  mining: 'mining'
};

const FLOW_STEPS = {
  selectScreen: 'selectScreen',
  instructions: 'instructions',
  playDecrypt: 'playDecrypt',
  playCoding: 'playCoding',
  success: 'success',
  restart: 'restart'
};

const SUBSCREEN_STEPS = {
  preparing: 'preparing',
  success: 'success',
  restart: 'restart'
};

const SCREENS_INFO: Record<string, any> = {
  selectScreen: {
    title: (landId: number) =>
      `Base Station #${landId}. Welcome home, colonist.`,
    content: [
      {
        Component: QuestAdditionalText,
        props: {
          text: (
            <p>
              Select your mission by using your <b>arrow</b> keys,
              <br />
              and press <b>“Enter”</b> to confirm.
            </p>
          )
        },
        topGap: 0
      },
      {
        Component: QuestsList,
        props: {
          items: [
            {
              value: {
                name: 'Coding challenge',
                difficulty: 'Easy',
                reward: '0.75',
                profession: 'Programmer'
              },
              isActive: true,
              key: QUEST_TYPES.coding
            },
            {
              value: {
                name: 'Message decryption',
                difficulty: 'Medium',
                reward: '1',
                profession: 'Scientist'
              },
              isActive: true,
              key: QUEST_TYPES.decrypt
            }
          ]
        }
      }
    ]
  },
  instructions: {
    title: (questType: string) =>
      `${capitalizeFirstLetter(questType)} Challenge`,
    content: {
      coding: [
        {
          Component: SimpleText,
          props: {
            children: (
              <div>
                <p>
                  Your communications system is offline! It appears a
                  cyberattack of <br />
                  unknown origin has been unleashed on your base.
                </p>
                <p>
                  You have 1 minute to restore communications and prevent <br />
                  a complete malfunction.
                </p>
              </div>
            )
          }
        },
        {
          Component: QuestAdditionalText,
          props: {
            text: (
              <>
                <p>
                  Press <b>“Enter”</b> to proceed
                </p>
                <p>
                  Press <b>“Q”</b> to return to main menu
                </p>
              </>
            )
          },
          topGap: 30
        }
      ],
      decrypt: [
        {
          Component: SimpleText,
          props: {
            children: (
              <div>
                <p>
                  Your transmitter has received an encrypted message from Space.{' '}
                  <br /> What if this is a SOS signal?
                </p>
                <p>
                  You have 4 attempts to decipher the message. Find a word and
                  press on it.
                  <br />
                  Computer will calculate how many letters in this word match
                  with the password
                  <br />
                  or if it’s the password, the system will automatically unlock.
                </p>
              </div>
            )
          }
        },
        {
          Component: QuestAdditionalText,
          props: {
            text: (
              <>
                <p>
                  Press <b>“Enter”</b> to proceed
                </p>
                <p>
                  Press <b>“Q”</b> to return to main menu
                </p>
              </>
            )
          },
          topGap: 30
        }
      ]
    }
  },
  playCoding: {
    title: null,
    content: [
      {
        Component: CodingQuest,
        props: {}
      }
    ]
  },
  playDecrypt: {
    title: null,
    content: [
      {
        Component: DecryptScreen,
        props: {}
      }
    ]
  },
  success: {
    title: () => 'Mission completed',
    content: {
      coding: [
        {
          Component: SimpleText,
          props: {
            children: (
              <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                Congrats! You've successfully restored communications.
              </div>
            )
          }
        },
        {
          Component: QuestAdditionalText,
          props: {
            text: <p>Collect your rewards on the screen to the right.</p>
          },
          topGap: 5
        }
      ],
      decrypt: [
        {
          Component: SimpleText,
          props: {
            children: (
              <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                Congrats! Message successfully decrypted.
              </div>
            )
          }
        },
        {
          Component: QuestAdditionalText,
          props: {
            text: <p>Collect your rewards on the screen to the right.</p>
          },
          topGap: 5
        }
      ]
    }
  },
  restart: {
    title: () => 'You passed the mission',
    content: [
      {
        Component: QuestAdditionalText,
        props: {
          text: <p>To continue playing press “Find a mission”.</p>
        }
      }
    ]
  }
};

const BUTTON_TYPES = {
  triangle: 'triangle',
  wide: 'wide',
  common: 'common'
};

const BUTTON_COLORS = {
  darkRed: 'darkRed',
  yellow: 'yellow',
  red: 'red',
  green: 'green'
};

export {
  BUTTON_COLORS,
  BUTTON_TYPES,
  FLOW_STEPS,
  QUEST_TYPES,
  SCREENS_INFO,
  SUBSCREEN_STEPS
};
