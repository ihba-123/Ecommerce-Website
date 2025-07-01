import React from 'react';

export default function GrowingSpinner() {
  return (
    <span role="status" className="flex items-center justify-center py-0.5 px-11.5">
      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2  border-white border-r-transparent" />
    </span>
  );
}
