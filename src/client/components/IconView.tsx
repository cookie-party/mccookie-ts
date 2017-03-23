import * as React from 'react';
import * as MaterialUI from 'material-ui';

export interface IconViewProps {
  icon: any, //MaterialUI.SvgIcon, TODO なんでできない?
  onClick: ()=>void,
  style: React.CSSProperties,
}
export interface IconViewState {
  hovering: boolean,
}

export default class IconView extends React.Component<IconViewProps, IconViewState>{
  constructor(props, state){
    super(props, state);
    this.state = {
      hovering: false
    };
  }

  whenMouseEntered() {
    this.setState({hovering: true});
  }
  whenMouseLeft() {
    this.setState({hovering: false});
  }

  onClick() {
    this.props.onClick && this.props.onClick();
  }

  render() {
    const style = this.props.style || {
      width: 20,
      height: 20,
      fill: '#d0d8e5',
      cursor: 'pointer',
    };

    if(this.state.hovering) {
      style.fill = '#42AFE3';
    }
    else {
      style.fill = '#d0d8e5';
    }

    const Icon = this.props.icon;
    return (
      <div
        onMouseEnter={this.whenMouseEntered.bind(this)}
        onMouseLeave={this.whenMouseLeft.bind(this)}>
        <Icon style={style} onTouchTap={this.onClick.bind(this)}/>
      </div>
    );
  }
}
