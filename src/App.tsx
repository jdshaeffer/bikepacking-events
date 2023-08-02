import { useEffect, useState } from 'react';
import DistanceFilter from './components/DistanceFilter';
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

// TODO: refresh events in background - load localstorage and then get new events... avoid repaint though - maybe just refresh button?
// TODO: actual filtering logic
// TODO: rest of filters
// TODO: ability to sort by filter category
// TODO: next/prev button - just returns that page's set of events
const App = () => {
  const [events, setEvents] = useState<BikepackingEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<BikepackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [waitingStr, setWaitingStr] = useState('...');

  const [distance, setDistance] = useState<number>();
  const [location, setLocation] = useState<string>();
  const [season, setSeason] = useState<string>();
  const [price, setPrice] = useState<string>();
  const [category, setCategory] = useState<string>();

  const getBikepackingEvents = async () => {
    setLoading(true);
    const res = await fetch(
      window.location.href === prodFEPath ? prodAPIPath : devPath,
      { mode: 'cors' },
    );
    const eventsJson = await res.json();
    setEvents(eventsJson);
    setFilteredEvents(eventsJson);
    setLoading(false);
    localStorage.setItem('events', JSON.stringify(eventsJson));
  };

  useEffect(() => {
    if (loading) {
      setInterval(() => {
        setWaitingStr(waitingStr + '.');
      }, 500);
    }
  });

  useEffect(() => {
    if (localStorage.getItem('events')) {
      const eventsJsonString = '' + localStorage.getItem('events');
      setEvents(JSON.parse(eventsJsonString));
      setFilteredEvents(JSON.parse(eventsJsonString));
    } else {
      getBikepackingEvents();
    }
  }, []);

  useEffect(() => {
    if (distance) {
      const eventsFilteredByDistance = events.filter((event) => {
        if (event.distance) {
          const d = +event.distance.split('/')[0].slice(0, -3);
          if (d <= distance) {
            return event;
          }
        }
      });
      setFilteredEvents(eventsFilteredByDistance);
    }
  }, [distance]);

  return (
    <div className='app'>
      <div className='app-header'>
        <span className='emoji' role='img' aria-label='bicycle emoji'>
          <h1>{String.fromCodePoint(0x1f6b5)}</h1>
        </span>
        <h1>bikepacking events</h1>
        <span className='emoji' role='img' aria-label='bicycle emoji'>
          <h1>{String.fromCodePoint(0x1f6b5)}</h1>
        </span>
      </div>
      <div className='filters'>
        <div className='filter'>
          <p>distance:</p>
          <DistanceFilter
            callback={(distance: number) => setDistance(distance)}
          />
        </div>
        <div className='filter'>
          <p>location:</p>
          <DistanceFilter
            callback={(distance: number) => setDistance(distance)}
          />
        </div>
        <div className='filter'>
          <p>season:</p>
          <DistanceFilter
            callback={(distance: number) => setDistance(distance)}
          />
        </div>
        <div className='filter'>
          <p>price:</p>
          <DistanceFilter
            callback={(distance: number) => setDistance(distance)}
          />
        </div>
        <div className='filter'>
          <p>category:</p>
          <DistanceFilter
            callback={(distance: number) => setDistance(distance)}
          />
        </div>
      </div>
      <div className='events'>
        {loading ? (
          <p>loading events from bikepacking.com{waitingStr}</p>
        ) : filteredEvents ? (
          filteredEvents.map((event) => (
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
};

export default App;
