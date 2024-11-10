import { StarIcon } from "@heroicons/react/24/solid";

const RestaurantInfo = ({ restaurant }) => {
  const { name, location, status } = restaurant;

  return (
    <div className="flex justify-between items-center pb-4 border-b border-dashed">
      <div>
        <h2 className="text-xl font-bold my-2">{name}</h2>
        <p className="text-xs text-gray-500">{status}</p>
        {location.map((location, i) => {
          return (
            <p className="text-xs text-gray-500">
              {location.address}, {location.city}
            </p>
          );
        })}
      </div>
    </div>
  );
};
export default RestaurantInfo;
