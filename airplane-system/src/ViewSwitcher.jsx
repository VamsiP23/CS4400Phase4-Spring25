import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VIEWS = [
  'flights_in_the_air',
  'flights_on_the_ground',
  'people_in_the_air',
  'people_on_the_ground',
  'route_summary',
  'alternative_airports'
];

const PROCEDURES = {
  'add_airplane': ['ip_airlineID', 'ip_tail_num', 'ip_seat_capacity', 'ip_speed', 'ip_locationID', 'ip_plane_type', 'ip_maintenanced', 'ip_model', 'ip_neo'],
  'add_airport': ['ip_airportID', 'ip_airport_name', 'ip_city', 'ip_state', 'ip_country', 'ip_locationID'],
  'add_person': ['ip_personID', 'ip_first_name', 'ip_last_name', 'ip_locationID', 'ip_taxID', 'ip_experience', 'ip_miles', 'ip_funds'],
  'grant_or_revoke_pilot_license' : ['ip_personID', 'ip_license'],
  'offer_flight' : ['ip_flightID', 'ip_routeID', 'ip_support_airline', 'ip_support_tail', 'ip_progress', 'ip_next_time', 'ip_cost'],
  'flight_landing' : ['ip_flightID'],
  'flight_takeoff' : ['ip_flightID'],
  'passengers_board': ['ip_flightID'],
  'passengers_disembark': ['ip_flightID'],
  'assign_pilot': ['ip_flightID', 'ip_personID'],
  'recycle_crew': ['ip_flightID'],
  'retire_flight': ['ip_flightID'],
  'simulation_cycle': []
  // Add other procedures with their parameters here
};

function ViewSwitcher() {
  const [selectedOption, setSelectedOption] = useState(VIEWS[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});
  const [isProcedure, setIsProcedure] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchViewData = async (viewName) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/${viewName}`);
      setData(res.data);
    } catch {
      setData([]);
    }
    setLoading(false);
  };

  const executeProcedure = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      await axios.post(
        `http://localhost:8080/api/procedure/${selectedOption}`,
        { params: Object.values(params) }
      );
      setSuccess(true);
      // Clear form after successful execution
      setParams({});
    } catch (error) {
      console.error("Procedure error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (VIEWS.includes(selectedOption)) {
      setIsProcedure(false);
      fetchViewData(selectedOption);
    } else {
      setIsProcedure(true);
    }
  }, [selectedOption]);

  return (
    <div className="container mx-auto px-2 py-4">
      <h1 className="text-lg font-semibold mb-4 text-center">
        Flight Tracking System
      </h1>

      <div className="flex justify-center mb-4">
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="text-sm p-2 border rounded"
        >
          <optgroup label="Views">
            {VIEWS.map(view => (
              <option key={view} value={view}>
                {view.replaceAll('_', ' ')}
              </option>
            ))}
          </optgroup>
          <optgroup label="Procedures">
            {Object.keys(PROCEDURES).map(proc => (
              <option key={proc} value={proc}>
                {proc.replaceAll('_', ' ')}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {isProcedure && (
        <div className="mb-6 p-4 bg-gray-50 rounded border">
          <h2 className="font-medium mb-3">
            Execute: {selectedOption.replaceAll('_', ' ')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {PROCEDURES[selectedOption]?.map(param => (
              <div key={param}>
                <label className="block text-sm mb-1">
                  {param.replaceAll('_', ' ')}:
                </label>
                <input
                  type="text"
                  value={params[param] || ''}
                  onChange={(e) => setParams({...params, [param]: e.target.value})}
                  className="w-full p-2 border rounded text-sm"
                  placeholder={param}
                />
              </div>
            ))}
          </div>

          <button
            onClick={executeProcedure}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Executing...' : 'Execute Procedure'}
          </button>

          {success && (
            <p className="mt-2 text-green-600 text-sm">
              Procedure executed successfully! Check MySQL Workbench for changes.
            </p>
          )}
        </div>
      )}

      {!isProcedure && (
        loading ? (
          <p className="text-center">Loading data...</p>
        ) : data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(data[0]).map(col => (
                    <th key={col} className="p-2 border text-left">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="p-2 border text-sm">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No data available</p>
        )
      )}
    </div>
  );
}

export default ViewSwitcher;
