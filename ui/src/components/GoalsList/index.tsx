import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import { create,activeGoalsSelector } from '../../slices/goals';

function GoalsList() {
  const dispatch = useAppDispatch();
  const activeGoals = useSelector(activeGoalsSelector);

  const [isCreating, setIsCreating] = useState(false);
  const [createDescription, setCreateDescription] = useState('');

  async function handleCreateSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    try {
      setIsCreating(false);
      await dispatch(create({
        description: createDescription,
        deadline: Math.round(new Date().getTime() / 1000) + 3600
      }));
    } catch (e) {
      // TODO: Handle this error
    }
    setIsCreating(false);
  }

  return (
    <div>
      {activeGoals.length === 0 ? 'No goals!' : (
        <ul>
          {activeGoals.map((v) => (
            <li key={v.id}>{`Goal #${v.id}: ${v.goal.description}`}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleCreateSubmit}>
        <input
          type="text"
          name="description"
          onChange={(ev) => setCreateDescription(ev.target.value)}
          value={createDescription}
        />
        <input
          type="submit"
          value={isCreating ? 'Creating...' : 'Create'}
          disabled={isCreating}
        />
      </form>
    </div>
  );
}

export default GoalsList;
