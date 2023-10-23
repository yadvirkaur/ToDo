import { useEffect, useState } from 'react';
import TodoForm from './TodoForm'; // Importing the TodoForm component
import axios from 'axios'; // For making HTTP requests
import { AiOutlineUser } from 'react-icons/ai'; // User icon
import { BsCircle } from 'react-icons/bs'; // Empty circle icon
import { IoCheckmarkCircleSharp } from 'react-icons/io5'; // Checkmark circle icon
import { RiDeleteBinLine } from 'react-icons/ri'; // Delete bin icon
import { GrEdit } from 'react-icons/gr'; // Edit icon

// Define the structure of a single task
interface Todo {
  _id: string;
  task: string;
  done: boolean;
}

// Interface to specify the structure of updated task data
interface UpdatedData {
  done?: boolean;
  task?: string;
}

const apibaseurl = import.meta.env.VITE_REACT_APP_API_BASE_URL;

const Home = () => {
  // State to manage the list of tasks
  const [todos, setTodos] = useState<Todo[]>([]);

  // States to manage the currently edited task's ID & content
  const [editedTaskId, setEditedTaskId] = useState<string | null>(null);
  const [editedTaskContent, setEditedTaskContent] = useState<
    string | undefined
  >(undefined);

  // Fetch the list of tasks from the server when the component mounts
  useEffect(() => {
    axios
      .get(`${apibaseurl}todos`)
      .then((result) => setTodos(result.data))
      .catch((error) => console.log(error));
  }, [todos]); // Re-fetch when the 'todos' state changes

  // Function to update a task's data
  const handleTaskUpdate = (taskId: string, updatedData: UpdatedData) => {
    // Map through the tasks and update the specified task
    const updatedTodos = todos.map((todo) => {
      if (todo._id === taskId) {
        const updatedTodo = { ...todo, ...updatedData };

        // Send an HTTP PUT request to update the task on the server
        axios
          .put(`${apibaseurl}todos/${taskId}`, updatedTodo)
          .then((result) => console.log(result))
          .catch((error) => console.log(error));

        return updatedTodo;
      }
      return todo;
    });

    // Update the 'todos' state with the updated list
    setTodos(updatedTodos);
  };

  // Function to toggle the 'done' status of a task
  const handleTaskToggleDone = (taskId: string) => {
    handleTaskUpdate(taskId, {
      done: !todos.find((todo) => todo._id === taskId)?.done,
    });
  };

  // Function to edit a task
  const handleTaskEdit = (taskId: string) => {
    if (editedTaskId === taskId) {
      // Save the edited content
      handleTaskUpdate(taskId, { task: editedTaskContent });
      setEditedTaskId(null); // Exit editing mode
      setEditedTaskContent(undefined); // Clear the edited content
    } else {
      setEditedTaskId(taskId); // Enter editing mode for the specific task
      setEditedTaskContent(
        todos.find((todo) => todo._id === taskId)?.task || ''
      );
    }
  };

  // Function to delete a task
  const handleTaskDelete = (taskId: string) => {
    // Send an HTTP DELETE request to remove the task from the server
    axios
      .delete(`${apibaseurl}todos/${taskId}`)
      .then((result) => {
        const updatedTodos = todos.filter((todo) => todo._id !== taskId);
        setTodos(updatedTodos); // Update the task list after deletion
        console.log(result);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="relative main md:my-4 min-h-[60%] md:max-h-[90vh] flex flex-col mx-auto md:border md:rounded-md md:shadow">
      <div className="sticky z-10 top-0 bg-white">
        <div className="bg-blue p-4 flex justify-between between mb-6 md:rounded-t-md">
          <div className="text-white font-medium text-lg">ToDo List</div>
          <div className="text-white">
            <AiOutlineUser />
          </div>
        </div>
        <div className="px-4">
          {/* Render the TodoForm component for adding new tasks */}
          <TodoForm />
        </div>
      </div>

      <div className="p-4 md:overflow-y-auto">
        {todos.length === 0 ? (
          <div>No Tasks.</div>
        ) : (
          <div>
            {todos.map((todo) => (
              // Render a task item with various icons for actions
              <div
                key={todo._id}
                className="flex items-center justify-between text-sm border shadow rounded-md p-4 w-[100%] my-1"
              >
                <div className="flex items-center gap-4 w-[100%]">
                  <div
                    className="text-blue text-base"
                    onClick={() => handleTaskToggleDone(todo._id)}
                  >
                    {todo.done ? <IoCheckmarkCircleSharp /> : <BsCircle />}
                  </div>
                  {editedTaskId === todo._id ? (
                    <input
                      type="text"
                      value={editedTaskContent || ''}
                      onChange={(e) => setEditedTaskContent(e.target.value)}
                      className="w-[100%] outline-none"
                    />
                  ) : (
                    <div className={todo.done ? 'line-through' : ''}>
                      {todo.task}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="text-blue text-base"
                    onClick={() => handleTaskEdit(todo._id)}
                  >
                    {editedTaskId === todo._id ? 'Save' : <GrEdit />}
                  </div>

                  <div
                    className="text-blue text-base"
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
