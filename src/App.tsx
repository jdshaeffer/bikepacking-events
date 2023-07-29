import { useEffect, useState } from 'react';
import './App.css';

const devPath = 'http://localhost:8000/api/events';
const prodAPIPath = 'https://nycmud.com/api/events';
const prodFEPath = 'https://jdshaeffer.github.io/bikepacking-events';

interface BikepackingEvent {
  title: string;
  distance: string;
  eventUrl: string;
  date: string;
  price: string;
  category: string;
  location: string;
  detail: string;
}

function App() {
  const [events, setEvents] = useState<BikepackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [waitingStr, setWaitingStr] = useState('...');

  const getBikepackingEvents = async () => {
    setLoading(true);
    const res = await fetch(
      window.location.href === prodFEPath ? prodAPIPath : devPath,
      { mode: 'cors' }
    );
    const eventsJson = await res.json();
    setEvents(eventsJson);
    setLoading(false);
    localStorage.setItem('events', JSON.stringify(eventsJson));
  };

  useEffect(() => {
    if (localStorage.getItem('events')) {
      const eventsJsonString = '' + localStorage.getItem('events');
      setEvents(JSON.parse(eventsJsonString));
    } else {
      getBikepackingEvents();
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setInterval(() => {
        setWaitingStr(waitingStr + '.');
      }, 500);
    }
  });

  return (
    <div className='app'>
      <div className='app-header'>
        <h1>bikepacking events</h1>
      </div>
      <div className='filters'>
        <div className='title-field'></div>
        <div className='distance-group'></div>
        <div className='location-group'></div>
        <div className='price-group'></div>
        <div className='category-group'></div>
      </div>
      <div className='events'>
        {loading ? (
          <p>loading events from bikepacking.com{waitingStr}</p>
        ) : events ? (
          events.map((event) => (
            <a key={event.eventUrl} className='link' href={event.eventUrl}>
              <div key={event.title} className='event'>
                <p className='category-location'>
                  {event.category} / {event.location}
                </p>
                <p className='title'>
                  {event.title}
                  <span className='distance'>{event.distance}</span>
                </p>
                <p className='date-price'>
                  {event.date} {event.price !== '' ? `/ ${event.price}` : ''}
                </p>
                <p className='detail'>{event.detail}</p>
              </div>
            </a>
          ))
        ) : (
          <p>none</p>
        )}
      </div>
    </div>
  );
}

export default App;
