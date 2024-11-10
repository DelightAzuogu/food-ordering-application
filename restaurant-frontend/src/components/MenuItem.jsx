import React, { useEffect, useRef, useState } from "react";
import { BE_URL } from "../utils/constants";
import { SendFormDataPostRequest } from "../utils/sendRequests";

function MenuItem({ message, onClose, isEdit, item }) {
  const addImageRef = useRef(null);
  const [name, setName] = useState(isEdit ? item._doc.name : "");
  const [price, setPrice] = useState(isEdit ? item._doc.price : 0);
  const [description, setDescription] = useState(
    isEdit ? item._doc.description : ""
  );

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const file = addImageRef.current.files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image", file);

    try {
      const Url = !isEdit
        ? `${BE_URL}/menu/add-item`
        : `${BE_URL}/menu/edit-item/${item._doc._id}`;
      await SendFormDataPostRequest(Url, formData, {});

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md w-96">
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg">{message}</p>
          <button
            onClick={() => {
              onClose();
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            CLOSE
          </button>
        </div>

        <form onSubmit={(e) => handleAddSubmit(e)}>
          <div className="mb-2">
            <label htmlFor="name" className="block">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="price" className="block">
              Price:
            </label>
            <input
              step="0.01"
              min={0}
              type="number"
              id="price"
              name="price"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="description" className="block">
              Description:
            </label>
            <textarea
              id="price"
              name="price"
              rows={4}
              cols={40}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="image" className="block">
              Image:
            </label>
            <input
              ref={addImageRef}
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
            >
              {isEdit ? "Edit Item" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MenuItem;
