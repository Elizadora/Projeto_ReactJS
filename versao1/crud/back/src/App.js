import React,{Component} from 'react';
import './App.css';
import axios from 'axios';

const Url = "http://localhost:3000/products"

const Inicial = {
  product :{
    description :'',
    qtd : ''
  },
  list :[]
};

export default class App extends Component{
  render(){
    return(
      <div>
        <form>
          <label>description</label>
          <input name="description" value={this.state.product.description} onChange={e=>this.updateField(e)} placeholder="Socorro"></input><br></br>
          <label>qtd</label>
          <input name="qtd" value={this.state.product.qtd} onChange={e=>this.updateField(e)} placeholder="Por favor"></input>
          <button onClick={e => this.save(e)}>
            Salvar
          </button>
          <button  onClick={e => this.clear(e)}>
            Cancelar
          </button>
        </form>
      </div>
    );
  }
  state ={...Inicial};

  componentWillMount(){
    axios(Url).then(resp =>{
      this.setState({list: resp.data })
    })
  }
  clear(){
    this.setState({ product : Inicial.product})
  }
  save(){
    const product = this.state.product;
    const method = product.id ? 'put' : 'post';
    const url = product.id ? '${Url}/${product.id}':Url;
    axios[method](Url,product).then(resp=>{
      const list = this.getUpdateList(resp.data);
      this.setState({product: Inicial.product, list});
    });
  }
  getUpdateList( product,add = true){
    const list = this.state.list.filter(p=> p.id != product.id)
    if(add) list.unshift(product)
    return list
  }
  updateField(event){
    const product ={...this.state.product}
    product[event.target.name] = event.target.value
    this.setState({product})
  }
  
  load(product){
    this.setState({product}) 
  }
  remove(product){
    axios.delete('${Url}/${product.id}').then
  }
}
