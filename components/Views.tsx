import React, { useState } from 'react';
import { AppState, User, Task } from '../types';
import { Button } from './Button';
import { Setup } from './Auth';
import { Input } from './Input';
import { Card } from './Card';
import {
  CheckCircle,
  Clock,
  DollarSign,
  Trash2,
  Plus,
  X,
  User as UserIcon,
  AlertCircle,
  Wallet,
  CheckSquare,
  Phone,
  Users,
} from 'lucide-react';
import { generateId } from '../utils/id';

// -------------------------------
// TASK MANAGER
// -------------------------------

interface TaskManagerProps {
  currentUser: User;
  users: User[];
  tasks: Task[];
  onStateChange: (newState: Partial<AppState>) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  currentUser,
  users,
  tasks,
  onStateChange,
}) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    reward: 10,
    assignedToId: '',
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.assignedToId) return;

    const task: Task = {
      id: generateId(),
      title: newTask.title.trim(),
      description: newTask.description.trim() || undefined,
      reward: newTask.reward,
      assignedToId: newTask.assignedToId,
      status: 'pending',
      createdAt: Date.now(),
    };

    onStateChange({ tasks: [...tasks, task] });

    setNewTask({
      title: '',
      description: '',
      reward: 10,
      assignedToId: '',
    });

    setIsCreating(false);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    onStateChange({ tasks: tasks.filter((task) => task.id !== taskId) });
  };

  const assignedToName = (task: Task) => {
    const user = users.find((u) => u.id === task.assignedToId);
    return user?.name ?? 'Unknown';
  };

  const isParent = currentUser.role === 'parent';
  const myTasks = isParent
    ? tasks
    : tasks.filter((task) => task.assignedToId === currentUser.id);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-emerald-400" />
            {isParent ? 'Family tasks' : 'My tasks'}
          </h2>
          <p className="text-xs text-slate-400">
            {isParent
              ? 'Create tasks and assign them to your kids. Approve completed tasks to add to their allowance.'
              : 'Complete your tasks and send them for approval to earn your allowance.'}
          </p>
        </div>

        {isParent && (
          <Button size="sm" onClick={() => setIsCreating(true)}>
            <Plus className="h-3 w-3 mr-1" />
            New task
          </Button>
        )}
      </div>

      {/* Create Task Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur">
          <div className="w-full max-w-md p-4">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <Plus className="h-4 w-4 text-emerald-400" />
                    Create task
                  </h3>
                  <p className="text-xs text-slate-400">
                    Assign a new task to one of your kids
                  </p>
                </div>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Task title
                  </label>
                  <Input
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Clean your room"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    className="w-full rounded-lg bg-slate-900/70 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                    rows={3}
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Pick up all toys and vacuum the floor"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Reward (kr)
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={newTask.reward}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          reward: Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Assign to
                    </label>
                    <select
                      className="w-full rounded-lg bg-slate-900/70 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      value={newTask.assignedToId}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          assignedToId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select child...</option>
                      {users
                        .filter((u) => u.role === 'child')
                        .map((child) => (
                          <option key={child.id} value={child.id}>
                            {child.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Create task
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="grid gap-3">
        {myTasks.length === 0 ? (
          <Card className="p-4 text-center text-xs text-slate-400">
            {isParent
              ? "No tasks yet. Create your first task to get started!"
              : "You don't have any tasks assigned right now."}
          </Card>
        ) : (
          myTasks.map((task) => (
            <Card key={task.id} className="p-3">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xs font-semibold text-slate-100">
                      {task.title}
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                      {task.status === 'pending' && (
                        <>
                          <Clock className="h-3 w-3 mr-1 text-sky-400" />
                          Not started
                        </>
                      )}
                      {task.status === 'waiting_for_approval' && (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1 text-amber-400" />
                          Waiting for approval
                        </>
                      )}
                      {task.status === 'completed' && (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1 text-emerald-400" />
                          Approved
                        </>
                      )}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-[11px] text-slate-300 mb-1">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-emerald-400" />
                      {task.reward} kr
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <UserIcon className="h-3 w-3 text-slate-500" />
                      {assignedToName(task)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {currentUser.role === 'child' && task.status === 'pending' && (
                    <Button
                      size="xs"
                      onClick={() => {
                        const updated = tasks.map((t) =>
                          t.id === task.id
                            ? { ...t, status: 'waiting_for_approval' }
                            : t
                        );
                        onStateChange({ tasks: updated });
                      }}
                    >
                      Mark done
                    </Button>
                  )}

                  {currentUser.role === 'parent' &&
                    task.status === 'waiting_for_approval' && (
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          variant="secondary"
                          onClick={() => {
                            const updated = tasks.map((t) =>
                              t.id === task.id
                                ? { ...t, status: 'completed' }
                                : t
                            );
                            const child = users.find(
                              (u) => u.id === task.assignedToId
                            );

                            if (!child) return;

                            const updatedUsers = users.map((u) =>
                              u.id === child.id
                                ? {
                                    ...u,
                                    balance: (u.balance ?? 0) + task.reward,
                                    totalEarned:
                                      (u.totalEarned ?? 0) + task.reward,
                                  }
                                : u
                            );

                            onStateChange({
                              tasks: updated,
                              users: updatedUsers,
                            });
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => {
                            const updated = tasks.map((t) =>
                              t.id === task.id
                                ? { ...t, status: 'pending' }
                                : t
                            );
                            onStateChange({ tasks: updated });
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    )}

                  {currentUser.role === 'parent' && (
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// -------------------------------
// FAMILY MANAGER
// -------------------------------

interface FamilyManagerProps {
  currentUser: User;
  users: User[];
  onStateChange: (newState: Partial<AppState>) => void;
  onNavigate: (view: 'tasks' | 'family') => void;
}

export const FamilyManager: React.FC<FamilyManagerProps> = ({
  currentUser,
  users,
  onStateChange,
  onNavigate,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const parents = users.filter((u) => u.role === 'parent');
  const children = users.filter((u) => u.role === 'child');

  const selectedUser = selectedUserId
    ? users.find((u) => u.id === selectedUserId)
    : null;

  const handleBalanceUpdate = (userId: string, delta: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const updatedUsers = users.map((u) =>
      u.id === userId
        ? {
            ...u,
            balance: Math.max(0, (u.balance ?? 0) + delta),
          }
        : u
    );

    onStateChange({ users: updatedUsers });
  };

  const handlePayOut = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user || (user.balance ?? 0) <= 0) return;

    const updatedUsers = users.map((u) =>
      u.id === userId
        ? {
            ...u,
            balance: 0,
          }
        : u
    );

    onStateChange({ users: updatedUsers });
  };

  const handleRemoveUser = (userId: string) => {
    if (!confirm('Are you sure you want to remove this family member?')) return;
    const updatedUsers = users.filter((u) => u.id !== userId);
    onStateChange({ users: updatedUsers });

    if (selectedUserId === userId) {
      setSelectedUserId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-400" />
            Family overview
          </h2>
          <p className="text-xs text-slate-400">
            See all family members, balances and manage allowance payments
          </p>
        </div>

      </div>

      {/* Children Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {children.map((child) => (
          <Card key={child.id} variant="interactive" className="relative">
            <div className="absolute right-0 top-0 w-24 h-24 bg-primary-500/10 rounded-bl-full blur-2xl"></div>

            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center">
                      <span className="text-sm">
                        {child.avatar || '👤'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-1">
                        {child.name}
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        {child.role === 'child' ? 'Child' : 'Parent'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-[11px] text-slate-300">
                    <div className="inline-flex items-center gap-1">
                      <Wallet className="h-3 w-3 text-emerald-400" />
                      <span className="font-semibold text-emerald-300">
                        {child.balance ?? 0} kr
                      </span>
                      <span className="text-slate-500 ml-1">current balance</span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-slate-400">
                      <DollarSign className="h-3 w-3 text-sky-400" />
                      <span>
                        Earned{' '}
                        <span className="font-semibold text-sky-300">
                          {child.totalEarned ?? 0} kr
                        </span>{' '}
                        total
                      </span>
                    </div>
                    {child.phoneNumber && (
                      <div className="inline-flex items-center gap-1 text-slate-400">
                        <Phone className="h-3 w-3 text-slate-500" />
                        <span>{child.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="text-xs text-slate-400 hover:text-slate-100"
                  onClick={() => setSelectedUserId(child.id)}
                >
                  Details
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800 mt-1 pt-2">
                <div className="flex gap-1">
                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => handleBalanceUpdate(child.id, 10)}
                  >
                    +10 kr
                  </Button>
                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => handleBalanceUpdate(child.id, 20)}
                  >
                    +20 kr
                  </Button>
                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => handleBalanceUpdate(child.id, -10)}
                  >
                    -10 kr
                  </Button>
                </div>
                <Button
                  size="xs"
                  variant="primary"
                  onClick={() => handlePayOut(child.id)}
                  disabled={!child.balance || child.balance <= 0}
                >
                  Pay out
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Parents List */}
      {parents.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1">
            <UserIcon className="h-3 w-3 text-slate-400" />
            Parents
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {parents.map((parent) => (
              <Card key={parent.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center">
                    <span className="text-sm">{parent.avatar || '👤'}</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-100">
                      {parent.name}
                    </div>
                    <div className="text-[10px] text-slate-400">Parent</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRemoveUser(parent.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>

                  {parent.phoneNumber && (
                    <a
                      href={`tel:${parent.phoneNumber}`}
                      className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600"
                    >
                      <Phone size={12} />
                      Call
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Selected child details (sidebar/modal) */}
      {selectedUser && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/80 backdrop-blur">
          <div className="w-full max-w-md p-4">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-emerald-400" />
                    {selectedUser.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedUser.role === 'child' ? 'Child' : 'Parent'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUserId(null)}
                  className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col gap-1 text-[11px] text-slate-300">
                  <div className="inline-flex items-center gap-1">
                    <Wallet className="h-3 w-3 text-emerald-400" />
                    <span className="font-semibold text-emerald-300">
                      {selectedUser.balance ?? 0} kr
                    </span>
                    <span className="text-slate-500 ml-1">
                      current balance
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1 text-slate-400">
                    <DollarSign className="h-3 w-3 text-sky-400" />
                    <span>
                      Earned{' '}
                      <span className="font-semibold text-sky-300">
                        {selectedUser.totalEarned ?? 0} kr
                      </span>{' '}
                      total
                    </span>
                  </div>
                  {selectedUser.phoneNumber && (
                    <div className="inline-flex items-center gap-1 text-slate-400">
                      <Phone className="h-3 w-3 text-slate-500" />
                      <span>{selectedUser.phoneNumber}</span>
                    </div>
                  )}
                </div>

                {selectedUser.role === 'child' && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                    <div className="text-[11px] text-slate-400">
                      Quick balance adjustments
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => handleBalanceUpdate(selectedUser.id, 10)}
                      >
                        +10 kr
                      </Button>
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => handleBalanceUpdate(selectedUser.id, 20)}
                      >
                        +20 kr
                      </Button>
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => handleBalanceUpdate(selectedUser.id, -10)}
                      >
                        -10 kr
                      </Button>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="xs"
                        variant="primary"
                        onClick={() => handlePayOut(selectedUser.id)}
                        disabled={
                          !selectedUser.balance || selectedUser.balance <= 0
                        }
                      >
                        Pay out to {selectedUser.name}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-slate-800 mt-2">
                  <button
                    onClick={() => handleRemoveUser(selectedUser.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={14} />
                    Remove from family
                  </button>

                  {selectedUser.phoneNumber && (
                    <a
                      href={`tel:${selectedUser.phoneNumber}`}
                      className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600"
                    >
                      <Phone size={12} />
                      Call
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------
// ROOT VIEW DECIDER
// -------------------------------

interface RootViewProps {
  state: AppState;
  currentUser: User | null;
  onStateChange: (update: Partial<AppState>) => void;
  onNavigate: (view: 'tasks' | 'family') => void;
}

export const RootView: React.FC<RootViewProps> = ({
  state,
  currentUser,
  onStateChange,
  onNavigate,
}) => {
  if (!state.users.length) {
    return <Setup onStateChange={onStateChange} />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-300">
          Please sign in to see your family&apos;s Veckopeng.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TaskManager
        currentUser={currentUser}
        users={state.users}
        tasks={state.tasks}
        onStateChange={onStateChange}
      />
      {currentUser.role === 'parent' && (
        <FamilyManager
          currentUser={currentUser}
          users={state.users}
          onStateChange={onStateChange}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
