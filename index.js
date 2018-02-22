import React from 'react';

class ReactArrowHandler  extends React.Component {

  render() {
    let {left,right,up,down} = this.props;
    let copies = React.Children.map(this.props.children[0], (child, i) => {
      let copy = React.cloneElement(child, {
      });
      return copy;
    });
    return (<div onKeyDown={(e) => {
        if (e.keyCode === 37){
          if(left){
            left();
          }
        } else if (e.keyCode === 39) {
          if(right){
            right();
          }
        } else if (e.keyCode === 38) {
          if(up){
            up();
          }
        } else if (e.keyCode === 40) {
          if(down){
            down();
          }
        }
      }}>{copies}</div>);
  }
}

export default ReactArrowHandler;
