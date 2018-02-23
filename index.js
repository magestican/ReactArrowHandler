import React from 'react';
import { findDOMNode } from 'react-dom';

class ReactArrowHandler  extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentHoveredElement : null,
      currentHoveredItem : null
    }
  }

  componentWillReceiveProps(nextProps) {
    let {current, idProperty} = this.props;
    let {currentHoveredElement} = this.props;

    if (idProperty && current){
      if (current[idProperty] != nextProps.current[idProperty]){
        if (currentHoveredElement) {
          currentHoveredElement.className.replace('hovered',' ');
        }
        this.setState({
          currentHoveredElement : null,
          currentHoveredItem : null
        });
      }
    }
  }

  markElementAsHovered = (arrayElement) => {
    let { currentHoveredElement } = this.state;
    let { textProperty } = this.props;

    if (arrayElement){
      let elementText = arrayElement[textProperty];

      let object = findDOMNode(this);

      let parent = object;

      let elementList = [];
      let findListOf = (typeOfElement) => {
        let elementsOfType = parent.querySelectorAll(typeOfElement);
        return [...elementsOfType].filter(e => e.innerHTML.trim() == elementText.trim());
      }
      elementList = findListOf('div')
      if (elementList.length == 0)
        elementList = findListOf('span');

      if (elementList && elementList.length > 0){
        
        if (currentHoveredElement){
          currentHoveredElement.className = currentHoveredElement.className.replace('hovered',' ');
        }
        let elementToModify = elementList[elementList.length - 1]; // get the last element

        let parentIsTheActualNavigationItem = () => {
          return elementToModify.parentElement.className.includes('item') && !elementToModify.parentElement.className.includes('dropdown')
        }
        if (parentIsTheActualNavigationItem()) {// in case this is a nested item
          elementToModify = elementToModify.parentElement;
          if (parentIsTheActualNavigationItem()) // second level
            elementToModify = elementToModify.parentElement;
        }
        elementToModify.className += ' hovered ';
        if (elementToModify.scrollIntoView){
          elementToModify.scrollIntoView();
        }
        this.setState({currentHoveredElement : elementToModify, currentHoveredItem : arrayElement});
      } else {
        console.warn('Item not found');
      }
    }

  }

  handleUpDropdown = () => {
    let {list, idProperty, current, textProperty} = this.props;
    let {currentHoveredItem} = this.state;

    if (currentHoveredItem)
      current = currentHoveredItem;

    let currentItemPositionInArray = list.findIndex(x => x[idProperty] == current[idProperty]);

    if (0 < currentItemPositionInArray && currentItemPositionInArray < list.length){
      currentItemPositionInArray -= 1;
      this.markElementAsHovered(list[currentItemPositionInArray]);
    } else if (currentItemPositionInArray == -1){
      this.markElementAsHovered(list[list.length - 1]);
    }
  }

  handleDownArrow = () =>{
    let {list, idProperty, current, textProperty} = this.props;
    let {currentHoveredItem} = this.state;

    if (currentHoveredItem)
      current = currentHoveredItem;

    let currentItemPositionInArray = list.findIndex(x => x[idProperty] == current[idProperty]);

    if (-1 < currentItemPositionInArray && currentItemPositionInArray < (list.length - 1)){
      currentItemPositionInArray += 1;
      this.markElementAsHovered(list[currentItemPositionInArray]);
    } else if (currentItemPositionInArray == -1){
      this.markElementAsHovered(list[0]);
    }
  }

  handleEnter = ()=>{
    let {selectItemHandler} = this.props;
    let {currentHoveredElement} = this.state;
    if (currentHoveredElement){
      currentHoveredElement.click();
    }
  }

  render() {
    let {left,right,up,down,list,idProperty,current,textProperty} = this.props;

    let indexToRender = 0;
    if (this.props.children[0] && this.props.children[0].trim && this.props.children[0].trim() != ''){
      indexToRender = 1;
    }
    let copies = React.Children.map(this.props.children[indexToRender], (child, i) => {
      let copy = React.cloneElement(child, {
      });
      return copy;
    });
    copies = copies || this.props.children;

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
            if (list && idProperty && textProperty != undefined && current != undefined) {
              this.handleUpDropdown();
            } else if (up) {
              up();
            }
        } else if (e.keyCode === 40) {
            if (list && idProperty && textProperty != undefined && current != undefined) {
              this.handleDownArrow();
            } else if (down) {
              down();
            }
        } else if (e.keyCode === 13) {
          this.handleEnter();
        }
      }}>{copies}</div>);
  }
}

export default ReactArrowHandler;
