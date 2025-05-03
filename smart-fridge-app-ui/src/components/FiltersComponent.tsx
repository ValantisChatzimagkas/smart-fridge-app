import { useState, useEffect } from 'react';
import { Filter, X, Check } from 'lucide-react';
import { BASE_URL } from "../constants";

type FilterState = {
  expired: boolean;
  not_expired: boolean;
  close_to_expire: boolean;
};

interface FiltersComponentProps {
  setIngredientsList: React.Dispatch<React.SetStateAction<any[]>>;

}

const ToggleableFilterComponent = ({ setIngredientsList }: FiltersComponentProps) => {

  const [filters, setFilters] = useState<FilterState>({
    expired: false,
    not_expired: false,
    close_to_expire: false,
  });
  

  const [showFilters, setShowFilters] = useState<boolean>(false);
  
 
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  
  const allSelected = filters.expired && filters.not_expired && filters.close_to_expire;
  
  const toggleFilter = (key: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  const toggleAll = () => {
    const newValue = !allSelected;
    setFilters({
      expired: newValue,
      not_expired: newValue,
      close_to_expire: newValue,
    });
  };
  
  const toggleFilterModal = () => {
    setShowFilters(!showFilters);
  };
  
  useEffect(() => {
    console.log("Current filters:", filters);
  }, [filters]);
  
  const fetchDataWithFilters = async () => {
    const appliedFilters = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key]) => `ingredient_status=${key}`)
      .join('&');
      
    if (appliedFilters !== "") {
      const ingredientsEndpoint = `${BASE_URL}/ingredient/all?${appliedFilters}`;
      const requestOptions = {
        method: 'GET',
        headers: {
          accept: 'application/json',
        }
      };
      
      try {
        const response = await fetch(ingredientsEndpoint, requestOptions);
        if (!response.ok) {
          throw new Error('Failed to fetch ingredients');
        }
        const data = await response.json();
        setIngredientsList(data || []);
        setShowFilters(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIngredientsList([]);
      }
    } else {
      setIngredientsList([]);
    }
  };
  
  const resetFilters = () => {
    setFilters({
      expired: false,
      not_expired: false,
      close_to_expire: false,
    });
  };

  return (
    <div className="relative">
      <button
        onClick={toggleFilterModal}
        className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 relative"
        title="Toggle Filters"
      >
        <Filter className="w-5 h-5" />
        {activeFiltersCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-4 relative">
            <button 
              onClick={toggleFilterModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-semibold mb-4 text-white">Filter Options</h2>
            
            <div className="space-y-3">
              <Toggle label="Expired" checked={filters.expired} onChange={() => toggleFilter("expired")} />
              <Toggle label="Not Expired" checked={filters.not_expired} onChange={() => toggleFilter("not_expired")} />
              <Toggle label="Close to Expire" checked={filters.close_to_expire} onChange={() => toggleFilter("close_to_expire")} />
              <hr className="my-2 border-gray-600" />
              <Toggle label="Toggle All" checked={allSelected} onChange={toggleAll} />
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center"
                onClick={resetFilters}
              >
                Reset
              </button>
              
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                onClick={fetchDataWithFilters}
              >
                <Check className="w-4 h-4 mr-2" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-white">{label}</span>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-green-600" : "bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleableFilterComponent;