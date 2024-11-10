import React, { useEffect, useState } from "react";
import { BE_URL } from "../utils/constants";
import { SendGetRequest, SendJsonPostRequest } from "../utils/sendRequests";
import MenuItem from "../components/MenuItem";

const MenuItems = () => {
  const [menu, setMenu] = useState([]);
  const [showItemDialogue, setShowItemDialogue] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [item, setItem] = useState();

  async function fetchData() {
    try {
      const url = `${BE_URL}/menu/${localStorage.getItem("id")}`;
      const { responseData } = await SendGetRequest(url);
      setMenu(responseData.menuItems);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function closeDialogue() {
    setShowItemDialogue(false);
    fetchData();
  }

  function openDialogue(isEdit, item) {
    setIsEdit(isEdit);
    setItem(item);
    setShowItemDialogue(true);
  }

  async function handleDeleteSubmit(itemId) {
    try {
      const url = `${BE_URL}/menu/delete/${itemId}`;
      await SendJsonPostRequest(url);

      setMenu(menu.filter((item) => item.id === itemId));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      {menu.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-1/2 h-100 mx-auto">
          <div className="text-4xl">Empty Menu List</div>
          <button
            className="w-full mt-4 uppercase font-bold text-lg bg-orange-600 text-white text-center p-4 rounded-md transition duration-300 hover:bg-orange-700"
            onClick={() => openDialogue(false)}
          >
            Add Item
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-center items-center ">
            <button
              className="w-200 mt-4 uppercase font-bold text-lg bg-orange-600 text-white text-center p-4 rounded-md transition duration-300 hover:bg-orange-700"
              onClick={() => openDialogue(false)}
            >
              Add Item
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menu.map((item, i) => {
              function isURL(str) {
                const urlRegex =
                  /^(?:https?:\/\/)?(?:www\.)?[\w\-\.\+]+\.\w+(?:\/.*)?$/;
                return urlRegex.test(str);
              }

              var image = isURL(item.imageUrl)
                ? item.imageUrl
                : `${BE_URL}/menu/image/${item._doc._id}`;

              return (
                <div key={i} className="bg-blue rounded shadow-md p-4">
                  <img
                    src={image}
                    alt={item._doc.name}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    {item._doc.name}
                  </h3>
                  <h3 className="text-lg font-semibold mb-2">
                    {item._doc.price}
                  </h3>

                  <p className="text-gray-600 mb-4">{item._doc.description}</p>
                  <div className="flex justify-between items-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                      onClick={() => openDialogue(true, item)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => handleDeleteSubmit(item._doc._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {showItemDialogue && (
        <MenuItem
          onClose={closeDialogue}
          message={"Add Menu Item"}
          isEdit={isEdit}
          item={item}
        />
      )}
    </div>
  );
};

export default MenuItems;
