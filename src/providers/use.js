import React, { useState, useEffect } from "react";

export function useSubscription(initialValue) {
  const [subsState, setSubState] = useState(initialValue);

  useEffect(() => () => {
    if (subsState && subsState.unsubscribe) {
      subsState.unsubscribe();
    }
  });

  return { subsState, setSubState };
}
