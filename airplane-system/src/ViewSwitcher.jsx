import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const VIEWS = [
  'flights_in_the_air',
  'flights_on_the_ground',
  'people_in_the_air',
  'people_on_the_ground',
  'route_summary',
  'alternative_airports',
];

const TABLES = [
  'airline',
  'location',
  'airplane',
  'airport',
  'person',
  'passenger',
  'passenger_vacations',
  'leg',
  'route',
  'route_path',
  'flight',
  'pilot',
  'pilot_licenses',
];

const PROCEDURES = {
  add_airplane: ['ip_airlineID', 'ip_tail_num', 'ip_seat_capacity', 'ip_speed', 'ip_locationID', 'ip_plane_type', 'ip_maintenanced', 'ip_model', 'ip_neo'],
  add_airport: ['ip_airportID', 'ip_airport_name', 'ip_city', 'ip_state', 'ip_country', 'ip_locationID'],
  add_person: ['ip_personID', 'ip_first_name', 'ip_last_name', 'ip_locationID', 'ip_taxID', 'ip_experience', 'ip_miles', 'ip_funds'],
  grant_or_revoke_pilot_license: ['ip_personID', 'ip_license'],
  offer_flight: ['ip_flightID', 'ip_routeID', 'ip_support_airline', 'ip_support_tail', 'ip_progress', 'ip_next_time', 'ip_cost'],
  flight_landing: ['ip_flightID'],
  flight_takeoff: ['ip_flightID'],
  passengers_board: ['ip_flightID'],
  passengers_disembark: ['ip_flightID'],
  assign_pilot: ['ip_flightID', 'ip_personID'],
  recycle_crew: ['ip_flightID'],
  retire_flight: ['ip_flightID'],
  simulation_cycle: [],
};

const ViewSwitcher = () => {
  const [selectedView, setSelectedView] = useState(VIEWS[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});
  const [success, setSuccess] = useState(false);

  const isProcedure = PROCEDURES.hasOwnProperty(selectedView);
  const isWideView = selectedView === 'people_in_the_air';

  const fetchData = useCallback(async () => {
    if (isProcedure) return;
    setLoading(true);
    try {
      const { data: fetchedData } = await axios.get(`http://localhost:8080/api/${selectedView}`);
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedView, isProcedure]);

  useEffect(() => {
    setData([]);
    setSuccess(false);
    setParams({});
    fetchData();
  }, [selectedView, fetchData]);

  const handleExecuteProcedure = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      await axios.post(`http://localhost:8080/api/procedure/${selectedView}`, {
        params: Object.values(params),
      });
      setSuccess(true);
      setParams({});
      await fetchData();
    } catch (error) {
      console.error('Error executing procedure:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParamChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const renderTable = () => (
    <div className="w-full" style={isWideView ? { zoom: 0.9, transformOrigin: 'top left' } : {}}>
      <table className="w-full border-collapse border border-gray-300 text-xs">
        <thead>
          <tr>
            {data.length > 0 && Object.keys(data[0]).map(col => (
              <th key={col} className="border px-2 py-1 bg-gray-100 font-medium break-all whitespace-normal">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
              {Object.values(row).map((val, j) => (
                <td key={j} className="border px-2 py-1 break-all whitespace-normal" title={val}>
                  {String(val)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto px-2 py-4">
      <h1 className="text-lg font-semibold mb-4 text-center">Flight Tracking System</h1>

      <div className="flex justify-center mb-4">
        <select
          value={selectedView}
          onChange={(e) => setSelectedView(e.target.value)}
          className="text-sm p-2 border rounded"
        >
          <optgroup label="Views">
            {VIEWS.map(view => (
              <option key={view} value={view}>{view.replaceAll('_', ' ')}</option>
            ))}
          </optgroup>
          <optgroup label="Tables">
            {TABLES.map(table => (
              <option key={table} value={table}>{table.replaceAll('_', ' ')}</option>
            ))}
          </optgroup>
          <optgroup label="Procedures">
            {Object.keys(PROCEDURES).map(proc => (
              <option key={proc} value={proc}>{proc.replaceAll('_', ' ')}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {isProcedure ? (
        <div className="mb-6 p-4 bg-gray-50 rounded border">
          <h2 className="font-medium mb-3">Execute: {selectedView.replaceAll('_', ' ')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {PROCEDURES[selectedView].map(param => (
              <div key={param}>
                <label className="block text-sm mb-1">{param.replaceAll('_', ' ')}:</label>
                <input
                  type="text"
                  value={params[param] || ''}
                  onChange={(e) => handleParamChange(param, e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  placeholder={param}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleExecuteProcedure}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Executing...' : 'Execute Procedure'}
          </button>

          {success && <p className="mt-2 text-green-600 text-sm">Procedure executed successfully!</p>}
        </div>
      ) : loading ? (
        <p className="text-center text-sm">Loading data...</p>
      ) : data.length > 0 ? (
        renderTable()
      ) : (
        <p className="text-center text-sm">No data available</p>
      )}
    </div>
  );
};

export default ViewSwitcher;
