export const SendPostRequest = async (url, body = {}, headers = {}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ ...body }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        ...headers,
      },
    });

    const responseData = await response?.json();

    if (!response.ok) {
      throw responseData;
    }

    return { responseData, response };
  } catch (error) {
    throw error;
  }
};

export const SendGetRequest = async (url, headers = {}) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        ...headers,
      },
    });

    const responseData = await response?.json();

    if (!response.ok) {
      throw responseData;
    }

    // console.log(responseData);

    return { responseData, response };
  } catch (error) {
    throw error;
  }
};
