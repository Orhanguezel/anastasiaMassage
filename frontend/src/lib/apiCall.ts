import API from "./api";

const apiCall = async (
  method: "get" | "post" | "put" | "delete" | "patch",
  url: string,
  data: any = null,
  rejectWithValue: (error: any) => any,
  config: any = {}
) => {
  try {
    console.log(`📡 API CALL → [${method.toUpperCase()}] ${url}`);
    if (data) console.log("📤 Request Payload:", data);

    const finalConfig = {
      ...config,
      withCredentials: true, // ✅ Cookie gönder/al
    };

    const response =
      method === "get"
        ? await API.get(url, { ...finalConfig, params: data })
        : await API[method](url, data, finalConfig);

    console.log(`✅ API Response [${method.toUpperCase()} ${url}]:`, response.data);
    return response.data;

  } catch (error: any) {
    const status = error?.response?.status || "Unknown";
    const errorData = error?.response?.data ?? {};
    const message =
      errorData?.message ||
      errorData?.errors?.[Object.keys(errorData.errors || {})[0]]?.message || // mongoose hataları
      error?.message ||
      "Etwas ist schiefgelaufen!";
      
      if (error?.response) {
        const { status, data, config } = error.response;
        console.error("❌ API Fehler / Error Details:", {
          url: config?.url || "Unbekannte URL",
          status,
          data,
        });
    } else {

    console.error("❌ API Fehler:", message);
    return rejectWithValue({ status, message, data: errorData });
  }
};
  }

export default apiCall;
