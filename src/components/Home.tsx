import { useEffect, useState } from 'react';
import TodoForm from './TodoForm';
import axios from 'axios';
import { AiOutlineUser } from 'react-icons/ai';
import { BsCircle } from 'react-icons/bs';
import { IoCheckmarkCircleSharp } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { GrEdit } from 'react-icons/gr';

interface Todo {
  _id: string;
  task: string;
  done: boolean;
}

const Home = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/todos')
      .then((result) => setTodos(result.data))
      .catch((error) => console.log(error));
  }, [todos]);

  const handleTaskUpdate = (taskId: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo._id === taskId) {
        const updatedTodo = { ...todo, done: !todo.done };

        axios
          .put(`http://localhost:8000/todos/${taskId}`, updatedTodo)
          .then((result) => console.log(result))
          .catch((error) => console.log(error));

        return updatedTodo;
      }
      return todo;
    });

    setTodos(updatedTodos);
  };

  const handleTaskEdit = (taskId: string) => {};

  const handleTaskDelete = (taskId: string) => {
    axios
      .delete(`http://localhost:8000/todos/${taskId}`)
      .then((result) => {
        const updatedTodos = todos.filter((todo) => todo._id !== taskId);
        setTodos(updatedTodos);
        console.log(result);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className=" relative main md:my-4 min-h-[60%] md:max-h-[90vh]   flex flex-col mx-auto md:border md:rounded-md  md:shadow">
      <div className="sticky z-10 top-0 bg-white">
        <div className="  bg-blue p-4 flex justify-between mb-6 md:rounded-t-md">
          <div className="text-white font-medium text-lg ">ToDo List</div>
          <div className="text-white">
            <AiOutlineUser />
          </div>
        </div>
        <div className=" px-4">
          <TodoForm />
        </div>
      </div>

      <div className=" p-4 md:overflow-y-auto ">
        {todos.length === 0 ? (
          <div>No Tasks.</div>
        ) : (
          <div>
            {todos.map((todo) => (
              <div
                key={todo._id}
                className=" flex items-center justify-between text-sm border  shadow rounded-md p-4 w-[100%]   my-1"
              >
                <div className=" flex items-center gap-4">
                  <div
                    className="text-blue text-base "
                    onClick={() => handleTaskUpdate(todo._id)}
                  >
                    {todo.done ? <IoCheckmarkCircleSharp /> : <BsCircle />}
                  </div>

                  <div className={todo.done ? 'line-through' : ''}>
                    {todo.task}
                  </div>
                </div>
                <div className=" flex items-center gap-4">
                  <div
                    className="text-blue text-base "
                    onClick={() => handleTaskEdit(todo._id)}
                  >
                    <GrEdit />
                  </div>

                  <div
                    className="text-blue text-base "
                    onClick={() => handleTaskDelete(todo._id)}
                  >
                    <RiDeleteBinLine />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
