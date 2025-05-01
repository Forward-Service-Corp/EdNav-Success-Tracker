import { useSession } from 'next-auth/react';
import { useContext, useEffect } from 'react';
import { NavigatorContext } from '../contexts/NavigatorsContext';

export default function useSetNavigatorFromSession() {
  const { data: session, status } = useSession();
  const { setSelectedNavigator } = useContext(NavigatorContext);

  useEffect(() => {
    if (status === 'authenticated') {
      const userLevel = session?.user?.level?.toLowerCase();
      const username = session?.user?.name;
      if (['navigator', 'admin'].includes(userLevel)) {
        setSelectedNavigator(username);
      }
    }
  }, [status, session, setSelectedNavigator]);
}