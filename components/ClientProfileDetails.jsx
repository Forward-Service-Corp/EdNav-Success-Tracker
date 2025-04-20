import React, { useEffect, useState } from 'react';
import { useClients } from '/contexts/ClientsContext';

export default function ClientProfileDetails({ menuOpen, setMenuOpen }) {
    const {selectedClient} = useClients();
    const [actions, setActions] = useState([]); // actions are the activities
    const [hasTrackable, setHasTrackable] = useState([]);
    const [hasTrackableUpdated, setHasTrackableUpdated] = useState(false);
    const [hasTrackableCopy, setHasTrackableCopy] = useState([]);
    const [updated, setUpdated] = useState(false);

    let getActions;
    getActions = async () => {
        if (!selectedClient) return;
        try {
            await fetch(`/api/activities?clientId=${selectedClient._id}`)
              .then(response => response.json())
              .then(data => {
                  setActions(data);
              })
              .catch(error => console.error('Error fetching client activities:', error));
        } catch (error) {
            console.error('Error fetching client activities:', error);
        }
    };

    useEffect( () => {
        getActions().then()
    }, [selectedClient, setActions])
    
    useEffect(() => {
        if(selectedClient && selectedClient.trackable) {
            setHasTrackable(selectedClient.trackable.items)
            if (!hasTrackableUpdated){
                const copy = JSON.parse(JSON.stringify(selectedClient.trackable.items))
                setHasTrackableCopy(copy)
                setHasTrackableUpdated(true)
            }
        } else {
            setHasTrackable([])
        }
    }, [actions, selectedClient])

    return (
      <div className="relative">
      </div>

    );
}
