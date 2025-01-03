import { useEffect, useState } from 'react';

export const ClientOnly = ({
  children,
}: {
  children: () => React.ReactNode;
}) => {
  const [isServer, setIsServer] = useState(true);
  useEffect(() => {
    setIsServer(false);
  }, []);
  return isServer ? null : children();
};
