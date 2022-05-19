import {  Component} from 'preact';

export class If extends Component{
  constructor(props){
    super(props)
  }

  render(){
    // console.log("IF" , this.props.condition)
    if(this.props.condition){
      return this.props.children
    }else{
    return ""
    }
  }
}

