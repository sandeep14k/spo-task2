import React, { useEffect, useState } from 'react';

const CACHE_KEY = 'planet-data';
const CACHE_EXPIRATION_KEY = 'planet-data-expiration';
const CACHE_DURATION = 60 * 60 * 1000; 

const FetchData = () => {
  const [planet, setPlanet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanet = async () => {
      setLoading(true);
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedExpiration = localStorage.getItem(CACHE_EXPIRATION_KEY);

        if (cachedData && cachedExpiration && new Date().getTime() < cachedExpiration) {
          setPlanet(JSON.parse(cachedData));
          setLoading(false);
        } else {
          const response = await fetch('https://swapi.dev/api/planets/1/');
          const data = await response.json();
          setPlanet(data);
          setLoading(false);
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          localStorage.setItem(CACHE_EXPIRATION_KEY, new Date().getTime() + CACHE_DURATION);
        }
      } catch (error) {
        console.error('Error fetching planet data:', error);
        setLoading(false);
      }
    };

    fetchPlanet();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!planet) {
    return <div>Error loading planet data.</div>;
  }

  return (
    <div>
      <h2>{planet.name}</h2>
      <p>Climate: {planet.climate}</p>
      <p>Terrain: {planet.terrain}</p>
      <p>Population: {planet.population}</p>
     
    </div>
  );
};

export default FetchData;
