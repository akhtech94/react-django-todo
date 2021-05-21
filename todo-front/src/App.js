import './App.css';
import React from 'react';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      todolist:[],
      activeItem:{
        id:null,
        title:'',
        completed:false,
      },
      editing:false
    }
    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

  componentWillMount(){
    this.fetchTasks();
    
  }

  fetchTasks(){
    fetch('http://akhtech94.pythonanywhere.com/api/task-list/')
    .then(response => response.json())
    .then(data => this.setState({todolist:data}))
  }

  handleChange(e){
    let value = e.target.value;
    console.log(value);
    this.setState({activeItem:{...this.state.activeItem, title:value}});

  }

  handleSubmit(e){
    e.preventDefault();
    console.log(this.state.activeItem);
    const csrftoken = this.getCookie('csrftoken');
    let url = 'http://akhtech94.pythonanywhere.com/api/task-create/';
    if(this.state.editing === true){
      url = 'http://akhtech94.pythonanywhere.com/api/task-update/' + this.state.activeItem.id + '/';
      console.log(this.state.activeItem.id);
      this.setState({editing:false});
    }
    fetch(url, {
      method:'POST', headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
    body:JSON.stringify(this.state.activeItem)
  }).then(response => {
    this.fetchTasks();
    this.setState({
      activeItem:{
        id:null,
        title:'',
        completed:false,
      }
    })
  }).catch(function(errror){
    console.log("Error: ", errror);
  })
  }

  handleEdit(task){
    this.setState({
      activeItem:task,
      editing:true,
    })
  }

  handleDelete(task){
    const csrftoken = this.getCookie('csrftoken');
    let url = 'http://akhtech94.pythonanywhere.com/api/task-delete/' + task.id + '/';
    fetch(url, {
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      }
    }).then( response => {this.fetchTasks();})
  }

  render(){
    let tasks = this.state.todolist
    let self = this;
    return(
      <div className="container">
        <div className="mainwrapper rounded my-5">
          <div className="formwrapper p-3"> 
            <form onSubmit={this.handleSubmit}>
              <div className="form-row mt-3">
                <div className="col-md-10">
                  <input onChange={this.handleChange} type="text" className="form-control" placeholder="Your new task" name="title" value={this.state.activeItem.title}></input>
                </div>
                <div className="col-md-2">
                  <input type="submit" value="SUBMIT" className="form-control btn btn-primary" id="submit"></input>
                </div>
              </div>
            </form>                 
          </div>
          <div className="listwrapper pb-2">
            <hr />
            {tasks.map((task, index) => {
              return(
                <div key={index}>
                  <div className="form-row p-1 m-1">
                    <div className="col-md-8">
                      <span>{task.title}</span>                      
                    </div>
                    <div className="col-md-4">
                      <div className="btn-group">
                        <button onClick={() => self.handleEdit(task)} className="btn btn-warning mx-1">EDIT</button>
                        <button onClick={() => self.handleDelete(task)} className="btn btn-outline-danger mx-1">DELETE</button>                      
                      </div>
                    </div>                                            
                  </div>
                </div>
              )
            })}            
          </div>
        </div>        
      </div>
    )
  }
}

export default App;
