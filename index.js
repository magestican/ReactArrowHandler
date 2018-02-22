import React from 'react';

class ReactArrowHandler  extends React.Component {

  render() {
    let {left,right,top,down};
    let copies = React.Children.map(this.props.children, (child, i) => {
      let copy = React.cloneElement(child, {
        onKeyDown: (e) => {
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
          }
      });
      return copy;
    });
    return (<div>{copies}</div>);
  }
}

export ReactArrowHandler;
