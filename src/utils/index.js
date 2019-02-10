export const alterPairs = (pairs, user) => {
  if (!pairs) return [];
  const auxPairs = Array.from(pairs);
  return auxPairs.map(pair => {
    const myPair = pair.members.filter(
      ({ nickname }) => nickname !== user.nickname
    );
    return { ...pair, members: myPair };
  });
};

export const pairIsMine = (pairAdded, user) => {
  const auxMembers = Array.from(pairAdded.members);
  const insidePair = auxMembers.some(
    member => member.nickname === user.nickname
  );

  return insidePair;
};
