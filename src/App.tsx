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

// TODO: next/prev button - currently is just returning the first page's events
// TODO: mobile screen styles
// TOOD: better loading
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
  const [refreshDistanceSort, setRefreshDistanceSort] = useState(false);
  const [refreshLocationSort, setRefreshLocationSort] = useState(false);
  const [refreshDateSort, setRefreshDateSort] = useState(false);
  const [refreshPriceSort, setRefreshPriceSort] = useState(false);
  const [refreshCategorySort, setRefreshCategorySort] = useState(false);

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

  // refresh the refresh
  useEffect(() => {
    setRefreshDistanceSort(false);
    setRefreshLocationSort(false);
    setRefreshDateSort(false);
    setRefreshPriceSort(false);
    setRefreshCategorySort(false);
  }, [
    refreshDistanceSort,
    refreshLocationSort,
    refreshDateSort,
    refreshPriceSort,
    refreshCategorySort,
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

  const handleGroupSort = (filter: string) => {
    type FilterDict = {
      [key: string]: () => void;
    };
    const filterDict: FilterDict = {
      distance: () => setRefreshDistanceSort(true),
      location: () => setRefreshLocationSort(true),
      date: () => setRefreshDateSort(true),
      price: () => setRefreshPriceSort(true),
      category: () => setRefreshCategorySort(true),
    };
    for (const f of Object.keys(filterDict)) {
      if (filter === f) {
        continue;
      }
      filterDict[f]();
    }
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
          sortCallback={(filter) => handleGroupSort(filter)}
          refreshSort={refreshDistanceSort}
        />
        <LocationFilter
          events={events}
          callback={(filteredEvents: BikepackingEvent[]) =>
            setFilteredLocationEvents(new Set(filteredEvents))
          }
          sortCallback={(filter) => handleGroupSort(filter)}
          refreshSort={refreshLocationSort}
        />
        <DateFilter
          events={events}
          callback={(filteredEvents: BikepackingEvent[]) =>
            setFilteredDateEvents(new Set(filteredEvents))
          }
          sortCallback={(filter) => handleGroupSort(filter)}
          refreshSort={refreshDateSort}
        />
        <PriceFilter
          events={events}
          callback={(filteredEvents: BikepackingEvent[]) =>
            setFilteredPriceEvents(new Set(filteredEvents))
          }
          sortCallback={(filter) => handleGroupSort(filter)}
          refreshSort={refreshPriceSort}
        />
        <CategoryFilter
          events={events}
          callback={(filteredEvents: BikepackingEvent[]) =>
            setFilteredPriceEvents(new Set(filteredEvents))
          }
          sortCallback={(filter) => handleGroupSort(filter)}
          refreshSort={refreshCategorySort}
        />
      </div>
      <div className='refresh-button-wrapper'>
        <button className='refresh-button' onClick={getBikepackingEvents}>
          refresh
        </button>
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
