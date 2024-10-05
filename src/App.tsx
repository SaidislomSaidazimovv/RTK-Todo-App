import { useState, Fragment } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import {
  addTodo,
  deleteTodo,
  toggleTodo,
  editTodo,
} from "./features/todoSlice";
import { Transition, Dialog } from "@headlessui/react";

const App = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const todos = useAppSelector((state) => state.todos.todos);
  const dispatch = useAppDispatch();

  const handleAddTodo = () => {
    if (text.trim()) {
      setLoading(true);
      setTimeout(() => {
        dispatch(addTodo(text));
        setText("");
        setLoading(false);
      }, 500);
    }
  };

  const handleEditTodo = (id: number, currentText: string) => {
    setEditId(id);
    setEditText(currentText);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editId !== null) {
      dispatch(editTodo({ id: editId, newText: editText }));
      closeEditModal();
    }
  };

  const handleDeleteTodo = (id: number) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      dispatch(deleteTodo(deleteId));
      closeDeleteModal();
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditId(null);
    setEditText("");
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Todo App</h1>
        <form
          className="flex mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTodo();
          }}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Add new Todo..."
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-r-lg transition-transform transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>

        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Todo</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo, index) => (
              <Transition
                key={todo.id}
                show={true}
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <tr className="border-t border-gray-300">
                  <td className="py-2 px-4 text-center">{index + 1}</td>
                  <td
                    className={`py-2 px-4 max-w-xs truncate ${
                      todo.completed ? "line-through text-green-500" : ""
                    } cursor-pointer`}
                    onClick={() => dispatch(toggleTodo(todo.id))}
                  >
                    {todo.text}
                  </td>
                  <td className="py-2 px-4 flex justify-center gap-4">
                    <button
                      onClick={() => handleEditTodo(todo.id, todo.text)}
                      className="text-blue-500 hover:text-blue-700 transition-transform transform hover:scale-110"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700 transition-transform transform hover:scale-110"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </Transition>
            ))}
          </tbody>
        </table>

        <Transition appear show={isEditModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeEditModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Edit Todo
                    </Dialog.Title>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none"
                        placeholder="Edit Todo..."
                      />
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                        onClick={handleSaveEdit}
                      >
                        Change
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        onClick={closeEditModal}
                      >
                        No
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Transition appear show={isDeleteModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeDeleteModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Do you want to delete this Todo
                    </Dialog.Title>
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        onClick={confirmDelete}
                      >
                        Yes, delete
                      </button>
                      <button
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                        onClick={closeDeleteModal}
                      >
                        No
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default App;
