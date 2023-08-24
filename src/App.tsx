import { useEffect, useState } from 'react';
import DistanceFilter from './components/DistanceFilter';
import LocationFilter from './components/LocationFilter';
import DateFilter from './components/DateFilter';
import PriceFilter from './components/PriceFilter';
import CategoryFilter from './components/CategoryFilter';
import './App.css';

const devPath = 'http://localhost:8000/api/events';
const prodAPIPath = 'https://nycmud.com/api/events';
const prodFEPath = 'https://jdshaeffer.github.io/bikepacking-events/';

export interface BikepackingEvent {
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
// TODO: ability to sort by filter category
// TODO: next/prev button - just returns that page's set of events
// TODO: mobile screen styles
// TODO: bug in price filter
const App = () => {
  const [events, setEvents] = useState<BikepackingEvent[]>([]);
  const [filteredDistanceEvents, setFilteredDistanceEvents] = useState<
    Set<BikepackingEvent>
  >(new Set());
  const [filteredLocationEvents, setFilteredLocationEvents] = useState<
    Set<BikepackingEvent>
  >(new Set());
  const [filteredDateEvents, setFilteredDateEvents] = useState<
    Set<BikepackingEvent>
  >(new Set());
  const [filteredPriceEvents, setFilteredPriceEvents] = useState<
    Set<BikepackingEvent>
  >(new Set());
  const [filteredCategoryEvents, setFilteredCategoryEvents] = useState<
    Set<BikepackingEvent>
  >(new Set());
  const [filteredEvents, setFilteredEvents] = useState<BikepackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [waitingStr, setWaitingStr] = useState('...');

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
      const parsed = JSON.parse(eventsJsonString);
      setEvents(parsed);
      setFilteredDistanceEvents(new Set(parsed));
      setFilteredLocationEvents(new Set(parsed));
      setFilteredDateEvents(new Set(parsed));
      setFilteredPriceEvents(new Set(parsed));
      setFilteredCategoryEvents(new Set(parsed));
    } else {
      getBikepackingEvents();
    }
  }, []);

  // combine the intersection of all the filtered events
  useEffect(() => {
    const intersection = events.filter(
      (event) =>
        filteredDistanceEvents.has(event) &&
        filteredLocationEvents.has(event) &&
        filteredDateEvents.has(event) &&
        filteredPriceEvents.has(event) &&
        filteredCategoryEvents.has(event),
    );
    setFilteredEvents(intersection);
  }, [
    filteredDistanceEvents,
    filteredLocationEvents,
    filteredDateEvents,
    filteredPriceEvents,
    filteredCategoryEvents,
    events,
  ]);

  const getBikepackingEvents = async () => {
    setLoading(true);
    const res = await fetch(
      window.location.href === prodFEPath ? prodAPIPath : devPath,
      { mode: 'cors' },
    );
    const eventsJson = await res.json();
    setEvents(eventsJson);
    setFilteredDistanceEvents(new Set(eventsJson));
    setFilteredLocationEvents(new Set(eventsJson));
    setFilteredDateEvents(new Set(eventsJson));
    setFilteredPriceEvents(new Set(eventsJson));
    setFilteredCategoryEvents(new Set(eventsJson));
    setLoading(false);
    localStorage.setItem('events', JSON.stringify(eventsJson));
  };

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
        <DistanceFilter
          events={events}
          callback={(filteredEvents: BikepackingEvent[]) =>
            setFilteredDistanceEvents(new Set(filteredEvents))
          }
          sortCallback={(filter) => {
            // neutralize all other sorts here - only necessary to update the label, the filtered events will handle themselves
          }}
        />
        <LocationFilter
          events={events}
          callback={(filteredEvents: BikepackingEvent[]) =>
            setFilteredLocationEvents(new Set(filteredEvents))
          }
          sortCallback={(filter) => {}}
        />
        <DateFilter
          events={events}
          callback={(filteredEvents: BikepackingEvent[]) =>
            setFilteredDateEvents(new Set(filteredEvents))
          }
          sortCallback={(filter) => {}}
        />
        <PriceFilter
          events={events}
          callback={(filteredEvents: BikepackingEvent[]) =>
            setFilteredPriceEvents(new Set(filteredEvents))
          }
          sortCallback={(filter) => {}}
        />
        <CategoryFilter
          events={events}
          callback={(filteredEvents: BikepackingEvent[]) =>
            setFilteredPriceEvents(new Set(filteredEvents))
          }
          sortCallback={(filter) => {}}
        />
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
