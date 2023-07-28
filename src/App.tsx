import { useEffect, useState } from 'react';
import './App.css';

interface BikepackingEvent {
  title: string;
  eventUrl: string;
  imgSrc: string;
  date: string;
  price: string;
  category: string;
  location: string;
  detail: string;
}

function App() {
  const [events, setEvents] = useState<BikepackingEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/events');
      const eventsJson = await res.json();
      setEvents(eventsJson);
      setLoading(false);
    })();
  }, []);

  return (
    <div className='app'>
      <div className='app-header'>
        <h1>bikepacking events</h1>
      </div>
      <div className='events'>
        {loading ? (
          <p>loading events from bikepacking.com ...</p>
        ) : events ? (
          events.map((event) => <p>{event.title}</p>)
        ) : (
          <p>none</p>
        )}
      </div>
    </div>
  );
}

export default App;
