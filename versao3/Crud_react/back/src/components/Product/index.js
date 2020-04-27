import React,{Component} from 'react';
import PubSub from 'pubsub-js';
import {
    Table, 
    Button,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
class FormProduct extends Component{
    state ={
        model:{
                id:0,
                nome:'',
                qtd:0
            }
        };
    setValues = (e,field) =>{
        const {model} = this.state;
        model[field] = e.target.value;
        this.setState({model});
        console.log(this.state.model);
    }

    create = () =>{
        this.setState({ model:{id:0,nome:'',qtd:0}})
        this.props.productCreate(this.state.model);
    }
    componentWillMount(){
        PubSub.subscribe('edit-product',(topic,product)=>{
            this.setState({model:product})
        });
    }
    render(){
        return(
            <Form>
                <FormGroup>
                   <Label for="nome">Nome:</Label>
                   <Input id="nome" type="text" value={this.state.model.nome} placeholder="Nome do Produto..." onChange={e => this.setValues(e,'nome')}></Input>  
                </FormGroup>
                <FormGroup>
                   <Label for="qtd">Quantidade:</Label>
                   <Input id="qtd" type="text" value={this.state.model.qtd} placeholder="Quantidade do Produto..." onChange={e => this.setValues(e,'qtd')}></Input>  
                </FormGroup>
                <Button block color="primary" onClick={this.create}>Gravar</Button>
            </Form>
        );

    }
}

class ListProduct extends Component{
    state ={
        model:{
                id:0,
                nome:'',
                qtd:0
            }
        };
    setValues = (e,field) =>{
            const {model} = this.state;
            model[field] = e.target.value;
            this.setState({model});
            console.log(this.state.model);
        }
     delete = (id) => {
        this.props.deleteProduct(id);
    }
    onEdit = (product) =>{
        PubSub.publish('edit-product',product);
    }
    render(){
        const {products} = this.props;
        const result = products
        .filter(product=>{
            return product.nome.toLowerCase().indexOf(this.state.model.nome.toLowerCase()) >=0
        })
        .map(product =>(
            <tr key={product.id}>
                <td>{product.nome}</td>
                 <td>{product.qtd}</td>
                 <td>
                     <Button color ="info" size="sm" onClick={e => this.onEdit(product)}>Editar</Button>
                     <Button color ="danger" size="sm" onClick={e=>this.delete(product.id)}>Deletar</Button>
                 </td>
            </tr>
        ));
        return(
          <div>
            <Form>
                <Input type="text" placeholder="EX: Sa"  value={this.state.model.nome}  onChange={e => this.setValues(e,'nome')}></Input>
            </Form>
            <Table className="table-bordered text-center mt-3">
               <thead className="thead-dark">
                   <tr>
                       <th>Nome</th>
                       <th>Quantidade</th>
                       <th>Ações</th>
                   </tr>
               </thead>
               <tbody>
                   {
                     result
                   }
               </tbody>
           </Table>
          </div>
        
        );
        
    }
}

export default class ProductBox extends Component{
    Url = 'http://localhost:3001/products';
    state ={
        products:[],
    }
    componentDidMount(){
        fetch(this.Url)
            .then(response => response.json())
            .then(products => this.setState({products}))
            .catch(e => console.log(e));
    }
    save = (product) =>{
        let data = {
            id: parseInt(product.id),
            nome:product.nome,
            qtd:parseInt(product.qtd),
        };
        const requestInfo = {
            method: data.id !== 0? 'PUT':'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };
        if (data.id === 0) {
            fetch(this.Url , requestInfo)
            .then(response => response.json())
            .then(newProduct =>{
                let {products} = this.state;
                products.push(newProduct);
                this.setState({products});
            })
            .catch(e => console.log(e)); 
        }else{
           fetch(`${this.Url}/${data.id}`, requestInfo)
            .then(response => response.json())
            .then(updateProduct => {
                let {products} = this.state;
                let position = products.findIndex(product => product.id === data.id);
                products[position] = updateProduct;
                this.setState({products});
            })
            .catch(e => console.log(e));  
        }
       
    }
     delete = (id) => {
        fetch(`${this.Url}/${id}`, {method: 'DELETE'})
            .then(response => response.json())
            .then(rows => {
                const products = this.state.products.filter(product => product.id !== id);
                this.setState({products});
            })
            .catch(e => console.log(e));
    }
    render(){
        return(
            <div className="row">
                <div className="col-md-6 my-3">
                    <h2 className="font-weight-bold text-center">Cadastro</h2>
                    <FormProduct productCreate={this.save}/>
                </div>
                <div className="col-md-6 my-3">
                    <h2 className="font-weight-bold text-center">Lista</h2>
                    <ListProduct products={this.state.products} deleteProduct={this.delete}/>
                </div>
            </div>
        );
    }
}