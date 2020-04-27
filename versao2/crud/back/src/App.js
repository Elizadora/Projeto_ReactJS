import React,{Component} from 'react';
import Header from './components/Header/index';
import ProductBox from './components/Product';
class App extends Component{
  render(){
    return(
      <div className="container">
          <Header title="Crud"/>
          <br />
         <ProductBox />
      </div>
    );
  }
}
export default App;
