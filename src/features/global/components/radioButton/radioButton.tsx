import { Component } from 'react';

import './radioButton.styles.css';

export class Radio extends Component<any, any> {
  state = {};

  render() {
    const { selected, onChange, text, value } = this.props;
    return (
      <div
        className="modern-radio-container"
        onClick={() => {
          onChange(value);
        }}
      >
        <div
          className={`radio-outer-circle ${value !== selected && 'unselected'}`}
        >
          <div
            className={`radio-inner-circle ${
              value !== selected && 'unselected-circle'
            }`}
          />
        </div>
        <div
          className={`helper-text ${
            value === selected && 'helper-text-selected'
          }`}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    );
  }
}
