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

function ViewSwitcher() {
  const [selectedView, setSelectedView] = useState(VIEWS[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const isWideView = selectedView === 'people_in_the_air';

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

  useEffect(() => {
    fetchViewData(selectedView);
  }, [selectedView]);

  return (
    <div className="container mx-auto px-2 py-4">
      <h1 className="text-lg font-semibold mb-4 text-center">
        Flight Tracking Views
      </h1>

      <div className="flex justify-center mb-4">
        <select
          value={selectedView}
          onChange={e => setSelectedView(e.target.value)}
          className="text-sm p-1 border rounded"
        >
          {VIEWS.map(view => (
            <option key={view} value={view}>
              {view.replaceAll('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-sm">Loading…</p>
      ) : data.length > 0 ? (
        <div
          className="w-full"
          style={isWideView ? { zoom: 0.9, transformOrigin: 'top left' } : {}}
        >
          <table className="table-fixed w-full border-collapse border border-gray-300 text-xs">
            <thead>
              <tr>
                {Object.keys(data[0]).map(col => (
                  <th
                    key={col}
                    className="border px-2 py-1 bg-gray-100 font-medium break-all whitespace-normal"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr
                  key={i}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                >
                  {Object.values(row).map((val, j) => (
                    <td
                      key={j}
                      className="border px-2 py-1 break-all whitespace-normal"
                      title={val}
                    >
                      {val?.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-sm">No data available.</p>
      )}
    </div>
  );
}

export default ViewSwitcher;
