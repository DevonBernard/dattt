export const apiCall = async (method: string, path: string, body={}) => {
  const payload: any = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  try {
    if (['POST','PUT','DELETE'].includes(method)) {
      payload.body = JSON.stringify(body);
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${path}`, payload);
    const respJson = await response.json();
    if (response.status !== 200) {
      if (respJson?.errors) {
        console.error(respJson.errors[0]);
      }
    }
    return {response, respJson};
  } catch (e) {
    console.error("Failed to connect with API");
    return {
      response: {},
      respJson: {}
    }
  }
}
