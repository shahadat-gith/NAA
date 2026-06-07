import React from 'react';
import { useSearchParams } from 'react-router-dom';

import actionConfig, { getActionComponent } from '../components/actions/actions';

const Action = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const ActionComponent = getActionComponent(type);

  if (!ActionComponent) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
            Action Not Found
          </h1>
          <p className="text-[var(--text-muted)] text-lg">
            The action type <span className="font-mono text-red-500">"{type}"</span> does not exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-8 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-medium hover:bg-[var(--color-primary-bright)] transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <ActionComponent
      // You can pass common props here
      onSuccess={() => window.history.back()}
      // Add more dynamic props if needed from searchParams
    />
  );
};

export default Action;