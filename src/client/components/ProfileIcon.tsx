import * as React from 'react';

export default class ProfileIcon extends React.Component<any, any> {
  constructor(props,state){
    super(props,state);
  }

  render() {
    const styles = {
      middleIcon: {
        width: 50,
        height: 50,
        fill: '#42AFE3', //d0d8e5
        cursor: 'pointer',
      }, 
      smallIcon: {
        width: 30,
        height: 30,
        fill: '#42AFE3', //d0d8e5
        cursor: 'pointer',
      }, 
    };

    const icon = this.props.src || '../../static/img/satomi.jpg';

    return <img src={icon} style={styles.middleIcon}/>
  }
}


