import { fetchUtils } from "react-admin";

const apiUrl = "https://apimb2-production.up.railway.app/api";

const httpClient = fetchUtils.fetchJson;

const dataProvider = {
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const url = `${apiUrl}/${resource}?page=${page - 1}&size=${perPage}`;

    return httpClient(url)
      .then(({ json }) => {
        // Add image URL prefix to each photo in the content array
        const dataWithImageUrls = json.content.map((item) => ({
          ...item,
          photo: `${apiUrl}/image/${resource}/${item.photo}`, // Add image URL prefix
        }));

        return {
          data: dataWithImageUrls, // Return modified data with image URLs
          total: json.totalElements,
        };
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        throw error;
      });
  },
  getOne: (resource, params) => {
    const { id } = params;
    const url = `${apiUrl}/${resource}/${id}`;

    return httpClient(url)
      .then(({ json }) => {
        return {
          data: json, // Return the fetched data
        };
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        throw error;
      });
  },
  getMany: (resource, params) => {
    const { ids } = params;

    // Construct the URL to fetch multiple records based on their IDs
    const url = `${apiUrl}/${resource}?ids=${ids.join(",")}`;

    return httpClient(url)
      .then(({ json }) => {
        return {
          data: json.content, // Return the fetched data
        };
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        throw error;
      });
  },

  update: (resource, params) => {
    const { id, data } = params;
    const url = `${apiUrl}/${resource}/${id}`;
    let options = {};

    if (data.file) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "category" && data[key]) {
          formData.append("category", data[key].id);
        } else {
          formData.append(key, data[key]);
        }
      });
      formData.append("file", data.file.rawFile);
      options = {
        method: "PUT",
        body: formData,
      };
    } else {
      options = {
        method: "PUT",
        headers: new Headers({ "Content-Type": "application/json" }), // Add headers
        body: JSON.stringify(data),
      };
    }

    return httpClient(url, options)
      .then(({ json }) => {
        return {
          data: json, // Return the updated data
        };
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        throw error;
      });
  },

  delete: (resource, params) => {
    const { id } = params;
    const url = `${apiUrl}/${resource}/${id}`;
    const options = {
      method: "DELETE",
    };

    return httpClient(url, options)
      .then(({ json }) => {
        return {
          data: json, // Return any response data, if needed
        };
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        throw error;
      });
  },

  create: (resource, params) => {
    const { data } = params;
    const url = `${apiUrl}/${resource}`;
    let options = {};

    if (data.file) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      formData.append("file", data.file.rawFile);
      options = {
        method: "POST",
        body: formData,
      };
    } else {
      options = {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }), // Add headers
        body: JSON.stringify(data),
      };
    }

    return httpClient(url, options)
      .then(({ json }) => {
        return { data: json }; // Assuming the API returns the created user data
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        throw error;
      });
  },

  deleteMany: (resource, params) => {
    const { ids } = params;
    const deletePromises = ids.map((id) => {
      const url = `${apiUrl}/${resource}/${id}`;
      const options = {
        method: "DELETE",
      };
      return httpClient(url, options);
    });

    return Promise.all(deletePromises)
      .then(() => {
        // Return a success response or any necessary data
        return { data: ids };
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        throw error;
      });
  },
};

export default dataProvider;
