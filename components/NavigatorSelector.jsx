"use client";
import { useEffect } from 'react';
import { useNavigators } from '/contexts/NavigatorsContext';
import { useSession } from 'next-auth/react';

function NavigatorSelector() {
  const { selectedNavigator, setSelectedNavigator } = useNavigators();
  const session = useSession();

  const navigatorNames = [
    { name: 'All', id: '' },
    { name: 'Andrew McCauley', id: '677e2852b19820275b00c061' },
    { name: 'Ashleigh Chesney', id: '67b4418653573b52275ce0cb' },
    { name: 'Corine Boelk', id: '67ef15a26f5242a3b5153f32' },
    { name: 'Hailey Jester', id: '67b4414e53573b52275ce0ca' },
    { name: 'Kecia Thompson-Gordon', id: '67b4424f53573b52275ce0cf' },
    { name: 'Marissa Foth', id: '67e9614a74cc11c0dff9e172' },
    { name: 'Morgan Sole', id: '67b4418653573b52275ce0cb' },
    { name: 'Rachael Banerdt', id: '67b441dc53573b52275ce0cd' },
    { name: 'Rich Basche', id: '67b441ad53573b52275ce0cc' },
    { name: 'Sara Jackson', id: '67eaa1d0f0d0003549891ba9' },
    { name: 'Stacy Martinez', id: '67b4410753573b52275ce0c9' },
    { name: 'Trevor Brunette', id: '67eab2ceb13b898d7f56ec21' },
  ];

  const getNavigatorData = async (navigator) => {
    try {
      const response = await fetch(`/api/education-navigators?navigator=${navigator}`);
      const data = await response.json();
      await setSelectedNavigator(data);
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(() => {
    getNavigatorData(session?.data?.user?.name).then();
  }, [session])

  return (
    <div>
      <select
        id="navigator-select"
        value={selectedNavigator?.name}
        className="select select-accent"
        onChange={async (e) => {
          if(e.target.value === "All") return setSelectedNavigator(
            {
              name: 'All',
            }
          )
          const response = await fetch(`/api/education-navigators?navigator=${e.target.value}`);
          const data = await response.json();
          await setSelectedNavigator(data);
        }}
      >
        <option value="" disabled>Select a navigator</option>
        {navigatorNames.map((nav) => (
          <option key={nav.name} value={nav.name}>
            {nav.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default NavigatorSelector;
