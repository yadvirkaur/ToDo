import { useState } from 'react';
import axios from 'axios';
import { AiOutlinePlus } from 'react-icons/ai';

const TodoForm = () => {
  const [task, setTask] = useState('');

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (task) {
      axios
        .post('https://mern-todo-app-bdsl.onrender.com/todos', { task: task })
        .then((result) => {
          console.log(result);
          setTask(''); // Clear the input field on success
        })
        .catch((error) => console.log(error));
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  return (
    <form className="form" onSubmit={onFormSubmit}>
      <div className=" flex items-center gap-4 text-sm border  shadow rounded-md p-4  w-[100%]">
        <div className="text-blue text-lg">
          <AiOutlinePlus />
        </div>
        <input
          type="text"
          name=""
          id=""
          placeholder="Add new task"
          onChange={onInputChange}
          className="w-[100%] outline-none"
          value={task}
        />
      </div>
      {/* <button type="submit">Add</button> */}
    </form>
  );
};

export default TodoForm;
