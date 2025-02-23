import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  assignees: string[];
  completed: boolean;
}

interface Project {
  id: number;
  title: string;
  tasks: Task[];
  availableAssignees: string[];
}

const ProjectManagementTool: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (selectedProject) {
      setSelectedTask(null);
    }
  }, [selectedProject]);

  const handleAddProject = () => {
    const newProject: Project = {
      id: projects.length + 1,
      title: newProjectTitle,
      tasks: [],
      availableAssignees: []
    };
    setProjects([...projects, newProject]);
    setNewProjectTitle('');
  };

  const handleAddAssignee = () => {
    if (selectedProject) {
      selectedProject.availableAssignees.push(newAssignee);
      setProjects([...projects]);
      setNewAssignee('');
    }
  };

  const handleAddTask = () => {
    if (selectedProject) {
      const newTask: Task = {
        id: selectedProject.tasks.length + 1,
        title: newTaskTitle,
        description: newTaskDescription,
        dueDate: newTaskDueDate,
        assignees: selectedAssignee ? [selectedAssignee] : [],
        completed: false,
      };
      selectedProject.tasks.push(newTask);
      setProjects([...projects]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDueDate('');
      setSelectedAssignee('');
    }
  };

  const handleCompleteTask = (task: Task) => {
    if (selectedProject) {
      const updatedTasks = selectedProject.tasks.map((t) =>
        t.id === task.id ? { ...t, completed: true } : t
      );
      selectedProject.tasks = updatedTasks;
      setProjects([...projects]);
    }
  };

  const handleDeleteTask = (task: Task) => {
    if (selectedProject) {
      const updatedTasks = selectedProject.tasks.filter((t) => t.id !== task.id);
      selectedProject.tasks = updatedTasks;
      setProjects([...projects]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Project Management Tool</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
        <input
          type="text"
          value={newProjectTitle}
          onChange={(e) => setNewProjectTitle(e.target.value)}
          placeholder="New Project Title"
          className="w-full md:w-1/2 p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
        />
        <button
          onClick={handleAddProject}
          className="w-full md:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {projects.map((project) => (
          <div key={project.id} className="p-4 border border-gray-300 rounded bg-white">
            <h2 className="text-xl font-bold mb-2">{project.title}</h2>
            <ul>
              {project.tasks.map((task) => (
                <li key={task.id} className="mb-2">
                  <span
                    className={`text-lg ${
                      task.completed ? 'text-gray-300 line-through' : 'text-gray-700'
                    }`}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => handleCompleteTask(task)}
                    className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task)}
                    className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedProject(project)}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto"
            >
              View Tasks
            </button>
          </div>
        ))}
      </div>

      {selectedProject && (
        <>
          <div className="p-4 border border-gray-300 rounded bg-white mb-4">
            <h2 className="text-xl font-bold mb-2">Add Assignees to {selectedProject.title}</h2>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <input
                type="text"
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                placeholder="New Assignee Name"
                className="w-full md:flex-1 p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              />
              <button
                onClick={handleAddAssignee}
                className="w-full md:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Assignee
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-300 rounded bg-white">
            <h2 className="text-xl font-bold mb-2">Add Task to {selectedProject.title}</h2>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task Title"
                className="p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              />
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Task Description"
                className="p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              />
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                placeholder="Due Date"
                className="p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              />
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              >
                <option value="">Select Assignee</option>
                {selectedProject.availableAssignees.map((assignee) => (
                  <option key={assignee} value={assignee}>
                    {assignee}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddTask}
                className="w-full md:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Task
              </button>
            </div>
          </div>
        </>
      )}

      <div className="mt-6">
        <LineChart
          width={500}
          height={300}
          data={projects.map((project) => ({
            name: project.title,
            tasks: project.tasks.length,
          }))}
          className="mx-auto"
        >
          <Line type="monotone" dataKey="tasks" stroke="#8884d8" />
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
          <Legend />
        </LineChart>
      </div>
    </div>
  );
};

export default ProjectManagementTool;
