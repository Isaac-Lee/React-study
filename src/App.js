import { useState } from 'react';
import './App.css';

function Header(props) {
  return <header>
    <h1><a href='/' onClick={event => {
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
  </header>
}

function Nav(props) {
  const lis = [];
  for (let i=0; i< props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(<li>
      <a id={t.id} href={'/read/'+t.id} onClick={event => {
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a>
      </li>)
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

function Content(props) {
  return <div>
    <h2>{props.title}</h2>
    {props.body}
  </div>
}

function Article(props) {
  return <article>
    <Content title={props.title} body={props.body}></Content>
  </article>
}

function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type='text' name='title' placeholder='title'></input></p>
      <p><textarea name='body' placeholder='body'></textarea></p>
      <p><input type='submit' value='Create'></input></p>
    </form>
  </article>
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type='text' name='title' placeholder='title' value={title} onChange={event => {
        setTitle(event.target.value);
      }}></input></p>
      <p><textarea name='body' placeholder='body' value={body} onChange={event => {
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type='submit' value='Update'></input></p>
    </form>
  </article>
}

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(3);
  const [topics, setTopics] = useState([
    {id:0, title:"html", body:'html is ...'},
    {id:1, title:"css", body:'css is ...'},
    {id:2, title:"js", body:'js is ...'},
  ]);
  let article = null;
  let contextControl = null;

  if(mode === 'WELCOME') {
    article = <Article title='Welcome' body='Hello, WEB'></Article>
  } else if(mode === 'READ') {
    article = <Article title={topics[id].title} body={topics[id].body}></Article>
    contextControl = <>
      <li><a href={'/update/'+id} onClick={event=>{
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      <li><a href={'/delete/'+id} onClick={event=>{
        event.preventDefault();
        const newTopics = [...topics].filter(topic=>{ return topic.id !== id });
        setTopics(newTopics);
        setMode('WELCOME');
      }}>Delete</a></li>
    </>
  } else if(mode === 'CREATE') {
    article = <Create onCreate={(_title, _body) => {
      const newtopics = [...topics]
      newtopics.push({id:nextId, title:_title, body:_body});
      setTopics(newtopics);
      setId(nextId);
      setNextId(nextId+1);
      setMode('READ');
    }}></Create>
  } else if(mode === 'UPDATE') {
    article = <Update title={topics[id].title} body={topics[id].body} onUpdate={(_title, _body) => {
      const newtopics = [...topics]
      const updatedTopic = topics[id];
      updatedTopic.title = _title;
      updatedTopic.body = _body;
      newtopics[id] = updatedTopic;
      setTopics(newtopics);
      setMode('READ');
    }}></Update>
  } else if(mode === 'DELETE') {
    article = <Update title={topics[id].title} body={topics[id].body} onUpdate={(_title, _body) => {
      const newtopics = [...topics]
      const updatedTopic = topics[id];
      updatedTopic.title = _title;
      updatedTopic.body = _body;
      newtopics[id] = updatedTopic;
      setTopics(newtopics);
      setMode('READ');
    }}></Update>
  }
  
  return (
    <div className="App">
      <Header title="WEB" onChangeMode={() => {
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={(_id) =>{
        setMode('READ');
        setId(_id);
      }}></Nav>
      {article}
      <ul>
        <li><a href='/creat' onClick={event=>{
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
